# Plan de Implementacion de Auditoria

## 1. Objetivo

Definir una implementacion de auditoria transversal para Paddy (backend + frontend) que permita:

- Trazar quien hizo que accion, cuando, desde donde y con que resultado.
- Registrar cambios de datos criticos (antes y despues) en operaciones sensibles.
- Facilitar investigacion de incidentes, cumplimiento y soporte.

## 2. Estado actual (baseline)

Hoy existe trazabilidad parcial, pero no un sistema de auditoria centralizado:

- Timestamps base por entidad (`createdAt`, `updatedAt`, `deletedAt`).
- Uso de `userId` en varias operaciones de negocio (recepciones, analisis, finanzas).
- Logs en controladores (Nest Logger).
- Interceptor global de transformacion de respuesta (no auditoria).

## 3. Alcance propuesto

Se recomienda auditar en backend:

- Eventos de autenticacion y seguridad.
- Todas las mutaciones (create/update/delete/complete/cancel/settle).
- Lecturas sensibles (consultas de datos personales y financieros).
- Errores y denegaciones de acceso relevantes.

Se recomienda exponer en frontend:

- Correlation id por request.
- Metadatos de cliente (opcional): ruta, accion UI, version app.

## 4. Modelo de datos sugerido

Tabla sugerida: `audit_events`

Campos minimos:

- `id` (PK)
- `eventCode` (string) Ej: `FINANCE.ADVANCE.CREATE`
- `category` (AUTH, USERS, PRODUCERS, CONFIG, OPERATIONS, FINANCE, ANALYTICS, SYSTEM)
- `severity` (INFO, WARN, HIGH, CRITICAL)
- `action` (CREATE, READ, UPDATE, DELETE, EXECUTE, LOGIN, LOGOUT, REFRESH, CALCULATE, COMPLETE, CANCEL)
- `status` (SUCCESS, FAIL, DENIED)
- `actorUserId` (nullable)
- `actorEmail` (nullable)
- `actorRole` (nullable)
- `entityType` (nullable) Ej: `User`, `Producer`, `Settlement`
- `entityId` (nullable)
- `route` (string)
- `method` (GET, POST, PUT, PATCH, DELETE)
- `ip` (nullable)
- `userAgent` (nullable)
- `requestId` (nullable)
- `correlationId` (nullable)
- `beforeData` (json, nullable)
- `afterData` (json, nullable)
- `metadata` (json, nullable)
- `errorMessage` (nullable)
- `createdAt` (timestamp)

## 5. Estrategia de implementacion

### 5.1 Interceptor global de auditoria

Crear un interceptor global (`AuditInterceptor`) que:

1. Lea contexto HTTP (usuario, ruta, ip, requestId).
2. Determine `eventCode` por ruta/metodo.
3. Registre resultado SUCCESS/FAIL/DENIED.
4. Persista evento en `audit_events` sin bloquear respuesta.

### 5.2 Decorator opcional por endpoint

Crear decorator `@Audit(eventCode, options)` para controlar:

- Si guarda body completo o solo campos permitidos.
- Si captura `before/after`.
- Nivel de severidad.

### 5.3 Servicio de auditoria

Crear `AuditService` con metodos:

- `logSuccess(...)`
- `logFailure(...)`
- `logDenied(...)`

### 5.4 Datos sensibles

Definir mascarado estricto para:

- Passwords, tokens, secretos.
- Datos bancarios (mostrar solo ultimos 4).
- Campos PII segun politica interna.

## 6. Lista completa de eventos/acciones a auditar

> Nota: esta lista cubre los controladores actuales del backend bajo `api/v1`.

## 6.1 Auth (`/auth`)

- `AUTH.LOGIN.SUCCESS` - POST `/auth/login` login exitoso.
- `AUTH.LOGIN.FAIL` - POST `/auth/login` credenciales invalidas o usuario inactivo.
- `AUTH.REGISTER.SUCCESS` - POST `/auth/register` registro exitoso.
- `AUTH.REGISTER.FAIL` - POST `/auth/register` error de validacion/conflicto.
- `AUTH.REFRESH.SUCCESS` - POST `/auth/refresh` refresh token exitoso.
- `AUTH.REFRESH.FAIL` - POST `/auth/refresh` token invalido/expirado.
- `AUTH.ME.READ` - GET `/auth/me` lectura de perfil autenticado.
- `AUTH.HEALTH.READ` - GET `/auth/health` (opcional, usualmente no auditar en produccion).

## 6.2 Users (`/users`)

- `USERS.LIST.READ` - GET `/users` listado usuarios.
- `USERS.ITEM.READ` - GET `/users/:id` detalle usuario.
- `USERS.CREATE` - POST `/users` crear usuario.
- `USERS.UPDATE` - PATCH `/users/:id` editar usuario.
- `USERS.DELETE` - DELETE `/users/:id` eliminar (soft delete).
- `USERS.TOGGLE_ACTIVE` - PUT `/users/:id/toggle-active` activar/desactivar usuario.

## 6.3 Producers (`/producers`)

- `PRODUCERS.LIST.READ` - GET `/producers` listado productores.
- `PRODUCERS.ITEM.READ` - GET `/producers/:id` detalle productor.
- `PRODUCERS.CREATE` - POST `/producers` crear productor.
- `PRODUCERS.UPDATE` - PUT `/producers/:id` actualizar productor.
- `PRODUCERS.DELETE` - DELETE `/producers/:id` eliminar productor.
- `PRODUCERS.BANK_ACCOUNT.ADD` - POST `/producers/:id/bank-accounts` agregar cuenta bancaria.
- `PRODUCERS.BANK_ACCOUNT.REMOVE` - DELETE `/producers/:id/bank-accounts/:index` remover cuenta bancaria.

## 6.4 Configuration (`/configuration`)

### Rice Types
- `CONFIG.RICE_TYPES.LIST.READ` - GET `/configuration/rice-types`
- `CONFIG.RICE_TYPES.ITEM.READ` - GET `/configuration/rice-types/:id`
- `CONFIG.RICE_TYPES.CREATE` - POST `/configuration/rice-types`
- `CONFIG.RICE_TYPES.UPDATE` - PUT `/configuration/rice-types/:id`
- `CONFIG.RICE_TYPES.DELETE` - DELETE `/configuration/rice-types/:id`

### Seasons
- `CONFIG.SEASONS.LIST.READ` - GET `/configuration/seasons`
- `CONFIG.SEASONS.ACTIVE.READ` - GET `/configuration/seasons/active`
- `CONFIG.SEASONS.ITEM.READ` - GET `/configuration/seasons/:id`
- `CONFIG.SEASONS.CREATE` - POST `/configuration/seasons`
- `CONFIG.SEASONS.UPDATE` - PUT `/configuration/seasons/:id`
- `CONFIG.SEASONS.DELETE` - DELETE `/configuration/seasons/:id`

### Templates
- `CONFIG.TEMPLATES.LIST.READ` - GET `/configuration/templates`
- `CONFIG.TEMPLATES.DEFAULT.READ` - GET `/configuration/templates/default`
- `CONFIG.TEMPLATES.ITEM.READ` - GET `/configuration/templates/:id`
- `CONFIG.TEMPLATES.CREATE` - POST `/configuration/templates`
- `CONFIG.TEMPLATES.UPDATE` - PUT `/configuration/templates/:id`
- `CONFIG.TEMPLATES.DELETE` - DELETE `/configuration/templates/:id`

### Analysis Params
- `CONFIG.ANALYSIS_PARAMS.LIST.READ` - GET `/configuration/analysis-params`
- `CONFIG.ANALYSIS_PARAMS.BY_CODE.READ` - GET `/configuration/analysis-params/code/:code`
- `CONFIG.ANALYSIS_PARAMS.PERCENT.READ` - GET `/configuration/analysis-params/:code/percent`
- `CONFIG.ANALYSIS_PARAMS.ITEM.READ` - GET `/configuration/analysis-params/:id`
- `CONFIG.ANALYSIS_PARAMS.CREATE` - POST `/configuration/analysis-params`
- `CONFIG.ANALYSIS_PARAMS.UPDATE` - PUT `/configuration/analysis-params/:id`
- `CONFIG.ANALYSIS_PARAMS.DELETE` - DELETE `/configuration/analysis-params/:id`

### Roles y bancos
- `CONFIG.ROLES.READ` - GET `/configuration/roles`
- `CONFIG.BANKS.READ` - GET `/configuration/banks`

## 6.5 Operations (`/operations`)

### Receptions
- `OPS.RECEPTIONS.LIST.READ` - GET `/operations/receptions`
- `OPS.RECEPTIONS.ITEM.READ` - GET `/operations/receptions/:id`
- `OPS.RECEPTIONS.BY_PRODUCER.READ` - GET `/operations/producers/:producerId/receptions`
- `OPS.RECEPTIONS.CREATE` - POST `/operations/receptions`
- `OPS.RECEPTIONS.UPDATE` - PUT `/operations/receptions/:id`
- `OPS.RECEPTIONS.RICE_PRICE.UPDATE` - PATCH `/operations/receptions/:receptionId/rice-price`
- `OPS.RECEPTIONS.DELETE` - DELETE `/operations/receptions/:id`

### Analysis records
- `OPS.ANALYSIS.READ` - GET `/operations/receptions/:receptionId/analysis`
- `OPS.ANALYSIS.CREATE` - POST `/operations/receptions/:receptionId/analysis`
- `OPS.ANALYSIS.UPDATE` - PUT `/operations/receptions/:receptionId/analysis`
- `OPS.ANALYSIS.DRY_PERCENT.UPDATE` - PATCH `/operations/receptions/:receptionId/analysis/dry-percent`
- `OPS.ANALYSIS.DELETE` - DELETE `/operations/receptions/:receptionId/analysis`

### Calculos y acciones de estado
- `OPS.RECEPTIONS.CALCULATE_DISCOUNTS` - POST `/operations/receptions/:receptionId/calculate-discounts`
- `OPS.RECEPTIONS.SETTLE` - POST `/operations/receptions/:receptionId/settle`

## 6.6 Finances (`/finances`)

### Advances
- `FINANCE.ADVANCES.LIST.READ` - GET `/finances/advances`
- `FINANCE.ADVANCES.ITEM.READ` - GET `/finances/advances/:id`
- `FINANCE.ADVANCES.DETAILS.READ` - GET `/finances/advances/:id/details`
- `FINANCE.ADVANCES.CREATE` - POST `/finances/advances`
- `FINANCE.ADVANCES.UPDATE_PUT` - PUT `/finances/advances/:id`
- `FINANCE.ADVANCES.UPDATE_PATCH` - PATCH `/finances/advances/:id`
- `FINANCE.ADVANCES.DELETE` - DELETE `/finances/advances/:id`
- `FINANCE.ADVANCES.INTEREST.CALCULATE` - GET `/finances/advances/:id/interest`

### Transactions
- `FINANCE.TRANSACTIONS.LIST.READ` - GET `/finances/transactions`
- `FINANCE.TRANSACTIONS.ITEM.READ` - GET `/finances/transactions/:id`
- `FINANCE.PRODUCERS.PENDING_BALANCE.READ` - GET `/finances/producers/:producerId/pending-balance`
- `FINANCE.TRANSACTIONS.CREATE` - POST `/finances/transactions`
- `FINANCE.TRANSACTIONS.UPDATE` - PUT `/finances/transactions/:id`
- `FINANCE.TRANSACTIONS.DELETE` - DELETE `/finances/transactions/:id`

### Settlements
- `FINANCE.SETTLEMENTS.LIST.READ` - GET `/finances/settlements`
- `FINANCE.SETTLEMENTS.CANDIDATES.READ` - GET `/finances/settlements/candidates`
- `FINANCE.SETTLEMENTS.ITEM.READ` - GET `/finances/settlements/:id`
- `FINANCE.SETTLEMENTS.CREATE` - POST `/finances/settlements`
- `FINANCE.SETTLEMENTS.UPDATE` - PUT `/finances/settlements/:id`
- `FINANCE.SETTLEMENTS.DELETE` - DELETE `/finances/settlements/:id`
- `FINANCE.SETTLEMENTS.CALCULATE` - POST `/finances/settlements/:id/calculate`
- `FINANCE.SETTLEMENTS.COMPLETE` - POST `/finances/settlements/:id/complete`
- `FINANCE.SETTLEMENTS.CANCEL` - POST `/finances/settlements/:id/cancel`

## 6.7 Analytics (`/analytics`)

- `ANALYTICS.DASHBOARD.READ` - GET `/analytics/dashboard`
- `ANALYTICS.PRODUCER_STATS.READ` - GET `/analytics/producers/:id`
- `ANALYTICS.TOP_PRODUCERS.READ` - GET `/analytics/producers/top`
- `ANALYTICS.SEASON_REPORT.READ` - GET `/analytics/seasons/:id/report`
- `ANALYTICS.QUALITY_REPORT.READ` - GET `/analytics/quality/report`
- `ANALYTICS.FINANCIAL_REPORT.READ` - GET `/analytics/finances/report`

## 6.8 Eventos transversales recomendados

- `SECURITY.ACCESS_DENIED` - intento sin permisos (roles/guard).
- `SECURITY.TOKEN_INVALID` - token invalido o expirado.
- `VALIDATION.ERROR` - payload invalido por reglas DTO.
- `SYSTEM.EXCEPTION` - error no controlado.
- `SYSTEM.DB_ERROR` - errores de persistencia.

## 7. Severidad recomendada por tipo de evento

- CRITICAL:
  - Login fail repetido, access denied en endpoints sensibles, cambios de estado financiero (complete/cancel), delete en datos maestros.
- HIGH:
  - Create/update/delete en usuarios, productores, configuracion, recepciones, analisis, anticipos y transacciones.
- INFO:
  - Lecturas operativas y analytics.

## 8. Politica de retencion sugerida

- Eventos CRITICAL/HIGH: 24 meses.
- Eventos INFO: 6 a 12 meses.
- Archivado mensual en almacenamiento frio.

## 9. Roadmap de implementacion

### Fase 1 (MVP)

- Crear entidad `AuditEvent` + migracion.
- Crear `AuditService`.
- Crear `AuditInterceptor` global.
- Registrar eventos SUCCESS/FAIL/DENIED para Auth, Users, Finances y Operations mutables.

### Fase 2

- Agregar `beforeData/afterData` para updates/deletes.
- Agregar mascarado de datos sensibles.
- Agregar busqueda y filtros de auditoria (endpoint admin).

### Fase 3

- Alertas por patrones anormales (ej: login fail masivo).
- Exportacion CSV/JSON de eventos.
- Dashboard de auditoria.

## 10. Criterios de aceptacion

- Cada accion mutable genera un evento auditado con actor, entidad y resultado.
- Cada acceso denegado relevante queda registrado.
- No se almacenan secretos en texto plano.
- Busqueda por rango de fechas, actor, entidad y eventCode.

## 11. Observaciones para esta base de codigo

- Ya existe captura de `userId` en varias rutas de Operations/Finances; se puede reutilizar como `actorUserId`.
- El endpoint `/auth/me` actualizado facilita refresco de contexto de usuario.
- Conviene incluir `requestId/correlationId` para trazar entre frontend y backend.
