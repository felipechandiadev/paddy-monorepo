# Seed de Producción - Paddy Backend

## Descripción

`seed-production.ts` es un seed especialmente diseñado para inicializar la base de datos de producción con datos curados desde `database_dump.json`. Este script realiza dos operaciones críticas:

1. **Resetea la base de datos**: Trunca todas las tablas para garantizar un estado limpio
2. **Carga datos desde JSON**: Importa los registros de `database_dump.json` de manera ordenada respetando las dependencias de las entidades

## Requisitos

- ✅ Archivo `database_dump.json` en el directorio raíz del proyecto
- ✅ Variables de entorno configuradas en `.env` con credenciales de base de datos
- ✅ Dependencias instaladas: `npm install`

## Variables de Entorno Requeridas

```env
DATABASE_HOST=165.227.14.126
DATABASE_PORT=3306
DATABASE_USER=<usuario>
DATABASE_PASSWORD=<contraseña>
DATABASE_NAME=defaultdb
DATABASE_SSL=true
DATABASE_SSL_MODE=REQUIRED
DATABASE_SSL_REJECT_UNAUTHORIZED=false
```

## Uso

### Opción 1: Comando NPM (Recomendado)

```bash
npm run seed:production
```

### Opción 2: Script Shell

```bash
# Primero, hacer el script ejecutable
chmod +x seed-production.sh

# Ejecutar el script
./seed-production.sh
```

### Opción 3: ts-node directo

```bash
ts-node -r tsconfig-paths/register src/infrastructure/persistence/seeders/seed-production.ts
```

## Operaciones Realizadas

### 1. Reseteo de Base de Datos

El script realiza un `TRUNCATE` en las siguientes tablas (en orden):
- settlement_reception_snapshots
- settlements
- transactions
- advances
- analysis_records
- receptions
- analysis_params
- templates
- seasons
- rice_types
- producers
- users
- user_permission_overrides
- audit_events
- migrations

Las tablas inexistentes se saltan automáticamente sin error.

### 2. Carga de Datos

Los datos se cargan en orden respetando las dependencias:

1. **Usuarios** (sin dependencias)
   - Carga de usuarios desde `database_dump.json`
   - Mantiene las contraseñas hasheadas con bcrypt
   - Asigna roles (ADMIN, USER, etc.)

2. **Tipos de Arroz** (sin dependencias)
   - Carga de variedades de arroz (Diamante, Zafiro, Brillante, Harper)
   - Incluye precios de referencia

3. **Temporadas** (sin dependencias)
   - Carga de temporadas (ej: COSECHA 2026)
   - Define períodos y años de cosecha

4. **Plantillas** (sin dependencias en el dump)
   - Carga de plantillas de análisis
   - Configura tolerancias y parámetros por defecto

5. **Parámetros de Análisis** (sin dependencias)
   - Carga códigos de descuento y parámetros de análisis
   - Define rangos de tolerancia para cada variable

## Datos de Ejemplo Cargados

```
Total de Registros: 134
├── Usuarios: 2
│   ├── pojeda@ayg.cl (ADMIN)
│   └── admin@ayg.cl (ADMIN)
├── Tipos de Arroz: 4
│   ├── Diamante ($600)
│   ├── Zafiro ($550)
│   ├── Brillante ($200)
│   └── Harper ($200)
├── Temporadas: 1
│   └── COSECHA 2026
├── Plantillas: 1
│   └── COSECHA 2026 (por defecto)
└── Parámetros de Análisis: 126
    └── 9 códigos de descuento con rangos de tolerancia
```

## Estructura del JON (database_dump.json)

```json
{
  "database": "defaultdb",
  "timestamp": "2026-03-20T01:03:33",
  "tables": {
    "users": {
      "rowCount": 2,
      "data": [[...], [...]]
    },
    "rice_types": {
      "rowCount": 4,
      "data": [[...], [...], [...], [...]]
    },
    "seasons": {
      "rowCount": 1,
      "data": [[...]]
    },
    "templates": {
      "rowCount": 1,
      "data": [[...]]
    },
    "analysis_params": {
      "rowCount": 126,
      "data": [[...], [...], ...]
    }
  }
}
```

## Mapeo de Columnas

El script utiliza índices de columnas para mapear datos del JSON a las entidades TypeORM:

### Usuarios (11 columnas)
```
0: id, 1: createdAt, 2: updatedAt, 3: deletedAt, 4: email,
5: password, 6: name, 7: firstName, 8: lastName, 9: role, 10: isActive
```

### Tipos de Arroz (8 columnas)
```
0: id, 1: createdAt, 2: updatedAt, 3: deletedAt, 4: code,
5: name, 6: description, 7: referencePrice, 8: isActive
```

### Temporadas (10 columnas)
```
0: id, 1: createdAt, 2: updatedAt, 3: deletedAt, 4: code,
5: name, 6: year, 7: startDate, 8: endDate, 9: isActive
```

### Plantillas (55 columnas)
```
0: id, 1: createdAt, 2: updatedAt, 3: deletedAt, 4: name,
[5-54]: diversas configuraciones de tolerancia y parámetros de análisis
```

### Parámetros de Análisis (12 columnas)
```
0: id, 1: createdAt, 2: updatedAt, 3: deletedAt, 4: discountCode,
5: discountName, 6: unit, 7: rangeStart, 8: rangeEnd,
9: discountPercent, 10: priority, 11: isActive
```

## Información de Carga

Durante la ejecución, el script muestra:

```
✅ Conectado a base de datos
✅ Archivo database_dump.json cargado

📊 Reseteando base de datos...
  ✓ Truncada tabla: settlement_reception_snapshots
  ✓ Truncada tabla: settlements
  [...]
✅ Base de datos reseteada

📥 Cargando datos desde database_dump.json...

✅ Usuarios cargados: 2
✅ Tipos de Arroz cargados: 4
✅ Temporadas cargadas: 1
✅ Plantillas cargadas: 1
✅ Parámetros de Análisis cargados: 126

✅ Seed de Producción completado exitosamente!

Resumen de datos cargados:
  • Usuarios: 2
  • Tipos de Arroz: 4
  • Temporadas: 1
  • Plantillas: 1
  • Parámetros de Análisis: 126
```

## Casos de Error

### Error: "database_dump.json no encontrado"

**Solución**: Asegúrate que el archivo `database_dump.json` existe en el directorio raíz del proyecto (mismo nivel que package.json)

### Error de Conexión a Base de Datos

**Solución**: Verifica que:
- Las credenciales en `.env` son correctas
- El host de base de datos es accesible
- Existen variables de entorno para SSL si es requerido

### Error de Entidades TypeORM

**Solución**: Asegúrate que:
- Las importaciones de entidades en el script coinciden con el código actual
- No hay cambios recientes en la definición de las entidades

## Recuperación ante Fallos

Si el seed falla a mitad de la ejecución:

1. El reseteo ya se habrá completado (las tablas estarán vacías)
2. Algunos datos pueden estar parcialmente cargados
3. **Recomendación**: Ejecutar el seed de nuevo después de resolver el error

## Scripts Relacionados

- `seed.ts` - Seed de desarrollo completo
- `seed-expanded.ts` - Seed con más datos de prueba
- `seed-minimal.ts` - Seed minimal para pruebas rápidas
- `seed-test-cosecha.ts` - Seed para pruebas con cosecha específica
- `db-reset.ts` - Simple reset de base de datos

## Configuración Avanzada

### Cambiar archivo de datos

Para usar un JSON diferente, edita la línea en `seed-production.ts`:

```typescript
const dumpPath = path.join(__dirname, '../../../..', 'database_dump.json');
```

Reemplaza `'database_dump.json'` con tu ruta deseada.

### Agregar validaciones adicionales

Puedes agregar validaciones antes de guardar entidades:

```typescript
const user = usersRepository.create(userData);
if (!user.email) {
  throw new Error('Email requerido para usuario');
}
await usersRepository.save(user);
```

## Troubleshooting

### El script se queda "colgado"

- Verifica la conectividad a la base de datos
- Revisa los logs de MySQL en el servidor remoto
- Aumenta el timeout si trabajas con datos muy grandes

### Datos parcialmente cargados

- Verifique que el JSON es válido (usa herramientas como `jq` para validar)
- Revise los logs de error más actuales
- Intente ejecutar de nuevo

### Conflictos de clave primaria

- Asegúrate que el scriptó truncó completamente las tablas
- Verifica que los IDs en `database_dump.json` no tienen duplicados

## Notas Importantes

✅ **Este seed está diseñado específicamente para**: Inicialización de producción con datos curados
✅ **Seguridad**: No incluye datos sensibles adicionales más allá de lo necesario
✅ **Orden de carga**: Los datos se cargan respetando dependencias por foreign keys
✅ **Idempotencia**: Puede ejecutarse múltiples veces sin problemas (resetea primero)

---

Para más información sobre seeders, revisa la documentación original en [Seed Documentation](./seed.ts)
