# 🎯 PADDY TMS - RESUMEN EJECUTIVO
## Visión Rápida del Proyecto

---

## 📌 INFORMACIÓN DEL PROYECTO

| Aspecto | Detalle |
|--------|---------|
| **Nombre Oficial** | Paddy TMS (Truck Management System) |
| **Carpeta** | `/paddy-tms/` |
| **Propósito** | Gestionar flujo logístico de recepción de arroz paddy |
| **Tipo** | PWA (Progressive Web App) con Next.js |
| **Stack Backend** | NestJS + MySQL + Socket.io |
| **Stack Frontend** | Next.js 16+ + React 19 + Tailwind CSS |
| **Base de Datos** | MySQL (TypeORM) |
| **Sincronización RT** | Socket.io + Polling |
| **Autenticación** | NextAuth.js (JWT) |

---

## 🎨 ESTRUCTURA DE RUTAS

### 📺 PANTALLA PÚBLICA (Sin Login)

```
/paddy/logistics/monitor
│
├─ Acceso: 100% LIBRE (sin autenticación)
├─ Audiencia: Choferes
├─ Función: Monitor de turnos
│
└─ Características:
   ✅ Pantalla grande, clara, sin distracciones
   ✅ Muestra turno actual (patente, chofer)
   ✅ Muestra próximos 5 turnos en cola
   ✅ Actualización en tiempo real (Socket.io)
   ✅ Alertas visuales cuando es su turno
   ✅ Alto contraste (optimizado para visibilidad exterior)
```

### 🔐 PUNTO DE ACCESO (Login)

```
/paddy/auth/login
│
├─ Acceso: PÚBLICO (sin sesión previa)
├─ Audiencia: Operadores logísticos
├─ Función: Autenticación
│
└─ Flujo:
   1. Usuario ingresa email + password
   2. Backend valida contra DB
   3. Se genera JWT
   4. Se crea sesión NextAuth.js
   5. Se redirige a /paddy/dashboard
```

### 📊 PANEL PROTEGIDO (Dashboard)

```
/paddy/dashboard
│
├─ Acceso: ✅ REQUIERE LOGIN
├─ Rol: LOGISTICS_OPERATOR
├─ Función: Panel de control principal
│
└─ Contiene:
   ✅ Estadísticas del día
   ✅ Histórico de recepciones
   ✅ Enlaces a otros módulos
```

### ⚖️ PANEL DE PESAJE (Main)

```
/paddy/logistics/weighing
│
├─ Acceso: ✅ REQUIERE LOGIN
├─ Rol: LOGISTICS_OPERATOR
├─ Función: Control de pesajes y registro de camiones
│
├─ Sub-rutas:
│  ├─ /paddy/logistics/weighing (listado + entrada)
│  └─ /paddy/logistics/weighing/[id] (detalles del camión)
│
└─ Funcionalidades:
   ✅ Registrar nuevo camión
   ✅ Registrar peso bruto
   ✅ Registrar peso tara
   ✅ Generar ticket PDF
   ✅ Control de estado en tiempo real
```

---

## 🔄 MÁQUINA DE ESTADOS (4 Estados)

```
┌─────────────┐
│   ESPERA    │  ← Camión recién registrado
│ (Nuevo)     │
└──────┬──────┘
       │ Operador: "Siguiente"
       ↓
┌────────────────────────┐
│ PESANDO_BRUTO          │  ← En balanza (pesaje de entrada)
│ (Primer pesaje)        │
└──────┬─────────────────┘
       │ Operador: Registra peso bruto
       │ (Camión se lleva a descargar - proceso externo)
       ↓
┌────────────────────────┐
│ PESANDO_TARA           │  ← En balanza (pesaje de salida)
│ (Segundo pesaje)       │
└──────┬─────────────────┘
       │ Operador: Registra peso tara
       │ Sistema: Calcula neto = bruto - tara
       ↓
┌────────────────────────┐
│ FINALIZADO             │  ← Proceso terminado
│ (Ticket generado)      │
└────────────────────────┘
   ✅ PDF listo
   ✅ Registro en histórico
```

**Nota**: El proceso de DESCARGANDO es completamente independiente y externo al TMS. No forma parte de esta máquina de estados.

---

## 👥 ROLES Y PERMISOS

### LOGISTICS_OPERATOR

```
Permisos:
✅ Ver dashboard
✅ Ver estadísticas
✅ Ver histórico de recepciones
✅ Crear camión (registro)
✅ Registrar peso bruto
✅ Registrar peso tara
✅ Generar tickets
✅ Descargar PDF
✅ Crear productores
✅ Ver productores
❌ Editar pesos registrados (inmutable)
❌ Eliminar camiones (solo soft delete)
❌ Editar productores (solo admin)
```

---

## 🔐 AUTENTICACIÓN Y PROTECCIÓN

### NextAuth.js Configuration

```
Provider: Credentials (email + password)
Estrategia: JWT
Duración sesión: 24 horas
Almacenamiento: JWT token en sesión

Flujo:
1. Usuario accede /paddy/auth/login
2. Ingresa credenciales
3. Backend (NestJS) valida en DB
4. Retorna usuario + JWT
5. NextAuth crea sesión
6. Frontend almacena token
7. Todas las requests incluyen token

Middleware:
- Valida token en rutas protegidas
- Redirige a /paddy/auth/login si no hay sesión
- Valida rol LOGISTICS_OPERATOR
```

---

## 🚀 FLUJO DE USUARIO

### Escenario 1: Chofer (Pantalla Pública)

```
1. Chofer llega a la planta
   └─ Accede a /paddy/logistics/monitor (SIN login)

2. Ve la pantalla
   └─ Turno actual: "ABC-1234"
   └─ Próximos: DEF-5678, GHI-9012, ...

3. Sistema muestra en tiempo real
   └─ Su patente brilla 🟢
   └─ "¡ACCEDER A BALANZA!"
   └─ Timer con tiempo transcurrido

4. Se retira
   └─ Pantalla se actualiza automáticamente
   └─ Próximo turno ahora es el actual
```

### Escenario 2: Operador (Panel Protegido)

```
1. Operador accede a /paddy/auth/login
   └─ Ingresa email + password
   └─ Se redirige a /paddy/dashboard

2. Ve panel de control
   └─ Estadísticas del día
   └─ Cola de camiones

3. Registra nuevo camión
   └─ Click en "Registrar Camión"
   └─ Ingresa: patente, chofer, guía, productor
   └─ Camión → estado ESPERA

4. Siguiente turno
   └─ Click en "Siguiente"
   └─ Sistema → PESANDO_BRUTO
   └─ Monitor 📺 avisa al chofer

5. Registra peso bruto
   └─ Ingresa peso (manual o automático desde balanza)
   └─ Camión → preparado para descarga

6. Registra peso tara
   └─ Ingresa peso (salida)
   └─ Sistema calcula peso neto automáticamente
   └─ Camión → FINALIZADO

7. Ticket generado
   └─ PDF listo para imprimir
   └─ Datos guardados en histórico
```

---

## 📊 DATOS CLAVE

### Entidad: TruckReception

```typescript
interface TruckReception {
  id: string;                    // UUID
  numero_turno: number;          // Correlativo diario
  producer_id: string;           // FK a productor
  
  // Datos del camión
  patente: string;               // ABC-1234
  guia: string;                  // Guía de transporte
  chofer_nombre: string;
  rut_chofer?: string;
  
  // Pesajes
  peso_bruto: number | null;     // Kg entrada
  peso_tara: number | null;      // Kg salida
  peso_neto?: number;            // Calculado: bruto - tara
  
  // Estados
  estado: 'ESPERA' | 'PESANDO_BRUTO' | 'PESANDO_TARA' | 'FINALIZADO';
  
  // Timestamps
  fecha_hora_entrada: Date;
  fecha_hora_peso_bruto?: Date;
  fecha_hora_peso_tara?: Date;
  fecha_hora_finalizacion?: Date;
  
  // Ticket
  numero_ticket?: string;
  pdf_url?: string;
  
  // Auditoría
  created_at: Date;
  updated_at: Date;
  created_by: string;
  deleted_at?: Date;
}
```

---

## 🌐 COMUNICACIÓN EN TIEMPO REAL

### Socket.io + Polling

```
FRONTEND
├─ Escucha eventos Socket.io
│  ├─ truck_reception:updated
│  ├─ truck_reception:state_changed
│  └─ queue:refreshed
│
├─ Polling fallback (cada 5 segundos)
│  └─ Si Socket.io no conecta
│
└─ Actualización visual instantánea

BACKEND (NestJS)
├─ LogisticsGateway (Socket.io)
│  ├─ Broadcast de cambios a todos los clientes
│  ├─ Sincroniza estado en tiempo real
│  └─ Maneja reconexiones
│
├─ Redis Pub/Sub (opcional - escalabilidad)
│  └─ Para múltiples instancias backend
│
└─ Base de datos (MySQL)
   └─ Fuente de verdad
```

---

## 📁 ESTRUCTURA DE CARPETAS PRINCIPALES

```
paddy-tms/
│
├── frontend/
│   └── src/
│       ├── app/paddy/
│       │   ├── auth/login/           ← 🔐 Login (PÚBLICA)
│       │   ├── dashboard/            ← 📊 Dashboard (PROTEGIDA)
│       │   └── logistics/
│       │       ├── monitor/          ← 📺 Monitor (PÚBLICA)
│       │       └── weighing/         ← ⚖️ Pesaje (PROTEGIDA)
│       │
│       └── features/logistics/       ← Lógica central
│           ├── context/              ← Estado global
│           ├── hooks/                ← Lógica de negocio
│           ├── components/           ← Componentes UI
│           ├── services/             ← API calls
│           ├── types/                ← TypeScript
│           ├── actions/              ← Server actions
│           └── utils/                ← Utilidades
│
└── backend/
    └── src/modules/logistics/
        ├── presentation/             ← Controllers
        ├── application/              ← Services + Gateway
        ├── domain/                   ← Entities
        ├── infrastructure/           ← Adapters
        └── dtos/                     ← Data Transfer Objects
```

---

## ✅ CHECKLIST RÁPIDO

**Antes de empezar:**
- [ ] Revisar documentos principales (ARCHITECTURE + ROUTING)
- [ ] Confirmar stack tecnológico (MySQL + Socket.io + Next.js)
- [ ] Configurar NextAuth.js
- [ ] Crear tabla `truck_receptions` en MySQL
- [ ] Instalar Socket.io (backend + frontend)

**Durante el desarrollo:**
- [ ] Crear estructura de carpetas
- [ ] Definir tipos TypeScript
- [ ] Implementar Context + Reducer
- [ ] Crear backend APIs
- [ ] Crear componentes frontend
- [ ] Implementar Socket.io
- [ ] Testear flujos

---

## 📚 DOCUMENTACIÓN DISPONIBLE

1. **TRUCK_MANAGEMENT_ARCHITECTURE.md**
   - Diseño completo del sistema
   - Arquitectura técnica
   - Estructura de carpetas
   - Componentes y APIs

2. **PADDY_TMS_ROUTING.md**
   - Rutas del proyecto
   - Autenticación y permisos
   - Middleware
   - Configuración NextAuth.js

3. **TRUCK_MANAGEMENT_CODE_EXAMPLES.md**
   - Tipos TypeScript
   - Ejemplos de implementación
   - Server Actions
   - Componentes React

4. **TRUCK_MANAGEMENT_CHECKLIST.md**
   - Plan de implementación
   - Tareas granulares
   - Tracking de progreso

5. **TRUCK_MANAGEMENT_INDEX.md**
   - Índice central
   - Guía de cómo empezar
   - Estimaciones

---

## 🎯 OBJETIVO FINAL

Un sistema PWA moderno que gestione el flujo completo de recepción de arroz paddy, con:
- ✅ Pantalla pública para choferes (sin login)
- ✅ Panel protegido para operadores (con login)
- ✅ Sincronización en tiempo real
- ✅ Máquina de estados robusta
- ✅ Generación automática de tickets
- ✅ Funcionamiento offline-first
- ✅ Integración con balanzas

---

**Proyecto**: Paddy TMS  
**Carpeta**: `/paddy-tms/`  
**Estado**: ✅ Listo para desarrollo  
**Última Actualización**: 21 de abril de 2026
