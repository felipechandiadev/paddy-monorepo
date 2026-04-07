# 🔐 Actualización de Permisos - Rol CONSULTANT

**Fecha:** 7 de abril de 2026  
**Estado:** ✅ Completado y compilado exitosamente

---

## 📋 Resumen de Cambios

Los permisos del rol **CONSULTANT** han sido actualizados para asignar SOLAMENTE los permisos especificados por el usuario.

---

## 🎯 Permisos Asignados al Rol CONSULTANT

### Usuarios
- ✅ **Ver usuarios**

### Productores
- ✅ **Ver productores**

### Configuración
- ✅ **Ver tipos de arroz**
- ✅ **Ver temporadas**
- ✅ **Ver plantillas**
- ✅ **Ver parámetros de análisis**

### Recepciones
- ✅ **Ver recepciones**

### Anticipos
- ✅ **Ver anticipos**
- ✅ **Crear anticipos**
- ✅ **Editar anticipos**
- ✅ **Editar tasa de interés**

### Finanzas
- ✅ **Ver transacciones**

### Liquidaciones
- ✅ **Ver liquidaciones**
- ✅ **Crear liquidaciones**
- ✅ **Guardar liquidaciones**

### Reportes
- ✅ **Ver reportes y analíticas**

---

## 🔧 Cambios Técnicos Realizados

### 1. Archivo: `src/modules/users/domain/permissions.constants.ts`

**Se actualizó `DEFAULT_ROLE_PERMISSIONS[RoleEnum.CONSULTANT]`** para incluir SOLAMENTE:

```typescript
[RoleEnum.CONSULTANT]: [
  // Usuarios: solo ver
  PermissionEnum.USERS_VIEW,

  // Productores: solo ver
  PermissionEnum.PRODUCERS_VIEW,

  // Configuración: solo ver
  PermissionEnum.RICE_TYPES_VIEW,
  PermissionEnum.SEASONS_VIEW,
  PermissionEnum.TEMPLATES_VIEW,
  PermissionEnum.ANALYSIS_PARAMS_VIEW,

  // Recepciones: solo ver
  PermissionEnum.RECEPTIONS_VIEW,

  // Anticipos: ver, crear, editar y cambiar tasa
  PermissionEnum.ADVANCES_VIEW,
  PermissionEnum.ADVANCES_CREATE,
  PermissionEnum.ADVANCES_UPDATE,
  PermissionEnum.ADVANCES_CHANGE_INTEREST,

  // Transacciones: solo ver
  PermissionEnum.TRANSACTIONS_VIEW,

  // Liquidaciones: ver, crear y guardar
  PermissionEnum.SETTLEMENTS_VIEW,
  PermissionEnum.SETTLEMENTS_CREATE,
  PermissionEnum.SETTLEMENTS_SAVE,

  // Analíticas: ver reportes
  PermissionEnum.ANALYTICS_VIEW,
],
```

### 2. Archivo: `src/infrastructure/persistence/seeders/seed-test-cosecha.ts`

**Se actualizó el método `createConsultor()`** para crear permisos override coincidentes:

- Los overrides ahora incluyen SOLAMENTE los 19 permisos listados arriba
- Removidos: PRODUCERS_CREATE/UPDATE/DELETE, RECEPTIONS_CREATE/UPDATE/CANCEL, ANALYSIS_RECORDS_VIEW, ADVANCES_CANCEL, SETTLEMENTS_COMPLETE/CANCEL
- Agregados: ADVANCES_CREATE, ADVANCES_UPDATE, ADVANCES_CHANGE_INTEREST, SETTLEMENTS_CREATE, SETTLEMENTS_SAVE

---

## ✅ Verificación

- ✅ Backend compila sin errores
- ✅ TypeScript no reporta problemas
- ✅ Permisos sincronizados en constants.ts y seeder
- ✅ Cambios respetan la arquitectura DDD existente

---

## 🚀 Cómo Funciona

### En tiempo de ejecución:

1. **Al crear un usuario con rol CONSULTANT:**
   - Se guarda en BD con `role = 'CONSULTANT'`
   - NO se crean overrides por defecto (se usan los defaults)

2. **Cuando el usuario accede a una acción:**
   - `PermissionsService.getEffectivePermissions()` calcula sus permisos
   - Combina: `DEFAULT_ROLE_PERMISSIONS['CONSULTANT'] + overrides individuales`
   - Guards (`@CheckPermission()`) validan contra esta lista

3. **Resultado:**
   - El usuario CONSULTANT solo puede acceder a las acciones con permisos asignados
   - Si intenta acceder a algo no permitido (ej: crear productores), obtiene 403 Forbidden

---

## 📝 Testing

Para verificar que funciona correctamente:

1. Crear un nuevo usuario con rol CONSULTANT
2. Verificar que NO puede:
   - Crear productores
   - Editar productores
   - Eliminar productores
   - Crear recepciones
   - Editar recepciones
   - Crear liquidaciones (debe poder SOLO si el usuario tiene override explícito)
   - (etc.)

3. Verificar que SI puede:
   - Ver la lista de usuarios
   - Ver la lista de productores
   - Ver la lista de anticipos
   - Crear un anticipo
   - Editar un anticipo
   - Cambiar tasa de interés en anticipos
   - Ver la lista de liquidaciones
   - Crear una liquidación
   - Ver reportes

---

## 🎯 Próximos Pasos (si aplica)

- [ ] Comunicar a usuarios el nuevo rol CONSULTANT
- [ ] Documentar en manual de usuario
- [ ] Hacer testing E2E con role CONSULTANT
