#!/usr/bin/env python3
import re
import json
from datetime import datetime
import os

sql_file = 'mysql-restore-dump-20260320-010253.sql'

with open(sql_file, 'r') as f:
    content = f.read()

result = {}

# Buscar todas las tablas CREATE TABLE
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
    
    # Separar registros: buscar ),( que NO esté dentro de strings
    record_strings = []
    current = ''
    in_string = False
    i = 0
    
    while i < len(values_str):
        char = values_str[i]
        
        # Detectar inicio/fin de strings
        if char == "'" and (i == 0 or values_str[i-1] != '\\'):
            in_string = not in_string
            current += char
        # Detectar transición entre registros
        elif not in_string and char == ')' and i + 1 < len(values_str) and values_str[i+1] == '(':
            current += char  # Agregar el )
            record_strings.append(current)
            current = ''
            i += 1  # Saltar el (
        else:
            current += char
        
        i += 1
    
    # Agregar el último registro si existe
    if current:
        record_strings.append(current)
    
    # Parsear cada registro
    records = []
    for record_str in record_strings:
        # Limpiar paréntesis
        record_str = record_str.strip()
        if record_str.startswith('('):
            record_str = record_str[1:]
        if record_str.endswith(')'):
            record_str = record_str[:-1]
        
        # Parsear valores respetando strings
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
                # Procesar valor
                val = current_value.strip()
                if val.startswith("'") and val.endswith("'"):
                    val = val[1:-1]
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
        
        # Crear registro si los valores coinciden con las columnas
        if len(values) == len(columns):
            record = {}
            for j, col_name in enumerate(columns):
                record[col_name] = values[j]
            records.append(record)
    
    if records:
        result[table_name] = records
        print(f"  ✓ {table_name}: {len(records)} registros")

# Guardar en JSON
output_file = f'mysql-restore-dump-{datetime.now().strftime("%Y%m%d-%H%M%S")}.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(result, f, indent=2, ensure_ascii=False)

print(f"\n📄 JSON generado: {output_file}")
print(f"📊 Total de tablas con datos: {len(result)}")
if result:
    tablas_info = ', '.join([f"{t}({len(records)})" for t, records in sorted(result.items())])
    print(f"📋 Tablas: {tablas_info}")

# Mostrar tamaño del archivo
size_mb = os.path.getsize(output_file) / (1024 * 1024)
print(f"💾 Tamaño: {size_mb:.2f} MB")
