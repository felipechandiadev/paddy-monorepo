#!/usr/bin/env python3
import json

with open('database_dump.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('=' * 90)
print('RESUMEN COMPLETO - DATABASE DUMP')
print('=' * 90)
print(f'\nBase de Datos: {data["database"]}')
print(f'Timestamp: {data["timestamp"]}')

total_rows = 0
for table_name, table_data in data['tables'].items():
    row_count = table_data['rowCount']
    total_rows += row_count

print(f'\nTOTAL DE TABLAS: {len(data["tables"])}')
print(f'TOTAL DE REGISTROS: {total_rows}')
print('=' * 90)

# Detalle por tabla
print(f'\nDETALLE POR TABLA:\n')

for table_name, table_data in sorted(data['tables'].items()):
    print(f'{table_name.upper()} ({table_data["rowCount"]} registros)')
    print('─' * 90)
    
    if table_name == 'analysis_params':
        params_by_code = {}
        for param in table_data['data']:
            code = param[4]
            name = param[5]
            if code not in params_by_code:
                params_by_code[code] = name
        print(f'  Codigos de descuento: {", ".join([f"{k}" for k, v in params_by_code.items()])}')
        print(f'  Tipos: {", ".join(set([v for k, v in params_by_code.items()]))}')
    
    elif table_name == 'rice_types':
        for rice in table_data['data']:
            print(f'  • {rice[5]} (Codigo: {rice[4]}, Precio: ${rice[7]})')
    
    elif table_name == 'seasons':
        for season in table_data['data']:
            print(f'  • {season[2]} ({season[1]} a {season[3]})')
    
    elif table_name == 'templates':
        for template in table_data['data']:
            default_str = 'SI' if template[6] else 'NO'
            print(f'  • {template[4]} (ID: {template[0]}, Por defecto: {default_str})')
    
    elif table_name == 'users':
        for user in table_data['data']:
            print(f'  • {user[5]} ({user[3]}, Rol: {user[9]})')
    
    print()

print('=' * 90)
print(f'ESTADO FINAL:')
print('=' * 90)
print(f'✓ Tablas activas: {list(data["tables"].keys())}')
print(f'✓ Total registros en dump: {total_rows}')
print('=' * 90)
