# GUÍA DE MIGRACIÓN A PRODUCCIÓN AIVEN - SIN PERDER DATOS

## IMPORTANTE: Lee esto completamente ANTES de ejecutar

### ⚠️ ADVERTENCIAS CRÍTICAS
1. **NO ejecutes `migration:revert`** — eliminaría tablas y datos
2. **Siempre **RESPALDÁ LA BD** antes de cualquier migración en producción
3. **Ejecuta `migration:run` solamente** — aplica cambios hacia adelante
4. **Verifica la conexión primero** — no hagas cambios si la conexión falla

---

## PASO 1: Verificar Conexión a Aiven (SIN hacer cambios)

```bash
cd /Users/felipe/dev/paddy/backend

# Compilar backend (sin ejecutar)
npm run build

# Verificar conexión a Aiven (solo lectura)
# En el código:
# npx typeorm query "SELECT VERSION()"
```

---

## PASO 2: Ver Migraciones Pendientes (SIN ejecutarlas)

```bash
npm run migration:show

# Output esperado:
# ✓ 1760123456789-CreateUsers
# ✓ 1760345678901-AddRoleToUsers
# ✗ 1760567890123-AddNewColumn  <- ESTO se va a ejecutar
```

---

## PASO 3: Ejecutar Migraciones (SOLO forward, NUNCA back)

```bash
# SEGURO: Solo ejecuta pendientes, no revierte nada
npm run migration:run

# Output esperado:
# Running migrations...
# Migration "1760567890123-AddNewColumn" has been executed successfully.
# ✓ Migrations have been successfully executed
```

---

## PASO 4: Verificar que todo se aplicó

```bash
npm run migration:show

# Todas las migraciones deben tener ✓
```

---

## PASO 5: Verificar Integridad de Datos

```bash
npm run start:dev

# En otra terminal, verifica:
curl http://localhost:3000/api/v1/users
curl http://localhost:3000/api/v1/producers
curl http://localhost:3000/api/v1/operations/receptions

# Todos deben retornar datos correctamente
```

---

## PASO 6: Agregar Permisos a Admins (SI es necesario)

Si la BD en producción tiene usuarios admin sin permisos nuevos, ejecuta:

```bash
npm run seed

# Esto agregará permisos a admins existentes SIN eliminar datos
```

---

## ROLLBACK de EMERGENCIA (si algo falla)

Si hay error y necesitas revertir:

```bash
# OPCIÓN 1: Restaurar desde backup manual
# (Contactar con Aiven para restaurar snapshot)

# OPCIÓN 2: Revertir UNA migración (úsalo solo si absolutamente necesario)
npm run migration:revert

# PERO NUNCA ejecutes migration:revert si no tienes backup!
```

---

## COMANDOS EXACTOS A EJECUTAR EN ORDEN

```bash
# Terminal en /Users/felipe/dev/paddy/backend

# 1. Compilar
npm run build

# 2. Ver pendientes (sin ejecutar)
npm run migration:show

# 3. Ejecutar (SALE ADELANTE, NUNCA ATRÁS)
npm run migration:run

# 4. Verificar que se aplicó
npm run migration:show

# 5. Inici instancia de prueba
npm run start:dev

# 6. Probar en otra terminal
curl http://localhost:3000/api/v1/health
```

---

## VERDAD/FALSO: ¿Qué es seguro?

| Comando | ¿Seguro? | Resultado |
|---------|----------|-----------|
| `npm run migration:run` | ✅ SÍ | Aplica cambios nuevos, preserva datos |
| `npm run migration:revert` | ❌ NO | Elimina últimas migraciones y sus datos |
| `npm run seed` | ✅ SÍ | Agrega datos nuevos, preserva existentes |
| `npm run db:setup` | ❌ NO | Limpia y reinicia todo (SOLO en desarrollo) |
| `npm run start:dev` | ✅ SÍ | Solo inicia la app, sin cambios a BD |

---

## DOCUMENTACIÓN OFICIAL

- **TypeORM Migrations**: https://typeorm.io/migrations
- **Aiven MySQL**: https://docs.aiven.io/docs/products/mysql

---

## CONTACTO DE EMERGENCIA

Si algo falla:
1. Detén el backend (`Ctrl+C`)
2. NO ejecutes migration:revert
3. Contacta a Aiven support
4. Solicita un snapshot restore a versión anterior

---

**FECHA**: Marzo 2026
**VERSIÓN**: 1.0
**ESTADO**: LISTA PARA PRODUCCIÓN
