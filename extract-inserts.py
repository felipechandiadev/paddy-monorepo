#!/usr/bin/env python3
import re

sql_file = 'mysql-restore-dump-20260320-010253.sql'
output_file = 'paddy-inserts-only.sql'

with open(sql_file, 'r') as f:
    content = f.read()

# Buscar todos los INSERT statements
insert_pattern = r'INSERT INTO `\w+` VALUES .+?;'
inserts = re.findall(insert_pattern, content, re.DOTALL)

print(f"Encontrados {len(inserts)} INSERT statements")

# Escribir solo los INSERTs
with open(output_file, 'w', encoding='utf-8') as f:
    f.write("-- Extraido del dump de mysql-restore-dump-20260320-010253.sql\n")
    f.write("-- Contiene solo INSERT statements\n")
    f.write("-- Generado: 2026-03-20\n\n")
    
    for insert in inserts:
        # Limpiar espacios en blanco extra
        insert = re.sub(r'\n\s+', ' ', insert)
        f.write(insert)
        f.write("\n\n")

# Verificar
with open(output_file, 'r') as f:
    content_out = f.read()
    lines = content_out.split('\n')

print(f"\nArchivo generado: {output_file}")
print(f"Líneas totales: {len(lines)}")
print(f"Tamaño: {len(content_out) / 1024:.2f} KB")
print(f"\nPrimeras 3 líneas de código:")
for line in lines[3:6]:
    if line.strip():
        print(f"  {line[:100]}...")
