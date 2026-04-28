# Informe de entrega — aplicación **Cargo** (TMS / báscula Paddy AyG)

**Documento:** descripción funcional y técnica de la aplicación **Cargo** (antes evolución bajo nombres *Paddy TMS* / *paddy-tms*), su relación con el backend **NestJS** y el proceso de desarrollo según el historial del repositorio.  
**Referencias internas:** resumen semanal [`CAMBIOS_SEMANA_2026-04-21.md`](../CAMBIOS_SEMANA_2026-04-21.md) (raíz del monorepo), código en [`cargo/`](../cargo/) y módulo [`backend/src/modules/logistics/`](../backend/src/modules/logistics/).

**Alcance:** entrega orientada a operación en planta (recepción y despacho de carga, cola de turnos, monitor en tiempo real) y a continuidad del desarrollo.

---

## 1. Propósito del producto

**Cargo** es la aplicación web usada en patio / báscula para:

- Registrar y pesar **recepciones** de camiones (arroz paddy u otros productos logísticos definidos en sistema).
- Gestionar **despachos** de camión con el mismo flujo operativo de pesaje (bruto / tara según diseño de API).
- Mostrar un **monitor** de sala con la cola en espera y el camión seleccionado en la balanza, actualizado en **tiempo casi real** vía **Socket.IO**.
- Operar como **PWA-friendly** donde aplica: uso de **puerto serie (Web Serial API)** para integrar balanza, almacenamiento local de preferencias y flujo de login con **NextAuth**.

La aplicación administrativa principal del ecosistema (**frontend** en puerto distinto) complementa Cargo con grillas de recepciones/despachos de camión, reimpresión de tickets y gestión; Cargo se centra en la **operación en terreno**.

---

## 2. Stack tecnológico (Cargo)

| Capa | Tecnología |
|------|------------|
| Framework UI | **Next.js 16** (App Router), **React 19** |
| Estilos | **Tailwind CSS**, componentes propios bajo `cargo/src/shared/components/ui` |
| Autenticación | **next-auth** v4, JWT vía `getToken` en middleware |
| Tiempo real | **socket.io-client** → namespace `/logistics` del backend |
| Datos / API | REST contra el backend Nest (`NEXT_PUBLIC_API_URL`), **Server Actions** y servicios cliente donde corresponde |
| Impresión | Tickets de pesaje (componentes dedicados, diálogo de impresión) |

**Ejecución típica en desarrollo:** `PORT=3002 npm run dev` (ver [`cargo/package.json`](package.json)).

---

## 3. Base de datos: las dos tablas nuevas del dominio logístico

El TMS no reutiliza la tabla de negocio `receptions` (recepciones de paddy contables); introduce **dos tablas** dedicadas al flujo de patio:

### 3.1 `truck_receptions`

- **Rol:** una fila por **camión en recepción** en planta (cola, pesaje, cierre).
- **Nombre físico:** `truck_receptions` (entidad TypeORM `TruckReception`).
- **Campos relevantes (resumen):**
  - `status`: enum operativo **`ESPERA` | `FINISHED`** (flujo simplificado respecto a diseños intermedios con más estados).
  - `numero_turno`, `turno_date`: sistema de turno y fecha de turno.
  - `producer_id`: productor asociado (FK a `producers`).
  - `product`: enum logístico (p. ej. **ARROZ_PADDY**, **CASCARILLA**).
  - Identificación y transporte: `license_plate`, `driver_name`, `carrier_company`, `dispatch_guide`.
  - Pesos: `gross_weight`, `tare_weight`, `net_weight`.
  - Tiempos: `entry_at`, `finished_at`, auditoría `created_at` / `updated_at` / soft delete.

Las migraciones aplicables viven en el backend (carpeta `backend/src/infrastructure/database/migrations/` y flujo `npm run db:migrate`); el histórico en [`CAMBIOS_SEMANA_2026-04-21.md`](../CAMBIOS_SEMANA_2026-04-21.md) documenta además operaciones de respaldo y sincronización con dumps de producción.

### 3.2 `truck_dispatches`

- **Rol:** misma **estructura operativa** que recepción, para **despacho** de carga.
- **Nombre físico:** `truck_dispatches` (entidad `TruckDispatch`).
- **Campos:** alineados a recepción (estado, turno, productor, producto, patente, pesos, guías, timestamps).

Ambas tablas permiten turnos independientes y consultas por fecha para la cola del día.

---

## 4. Sistema de turnos (detalle operativo y técnico)

### 4.1 Reglas de negocio

- Los números de turno utilizan un rango acotado **1–100** (constantes `RECEPTION_TURNO_MIN` / `RECEPTION_TURNO_MAX` en backend).
- Un turno **no usado** puede asignarse al crear un registro; el backend valida disponibilidad entre filas en **`ESPERA`** (recepción y despacho tienen lógica análoga donde aplica).
- El servicio expone **siguiente turno libre** (`getNextTurnoForToday`, `getNextTurnoForTodayDispatches`) para asignación automática cuando el operador no fuerza un número.
- La **fecha de turno** (`turno_date`) acota la consulta de “turnos del día” en listas y en el monitor.

### 4.2 Cola en **ESPERA** y reordenamiento (DnD)

- En la pantalla de **pesaje / recepción**, la lista de camiones en espera admite **arrastrar y soltar** para reordenar la cola.
- El orden no solo es visual: el cliente emite por Socket.IO el mensaje **`espera-queue-order`** con el arreglo `ordered_ids` (IDs de `truck_receptions`).
- El **gateway** del backend guarda ese orden y lo aplica al armar el payload del monitor (`applyEsperaQueueOrder`), de modo que **monitor y operador ven la misma prioridad**.

### 4.3 Selección en balanza

- Cuando el operador selecciona un camión para pesar, se emite **`weighing-selection`** con `truck_reception_id`.
- El servidor mantiene `weighingTruckReceptionId` y lo incluye en **`monitor-state`**, de forma que el monitor destaque qué registro está “en balanza”.

---

## 5. WebSocket y tiempo real

### 5.1 Backend (NestJS + Socket.IO)

- **Gateway:** `LogisticsGateway`, namespace **`/logistics`** (`@WebSocketGateway`).
- **Evento principal hacia el cliente:** `monitor-state` con payload:
  - `serverTime`
  - `weighingTruckReceptionId`
  - `waiting`: lista de ítems en **ESPERA** (id, `numero_turno`, patente, `entry_at`, `status`).
- Tras operaciones de negocio (crear, actualizar estado, pesaje, etc.), `LogisticsService` invoca **`broadcastMonitorState()`** para refrescar a todos los clientes conectados.
- **Eventos desde el cliente (subset usado por Cargo):**
  - `weighing-selection` — camión activo en pesaje.
  - `espera-queue-order` — orden de la cola tras DnD.
- Otros mensajes (`register-truck`, `register-weighing`, etc.) existen en el gateway para extensibilidad o integraciones legacy.

### 5.2 Cargo (cliente)

- Conexión base: [`cargo/src/lib/logisticsSocket.ts`](src/lib/logisticsSocket.ts) — URL derivada de `NEXT_PUBLIC_WS_URL` o `NEXT_PUBLIC_API_URL` (mismo host que la API, sin path `/api/v1` para el handshake Socket.IO).
- **Monitor:** hook [`useMonitorQueueSocket`](src/features/logistics/hooks/useMonitorQueueSocket.ts): una conexión por página, suscripción a `monitor-state`.
- **Pesaje:** socket **compartido** (`getSharedWeighingLogisticsSocket`) para no multiplicar conexiones; sincronización selección/cola vía [`WeighingMonitorSync`](src/components/weighing/WeighingMonitorSync.tsx) y `emitEsperaQueueOrder` desde [`TruckList`](src/components/weighing/TruckList.tsx).

### 5.3 WebSocket “clásico” (opcional / legado)

- En `features/logistics` existen [`realtimeService.ts`](src/features/logistics/services/realtimeService.ts) y [`useRealtimeSync.ts`](src/features/logistics/hooks/useRealtimeSync.ts) basados en **`WebSocket` nativo**; el diseño actual de monitor y pesaje se apoya principalmente en **Socket.IO** del namespace `/logistics`. El código legacy puede quedar deshabilitado o en modo tolerante a fallo si el servidor no expone ese endpoint.

---

## 6. Secciones de la aplicación Cargo (rutas y función)

| Ruta (aprox.) | Función |
|---------------|---------|
| `/` | **Login** (y redirección si ya hay sesión). Soporte de `?redirect=` para volver a una ruta protegida. |
| `/login` | Alias de flujo de login dedicado (según evolución del App Router). |
| `/weighing` | **Recepción y pesaje:** formulario de alta / tara, lista de camiones del día, integración balanza, impresión de ticket, sincronización con monitor. Layout [`TmsAppLayout`](src/components/layout/TmsAppLayout.tsx) con enlace a despacho y logo Paddy AyG. |
| `/weighing/[id]` | Detalle / flujo por ID según implementación actual. |
| `/receptions` | **Administración de recepciones** de camión: grillas, edición, creación manual si aplica — pensado para backoffice de patio. |
| `/despachos` | **Despacho:** entrada a flujos de despacho (navegación a administrar, lista, cliente de pesaje). |
| `/despachos/administrar` | Gestión / administración de despachos. |
| `/despachos/lista` | Listado tipo DataGrid. |
| `/monitor` | **Monitor de sala:** sin barra TMS completa; usa `MonitorTopBar` + `MonitorDisplay`, solo lectura del estado en tiempo real (cola + selección en balanza). |

### 6.1 Protección por sesión (middleware)

En [`cargo/middleware.ts`](middleware.ts), rutas bajo **`/weighing`**, **`/receptions`**, **`/despachos`** exigen JWT válido (`next-auth/jwt`). **`/monitor`** no aparece en la lista actual de protegidas: puede usarse como pantalla pública en TV de sala (evaluar en despliegue si se desea restringir).

---

## 7. Autenticación y roles (ecosistema)

- Cargo comparte modelo de usuario con el resto del sistema; el backend introdujo el rol **`TRUCK_RECEPTION`** (migración y enum en `users.role`) para operadores de báscula/TMS.
- Los tokens se consumen en llamadas al API (cabecera `Authorization`) desde acciones y servicios configurados en Cargo.
- El middleware de Next redirige a `/` con `redirect` cuando un usuario no autenticado intenta acceder a rutas protegidas.

---

## 8. Integración con hardware y PWA

- **Web Serial API:** hook `useSerialPort`, contexto en `TmsAppLayout`, diálogo de configuración de puerto; pensado para leer peso desde balanza en entornos compatibles (Chrome/Edge, HTTPS o localhost).
- **localStorage:** servicios para persistir preferencias locales del operador cuando aplica.
- **Despliegue:** variables como `NEXT_PUBLIC_WEIGHING_APP_URL` permiten apuntar el acceso rápido “Ir a recepción y pesaje” entre instancias.

---

## 9. API backend (referencia rápida)

Controlador base: **`/api/v1/logistics`** (prefijo global según configuración Nest). Incluye, entre otros:

- Alta con peso bruto, registro de tara, actualización de estado, cancelación.
- Consultas de turnos por fecha, siguiente turno, listados paginados para grillas.
- Endpoints específicos de **despacho** (creación con tara, registro de pesos, grillas, cancelación).

El detalle de DTOs está en `backend/src/modules/logistics/dtos/`.

---

## 10. Proceso de desarrollo (línea de tiempo resumida)

La siguiente síntesis combina el trabajo descrito en **`CAMBIOS_SEMANA_2026-04-21.md`** y la estructura actual del código:

1. **Creación del TMS (Next + Nest + MySQL):** proyecto inicial de recepción de camiones, rutas de pesaje y login.
2. **Módulo Logistics en backend:** entidad `TruckReception`, controlador, servicio; correcciones de rutas y registro de `Producer` en TypeORM.
3. **Evolución del flujo de turnos:** estados **ESPERA → FINISHED**, turnos 1–100, cola con DnD y APIs de orden.
4. **Monitor Socket.IO:** gateway `/logistics`, evento `monitor-state`, ticket de pesaje con marca **Paddy AyG**.
5. **Despachos:** entidad y API paralelas a recepción, páginas Cargo (administrar, lista, formularios y pesaje de despacho).
6. **Consolidación y renombre:** carpeta **cargo** como app de báscula; rol `TRUCK_RECEPTION`; ajustes de UI (folios en tickets, DataGrids, login).
7. **Integración con `origin/main` y rama `chore/local-fixes`:** CORS, exportaciones de informes en frontend principal, fixes de correlación UUID en backend, auth en middleware Cargo, etc. (según merges vigentes en `main` al momento de leer el repo).

Este informe **no** sustituye el changelog commit-a-commit; para auditoría fina usar `git log` y el archivo semanal citado.

---

## 11. Entregables y continuidad

**Entregado con Cargo:**

- Aplicación Next desplegable (build `npm run build`, start `npm run start`).
- Flujo completo recepción + despacho + monitor con persistencia en **dos tablas** dedicadas.
- Tiempo real vía **Socket.IO** en `/logistics`.
- Sistema de **turnos** 1–100 con cola reordenable y reflejo en monitor.

**Recomendaciones para el equipo receptor:**

- Definir política de acceso a **`/monitor`** (público vs autenticado).
- Mantener documentación de variables `.env` / `.env.local` alineada a `NEXT_PUBLIC_*` y secretos de NextAuth.
- Tras cambios en Turbopack/Next 16, ante fallos intermitentes: limpiar `.next` y, si persiste, arrancar con `next dev --webpack` (ver documentación Next 16).

---

## 12. Control de versiones del documento

| Versión | Fecha | Notas |
|---------|-------|--------|
| 1.0 | 2026-04-24 | Primera versión del informe de entrega Cargo en repo. |

---

*Fin del informe.*
