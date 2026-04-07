#!/usr/bin/env python3
import re
import json
from datetime import datetime
import os

sql_file = 'mysql-restore-dump-20260320-010253.sql'

with open(sql_file, 'r') as f:
    content = f.read()

result = {}

# Primero, buscar todas las tablas CREATE TABLE
create_table_pattern = r'CREATE TABLE `(\w+)`'
table_names = re.findall(create_table_pattern, content)

print(f"Tablas encontradas: {len(table_names)}")

for table_name in table_names:
    # Excluir tablas de auditoría
    if 'audit' in table_name.lower():
        print(f"  ⊘ Omitiendo: {table_name}")
        continue
    
    # Buscar el INSERT para esta tabla específica
    insert_pattern = rf'INSERT INTO `{table_name}` VALUES (.+?);'
    insert_match = re.search(insert_pattern, content, re.DOTALL)
    
    if not insert_match:
        print(f"  - {table_name}: sin datos")
        continue
    
    values_str = insert_match.group(1)
    
    # Obtener estructura de la tabla
    table_struct_pattern = rf'CREATE TABLE `{table_name}`\s*\((.+?)\) ENGINE'
    table_match = re.search(table_struct_pattern, content, re.DOTALL)
    
    if not table_match:
        continue
    
    # Extraer nombres de columnas
    table_def = table_match.group(1)
    columns = []
    for line in table_def.split('\n'):
        line = line.strip()
        # Buscar líneas que definan columnas
        if line and '`' in line and not any(x in line for x in ['PRIMARY KEY', 'FOREIGN KEY', 'UNIQUE KEY', 'KEY `']):
            col_match = re.search(r'`(\w+)`', line)
            if col_match:
                col_name = col_match.group(1)
                if col_name not in columns:  # Evitar duplicados
                    columns.append(col_name)
    
    if not columns:
        print(f"  - {table_name}: no se pudo extraer estructura")
        continue
    
    # Parsear valores
    records = []
    
    # Separar registros: buscar secuencias de ),(
    # Pero necesitamos ser cuidadosos con strings que pueden contener ),(
    record_strings = []
    depth = 0
    current_record = ''
    in_string = False
    escape_next = False
    
    for i, char in enumerate(values_str):
        if escape_next:
            current_record += char
            escape_next = False
            continue
        
        if char == '\\':
            current_record += char
            escape_next = True
            continue
        
        if char == "'" and not escape_next:
            in_string = not in_string
            current_record += char
            continue
        
        if not in_string:
            if char == '(':
                depth += 1
            elif char == ')':
                depth -= 1
                if depth == 0:
                    # Final de un registro
                    record_strings.append(current_record)
                    current_record = ''
                    continue
        
        current_record += char
    
    for record_str in record_strings:
        record_str = record_str.strip()
        # Limpiar paréntesis al inicio y final
        if record_str.startswith('('):
            record_str = record_str[1:]
        if record_str.endswith(')'):
            record_str = record_str[:-1]
        
        # Parsear valores
        values = []
        in_string = False
        current_value = ''
        escape_next = False
        
        for char in record_str:
            if escape_next:
                current_value += char
                escape_next = False
            elif char == '\\':
                current_value += char
                escape_next = True
            elif char == "'" and not escape_next:
                in_string = not in_string
                current_value += char
            elif char == ',' and not in_string:
                val = current_value.strip()
                # Limpiar comillas simples
                if val.startswith("'") and val.endswith("'"):
                    val = val[1:-1]
                # Convertir 'NULL' a None
                if val and val.upper() == 'NULL':
                    val = None
                values.append(val)
                current_value = ''
            else:
                current_value += char
        
        # Último valor
        if current_value:
            val = current_value.strip()
            if val.startswith("'") and val.endswith("'"):
                val = val[1:-1]
            if val and val.upper() == 'NULL':
                val = None
            values.append(val)
        
        # Crear registro
        if len(values) == len(columns):
            record = {}
            for j, col_name in enumerate(columns):
                record[col_name] = values[j]
            records.append(record)
        else:
            print(f"  ⚠ Warning: columnas mismatch en {table_name}: {len(columns)} esperadas, {len(values)} encontradas")
    
    if records:
        result[table_name] = records
        print(f"  ✓ {table_name}: {len(records)} registros con {len(columns)} columnas")

# Guardar en JSON
output_file = f'mysql-restore-dump-{datetime.now().strftime("%Y%m%d-%H%M%S")}.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(result, f, indent=2, ensure_ascii=False)

print(f"\n📄 JSON generado: {output_file}")
print(f"📊 Total de tablas con datos: {len(result)}")
if result:
    print(f"📋 Tablas: {', '.join(sorted(result.keys()))}")

# Mostrar tamaño del archivo
size_mb = os.path.getsize(output_file) / (1024 * 1024)
print(f"💾 Tamaño: {size_mb:.2f} MB")
