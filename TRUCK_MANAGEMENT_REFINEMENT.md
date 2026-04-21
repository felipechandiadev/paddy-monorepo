# 🚚 TRUCK MANAGEMENT SYSTEM - REFINAMIENTO ARQUITECTÓNICO

**Documento de Actualización Arquitectónica**  
**Fecha**: 21 de abril de 2026  
**Estado**: ⚡ REFINAMIENTO BASADO EN FEEDBACK  
**Cambios**: Simplificación de modelo + Roles especializados

---

## 🎯 CAMBIOS PRINCIPALES PROPUESTOS

### 1. DESCARGANDO ES PROCESO INDEPENDIENTE

El proceso de **DESCARGANDO** será:
- ✅ Manejado en **otro subsistema** (independiente del TMS)
- ✅ **Totalmente desacoplado** del flujo de pesaje
- ✅ El chofer regresa desde descarga cuando está listo
- ⚠️ **TMS No controla ni monitorea la descarga**

### 2. FLUJO SIMPLIFICADO DEL TMS

```
ANTES (5 estados):
  ESPERA → PESANDO_BRUTO → DESCARGANDO → PESANDO_TARA → FINALIZADO

DESPUÉS (3 estados - SOLO PESAJE):
  ESPERA → PESANDO_BRUTO → [DESCARGANDO EXTERNO] → PESANDO_TARA → FINALIZADO
           ↑                                              ↑
       Chofer llama                                  Chofer regresa
```

### 3. UNA SOLA ENTIDAD EN BACKEND

**Simplificación:**
- ❌ NO múltiples estados para descarga
- ✅ **UNA ÚNICA ENTIDAD**: `Reception` (Recepción)
- ✅ Solo campos relevantes al pesaje
- ✅ Relación con `Producer` (productor/transportista)

### 4. ROL ESPECIALIZADO PARA OPERADORES

Crear rol: **`LOGISTICS_OPERATOR`**

**Permisos:**
- ✅ Consultar `producers` (lista completa)
- ✅ Crear `producers` (nuevos productores)
- ✅ Realizar operaciones de `reception` (pesaje)
- ✅ Ver reportes de `reception`
- ❌ Acceso a módulos de finanzas, reportes avanzados

---

## 📊 NUEVO MODELO DE DATOS

### Entidad Principal: Reception (Recepción)

```typescript
interface Reception {
  // IDs
  id: string;                        // UUID
  numero_turno: number;              // Correlativo diario
  
  // Información del productor/transportista
  producer_id: string;               // FK a Producer
  chofer_nombre: string;
  rut_chofer?: string;
  patente: string;                   // Vehículo
  guia: string;                      // Número guía
  
  // PESAJE ENTRADA (Bruto)
  peso_bruto: number | null;         // kg
  fecha_hora_peso_bruto?: Date;
  
  // PERIODO DESCARGA (Externo)
  // ⚠️ NO SE CONTROLA DESDE TMS
  // El sistema solo espera a que chofer regrese
  
  // PESAJE SALIDA (Tara)
  peso_tara: number | null;          // kg
  fecha_hora_peso_tara?: Date;
  
  // CALCULADOS
  peso_neto?: number;                // bruto - tara
  
  // ESTADO
  estado: 'ESPERA' | 'PESANDO_BRUTO' | 'PESANDO_TARA' | 'FINALIZADO';
  
  // TICKET
  ticket_generado: boolean;
  numero_ticket?: string;
  pdf_url?: string;
  
  // TIEMPOS (para analytics)
  fecha_hora_entrada: Date;
  fecha_hora_finalizacion?: Date;
  tiempo_total_minutos?: number;
  
  // AUDITORÍA
  created_at: Date;
  updated_at: Date;
  created_by: string;
  deleted_at?: Date;
}
```

### Relaciones

```
Reception (Recepción)
    ├─ FK: producer_id → Producer
    │  └─ Agricultor/Transportista
    │
    └─ Timestamps (auditoría)
       └─ Rastreo completo de proceso
```

**NO hay relación con:**
- ❌ Descarga (subsistema independiente)
- ❌ Otros módulos (aislado)

---

## 👤 ROL ESPECIALIZADO: LOGISTICS_OPERATOR

### Definición

```typescript
enum Role {
  ADMIN = 'admin',
  CONSULTANT = 'consultant',
  LOGISTICS_OPERATOR = 'logistics_operator',  ← NUEVO
  // ... otros roles
}

interface LogisticsOperatorPermissions {
  // Productores
  producers: {
    view: true,      // Ver lista de productores
    create: true,    // Crear nuevos productores
    edit: false,     // NO editar existentes
    delete: false,   // NO eliminar
  },
  
  // Recepciones
  receptions: {
    view: true,      // Ver recepciones
    create: true,    // Crear nueva recepción
    update: true,    // Actualizar estado
    delete: false,   // NO eliminar
  },
  
  // Reportes
  reports: {
    reception_summary: true,   // Resumen de recepciones
    daily_report: true,        // Reporte diario
    producer_report: true,     // Reporte por productor
  },
  
  // Otros módulos
  finances: false,
  analytics: false,
  settings: false,
}
```

### Acciones Permitidas

```
LOGISTICS_OPERATOR puede:

1. CONSULTAR PRODUCTORES
   GET /api/v1/producers
   └─ Lista completa de productores existentes

2. CREAR PRODUCTOR
   POST /api/v1/producers
   └─ Registro rápido de nuevo productor
   └─ Datos mínimos: Nombre, RUT, Teléfono

3. INICIAR RECEPCIÓN
   POST /api/v1/receptions
   ├─ Seleccionar productor
   ├─ Ingresar datos vehículo (patente, guía)
   └─ Sistema asigna número de turno

4. REGISTRAR PESAJE ENTRADA
   PUT /api/v1/receptions/{id}/weighing
   ├─ Tipo: 'bruto'
   ├─ Peso en kg
   └─ Timestamp automático

5. REGISTRAR PESAJE SALIDA
   PUT /api/v1/receptions/{id}/weighing
   ├─ Tipo: 'tara'
   ├─ Peso en kg
   └─ Sistema calcula peso neto

6. FINALIZAR RECEPCIÓN
   PUT /api/v1/receptions/{id}/finalize
   ├─ Genera ticket (PDF)
   ├─ Calcula tiempos
   └─ Archiva en reportes

7. VER REPORTE DIARIO
   GET /api/v1/receptions/reports/daily
   └─ Resumen: Total camiones, peso total, tiempos promedio
```

---

## 🔄 FLUJO REVISADO (SIMPLIFICADO)

### Timeline del Operador

```
MAÑANA: Sistema listo
  └─ Cola vacía, pantalla en espera

CAMIÓN LLEGA:
  ├─ Operador: Click "Nueva Recepción"
  ├─ Busca productor en lista (autocomplete)
  ├─ O crea productor nuevo rápidamente
  ├─ Ingresa: Patente, Guía, Chofer
  └─ Sistema: Reception creada → ESPERA

TURNO ACTUAL:
  ├─ Monitor: "ABC-1234 A BALANZA #1"
  ├─ Operador: Ingresa peso bruto (ej: 2500 kg)
  ├─ Sistema: Reception → PESANDO_BRUTO → PESANDO_TARA
  └─ Timer inicia

CHOFER DESCIENDE:
  ├─ [SISTEMA EXTERNO MANEJA DESCARGA]
  ├─ Chofer sale del TMS
  ├─ Vacía arroz en descargador
  └─ (TMS no tiene visibilidad)

CHOFER REGRESA:
  ├─ Operador: "Listo para pesaje final"
  ├─ Ingresa peso tara (ej: 400 kg)
  ├─ Sistema calcula: 2500 - 400 = 2100 kg neto
  ├─ Valida: 2100 > 0 ✓
  └─ Reception → FINALIZADO

TICKET GENERADO:
  ├─ PDF automático con:
  │  ├─ Número ticket
  │  ├─ Productor
  │  ├─ Patente
  │  ├─ Pesos (bruto, tara, neto)
  │  ├─ Tiempos (espera, pesaje total)
  │  └─ QR para rastreo
  ├─ Se guarda en storage
  └─ Chofer se va

PRÓXIMO TURNO:
  ├─ Monitor: Vuelve a próximos en cola
  └─ Operador: "Siguiente"
```

---

## 🏗️ ARQUITECTURA SIMPLIFICADA

### Relación con otros módulos

```
PADDY APP (Monolítico)
│
├── MÓDULO: Receptions (EXISTENTE)
│   ├─ Domain: Reception entity
│   ├─ Service: Reception logic
│   └─ Controller: Reception API
│
├── MÓDULO: Logistics (NUEVO - TMS)
│   ├─ Context: LogisticsContext
│   ├─ Hooks: useLogisticsData, useRealtimeSync
│   ├─ Components: AdminDashboard, MonitorDisplay
│   └─ Actions: Server Actions para operaciones
│
├── MÓDULO: Producers (EXISTENTE)
│   ├─ Usado por TMS (consulta + creación)
│   └─ No se modifica
│
└── MÓDULO: Auth (EXISTENTE)
    ├─ Nuevo rol: LOGISTICS_OPERATOR
    └─ Validación de permisos
```

### Diferencia clave

```
ANTES:
  TMS tenía su propia entidad "Truck"
  └─ Duplicación con Reception

DESPUÉS:
  TMS REUTILIZA "Reception"
  ├─ Simplificación
  ├─ Una fuente de verdad
  └─ Integración natural con sistema
```

---

## 📋 CUADRO COMPARATIVO

| Aspecto | ANTES | DESPUÉS |
|--------|-------|---------|
| **Estados** | 5 (ESPERA, PESANDO_BRUTO, DESCARGANDO, PESANDO_TARA, FINALIZADO) | 4 (ESPERA, PESANDO_BRUTO, PESANDO_TARA, FINALIZADO) |
| **Entidades** | Truck (nueva) | Reception (reutilizada) |
| **Control Descarga** | Sí (incluida) | No (externa) |
| **Rol Necesario** | Ninguno nuevo | LOGISTICS_OPERATOR |
| **Relación Producer** | No definida | FK directo |
| **Complejidad** | Alta | Baja |
| **Reutilización** | Baja | Alta |
| **Acoplamiento** | Alto | Bajo |

---

## 🔐 PERMISOS POR ROL

### LOGISTICS_OPERATOR (Nuevo)

```
Recursos:        GET  POST  PUT  DELETE
────────────────────────────────────────
/producers       ✅   ✅   ❌   ❌
/receptions      ✅   ✅   ✅   ❌
/receptions/reports ✅ ❌   ❌   ❌

Acciones específicas:
├─ reception.create
├─ reception.update_weighing
├─ reception.finalize
├─ producer.view
└─ producer.create
```

### Comparar con ADMIN

```
ADMIN:           GET  POST  PUT  DELETE
────────────────────────────────────────
/producers       ✅   ✅   ✅   ✅
/receptions      ✅   ✅   ✅   ✅
/finances        ✅   ✅   ✅   ✅
/reports         ✅   ✅   ✅   ✅
/settings        ✅   ✅   ✅   ✅
```

---

## 📝 NUEVA ESPECIFICACIÓN: RECEPTION EXTENDIDO

### Modelo TypeScript Actualizado

```typescript
// Reutilizar Reception existente, agregar campos TMS

interface Reception {
  // IDs
  id: string;
  numero_turno?: number;           // NUEVO: Correlativo diario TMS
  
  // Datos existentes
  producer_id: string;             // FK Producer
  chofer_nombre?: string;          // NUEVO: Para TMS
  rut_chofer?: string;             // NUEVO: Para TMS
  patente?: string;                // NUEVO: Para TMS
  guia?: string;                   // NUEVO: Para guía/comprobante
  
  // Pesajes TMS
  peso_bruto?: number;             // NUEVO: kg entrada
  peso_tara?: number;              // NUEVO: kg salida
  peso_neto?: number;              // NUEVO: calculado
  
  // Timestamps TMS
  fecha_hora_peso_bruto?: Date;    // NUEVO
  fecha_hora_peso_tara?: Date;     // NUEVO
  
  // Estado TMS
  estado_tms?: 'ESPERA' | 'PESANDO_BRUTO' | 'PESANDO_TARA' | 'FINALIZADO';
  
  // Ticket
  numero_ticket?: string;          // NUEVO
  pdf_url?: string;                // NUEVO
  
  // Datos originales Reception (se mantienen)
  fecha_recepcion: Date;
  estado: string;                  // Original
  // ... otros campos
  
  // Auditoría
  created_at: Date;
  updated_at: Date;
}
```

---

## 🎨 INTERFAZ DE USUARIO

### Admin Dashboard - Flujo Simplificado

```
┌───────────────────────────────────────────────────────────┐
│            PANEL LOGÍSTICA - TMS                          │
├───────────────────────────────────────────────────────────┤
│                                                           │
│ [Nueva Recepción]  [Próximos]  [Finalizadas]            │
│                                                           │
│ ┌─────────────────────────────────────────────────────┐  │
│ │ TURNO ACTUAL                                        │  │
│ ├─────────────────────────────────────────────────────┤  │
│ │ Productor:     Carlos García                       │  │
│ │ Patente:       ABC-1234                            │  │
│ │ Chofer:        Juan Pérez                          │  │
│ │                                                     │  │
│ │ Estado:        PESANDO_BRUTO                       │  │
│ │ Entrada:       2500 kg                             │  │
│ │ Salida:        ─                                   │  │
│ │ Neto:          ─                                   │  │
│ │ Tiempo:        3 min 45 seg                        │  │
│ │                                                     │  │
│ │ ┌─────────────────────────────────────────────┐    │  │
│ │ │ Peso Salida (kg):  [       ]               │    │  │
│ │ │                                             │    │  │
│ │ │ [Cancelar]              [Registrar]        │    │  │
│ │ └─────────────────────────────────────────────┘    │  │
│ └─────────────────────────────────────────────────────┘  │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

---

## 📊 IMPACTO EN DESARROLLO

### Reduce Complejidad

```
ANTES:
- 5 estados a validar
- Máquina de estados compleja
- Lógica de descarga integrada
- 100+ checklist items

DESPUÉS:
- 4 estados (más simple)
- Máquina de estados básica
- Sin lógica de descarga (externa)
- 60-70 checklist items
```

### Reutilización

```
ANTES:
- Entidad nueva "Truck"
- DTOs nuevos
- API endpoints nuevos
- 6 endpoints

DESPUÉS:
- Reutilizar "Reception"
- DTOs existentes (agregar campos)
- API endpoints existentes (extender)
- 4-5 endpoints (menos)
```

---

## ✅ CAMBIOS EN PLAN DE IMPLEMENTACIÓN

### FASE 1: Setup (IGUAL)
- Crear estructura de carpetas
- Definir tipos (SIMPLIFICADO)
- Context + Reducer (MÁS SIMPLE)

### FASE 2: Backend (SIMPLIFICADO)
- ❌ NO crear entidad Truck nueva
- ✅ Extender Reception existente
- ✅ Crear rol LOGISTICS_OPERATOR
- ✅ Agregar campos a DTOs
- ✅ 4-5 endpoints (menos)

### FASE 3: Frontend (SIMILAR)
- Crear contexto para TMS
- Componentes AdminDashboard + Monitor
- Hooks para sincronización

### FASE 4+: Testing, Realtime, Producción (IGUAL)

---

## 🎯 BENEFICIOS DE CAMBIO

| Beneficio | Impacto |
|----------|--------|
| **Menos código** | 30% menos lineas |
| **Menos BD** | Reutilizar tabla reception |
| **Mantenibilidad** | Una fuente de verdad |
| **Integración** | Seamless con sistema existente |
| **Riesgos** | Reducidos significativamente |
| **Tiempo dev** | 1 semana menos |
| **Testing** | Más simple |
| **Escalabilidad** | Mejor desacoplada |

---

## 📝 ACCIÓN REQUERIDA

### Revisar y Validar

- [ ] ¿Acuerdan reutilizar Reception?
- [ ] ¿Reception actual tiene los campos necesarios?
- [ ] ¿Crean nuevo rol LOGISTICS_OPERATOR?
- [ ] ¿Timeline para crear el rol?
- [ ] ¿Quién gestiona permisos de rol?

### Próximos Pasos

1. Validar cambios con equipo
2. Actualizar TRUCK_MANAGEMENT_ARCHITECTURE.md
3. Reducir TRUCK_MANAGEMENT_CHECKLIST.md (menos items)
4. Comenzar FASE 1 con arquitectura simplificada

---

**Documento**: TRUCK_MANAGEMENT_REFINEMENT.md  
**Versión**: 1.0 - Simplificación  
**Estado**: ⚡ Listo para validación
