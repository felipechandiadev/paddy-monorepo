# INFORME DE ENTREGA DE PROYECTO

---

| Campo               | Detalle                                              |
|---------------------|------------------------------------------------------|
| **Proyecto**        | Paddy - Sistema de Recepcion de Arroz y Gestion Financiera |
| **Version**         | 1.0.0                                                |
| **Fecha de entrega**| 17 de marzo de 2026                                  |
| **Cliente**         | AYG Paddy                                            |
| **Equipo**          | Equipo de Desarrollo Paddy                           |
| **Repositorio**     | Repositorio privado Git                              |
| **Clasificacion**   | Confidencial                                         |

---

## Tabla de Contenidos

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Descripcion del Proyecto](#2-descripcion-del-proyecto)
3. [Arquitectura del Sistema](#3-arquitectura-del-sistema)
4. [Backend - Especificacion Tecnica](#4-backend---especificacion-tecnica)
   - 4.1 [Stack Tecnologico](#41-stack-tecnologico)
   - 4.2 [Modulos del Sistema](#42-modulos-del-sistema)
   - 4.3 [Modelo de Datos](#43-modelo-de-datos)
   - 4.4 [API REST - Referencia de Endpoints](#44-api-rest---referencia-de-endpoints)
   - 4.5 [Seguridad](#45-seguridad)
   - 4.6 [Historial de Migraciones](#46-historial-de-migraciones)
5. [Frontend - Especificacion Tecnica](#5-frontend---especificacion-tecnica)
   - 5.1 [Stack Tecnologico](#51-stack-tecnologico)
   - 5.2 [Arquitectura Frontend](#52-arquitectura-frontend)
   - 5.3 [Modulos de Funcionalidad](#53-modulos-de-funcionalidad)
   - 5.4 [Arbol de Rutas](#54-arbol-de-rutas)
   - 5.5 [Biblioteca de Componentes UI](#55-biblioteca-de-componentes-ui)
   - 5.6 [Flujo de Autenticacion](#56-flujo-de-autenticacion)
6. [Infraestructura y Despliegue](#6-infraestructura-y-despliegue)
7. [Runbook Operacional](#7-runbook-operacional)
8. [Estrategia de Pruebas](#8-estrategia-de-pruebas)
9. [Limitaciones Conocidas y Deuda Tecnica](#9-limitaciones-conocidas-y-deuda-tecnica)
10. [Glosario](#10-glosario)

---

## 1. Resumen Ejecutivo

**Paddy** es un sistema de gestion integral para empresas recibidoras de arroz, que cubre el ciclo completo desde la recepcion del grano en terreno hasta la liquidacion financiera con el productor.

El sistema fue desarrollado en su totalidad durante la temporada 2025-2026 e incorpora:

- **Recepcion y analisis de calidad:** Registro de guias de recepcion, pesaje bruto/tara, analisis de humedad y calidad parametrico (8 parametros configurables), calculo automatico de descuentos y bonificaciones.
- **Gestion de productores:** Directorio de productores con RUT chileno, multiples cuentas bancarias y historial de operaciones.
- **Finanzas:** Anticipos con calculo de interes, transacciones, y liquidaciones (settlements) con IVA, facturas y documentacion imprimible.
- **Reportes analiticos:** 8 reportes de business intelligence cubriendo secado, intereses, rentabilidad, libro de inventario, proyeccion de caja y mas.
- **Configuracion:** Tipos de arroz, temporadas, plantillas de analisis y parametros de descuento, todos administrables desde el sistema.

**Estado de entrega:** Sistema funcional completo en produccion. Backend desplegado en Render, frontend en Vercel, base de datos en Aiven Cloud (MySQL 8).

---

## 2. Descripcion del Proyecto

### 2.1 Contexto y Objetivo

Las empresas recibidoras de arroz en Chile operan un proceso manual y fragmentado: reciben el grano de productores, realizan analisis de calidad en laboratorio, calculan descuentos sobre precios de referencia, otorgan anticipos financieros y emiten liquidaciones al final de la temporada.

Paddy digitaliza y automatiza este workflow completo, reemplazando planillas Excel y registros en papel con una plataforma web centralizada.

### 2.2 Alcance Funcional

| Area | Descripcion | Estado |
|------|-------------|--------|
| Autenticacion y Usuarios | Login, gestion de roles (Admin/Consultor), cambio de contrasena | Completo |
| Gestion de Productores | CRUD, cuentas bancarias multiples, validacion RUT | Completo |
| Configuracion | Tipos de arroz, temporadas, plantillas, parametros de analisis | Completo |
| Recepciones | Registro de guias, analisis parametrico, calculo de descuentos | Completo |
| Finanzas - Anticipos | Emision, interes, historial y comprobantes | Completo |
| Finanzas - Liquidaciones | Calculo, IVA, aprobacion y documentacion imprimible | Completo |
| Reportes Analiticos | 8 reportes con filtros, graficos y exportacion | Completo |
| Exportacion Excel | Recepciones y anticipos exportables a Excel | Completo |
| Impresion | Comprobantes de anticipo, liquidaciones y analisis | Completo |

### 2.3 Roles de Usuario

| Rol | Descripcion | Permisos |
|-----|-------------|----------|
| `ADMIN` | Administrador del sistema | Acceso completo a todos los modulos |
| `CONSULTANT` | Consultor/Operador | Acceso de lectura y operaciones definidas |

### 2.4 Credenciales de Prueba

| Email | Contrasena | Rol |
|-------|-----------|-----|
| `pojeda@ayg.cl` | `pass` | ADMIN |

---

## 3. Arquitectura del Sistema

### 3.1 Diagrama de Alto Nivel

```
+-----------------------------------------------------+
|                     CLIENTE                          |
|              Navegador Web (Next.js SPA)             |
|           Vercel · paddy-frontend.vercel.app         |
+----------------------+------------------------------+
                       | HTTPS / REST API
                       | Authorization: Bearer <JWT>
+----------------------v------------------------------+
|                   BACKEND API                        |
|                NestJS 10 · Node.js                   |
|         Render · paddy-backend-xez5.onrender.com     |
|                                                      |
|  +----------+ +----------+ +----------+ +--------+  |
|  |   Auth   | |Producers | |Operations| |Finance |  |
|  +----------+ +----------+ +----------+ +--------+  |
|  +----------+ +----------+ +----------+ +--------+  |
|  |  Config  | |  Users   | |Analytics | |  ...   |  |
|  +----------+ +----------+ +----------+ +--------+  |
|                     TypeORM 0.3                      |
+----------------------|------------------------------+
                       | TLS/SSL · puerto 22495
+----------------------v------------------------------+
|               BASE DE DATOS                          |
|          MySQL 8 · Aiven Cloud (Finlandia)           |
|       mysql-15bd0b47-paddy-aygpaddy-cba2.g.ai...     |
|          11 tablas · Migraciones versionadas         |
+-----------------------------------------------------+
```

### 3.2 Principios Arquitectonicos

**Backend - Domain-Driven Design (DDD)**
Cada modulo de negocio sigue una estructura consistente de cuatro capas:

```
modules/{feature}/
+- domain/           -> Entidad TypeORM (tabla de base de datos)
+- application/      -> Servicio (logica de negocio)
+- presentation/     -> Controlador (HTTP handlers)
+- dto/              -> Data Transfer Objects (validacion de entrada)
```

**Frontend - Feature-First + Clean Architecture**
La carpeta `/app` es exclusivamente routing. Todo el codigo de negocio vive en `/features`.

```
src/app/        -> Routing (page.tsx, layout.tsx) - sin logica
src/features/   -> Modulos de negocio autocontenidos
src/shared/     -> Componentes y hooks compartidos
src/lib/        -> HTTP client, auth config
src/providers/  -> Providers globales de React
```

---

## 4. Backend - Especificacion Tecnica

### 4.1 Stack Tecnologico

| Tecnologia | Version | Rol |
|-----------|---------|-----|
| Node.js | >= 18 | Runtime |
| NestJS | ^10.3.3 | Framework API REST |
| TypeScript | ^5.3.3 | Lenguaje |
| TypeORM | ^0.3.17 | Object-Relational Mapper |
| MySQL | 8.x | Base de datos relacional |
| mysql2 | ^3.6.5 | Driver MySQL para Node |
| Passport.js | ^0.7.0 | Framework de autenticacion |
| passport-jwt | ^4.0.1 | Estrategia JWT |
| @nestjs/jwt | ^10.2.0 | Manejo de tokens JWT |
| bcryptjs | ^2.4.3 | Hashing de contrasenas |
| class-validator | ^0.14.0 | Validacion de DTOs |
| class-transformer | ^0.5.1 | Serializacion de objetos |
| ExcelJS | ^4.4.0 | Generacion de reportes Excel |
| Joi | ^17.11.0 | Validacion de variables de entorno |
| RxJS | ^7.8.1 | Streams reactivos |
| Jest | ^29.7.0 | Framework de pruebas |

### 4.2 Modulos del Sistema

El backend esta compuesto por **8 modulos funcionales** mas infraestructura compartida.

#### Modulo `auth`
Gestion de identidad y sesion.
- Login con emision de JWT (access token)
- Registro de nuevos usuarios
- Refresh de token
- Perfil del usuario autenticado (`GET /auth/me`)
- Cambio de contrasena

#### Modulo `users`
Administracion de operadores del sistema.
- CRUD completo de usuarios
- Gestion de roles (`ADMIN`, `CONSULTANT`)
- Activar/desactivar cuenta

#### Modulo `producers`
Directorio de productores de arroz.
- CRUD de productores con validacion de RUT chileno
- Gestion de multiples cuentas bancarias por productor (array JSON)
- Campos: razon social, direccion, ciudad, telefono, contacto

#### Modulo `configuration`
Catalogos configurables del sistema.
- **Tipos de arroz** (`rice_types`): variedades con codigo, nombre y precio de referencia
- **Temporadas** (`seasons`): ano, fechas inicio/fin, activa/inactiva
- **Parametros de analisis** (`analysis_params`): 8 parametros de descuento por calidad
- **Plantillas** (`templates`): configuracion de analisis por productor o global

#### Modulo `operations`
Nucleo operacional del sistema.
- Registro de recepciones de arroz (pesaje, precio, guia)
- Analisis de calidad parametrico (8 parametros)
- Calculo automatico de descuentos por calidad (kg descontados)
- Calculo de porcentaje de secado
- Exportacion a Excel

#### Modulo `finances`
Gestion financiera con productores.
- **Anticipos**: emision, calculo de interes por tasa y dias, historial
- **Transacciones**: registro de cada movimiento financiero (anticipo, pago, deduccion, interes, liquidacion)
- **Liquidaciones**: agrupacion de recepciones + anticipos, calculo de IVA, saldo a pagar, registro de factura

#### Modulo `analytics`
Reportes de business intelligence (solo lectura).
| Reporte | Descripcion |
|---------|-------------|
| Dashboard KPIs | Indicadores clave por temporada activa |
| Top Productores | Ranking por volumen recibido |
| Perfil de Productor | Estadisticas individuales |
| Reporte de Temporada | Resumen completo de la temporada |
| Ingresos por Secado | Revenue por servicio de secado |
| Ingresos por Interes | Revenue por intereses de anticipos |
| Rentabilidad Financiera | P&L por temporada |
| Retorno a Presupuesto | Analisis presupuestario |
| Rendimiento de Proceso | Metricas de eficiencia |
| Libro de Existencias | Inventario de entradas y salidas |
| Proyeccion de Caja | Flujo de caja proyectado |
| Volumen vs Precio | Correlacion volumen/precio |

#### Infraestructura Compartida (`shared/`)

| Componente | Tipo | Funcion |
|-----------|------|---------|
| `JwtAuthGuard` | Guard | Valida Bearer JWT en cada request. Retorna 401 si falta o es invalido. |
| `RolesGuard` | Guard | Compara `@Roles()` del handler con `request.user.role`. Retorna 403 si no coincide. |
| `@Roles(...)` | Decorator | Anota los roles permitidos en un endpoint. |
| `@GetUser(field?)` | Decorator | Extrae `request.user` o un campo especifico del token JWT. |
| `TransformInterceptor` | Interceptor | Envuelve respuestas en `{ success: true, data, timestamp }`. No aplica a `StreamableFile`. |
| `HttpExceptionFilter` | Filter | Formatea errores HTTP como `{ success: false, message, statusCode, timestamp }`. |
| `AllExceptionsFilter` | Filter | Catch-all para errores no capturados -> HTTP 500. |
| `BaseEntity` | Abstract class | Campos comunes: `id`, `createdAt`, `updatedAt`, `deletedAt` (soft delete). |

### 4.3 Modelo de Datos

El sistema utiliza **11 tablas** en MySQL 8, todas con soft delete (`deletedAt`) y timestamps automaticos.

#### Diagrama Entidad-Relacion (simplificado)

```
producers --------------------------------------------+
    |                                                 |
    +-- receptions -- analysis_records                |
    |      |                                          |
    |      +-- (settled via) -- settlements ----------+
    |                              |                  |
    +-- advances ------------------+                  |
    |                                                 |
    +-- transactions (linked to advances/settlements) |

rice_types ---- receptions
seasons ---------+-- advances -- settlements
templates ------ receptions -- analysis_records
analysis_params (global catalog)
users --------- receptions -- settlements -- transactions
```

#### Tabla: `users`
Campos principales: `id`, `email`, `password`, `name`, `firstName`, `lastName`, `role`, `isActive`, `phone`, `lastLogin`.

#### Tabla: `producers`
Campos principales: `id`, `rut`, `name`, `address`, `city`, `phone`, `email`, `contactPerson`, `bankAccounts`, `notes`, `isActive`, `totalDebt`.

**Esquema de `bankAccounts` (JSON array):**
```json
[
  {
    "bankCode": "001",
    "bankName": "Banco de Chile",
    "accountNumber": "1234567890",
    "accountTypeCode": "CC",
    "holderName": "Juan Perez"
  }
]
```

#### Tabla: `rice_types`
Campos principales: `id`, `code`, `name`, `description`, `referencePrice`, `isActive`.

#### Tabla: `seasons`
Campos principales: `id`, `code`, `name`, `year`, `startDate`, `endDate`, `isActive`, `notes`.

#### Tabla: `analysis_params`
8 parametros de descuento por calidad del grano.
Campos principales: `id`, `discountCode`, `discountName`, `unit`, `rangeStart`, `rangeEnd`, `discountPercent`, `priority`, `isActive`.

Parametros estandar:

| Codigo | Parametro |
|--------|-----------|
| 1 | Humedad |
| 2 | Granos Verdes |
| 3 | Impurezas |
| 4 | Vano |
| 5 | Hualcacho |
| 6 | Granos Manchados |
| 7 | Granos Pelados |
| 8 | Granos Yesosos |

#### Tabla: `templates`
Plantillas de analisis por productor o global, con columnas por cada parametro (disponibilidad, porcentaje, tolerancia, visibilidad) y grupo de tolerancia.

#### Tabla: `receptions`
Registro de cada guia de entrada: productor, plantilla, temporada, tipo de arroz, fecha, guia, patente, pesos, descuentos, bonificaciones, estado y usuario.

#### Tabla: `analysis_records`
Resultado del analisis de calidad (1:1 con recepcion), incluyendo snapshots de configuracion para trazabilidad.

#### Tabla: `advances`
Anticipos financieros con monto CLP, tasa de interes, periodo de interes, estado y liquidacion asociada.

#### Tabla: `settlements`
Liquidaciones finales con composicion (recepciones y anticipos), montos, IVA, saldo final, factura y fechas de emision/liquidacion.

#### Tabla: `settlement_reception_snapshots`
Snapshot inmutable de cada linea de recepcion al liquidar (fecha, guia, kg, precio, subtotales, IVA, secado).

#### Tabla: `transactions`
Movimientos financieros: `advance`, `payment`, `deduction`, `interest`, `refund`, `settlement`.

### 4.4 API REST - Referencia de Endpoints

**Base URL:** `https://paddy-backend-xez5.onrender.com/api/v1`

**Autenticacion:** Todos los endpoints (excepto `POST /auth/login`) requieren:
```
Authorization: Bearer <access_token>
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T12:00:00.000Z"
}
```

**Respuesta de error:**
```json
{
  "success": false,
  "message": "Descripcion del error",
  "statusCode": 400,
  "timestamp": "2026-03-17T12:00:00.000Z"
}
```

#### Auth
| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| POST | `/auth/login` | No | Login (`email`, `password`) |
| POST | `/auth/register` | JWT | Registrar usuario |
| POST | `/auth/refresh` | JWT | Renovar token |
| GET | `/auth/me` | JWT | Perfil actual |
| PUT | `/auth/change-password` | JWT | Cambiar contrasena |

#### Users
| Metodo | Ruta | Auth |
|--------|------|------|
| GET | `/users` | JWT+ADMIN |
| POST | `/users` | JWT+ADMIN |
| GET | `/users/:id` | JWT+ADMIN |
| PATCH | `/users/:id` | JWT+ADMIN |
| DELETE | `/users/:id` | JWT+ADMIN |
| PUT | `/users/:id/toggle-active` | JWT+ADMIN |

#### Producers
| Metodo | Ruta | Auth |
|--------|------|------|
| GET | `/producers` | JWT |
| POST | `/producers` | JWT+ADMIN |
| GET | `/producers/:id` | JWT |
| PUT | `/producers/:id` | JWT+ADMIN |
| DELETE | `/producers/:id` | JWT+ADMIN |
| POST | `/producers/:id/bank-accounts` | JWT+ADMIN |
| DELETE | `/producers/:id/bank-accounts/:index` | JWT+ADMIN |

#### Configuration
Todos requieren `JWT+ADMIN`.
- `GET/POST /configuration/rice-types`
- `GET/PUT/DELETE /configuration/rice-types/:id`
- `GET/POST /configuration/seasons`
- `GET /configuration/seasons/active`
- `GET/PUT/DELETE /configuration/seasons/:id`
- `GET/POST /configuration/templates`
- `GET /configuration/templates/default`
- `GET/PUT/DELETE /configuration/templates/:id`
- `GET/POST /configuration/analysis-params`
- `GET/PUT/DELETE /configuration/analysis-params/:id`

#### Operations
- `GET /operations/receptions`
- `GET /operations/receptions/export/excel`
- `POST /operations/receptions`
- `POST /operations/receptions/with-analysis`
- `GET/PUT/DELETE /operations/receptions/:id`
- `PATCH /operations/receptions/:id/rice-price`
- `GET /operations/producers/:producerId/receptions`
- `GET/POST/PUT/DELETE /operations/receptions/:id/analysis`
- `PATCH /operations/receptions/:id/analysis/dry-percent`
- `POST /operations/receptions/:id/calculate-discounts`
- `POST /operations/receptions/:id/settle`

#### Finances
- `GET/POST /finances/advances`
- `GET /finances/advances/export/excel`
- `GET/PUT/PATCH/DELETE /finances/advances/:id`
- `GET /finances/advances/:id/details`
- `GET /finances/advances/:id/interest`
- `GET/POST /finances/transactions`
- `GET/PUT/DELETE /finances/transactions/:id`
- `GET /finances/producers/:producerId/pending-balance`
- `GET/POST /finances/settlements`
- `GET /finances/settlements/candidates`
- `GET/PUT/DELETE /finances/settlements/:id`
- `POST /finances/settlements/:id/calculate`
- `POST /finances/settlements/:id/complete`
- `POST /finances/settlements/:id/cancel`

#### Analytics
- `GET /analytics/dashboard`
- `GET /analytics/producers/top`
- `GET /analytics/producers/:id`
- `GET /analytics/seasons/:id/report`
- `GET /analytics/quality/report`
- `GET /analytics/finances/report`
- `GET /analytics/drying/revenue`
- `GET /analytics/financial-services/interests`
- `GET /analytics/reports/inventory-book`
- `GET /analytics/reports/cash-projection`
- `GET /analytics/reports/financial-profitability`
- `GET /analytics/reports/budget-return`
- `GET /analytics/reports/process-yield`
- `GET /analytics/reports/volume-price`

### 4.5 Seguridad

- **Autenticacion JWT** con firma HS256 y `JwtAuthGuard`.
- **Autorizacion RBAC** con `@Roles()` + `RolesGuard` (`ADMIN`, `CONSULTANT`).
- **Contrasenas** hasheadas con bcrypt (nunca texto plano).
- **Base de datos con SSL/TLS** obligatorio en Aiven.
- **Validacion de entrada** con `class-validator` y `ValidationPipe` global.
- **Soft delete** en entidades para trazabilidad y recuperacion.

### 4.6 Historial de Migraciones

- `1741689000000-AddAllParametersToTemplate`
- `1772983328273-AddNameToUsers`
- `1778497200000-AddInterestFieldsToAdvance`
- `1778500000000-AddConsultantRole`
- `1778600000000-AddSettlementCompositionAndAdvanceLink`
- `1778620000000-RenameAdvancePendingStatusToPaid`
- `1778700000000-AddGroupToleranceNameToTemplate`
- `1778800000000-AddAnalysisRecordSnapshotFields`
- `1778900000000-ReplaceInProcessReceptionStatusWithCancelled`
- `1779000000000-AddSettlementReceptionSnapshots`
- `1779800000000-AddInventoryBookFields`

---

## 5. Frontend - Especificacion Tecnica

### 5.1 Stack Tecnologico

| Tecnologia | Version | Rol |
|-----------|---------|-----|
| Next.js | 16.1.6 | Framework React |
| React | 19.2.3 | UI |
| TypeScript | ^5 | Lenguaje |
| NextAuth | ^4.24.13 | Autenticacion |
| TanStack Query | ^5.90.21 | Cache y fetching |
| Tailwind CSS | ^3.4.17 | Estilos |
| Recharts | ^3.8.0 | Graficos |
| @nivo/line | ^0.99.0 | Graficos de linea |
| Leaflet / react-leaflet | ^1.9.4 / ^5.0.0 | Mapa |
| lucide-react | ^0.575.0 | Iconos |
| react-to-print | ^3.3.0 | Impresion |

### 5.2 Arquitectura Frontend

```
src/
+- app/                    # Solo routing
|  +- (public)/
|  +- paddy/              # Rutas protegidas
|  +- api/                # API Routes
+- features/              # Logica de negocio
+- shared/                # Componentes y hooks compartidos
+- lib/                   # auth + api client
+- providers/             # Providers globales
```

### 5.3 Modulos de Funcionalidad

- `auth`: login y cambio de contrasena
- `users`: CRUD de usuarios y roles
- `producers`: CRUD de productores y cuentas bancarias
- `receptions`: alta/edicion de recepciones y analisis
- `finances`: anticipos, pagos y liquidaciones
- `reports`: reportes analiticos y visualizaciones
- `rice-types`, `seasons`, `templates`, `analysis-params`: catalogos de configuracion

### 5.4 Arbol de Rutas

- `/auth/login`
- `/paddy`
- `/paddy/operations/receptions`
- `/paddy/management/producers`
- `/paddy/management/rice-types`
- `/paddy/finances/advances`
- `/paddy/finances/payments`
- `/paddy/finances/settlements`
- `/paddy/reports/drying-revenue`
- `/paddy/reports/interest-revenue`
- `/paddy/reports/financial-profitability`
- `/paddy/reports/budget-return`
- `/paddy/reports/process-yield`
- `/paddy/reports/inventory-book`
- `/paddy/reports/cash-projection`
- `/paddy/reports/volume-price`
- `/paddy/settings/seasons`
- `/paddy/settings/templates`
- `/paddy/settings/analysis-params`
- `/paddy/settings/rice-types`
- `/paddy/users`

### 5.5 Biblioteca de Componentes UI

`src/shared/components/ui/` incluye 21 componentes reutilizables.
Principales:
- `TextField`, `Select`, `Switch`, `Button`, `IconButton`
- `DataGrid`, `Dialog`, `Alert`, `Badge`, `Tabs`
- `AutoComplete`, `FileUploader`, `RangeSlider`, `NumberStepper`
- `SplashScreen`, `TopBar`, `PrintDialog`

### 5.6 Flujo de Autenticacion

```
LoginForm -> signIn("credentials")
        -> NextAuth callback
        -> POST /auth/login (backend)
        -> JWT en sesion NextAuth
        -> Middleware protege /paddy/*
```

Hardening productivo implementado en `auth.config.ts`:
- Resolucion robusta de URL backend (`BACKEND_API_URL` prioridad)
- Timeout de 10s en requests de auth
- Parsing defensivo para respuestas no-JSON
- Manejo explicito de 401/403 y errores de red

---

## 6. Infraestructura y Despliegue

### 6.1 Entornos

| Entorno | Backend | Frontend | DB |
|---------|---------|----------|----|
| Produccion | Render | Vercel | Aiven MySQL |
| Local | localhost:3000 | localhost:3001 | Local/Aiven |

### 6.2 Variables de Entorno

#### Backend
- `DATABASE_HOST`
- `DATABASE_PORT`
- `DATABASE_USER`
- `DATABASE_PASSWORD`
- `DATABASE_NAME`
- `DATABASE_SSL_MODE=REQUIRED`
- `DATABASE_SSL_REJECT_UNAUTHORIZED=false`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `PORT`

#### Frontend
- `NEXT_PUBLIC_API_URL`
- `BACKEND_API_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `PORT=3001`

### 6.3 Topologia de Produccion

```
Vercel (Frontend)
  -> HTTPS -> Render (Backend)
              -> TLS -> Aiven (MySQL)
```

---

## 7. Runbook Operacional

### 7.1 Setup Local

```bash
# Backend
cd backend
npm install
npm run db:setup
npm run start:dev

# Frontend
cd frontend
npm install
npm run dev
```

### 7.2 Scripts DB

| Comando | Accion |
|---------|--------|
| `npm run db:reset` | Recreate completo (destructivo) |
| `npm run db:migrate` | Ejecuta migraciones |
| `npm run db:seed` | Seed minimo |
| `npm run db:seed:full` | Seed completo |
| `npm run db:setup` | Reset + build + seed |

### 7.3 Backfill (historicos)

```bash
cd backend
npm run db:backfill:advance-transactions
npm run db:backfill:settlement-iva
npm run db:backfill:settlement-snapshots
```

### 7.4 Despliegue Produccion

**Vercel env vars recomendadas:**
```bash
BACKEND_API_URL=https://paddy-backend-xez5.onrender.com/api/v1
NEXT_PUBLIC_API_URL=https://paddy-backend-xez5.onrender.com/api/v1
NEXTAUTH_URL=https://<tu-dominio>.vercel.app
NEXTAUTH_SECRET=<secreto-seguro>
```

---

## 8. Estrategia de Pruebas

| Tipo | Estado | Herramienta |
|------|--------|-------------|
| Unit backend | Configurado | Jest |
| E2E backend | Configurado base | Jest |
| Unit frontend | Pendiente | - |
| E2E frontend | Pendiente | - |

Flujos validados manualmente:
- Login + sesion
- Recepcion + analisis + descuentos
- Anticipo + interes
- Liquidacion completa
- Exportaciones Excel
- Impresiones

---

## 9. Limitaciones Conocidas y Deuda Tecnica

| Item | Severidad | Observacion |
|------|-----------|-------------|
| Cobertura automatizada baja | Alta | Faltan tests unitarios y E2E robustos |
| Render cold start | Media | Latencia inicial 30-60s |
| CI/CD formal | Media | No se observan pipelines de GitHub Actions activos |
| Escalabilidad reportes | Media | Reportes pesados pueden requerir paginacion/caching |

Mejoras sugeridas:
1. Pipeline CI con build + test en PR
2. Suite E2E para flujos criticos
3. Alertas y auditoria por usuario
4. Integracion con facturacion electronica (SII)
5. Monitoreo/APM y trazas distribuidas

---

## 10. Glosario

| Termino | Definicion |
|---------|------------|
| Recepcion | Entrada de arroz con pesaje y datos de guia |
| Analisis de Calidad | Evaluacion de parametros que impactan descuentos |
| Parametro | Factor de calidad (humedad, impurezas, etc.) |
| Plantilla | Configuracion base de analisis por productor/global |
| Anticipo | Prestamo previo a liquidacion |
| Liquidacion | Documento final de pago al productor |
| IVA Arroz | Impuesto sobre venta de arroz |
| IVA Servicios | Impuesto sobre secado y servicios |
| Temporada | Ciclo agricola anual |
| RUT | Identificador tributario chileno |
| DDD | Domain-Driven Design |
| Soft Delete | Eliminacion logica con `deletedAt` |
| JWT | JSON Web Token |
| RBAC | Control de acceso basado en roles |
| CLP | Peso Chileno |

---

Documento generado el 17 de marzo de 2026.
