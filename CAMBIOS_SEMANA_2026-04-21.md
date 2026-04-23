# Cambios de la semana (según historial Git)

**Periodo considerado:** 21 al 23 de abril de 2026 (commits con fecha de autor en ese rango).  
**Total de commits:** 83.  
**HEAD al generar este documento:** `01620a43509165c1f3a968a99a65e760f3d9e4f6`.

Este resumen se elaboró a partir de los mensajes de commit en el repositorio. No incluye cambios locales que aún no estén confirmados en Git.

---

## Resumen por temas

### Nuevo producto **paddy-tms** y estructura del repo

- Creación del proyecto Paddy TMS (Next.js + integración con backend NestJS + MySQL).
- Reorganización: frontend de **paddy-tms** en la raíz de la carpeta, eliminación del backend duplicado dentro de **paddy-tms**; rutas simplificadas (`/weighing`, `/monitor`, `/login`, etc.).
- Página raíz con redirección a login; layout con estilos globales y **LogisticsProvider**.
- Documentación y guías de inicio / migración de componentes (varios commits `docs:` el 21/04).

### Backend — módulo **Logistics** y **TruckReception**

- Integración del módulo Logistics en el backend principal; corrección de ruta duplicada del controlador y registro de **Producer** en `TypeOrmModule`.
- Reestructuración de la entidad **TruckReception** (nuevos campos y estados; eliminación de `fecha_hora_peso_bruto` / `fecha_hora_peso_tara`).
- Flujo de turnos actualizado (**ESPERA → FINISHED** y estados intermedios según el diseño actual).
- Turnos **1–100**, cola en **ESPERA** con reordenamiento; ajustes en servicio, DTOs y controlador para recepción y actualización de turnos.
- Corrección de anidamiento en respuestas API, normalización de fechas en **getTurnosByDate**, parsing de **numero_turno** y logging del flujo de recepción.

### Tiempo real y monitor

- Monitor con **Socket.IO**; sincronización del pesaje con el monitor; ticket de pesaje e identidad **Paddy AyG** en cabecera.
- WebSocket más resiliente y deshabilitado por defecto en un punto del desarrollo (commit del 21/04).

### Aplicación **paddy-tms** — pesaje y operación en patio

- Panel de pesaje con sidebar, componentes modulares, formularios y campos alineados a **TruckReception**.
- Servicios **localStorage** y **puerto serie** orientados a PWA; hook **useSerialPort** y correcciones de tipos **SerialPort**.
- Refactor de recepción de camiones hacia **Server Actions**; autenticación en peticiones del cliente (**truckReceptionService**, **validateAuth** con `Authorization`).
- **TruckList**: diseño de tarjetas, orden visual turno / patente, hora en formato **24 h**, separador de miles en peso bruto, iconos y arrastre (DnD).
- DnD para **reordenar la cola** (intercambio de posiciones y actualización de **numero_turno**), con iteraciones de UX y feedback al reordenar en ESPERA.
- Cabecera de pesaje: turnos y barra superior (commit 23/04).

### Recepciones y UI administrativa

- Listado de recepciones con **DataGrid** y mejoras de UI.
- Ajuste de URLs del DataGrid usando **pathname**; página de recepciones con **force-dynamic** (23/04).

### Autenticación y componentes compartidos

- Login con componentes compartidos; mejoras en **authService** y tokens.
- Limpieza de archivos y exports de **next-auth** no usados.
- **ChangePasswordDialog** alineado con la auth de paddy-tms.
- Correcciones en **Select**, **Alert**, imports default, **Badge**, **LoginPage** / **TextField**, **fetchProducersAction** con cookies de servidor.

### Otros (monorepo)

- **Inventory Book:** descarga de Excel vía Server Action (commit `d0ff8bd`).

---

## Lista completa de commits (orden cronológico inverso: más reciente primero)

- `01620a4` — fix(tms): DataGrid URL updates use pathname; receptions force-dynamic (2026-04-23)
- `facc671` — feat(tms): pesaje — cabecera, turnos y barra superior (2026-04-23)
- `969247b` — fix(weighing): mejor feedback visual al reordenar cola en espera (2026-04-23)
- `3336638` — feat(logistics): recepción, turnos 1–100 y cola en espera con DnD (2026-04-23)
- `fc33854` — feat(tms): monitor Socket.IO, ticket pesaje y marca Paddy AyG (2026-04-22)
- `7eb0cca` — feat(tms): listado de recepciones con DataGrid y mejoras de UI (2026-04-22)
- `09863c4` — Add thousands separator to gross weight display (2026-04-22)
- `e06792e` — Reorder turn badge and license plate in truck cards (2026-04-22)
- `061b252` — Add hover color effect to drag icon in truck cards (2026-04-22)
- `5180ce3` — Ensure all form field labels are always visible (2026-04-22)
- `b5d4ae4` — Enhance arrow icon in truck card with size and hover effects (2026-04-22)
- `f12346b` — Move logo to left side of header (2026-04-22)
- `728f547` — Add logo to weighing page header (2026-04-22)
- `0431773` — Add all logos and icons from frontend to paddy-tms (2026-04-22)
- `9a3e8f0` — Improve truck card information display format (2026-04-22)
- `30f7f64` — Fix truck turn number display after drag and drop (2026-04-22)
- `eceaf02` — Simplify drag and drop to swap positions directly (2026-04-22)
- `e45b7fc` — Implement turn number update on drag and drop reordering (2026-04-22)
- `411b3eb` — Fix drag and drop functionality with improved event handling (2026-04-22)
- `b045087` — Fix drag and drop to reorder trucks instead of changing status (2026-04-22)
- `c29b6d2` — Change time format to 24-hour (remove AM/PM) (2026-04-22)
- `bdeaa0e` — Implement drag and drop functionality to update truck status (2026-04-22)
- `f124369` — Update TruckList styling and labels (2026-04-22)
- `9d1ec05` — Improve TruckList card design for better elegance and clarity (2026-04-22)
- `3021626` — Redesign TruckList cards with improved styling and layout (2026-04-22)
- `af95e74` — Fix getTurnosByDate to normalize date for proper database queries (2026-04-22)
- `b67caa9` — Fix backend response nesting by removing duplicate wrapping (2026-04-22)
- `d776023` — Add comprehensive logging for truck reception flow (2026-04-22)
- `82e97cb` — Fix truck reception response parsing for numero_turno (2026-04-22)
- `49a167d` — Refactor truck reception to use Server Actions (2026-04-22)
- `526bee6` — fix: Actualizar ChangePasswordDialog para usar auth de paddy-tms (2026-04-22)
- `cbfb100` — fix: Remover referencias de tipo SerialPort (2026-04-22)
- `6c5b196` — fix: Corregir tipo SerialPort en serialPort.service.ts (2026-04-22)
- `c47dd24` — chore: Limpiar exports de next-auth en lib/index.ts (2026-04-21)
- `60d6781` — chore: Eliminar archivos de next-auth no utilizados (2026-04-21)
- `d50f1be` — chore: Eliminar archivos innecesarios de next-auth en paddy-tms (2026-04-21)
- `733fede` — fix: Corregir tipo de retorno del hook useSerialPort (2026-04-21)
- `fbb5dba` — fix: Corregir variante de Badge en TruckList (2026-04-21)
- `77cc656` — fix: Agregar autenticación a todas las peticiones del cliente en truckReceptionService (2026-04-21)
- `e3bd146` — fix: Corregir tipo de retorno en filterOption (2026-04-21)
- `8c3213d` — fix: Corregir fetchProducersAction para usar cookies del servidor (2026-04-21)
- `fe9ace6` — feat: Refactorizar weighing page con componentes modulares y nuevo layout (2026-04-21)
- `8780d9d` — fix: Corregir ruta duplicada del controlador de logistics (2026-04-21)
- `60b2ce0` — feat: Implementar servicio de recepción con localStorage y refactorizar /weighing/page.tsx (2026-04-21)
- `cd6bd52` — feat: Agregar servicios de localStorage y puerto serial para PWA (2026-04-21)
- `fbdc162` — feat: Actualizar backend para nuevo flujo de turnos (ESPERA -> FINISHED) (2026-04-21)
- `c57ad94` — docs: Agregar documentación de reestructuración de TruckReception (2026-04-21)
- `c9fa554` — refactor: Actualizar UI de weighing con nuevos campos de TruckReception (2026-04-21)
- `fc22a0b` — refactor: Reestructurar entidad TruckReception con nuevos campos y estados (2026-04-21)
- `62ddd31` — refactor: Eliminar campos fecha_hora_peso_bruto y fecha_hora_peso_tara de TruckReception (2026-04-21)
- `672b021` — fix: Pasar token en header Authorization en validateAuth (2026-04-21)
- `2950229` — fix: Corregir props de Select en formulario de nueva recepción (2026-04-21)
- `f662224` — fix: Corregir importaciones de componentes como default exports (2026-04-21)
- `488533c` — fix: Corregir importación de Alert component (2026-04-21)
- `47027e4` — fix: Hacer WebSocket sync más resiliente y deshabilitarlo por defecto (2026-04-21)
- `69ade93` — feat: Implementar UI completa del panel de pesaje con sidebar (2026-04-21)
- `7a895a9` — fix: Agregar LogisticsProvider al layout raíz (2026-04-21)
- `fa84ec2` — refactor: Simplificar página de weighing a versión funcional básica (2026-04-21)
- `2cf3767` — fix: Importar globals.css en layout principal (2026-04-21)
- `c4a7b75` — fix: Corregir atributos incompatibles en TextField de LoginPage (2026-04-21)
- `e382502` — docs: Documentar componentes compartidos en COMIENZA_AQUI.md (2026-04-21)
- `1e5b2bc` — refactor: Mejorar manejo de tokens en authService (2026-04-21)
- `0203c2f` — refactor: Actualizar LoginPage para usar componentes compartidos (2026-04-21)
- `d2dc226` — feat: Agregar página raíz con redirección automática a login (2026-04-21)
- `8ad5dbf` — docs: Actualizar rutas en documentación (2026-04-21)
- `5379ba2` — refactor: Reorganizar rutas de paddy-tms a estructura simple (2026-04-21)
- `4a9035f` — refactor: Eliminar carpeta backend innecesaria de paddy-tms (2026-04-21)
- `3cfdebf` — fix: Agregar Producer al TypeOrmModule en LogisticsModule (2026-04-21)
- `9164192` — refactor: Reorganizar paddy-tms para que frontend esté en raíz (2026-04-21)
- `1d54eb2` — feat: Integrar módulo Logistics en backend principal (2026-04-21)
- `d940031` — docs: Crear guía de inicio rápido para Paddy TMS (2026-04-21)
- `f2e20eb` — feat: Crear proyecto Paddy TMS completo - Next.js + NestJS + MySQL (2026-04-21)
- `58c4b63` — docs: Crear README principal para Paddy TMS (2026-04-21)
- `b4594b8` — script: Crear script de automatización para migración de componentes (2026-04-21)
- `37981de` — docs: Crear guía de migración de componentes UI a Paddy TMS (2026-04-21)
- `5efdf05` — docs: Crear resumen ejecutivo del proyecto Paddy TMS (2026-04-21)
- `d2711eb` — docs: Actualizar documentación TMS con nombre oficial y rutas (2026-04-21)
- `0203a3a` — docs: Actualizar TMS Architecture para MySQL + Socket.io (2026-04-21)
- `c5c3bad` — docs: Crear arquitectura final - Nueva entidad TruckReception (NO extender Reception) (2026-04-21)
- `800b914` — docs: Agregar refinamiento arquitectónico del TMS (2026-04-21)
- `f310135` — docs: Agregar índice y guía de documentos del TMS (2026-04-21)
- `d0ff8bd` — refactor: Usar Server Action para descarga segura de Excel del Inventory Book (2026-04-21)
- `8062dbf` — docs: Agregar arquitectura completa del Truck Management System (2026-04-21)

---

## Cómo reproducir el listado

```bash
git log --since="2026-04-21 00:00" --until="2026-04-24 00:00" \
  --pretty=format:"- \`%h\` — %s (%ad)" --date=short
```

Para otra semana, ajusta las fechas en `--since` y `--until`.
