#!/usr/bin/env python3
import json

seasons_data = [
    [1, '2026-03-16 10:41:56.681129', '2026-03-16 10:41:56.681129', None, 'COSECHA_2026', 'COSECHA 2026', 2026, '2025-12-31', '2026-12-30', 1, 'Temporada base para iniciar la operacion']
]

with open('database_dump.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

data['tables']['seasons']['data'] = seasons_data
data['tables']['seasons']['rowCount'] = 1

with open('database_dump.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print('✓ Archivo actualizado')
print(f'Temporadas en JSON: 1')
print(f'  • COSECHA 2026')
