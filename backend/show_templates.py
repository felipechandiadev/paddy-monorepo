#!/usr/bin/env python3
import json

with open('database_dump.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

templates = data['tables']['templates']['data']

print('=' * 80)
print('TEMPLATES EN EL ARCHIVO')
print('=' * 80)

for i, template in enumerate(templates, 1):
    default = 'SI' if template[6] else 'NO'
    group = 'SI' if template[7] else 'NO'
    active = 'SI' if template[-1] else 'NO'
    
    print(f'\nTemplate #{i}')
    print(f'  ID: {template[0]}')
    print(f'  Nombre: {template[4]}')
    print(f'  Creado: {template[1]}')
    print(f'  Por defecto: {default}')
    print(f'  Usa Tolerancia Grupal: {group}')
    if template[9]:
        print(f'  Nombre Grupo Tolerancia: {template[9]}')
    print(f'  Valor Tolerancia Grupal: {template[8]}')
    print(f'  Activo: {active}')

print(f'\nTotal de templates: {len(templates)}')
print('=' * 80)
