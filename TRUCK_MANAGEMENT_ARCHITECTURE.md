# 🚚 PADDY TMS - TRUCK MANAGEMENT SYSTEM
## Arquitectura Técnica Completa

**Nombre del Proyecto**: Paddy TMS  
**Carpeta**: `/paddy-tms/`  
**Documento de Arquitectura Integral**  
**Fecha de Creación**: 21 de abril de 2026  
**Estado**: 📋 EN DISEÑO Y PLANIFICACIÓN  
**Última Actualización**: 21 de abril de 2026

---

## 📑 ÍNDICE

1. [Visión General](#visión-general)
2. [Objetivos del Sistema](#objetivos-del-sistema)
3. [Flujo de Procesos](#flujo-de-procesos)
4. [Arquitectura Técnica](#arquitectura-técnica)
5. [Modelos de Datos](#modelos-de-datos)
6. [Máquina de Estados](#máquina-de-estados)
7. [Estructura de Carpetas](#estructura-de-carpetas)
8. [Componentes Frontend](#componentes-frontend)
9. [Backend APIs](#backend-apis)
10. [Sincronización en Tiempo Real](#sincronización-en-tiempo-real)
11. [Manejo de Errores](#manejo-de-errores)
12. [Implementación Step-by-Step](#implementación-step-by-step)
13. [Testing & Validación](#testing--validación)

---

## 📌 DESCRIPCIÓN GENERAL DEL PROYECTO

**Nombre Oficial**: Paddy TMS  
**Nombre de Carpeta**: `/paddy-tms/`  
**Acrónimo**: Truck Management System  
**Propósito**: Gestionar el flujo logístico completo de recepción de arroz paddy

### 🎯 VISIÓN GENERAL

El **Paddy TMS** es una PWA moderna que gestiona el flujo logístico completo de recepción de arroz paddy, desde la llegada del camión hasta la generación del ticket final. El sistema está diseñado para operar **en tiempo real** con dos vistas claramente separadas:

- **👨‍💼 Admin Dashboard** (Protegido con Login): Interfaz completa para operadores logísticos (ingreso de datos, control, pesajes)
- **📺 Monitor Display** (Público, Sin Login): Pantalla grande para choferes (llamados, próximos turnos, información clara y visible)

### Key Features
- ✅ Máquina de estados robusto (4 estados: ESPERA → PESANDO_BRUTO → PESANDO_TARA → FINALIZADO)
- ✅ Sincronización en tiempo real (Socket.io + Polling con MySQL)
- ✅ Funcionamiento offline-first (PWA + IndexedDB)
- ✅ Integración con balanzas (RS232/USB)
- ✅ Generación automática de tickets (PDF)
- ✅ Sistema de alertas audibles y visuales
- ✅ Reportes y analytics

---

## 🎯 OBJETIVOS DEL SISTEMA

### Operacionales
1. **Reducir tiempos de espera** de camiones (meta: <20 min por ciclo)
2. **Cero errores en pesaje** mediante validaciones automáticas
3. **Trazabilidad completa** de cada recepción
4. **Visibilidad en tiempo real** para choferes y operadores

### Técnicos
1. **PWA robusta** que funcione sin internet
2. **Sincronización RT** sin conflictos de datos
3. **Escalable** a múltiples balanzas/ubicaciones
4. **Auditable** con logs completos

---

## 🔄 FLUJO DE PROCESOS

### Flujo General del Camión

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUJO DEL CAMIÓN (TMS)                        │
└─────────────────────────────────────────────────────────────────┘

[1. ESPERA]
    ↓
    ├─ Camión llega a la entrada
    ├─ Se registra: Patente, Chofer, Transportista, Guía
    ├─ Se asigna número de turno
    └─ Se muestra en Monitor → "Próximos Turnos"

[2. PESANDO_BRUTO]
    ↓
    ├─ Monitor llama: "XYZ-1234 A BALANZA #1"
    ├─ Chofer se dirige a balanza
    ├─ Se registra peso bruto automático (si hay integración)
    ├─ Operador confirma peso o ingresa manualmente
    └─ Se guarda: fechaHoraPesoBruto, pesoBruto

[3. DESCARGANDO]
    ↓
    ├─ Camión se posiciona en descarga
    ├─ Sistema registra: fechaHoraInicioDescarga
    ├─ Monitor muestra tiempo transcurrido
    └─ Operador indica cuando está listo para pesaje final

[4. PESANDO_TARA]
    ↓
    ├─ Camión vuelve a balanza (sin carga)
    ├─ Se registra peso tara automático
    ├─ Sistema calcula: pesoNeto = pesoBruto - pesoTara
    ├─ Validación: pesoNeto > 0 ✓
    └─ Se guarda: fechaHoraPesoTara, pesoTara

[5. FINALIZADO]
    ↓
    ├─ Se generan métricas: tiempos totales
    ├─ Se genera ticket (PDF)
    ├─ Se libera cupo en Monitor
    ├─ Camión sale del sistema
    └─ Se registran datos para analytics

```

### Interacción Usuario (Operador vs Monitor)

```
ADMIN PANEL                          MONITOR (Pantalla para Choferes)
─────────────────────────────────────────────────────────────────

1. Operador registra              1. Monitor en blanco/lista espera
   nuevo camión

2. Hace clic "Siguiente"          2. ⚠️  ALERTA: "XYZ-1234"
                                     Parpadea verde
                                     
3. Selecciona balanza             3. Muestra GRANDE:
   (ej: Balanza #1)                  "ACCEDER A BALANZA BRUTA #1"
   
4. Ingresa peso bruto             4. (Monitor sin cambios)
   (o lector automático)

5. Registra estado DESCARGANDO    5. Cambio a:
                                     "EN DESCARGA - Tiempo: 5 min"

6. Ingresa peso tara              6. Timer actualizándose

7. Sistema calcula peso neto      7. Final: "✓ FINALIZADO"
   y genera ticket

8. Hace clic "Siguiente"          8. Vuelve a lista de próximos
   (Libera turno actual)
```

---

## 🏗️ ARQUITECTURA TÉCNICA

### Stack Tecnológico (ACTUALIZADO - MySQL Backend)

```
FRONTEND (Next.js 16+)
├── React 19 (UI)
├── TypeScript (type-safe)
├── Tailwind CSS (estilos)
├── Context API + useReducer (estado global)
├── TanStack Query (caching & fetching)
├── Service Workers (offline-first)
├── IndexedDB (persistencia local)
└── Socket.io + Polling (sync RT - MYSQL COMPATIBLE)

BACKEND (NestJS + MySQL)
├── Express (HTTP)
├── MySQL (BD principal - TypeORM)
├── TypeORM (ORM configurado para MySQL)
├── Socket.io (WebSocket para Realtime)
├── Redis (opcional - Pub/Sub para Realtime escalable)
├── NextAuth (Autenticación)
└── Integración Balanzas (RS232/USB)

EXTRAS
├── Playwright (E2E tests)
├── PWA (manifest + service workers)
└── PDF Generation (tickets)
```

### Capas de Arquitectura

```
┌──────────────────────────────────────────────────────────────┐
│                    USER INTERFACE LAYER                       │
│  ┌──────────────────┐  ┌──────────────────┐                  │
│  │ Admin Dashboard  │  │ Monitor Display  │                  │
│  └────────┬─────────┘  └────────┬─────────┘                  │
└────────────┼──────────────────────┼──────────────────────────┘
             │                      │
┌────────────┼──────────────────────┼──────────────────────────┐
│  BUSINESS LOGIC LAYER (Context + Hooks)                       │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ useLogisticsData + useRealtimeSync + useTruckState      │ │
│  │ LogisticsContext (máquina de estados + validaciones)    │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────┬──────────────────────────────────────────────────┘
             │
┌────────────┼──────────────────────────────────────────────────┐
│  DATA ACCESS LAYER (Hooks + Actions)                          │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Server Actions (truck.action.ts)                        │ │
│  │ Services (truckService.ts, realtimeService.ts)          │ │
│  │ TanStack Query hooks                                     │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────┬──────────────────────────────────────────────────┘
             │
┌────────────┼──────────────────────────────────────────────────┐
│  API GATEWAY LAYER                                            │
│  ├─ REST API Calls (Backend NestJS + MySQL)                  │
│  ├─ Socket.io WebSocket (Realtime sync)                      │
│  ├─ Polling fallback (cada 5 segundos)                       │
│  └─ Redis Pub/Sub (opcional - para escalabilidad)            │
└────────────┬──────────────────────────────────────────────────┘
             │
┌────────────┼──────────────────────────────────────────────────┐
│  PERSISTENCE LAYER                                            │
│  ├─ MySQL (backend - TypeORM)                                │
│  ├─ IndexedDB (frontend offline)                              │
│  ├─ Service Workers (cache)                                   │
│  └─ Local Storage (small data)                                │
└──────────────────────────────────────────────────────────────┘
```

---

## 📊 MODELOS DE DATOS

### 1. Modelo Principal: Truck (Camión)

```typescript
// Tipos base
interface Truck {
  // Identificadores
  id: string;                      // UUID
  numero_turno: number;            // Secuencial diario (1, 2, 3...)
  
  // Información del vehículo y transporte
  patente: string;                 // ABC-1234
  transportista: string;           // Nombre empresa
  chofer: string;                  // Nombre del chofer
  rut_chofer?: string;            // RUT
  guia: string;                   // Número de guía/comprobante
  
  // Pesajes
  peso_bruto: number | null;      // Kg (con carga)
  peso_tara: number | null;       // Kg (sin carga)
  peso_neto?: number;             // Calculado: bruto - tara
  
  // Estado del flujo
  estado: TruckState;             // Enum: ESPERA | PESANDO_BRUTO | ...
  
  // Timestamps
  fecha_hora_entrada: Date;       // Cuando llega
  fecha_hora_peso_bruto?: Date;   // Cuando se pesa entrada
  fecha_hora_inicio_descarga?: Date;
  fecha_hora_peso_tara?: Date;    // Cuando se pesa salida
  fecha_hora_finalizacion?: Date;
  
  // Métricas calculadas
  tiempo_espera_minutos?: number;      // Desde entrada a primer pesaje
  tiempo_descarga_minutos?: number;    // Desde pesaje bruto a tara
  tiempo_total_minutos?: number;       // Desde entrada a salida
  
  // Ticket
  ticket_generado: boolean;
  numero_ticket?: string;          // Correlativo
  pdf_url?: string;               // URL del PDF
  
  // Auditoría
  created_at: Date;
  updated_at: Date;
  created_by: string;             // Usuario que registró
  updated_by?: string;
  deleted_at?: Date;              // Soft delete
}

// Enum de estados
enum TruckState {
  ESPERA = 'ESPERA',                    // Esperando ser llamado
  PESANDO_BRUTO = 'PESANDO_BRUTO',      // En balanza (entrada)
  DESCARGANDO = 'DESCARGANDO',          // Descargando arroz
  PESANDO_TARA = 'PESANDO_TARA',        // En balanza (salida)
  FINALIZADO = 'FINALIZADO',            // Proceso completado
}
```

### 2. Estado Global: Queue/Monitor

```typescript
interface LogisticsQueueState {
  // Turno actual
  truck_actual: Truck | null;
  
  // Próximos en cola
  truck_proximos: Truck[];        // Array ordenado (max 5 mostrados)
  
  // En proceso de descarga
  truck_descargando: Truck[];     // Pueden estar multiples descargando
  
  // Finalizados en sesión
  truck_finalizados: Truck[];     // Para reportes
  
  // Métricas sesión
  sesion_fecha: Date;
  sesion_numero_turnos: number;
  sesion_peso_total_kg: number;
  sesion_tiempo_promedio_minutos: number;
}

interface LogisticsContext {
  queue: LogisticsQueueState;
  dispatch: (action: LogisticsAction) => void;
  
  // Acciones
  registrarCamion: (data: TruckInput) => Promise<void>;
  avanzarEstado: (truckId: string, nuevoEstado: TruckState) => Promise<void>;
  registrarPeso: (truckId: string, tipo: 'bruto' | 'tara', peso: number) => Promise<void>;
  liberarCupo: (truckId: string) => Promise<void>;
  
  // Estado UI
  loading: boolean;
  error: string | null;
}
```

### 3. Input/DTO: Registro de Camión

```typescript
interface TruckInput {
  patente: string;                // Validar formato: ABC-1234
  transportista: string;
  chofer: string;
  rut_chofer?: string;
  guia: string;
}

interface PesoInput {
  truck_id: string;
  peso: number;                   // En kg, número positivo
  tipo: 'bruto' | 'tara';
  timestamp?: Date;               // Override si es necesario
}
```

### 4. Response/DTO: Retornos API

```typescript
interface TruckResponse extends Truck {
  // Datos adicionales para UI
  tiempo_espera_actual_minutos?: number;  // Calculado en tiempo real
  proximo?: Truck | null;                 // El siguiente en cola
}

interface LogisticsSessionReport {
  fecha: Date;
  numero_turnos: number;
  peso_total_kg: number;
  tiempo_promedio_minutos: number;
  tiempo_minimo_minutos: number;
  tiempo_maximo_minutos: number;
  camiones: TruckResponse[];
}
```

---

## 🎛️ MÁQUINA DE ESTADOS

### Diagrama de Transiciones (4 Estados)

```
                    ┌─────────────┐
                    │   ESPERA    │
                    │ (Nuevo/Idle)│
                    └──────┬──────┘
                           │
                           │ Operador: "Siguiente"
                           │ (Validar: patente, chofer, guía)
                           ↓
                    ┌─────────────────┐
                    │ PESANDO_BRUTO   │
                    │ (En balanza #1) │
                    └──────┬──────────┘
                           │
                           │ Registrar peso bruto
                           │ (Validar: peso > 0)
                           ↓
                    ┌─────────────────┐
                    │ PESANDO_TARA    │
                    │ (En balanza #1) │
                    └──────┬──────────┘
                           │
                           │ Registrar peso tara
                           │ (Validar: 0 < tara < bruto)
                           ↓
                    ┌─────────────────┐
                    │  FINALIZADO     │
                    │ (Generar ticket)│
                    └─────────────────┘
```

**Nota**: El proceso de DESCARGANDO es completamente independiente y externo al TMS. Se maneja en otro sistema y no forma parte de la máquina de estados del TMS.

### Validaciones por Transición

```typescript
const STATE_GUARDS = {
  // ESPERA -> PESANDO_BRUTO
  PESANDO_BRUTO: (truck: TruckReception) => {
    return (
      truck.patente?.length > 0 &&
      truck.chofer_nombre?.length > 0 &&
      truck.guia?.length > 0
    );
  },
  
  // PESANDO_BRUTO -> PESANDO_TARA (Validar registro previo)
  PESANDO_TARA: (truck: TruckReception) => {
    return (
      truck.peso_bruto !== null &&
      truck.peso_bruto > 0 &&
      truck.fecha_hora_peso_bruto !== null
    );
  },
  
  // PESANDO_TARA -> FINALIZADO
  FINALIZADO: (truck: TruckReception) => {
    const pesoNeto = (truck.peso_bruto ?? 0) - (truck.peso_tara ?? 0);
    return (
      truck.peso_tara !== null &&
      truck.peso_tara > 0 &&
      truck.peso_tara < truck.peso_bruto! &&
      pesoNeto > 0 &&
      truck.fecha_hora_peso_tara !== null
    );
  },
};
```

const VALID_TRANSITIONS: Record<TruckState, TruckState[]> = {
  ESPERA: [PESANDO_BRUTO],
  PESANDO_BRUTO: [DESCARGANDO],
  DESCARGANDO: [PESANDO_TARA],
  PESANDO_TARA: [FINALIZADO],
  FINALIZADO: [], // Terminal
};
```

### Errores por Transición

```typescript
enum TransitionError {
  INVALID_STATE_CHANGE = 'INVALID_STATE_CHANGE',
  GUARD_FAILED = 'GUARD_FAILED',
  WEIGHT_NOT_POSITIVE = 'WEIGHT_NOT_POSITIVE',
  TARA_GREATER_THAN_BRUTO = 'TARA_GREATER_THAN_BRUTO',
  MISSING_REQUIRED_FIELDS = 'MISSING_REQUIRED_FIELDS',
  TRUCK_NOT_FOUND = 'TRUCK_NOT_FOUND',
}
```

---

## 📁 ESTRUCTURA DE CARPETAS Y RUTAS

### 🔐 Rutas del Proyecto

```
PADDY TMS - Rutas
═════════════════════════════════════════════════════════════════

PÚBLICA (SIN LOGIN):
├─ /monitor     ← 📺 Monitor de turnos (Choferes)
│  └─ Pantalla grande, información clara, actualización RT
│
PROTEGIDA (CON LOGIN):
├─ /login            ← 🔐 Única entrada al sistema
│
├─ /weighing    ← ⚖️ Panel de pesaje (Admin)
│  ├─ Registro de camiones
│  ├─ Control de pesajes (bruto/tara)
│  └─ Generación de tickets
│
└─ /weighing             ← 📊 Dashboard principal
   ├─ Estadísticas
   ├─ Histórico
   └─ Reportes

AUTENTICACIÓN:
├─ NextAuth.js (JWT + Session)
├─ Rol: LOGISTICS_OPERATOR
└─ Permiso: ver/crear/editar recepciones
```

### 📂 Estructura de Carpetas (Frontend)

```
frontend/
├── src/
│   ├── app/
│   │   └── paddy/
│   │       ├── auth/
│   │       │   ├── login/
│   │       │   │   └── page.tsx              ← 🔐 Login (PÚBLICA)
│   │       │   └── layout.tsx
│   │       │
│   │       ├── logistics/                    ← SECCIÓN PRINCIPAL
│   │       │   ├── monitor/
│   │       │   │   ├── page.tsx             ← 📺 Monitor (PÚBLICA - sin auth)
│   │       │   │   └── layout.tsx
│   │       │   │
│   │       │   ├── weighing/
│   │       │   │   ├── page.tsx             ← ⚖️ Panel pesaje (PROTEGIDA)
│   │       │   │   ├── [id]/
│   │       │   │   │   └── page.tsx
│   │       │   │   └── layout.tsx
│   │       │   │
│   │       │   └── layout.tsx               ← Layout general TMS
│   │       │
│   │       ├── dashboard/
│   │       │   ├── page.tsx                 ← 📊 Dashboard (PROTEGIDA)
│   │       │   └── layout.tsx
│   │       │
│   │       └── layout.tsx                   ← Layout raíz /paddy
│   │
│   ├── features/
│   │   └── logistics/                        ← FEATURE LOGISTICS
│   │       ├── context/
│   │       │   ├── LogisticsContext.tsx     ← Context global
│   │       │   ├── index.ts
│   │       │   └── actions.ts               ← Acciones reducer
│   │       │
│   │       ├── hooks/
│   │       │   ├── useLogisticsData.ts      ← Fetch & cache
│   │       │   ├── useRealtimeSync.ts       ← Socket.io sync
│   │       │   ├── useTruckState.ts         ← State machine
│   │       │   ├── useLogisticsQueue.ts     ← Cola de camiones
│   │       │   ├── useAuth.ts               ← Auth check
│   │       │   └── index.ts
│   │       │
│   │       ├── services/
│   │       │   ├── truckService.ts          ← API calls
│   │       │   ├── realtimeService.ts       ← Socket.io setup
│   │       │   ├── weighingService.ts       ← Balanza
│   │       │   ├── authService.ts           ← Auth validation
│   │       │   └── index.ts
│   │       │
│   │       ├── components/
│   │       │   ├── MonitorDisplay.tsx       ← 📺 Monitor (público)
│   │       │   ├── AdminDashboard.tsx       ← ⚖️ Admin panel
│   │       │   ├── WeighingForm.tsx         ← Formulario pesaje
│   │       │   ├── QueueList.tsx            ← Próximos camiones
│   │       │   ├── CurrentTruckDisplay.tsx  ← Turno actual
│   │       │   ├── TruckCard.tsx            ← Tarjeta camión
│   │       │   ├── StateIndicator.tsx       ← Estado visual
│   │       │   ├── TimerDisplay.tsx         ← Timer
│   │       │   ├── TruckInputForm.tsx       ← Nuevo camión
│   │       │   ├── LoginForm.tsx            ← Formulario login
│   │       │   └── index.ts
│   │       │
│   │       ├── types/
│   │       │   ├── logistics.types.ts
│   │       │   ├── state.types.ts
│   │       │   ├── auth.types.ts
│   │       │   └── index.ts
│   │       │
│   │       ├── actions/
│   │       │   ├── truck.action.ts
│   │       │   ├── weighing.action.ts
│   │       │   ├── auth.action.ts
│   │       │   └── index.ts
│   │       │
│   │       ├── utils/
│   │       │   ├── validation.ts
│   │       │   ├── formatters.ts
│   │       │   ├── calculations.ts
│   │       │   ├── auth.ts
│   │       │   └── index.ts
│   │       │
│   │       └── index.ts
│   │
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── nextauth.ts                  ← NextAuth config
│   │   │   └── permissions.ts               ← RBAC
│   │   ├── localStorage/
│   │   │   └── truckStore.ts
│   │   └── serviceWorker/
│   │       └── logistics-sw.ts
│   │
│   └── middleware.ts                        ← Proteger rutas
│
├── public/
│   └── logistics-sw.js                      ← Service Worker
│
└── next.config.js

---

## 🎨 COMPONENTES FRONTEND

### 1. MonitorDisplay.tsx

```typescript
/**
 * Pantalla para choferes
 * - Alta visibilidad (fuentes grandes)
 * - Sin distracciones
 * - Actualización RT automática
 */

interface MonitorDisplayProps {
  queue: LogisticsQueueState;
  isOnline: boolean;
  theme?: 'light' | 'dark' | 'high-contrast';
}

export const MonitorDisplay: React.FC<MonitorDisplayProps> = ({
  queue,
  isOnline,
  theme = 'dark',
}) => {
  return (
    <div className="grid grid-cols-2 h-screen gap-4 p-8 bg-black">
      {/* Lado izquierdo: LLAMADO ACTUAL */}
      <div className="flex flex-col justify-center items-center bg-green-900 rounded-lg animate-pulse">
        <h1 className="text-6xl font-bold text-white mb-4">
          🟢 LLAMADO A BALANZA
        </h1>
        
        {queue.truck_actual ? (
          <>
            <div className="text-8xl font-black text-yellow-300 mb-8">
              {queue.truck_actual.patente}
            </div>
            <div className="text-4xl text-white mb-2">
              {queue.truck_actual.chofer}
            </div>
            <div className="text-3xl text-green-300">
              ⚠️ ACCEDER A BALANZA BRUTA #1
            </div>
          </>
        ) : (
          <div className="text-4xl text-white opacity-50">
            Esperando próximo camión...
          </div>
        )}
      </div>

      {/* Lado derecho: PRÓXIMOS TURNOS */}
      <div className="flex flex-col bg-gray-900 rounded-lg p-6">
        <h2 className="text-5xl font-bold text-white mb-4">
          📋 PRÓXIMOS TURNOS
        </h2>
        
        <div className="flex-1 space-y-3">
          {queue.truck_proximos.slice(0, 5).map((truck, idx) => (
            <div
              key={truck.id}
              className="bg-gray-800 p-4 rounded text-2xl text-white"
            >
              <div className="font-bold">
                {idx + 1}. {truck.patente}
              </div>
              <div className="text-gray-400">
                {truck.chofer}
              </div>
            </div>
          ))}
        </div>

        {/* Status indicator */}
        <div className="mt-auto text-lg">
          {isOnline ? (
            <span className="text-green-400">🟢 En línea</span>
          ) : (
            <span className="text-red-400">🔴 Sin conexión</span>
          )}
        </div>
      </div>
    </div>
  );
};
```

### 2. AdminDashboard.tsx

```typescript
/**
 * Panel de administración para operadores
 * - Control completo del flujo
 * - Ingreso de datos
 * - Validaciones en tiempo real
 */

interface AdminDashboardProps {
  queue: LogisticsQueueState;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ queue }) => {
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [showRegistroForm, setShowRegistroForm] = useState(false);

  return (
    <div className="grid grid-cols-12 gap-6 h-screen p-6">
      {/* Columna izquierda: Registro nuevo camión */}
      <div className="col-span-3 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Registrar Camión</h2>
        <TruckInputForm onSubmit={() => setShowRegistroForm(false)} />
      </div>

      {/* Columna central: Turno actual + acciones */}
      <div className="col-span-6 space-y-6">
        {/* Turno actual */}
        <div className="bg-gradient-to-r from-green-100 to-green-50 rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-bold mb-4">Turno Actual</h3>
          {queue.truck_actual ? (
            <>
              <TruckCard truck={queue.truck_actual} isActive />
              <WeighingForm truck={queue.truck_actual} />
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <button className="bg-blue-500 text-white py-2 rounded">
                  Registrar Peso Bruto
                </button>
                <button className="bg-yellow-500 text-white py-2 rounded">
                  → Descargando
                </button>
              </div>
            </>
          ) : (
            <div className="text-gray-500 text-center py-8">
              No hay camión en proceso
            </div>
          )}
        </div>

        {/* En descarga */}
        <div className="bg-blue-50 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">
            En Descarga ({queue.truck_descargando.length})
          </h3>
          <div className="space-y-2">
            {queue.truck_descargando.map((truck) => (
              <TruckCard key={truck.id} truck={truck} isDescargando />
            ))}
          </div>
        </div>
      </div>

      {/* Columna derecha: Próximos + Finalizados */}
      <div className="col-span-3 space-y-6">
        {/* Próximos */}
        <div className="bg-gray-50 rounded-lg shadow-lg p-6 max-h-80 overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">Próximos ({queue.truck_proximos.length})</h3>
          <QueueList trucks={queue.truck_proximos} />
        </div>

        {/* Finalizados */}
        <div className="bg-green-50 rounded-lg shadow-lg p-6 max-h-80 overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">
            Finalizados ({queue.truck_finalizados.length})
          </h3>
          <div className="space-y-2">
            {queue.truck_finalizados.slice(0, 10).map((truck) => (
              <div key={truck.id} className="text-sm text-gray-600">
                <span className="font-bold">{truck.patente}</span>
                {truck.numero_ticket && (
                  <span className="text-green-600 ml-2">#{truck.numero_ticket}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
```

### 3. WeighingForm.tsx

```typescript
/**
 * Formulario para ingreso de pesos
 * - Integración con balanza (si existe)
 * - Validación en tiempo real
 * - Guardado automático
 */

interface WeighingFormProps {
  truck: Truck;
  onSuccess?: () => void;
}

export const WeighingForm: React.FC<WeighingFormProps> = ({ truck, onSuccess }) => {
  const [peso, setPeso] = useState<number | null>(null);
  const [tipo, setTipo] = useState<'bruto' | 'tara'>('bruto');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegistrarPeso = async () => {
    // Validaciones
    if (!peso || peso <= 0) {
      setError('El peso debe ser mayor a 0');
      return;
    }

    if (
      tipo === 'tara' &&
      truck.peso_bruto &&
      peso >= truck.peso_bruto
    ) {
      setError('El peso tara no puede ser >= al peso bruto');
      return;
    }

    setLoading(true);
    try {
      await registrarPeso({
        truck_id: truck.id,
        peso,
        tipo,
      });
      setPeso(null);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error registrando peso');
    } finally {
      setLoading(false);
    }
  };

  const isBrutoState = truck.estado === 'PESANDO_BRUTO';
  const isTaraState = truck.estado === 'PESANDO_TARA';

  if (!isBrutoState && !isTaraState) {
    return null;
  }

  return (
    <div className="space-y-4 border-t pt-4">
      <div className="bg-blue-100 p-4 rounded">
        <p className="text-sm font-bold mb-2">
          {isBrutoState ? 'Pesaje de Entrada (Bruto)' : 'Pesaje de Salida (Tara)'}
        </p>

        <div className="flex gap-4">
          <input
            type="number"
            value={peso ?? ''}
            onChange={(e) => {
              setPeso(e.target.value ? parseFloat(e.target.value) : null);
              setError(null);
            }}
            placeholder="Ej: 2500.5"
            className="flex-1 border rounded px-3 py-2"
            disabled={loading}
            autoFocus
          />
          <span className="flex items-center text-lg font-bold">kg</span>
          <button
            onClick={handleRegistrarPeso}
            disabled={loading || !peso || peso <= 0}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded font-bold"
          >
            {loading ? 'Guardando...' : 'Registrar'}
          </button>
        </div>

        {error && (
          <p className="text-red-600 text-sm mt-2">⚠️ {error}</p>
        )}

        {/* Mostrar pesos registrados */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Peso Bruto:</span>
            <p className="font-bold text-lg">
              {truck.peso_bruto ? `${truck.peso_bruto.toFixed(1)} kg` : '-'}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Peso Tara:</span>
            <p className="font-bold text-lg">
              {truck.peso_tara ? `${truck.peso_tara.toFixed(1)} kg` : '-'}
            </p>
          </div>
        </div>

        {/* Mostrar peso neto calculado */}
        {truck.peso_bruto && truck.peso_tara && (
          <div className="mt-3 p-2 bg-green-200 rounded">
            <span className="text-gray-700">Peso Neto:</span>
            <p className="font-bold text-xl text-green-800">
              {((truck.peso_bruto - truck.peso_tara)).toFixed(1)} kg
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
```

---

## 🔌 BACKEND APIs

### Endpoints Principales

```
POST   /api/v1/logistics/trucks
├─ Input:  { patente, chofer, transportista, guia }
├─ Output: Truck (con ID y estado ESPERA)
└─ Auth: ✅ JWT required

PUT    /api/v1/logistics/trucks/{id}/state
├─ Input:  { nuevoEstado: TruckState }
├─ Output: Truck (con nuevo estado)
├─ Validación: State machine validations
└─ Auth: ✅ JWT required

POST   /api/v1/logistics/trucks/{id}/weighing
├─ Input:  { tipo: 'bruto'|'tara', peso: number }
├─ Output: Truck (con peso registrado)
├─ Validación: peso > 0, tara < bruto
└─ Auth: ✅ JWT required

GET    /api/v1/logistics/queue
├─ Output: LogisticsQueueState
├─ Realtime: WebSocket update
└─ Auth: ✅ JWT required

GET    /api/v1/logistics/trucks/{id}
├─ Output: Truck (completo con metrics)
└─ Auth: ✅ JWT required

POST   /api/v1/logistics/trucks/{id}/ticket
├─ Output: { pdfUrl: string, numeroTicket: string }
├─ Side-effect: Genera PDF, email
└─ Auth: ✅ JWT required

DELETE /api/v1/logistics/trucks/{id}
├─ Soft delete
├─ Audit log
└─ Auth: ✅ JWT required
```

### Controller Base (NestJS)

```typescript
@Controller('logistics')
@UseGuards(JwtAuthGuard)
export class LogisticsController {
  constructor(private service: LogisticsService) {}

  @Post('trucks')
  async createTruck(@Body() input: CreateTruckDto) {
    return this.service.createTruck(input);
  }

  @Put('trucks/:id/state')
  async updateState(
    @Param('id') id: string,
    @Body() { nuevoEstado }: UpdateStateDto,
  ) {
    return this.service.updateState(id, nuevoEstado);
  }

  @Post('trucks/:id/weighing')
  async registerWeighing(
    @Param('id') id: string,
    @Body() input: WeighingDto,
  ) {
    return this.service.registerWeighing(id, input);
  }

  @Get('queue')
  async getQueue() {
    return this.service.getQueueState();
  }

  @Post('trucks/:id/ticket')
  async generateTicket(@Param('id') id: string) {
    return this.service.generateTicket(id);
  }
}
```

---

## 🔄 SINCRONIZACIÓN EN TIEMPO REAL

### Estrategia: Socket.io + Polling (MySQL Compatible)

```typescript
// 1. ESCUCHAR cambios via Socket.io
const useRealtimeSync = (queueState: LogisticsQueueState) => {
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL, {
      transports: ['websocket', 'polling'],
    });

    // Escuchar cambios en truck_receptions
    socket.on('truck_reception:updated', (payload) => {
      dispatch({
        type: 'TRUCK_UPDATED',
        payload: payload,
      });
    });

    socket.on('truck_reception:state_changed', (payload) => {
      dispatch({
        type: 'TRUCK_STATE_UPDATED',
        payload: payload,
      });
    });

    return () => socket.disconnect();
  }, []);

  // Polling fallback cada 5 segundos
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const result = await fetchTruckReceptions();
        if (result.success) {
          dispatch({
            type: 'QUEUE_REFRESHED',
            payload: result.data,
          });
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 5000);

    return () => clearInterval(pollInterval);
  }, []);
};

// 2. EMITIR cambios cuando se registra peso
const registerWeighing = async (
  truck_id: string,
  peso: number,
  tipo: 'bruto' | 'tara',
) => {
  // Call Server Action
  const result = await registerWeighingAction(truck_id, peso, tipo);

  // Emitir cambio a través de Socket.io
  if (result.success) {
    socket.emit('truck_reception:weight_registered', {
      truck_id,
      peso,
      tipo,
      timestamp: new Date(),
    });
  }

  return result;
};

// 3. SINCRONIZACIÓN OFFLINE
// Si no hay conexión, guardar en IndexedDB
const offlineStore = {
  pendingWeighings: [],
};

const savePendingWeighing = async (data: WeighingData) => {
  const db = await openDB('logistics-db', 1);
  await db.add('pending-weighings', {
    ...data,
    synced: false,
    createdAt: Date.now(),
  });
};

// Sincronizar cuando vuelve conexión
useEffect(() => {
  const handleOnline = async () => {
    const db = await openDB('logistics-db', 1);
    const pending = await db.getAll('pending-weighings');

    for (const item of pending) {
      try {
        await registerWeighingAction(item.truck_id, item.peso, item.tipo);
        await db.delete('pending-weighings', item.id);
      } catch (err) {
        console.error('Error syncing:', err);
      }
    }
  };

  window.addEventListener('online', handleOnline);
  return () => window.removeEventListener('online', handleOnline);
}, []);
```

### Backend: Socket.io Gateway (NestJS)

```typescript
// logistics.gateway.ts
import { WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'logistics',
  cors: {
    origin: process.env.FRONTEND_URL,
  },
})
export class LogisticsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('truck_reception:weight_registered')
  handleWeightRegistered(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    // Broadcast a todos los clientes conectados
    this.server.emit('truck_reception:updated', data);
    return { success: true };
  }

  broadcastTruckStateChange(truckReception: TruckReception) {
    this.server.emit('truck_reception:state_changed', truckReception);
  }

  broadcastQueueUpdate(queue: LogisticsQueueState) {
    this.server.emit('queue:refreshed', queue);
  }
}
```

---

## ⚠️ MANEJO DE ERRORES

### Matriz de Errores

| Error | Causa | Solución |
|-------|-------|----------|
| `INVALID_STATE_CHANGE` | Transición no permitida | Mostrar alerta, permitir retroceder |
| `WEIGHT_NOT_POSITIVE` | Peso <= 0 | Validar input, rechazar silenciosamente |
| `TARA_GREATER_THAN_BRUTO` | Peso tara >= bruto | Sugerir corrección |
| `TRUCK_NOT_FOUND` | ID inexistente | Mostrar 404, recargar lista |
| `OFFLINE` | Sin conexión | Guardar localmente, sync al volver |
| `DB_TIMEOUT` | Operación lenta | Retry automático + mensaje usuario |
| `BALANCE_ERROR` | Problema con balanza | Permitir entrada manual |

### Estrategia Global

```typescript
const handleError = (error: AppError) => {
  // 1. Log en consola + backend
  logger.error(error);

  // 2. Categorizar
  if (error.type === 'OFFLINE') {
    showNotification('Modo offline - los datos se sincronizarán automáticamente', 'info');
  } else if (error.type === 'VALIDATION') {
    showNotification(`Error: ${error.message}`, 'error');
  } else if (error.type === 'CRITICAL') {
    showNotification('Error crítico - contacta soporte', 'error');
    alertAdmin(error);
  }

  // 3. Retry si es necesario
  if (error.retryable) {
    scheduleRetry(error.originalAction, exponentialBackoff);
  }
};
```

---

## 🛠️ IMPLEMENTACIÓN STEP-BY-STEP

### FASE 1: Setup Inicial (Semana 1)

#### Paso 1.1: Crear estructura de carpetas
```bash
# Frontend
mkdir -p frontend/src/app/paddy/logistics/{dispatch,weighing}
mkdir -p frontend/src/features/logistics/{context,hooks,services,components,types,actions,utils}

# Backend
mkdir -p backend/src/modules/logistics/{presentation,application,domain,infrastructure,dtos}
```

#### Paso 1.2: Crear tipos base
- [ ] `frontend/src/features/logistics/types/logistics.types.ts`
- [ ] `frontend/src/features/logistics/types/state.types.ts`
- [ ] `backend/src/modules/logistics/dtos/truck.dto.ts`

#### Paso 1.3: Crear Context + Reducer
- [ ] `frontend/src/features/logistics/context/LogisticsContext.tsx`
- [ ] `frontend/src/features/logistics/context/actions.ts`

**Deliverable**: Tipos y contexto compilando sin errores

---

### FASE 2: Backend APIs (Semana 1-2)

#### Paso 2.1: Crear entity + DTOs
- [ ] `backend/src/modules/logistics/domain/logistics.entity.ts`
- [ ] `backend/src/modules/logistics/dtos/truck.dto.ts`

#### Paso 2.2: Crear service
- [ ] `backend/src/modules/logistics/application/logistics.service.ts`
  - Métodos: createTruck, updateState, registerWeighing, getQueue, generateTicket

#### Paso 2.3: Crear controller
- [ ] `backend/src/modules/logistics/presentation/logistics.controller.ts`

#### Paso 2.4: Tests E2E backend
- [ ] Tests para cada transición de estado
- [ ] Tests para validaciones de peso

**Deliverable**: APIs respondiendo correctamente en Postman

---

### FASE 3: Frontend Hooks + Services (Semana 2)

#### Paso 3.1: Crear services
- [ ] `frontend/src/features/logistics/services/truckService.ts`
- [ ] `frontend/src/features/logistics/services/realtimeService.ts`

#### Paso 3.2: Crear hooks
- [ ] `frontend/src/features/logistics/hooks/useLogisticsData.ts`
- [ ] `frontend/src/features/logistics/hooks/useRealtimeSync.ts`
- [ ] `frontend/src/features/logistics/hooks/useTruckState.ts`

#### Paso 3.3: Crear Server Actions
- [ ] `frontend/src/features/logistics/actions/truck.action.ts`
- [ ] `frontend/src/features/logistics/actions/weighing.action.ts`

**Deliverable**: Datos fluyendo desde backend a contexto

---

### FASE 4: Componentes Básicos (Semana 3)

#### Paso 4.1: Componentes unitarios
- [ ] `TruckCard.tsx`
- [ ] `StateIndicator.tsx`
- [ ] `TimerDisplay.tsx`
- [ ] `QueueList.tsx`

#### Paso 4.2: Componentes compuestos
- [ ] `TruckInputForm.tsx`
- [ ] `WeighingForm.tsx`
- [ ] `CurrentTruckDisplay.tsx`

#### Paso 4.3: Vistas principales
- [ ] `AdminDashboard.tsx`
- [ ] `MonitorDisplay.tsx`

#### Paso 4.4: Pages
- [ ] `frontend/src/app/weighing/page.tsx`
- [ ] `frontend/src/app/paddy/logistics/dispatch/page.tsx`

**Deliverable**: Dashboard visible en navegador con datos mockeados

---

### FASE 5: Sincronización RT (Semana 3-4)

#### Paso 5.1: Configurar Socket.io + MySQL
- [ ] Instalar `socket.io` en backend y frontend
- [ ] Crear LogisticsGateway (NestJS WebSocket)
- [ ] Configurar CORS para Socket.io

#### Paso 5.2: Implementar sync con Socket.io
- [ ] Listeners en frontend (truck_reception:updated)
- [ ] Emitir eventos desde backend
- [ ] Polling fallback cada 5 segundos
- [ ] Optimistic updates en UI

#### Paso 5.3: Offline-first
- [ ] Service Worker setup
- [ ] IndexedDB schema
- [ ] Sync al volver online

**Deliverable**: Dos clientes sincronizados en tiempo real (Socket.io)

---

### FASE 6: Testing + Pulido (Semana 4)

#### Paso 6.1: Tests E2E (Playwright)
- [ ] Test flujo completo: registro → pesaje bruto → descarga → pesaje tara → finalizado
- [ ] Tests de validación (pesos negativos, tara > bruto)
- [ ] Tests offline

#### Paso 6.2: Tests unitarios
- [ ] State machine validations
- [ ] Calculations (time, weights)

#### Paso 6.3: Ajustes UI/UX
- [ ] Responsividad
- [ ] Accesibilidad
- [ ] Performance

**Deliverable**: Sistema completamente funcional y testeado

---

## 🧪 TESTING & VALIDACIÓN

### Escenarios de Test E2E

```gherkin
Feature: Truck Management Workflow
  
  Scenario: Flujo completo de un camión
    Given Un camión llega con patente ABC-1234
    When Se registra en el sistema
    Then Estado = ESPERA
    
    When Operador hace clic "Siguiente"
    Then Estado = PESANDO_BRUTO
    And Monitor muestra "ABC-1234 A BALANZA"
    
    When Se registra peso bruto 2500 kg
    Then Estado = DESCARGANDO
    And Se calcula tiempo_espera
    
    When Se registra peso tara 400 kg
    Then Estado = PESANDO_TARA
    
    When Se confirma
    Then Estado = FINALIZADO
    And Se genera ticket
    And Se calcula metricas
    And Camión desaparece de monitor
```

### Criterios de Validación

- [ ] **Máquina de estados**: 100% transiciones válidas
- [ ] **Pesos**: Siempre positivos, tara < bruto
- [ ] **Tiempos**: Precisión ±1 segundo
- [ ] **Sincronización**: <1seg de latencia
- [ ] **Offline**: Todos los datos se sincronizan al volver online
- [ ] **Monitor**: Actualización <500ms
- [ ] **Performance**: <3seg de carga inicial

---

## 📋 CHECKLIST DE DESARROLLO

### FASE 1: Setup
- [ ] Estructura de carpetas creada
- [ ] Tipos definidos
- [ ] Context implementado
- [ ] Compilación sin errores

### FASE 2: Backend
- [ ] Entity + DTOs
- [ ] Service implementado
- [ ] Controller con todos endpoints
- [ ] Tests E2E pasando

### FASE 3: Frontend
- [ ] Services funcionando
- [ ] Hooks sincronizados
- [ ] Server Actions testeadas
- [ ] Datos fluyendo

### FASE 4: UI
- [ ] Componentes unitarios
- [ ] Dashboard admin visible
- [ ] Monitor display visible
- [ ] Estilos responsivos

### FASE 5: Realtime
- [ ] Supabase configurado
- [ ] WebSocket listeners activos
- [ ] Offline-first funcionando
- [ ] Sincronización sin conflictos

### FASE 6: Testing
- [ ] Tests E2E fljo completo
- [ ] Tests validaciones
- [ ] Tests offline
- [ ] Performance OK

### FASE 7: Producción
- [ ] Documentación actualizada
- [ ] Deployment checklist
- [ ] Logs + monitoring
- [ ] Feedback con usuarios

---

## 📚 REFERENCIAS Y DOCUMENTOS RELACIONADOS

### Documentos existentes en el proyecto:
- `IMPLEMENTATION_E2E_COMPLETE.md` - Tests Playwright
- `backend/src/modules/operations/` - Patrón de módulos (referencia)
- `frontend/src/features/receptions/` - Contexto similar (referencia)

### Links útiles:
- [Next.js App Router](https://nextjs.org/docs/app)
- [NestJS Documentation](https://docs.nestjs.com)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Playwright Testing](https://playwright.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

## ❓ PREGUNTAS ABIERTAS

### Clarificaciones técnicas
1. **¿Ya tienes integración con balanza?** ¿Protocolo? ¿API?
2. **¿Multi-sitio?** ¿Múltiples balanzas en diferentes ubicaciones?
3. **¿Almacenamiento de PDFs?** ¿S3, CloudStorage, o local?
4. **¿Supabase está configurado en backend?** ¿Base de datos actual?
5. **¿Alertas audibles?** ¿Sonar en monitor cuando se llama un camión?

### Configuración
1. **¿Credenciales Supabase?** ¿Quién proporciona?
2. **¿Hostname balanzas?** ¿Cómo se conectan?
3. **¿URL PDF storage?** ¿Dónde guardar tickets?

---

## 🎯 PRÓXIMOS PASOS

1. **Revisar y validar** este documento con el equipo
2. **Aclarar preguntas abiertas**
3. **Comenzar FASE 1: Setup inicial**
4. **Crear PR con estructura de carpetas**
5. **Iniciar desarrollo iterativo**

---

**Documento creado por**: AI Assistant  
**Última modificación**: 2026-04-21  
**Estado**: 📋 Listo para implementación
