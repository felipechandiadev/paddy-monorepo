# 🚚 TRUCK MANAGEMENT SYSTEM - ARQUITECTURA FINAL

**Documento de Arquitectura Final Corregido**  
**Fecha**: 21 de abril de 2026  
**Estado**: ✅ VERSIÓN FINAL VALIDADA  
**Cambios**: Nueva entidad TruckReception (NO extender Reception)

---

## 🎯 DECISIÓN ARQUITECTÓNICA FINAL

### ✅ CREAR NUEVA ENTIDAD: `TruckReception`

**NO extender Reception existente**, sino crear una **entidad nueva e independiente**:

```typescript
// NUEVA ENTIDAD: TruckReception (Específica para TMS)
interface TruckReception {
  id: string;                           // UUID
  numero_turno: number;                 // Correlativo diario
  producer_id: string;                  // FK → Producer
  patente: string;                      // ABC-1234
  guia: string;                         // Número guía
  chofer_nombre: string;
  rut_chofer?: string;
  
  // Pesajes
  peso_bruto: number | null;
  peso_tara: number | null;
  peso_neto?: number;
  
  // Estado TMS
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

// ENTIDAD EXISTENTE: Reception (Se mantiene intacta)
interface Reception {
  // Campos originales - NO SE TOCAN
  id: string;
  // ... resto de campos originales
}
```

### ¿Por Qué Nueva Entidad?

| Aspecto | Extender Reception | Nueva Entidad |
|--------|-------------------|---------------|
| **Desacoplamiento** | ❌ Bajo | ✅ Alto |
| **Compatibilidad** | ❌ Riesgoso | ✅ Seguro |
| **Migrations** | ❌ Complejas | ✅ Simples |
| **Lógica** | ❌ Duplicada | ✅ Separada |
| **Testing** | ❌ Afecta otros | ✅ Aislado |
| **Mantenibilidad** | ❌ Baja | ✅ Alta |

---

## 📊 ARQUITECTURA DE ENTIDADES

```
PADDY APP - Base de Datos
│
├── MÓDULO: Producers (Existente)
│   └── Table: producers
│       ├─ id, name, rut, email, phone
│       └─ Agricultores y transportistas
│
├── MÓDULO: Receptions (Existente)
│   └── Table: receptions
│       ├─ id, producer_id, fecha_recepcion, estado
│       └─ Recepciones generales (NO se modifica)
│
├── MÓDULO: Operations (Existente)
│   └── Table: operations (otros tipos)
│
└── MÓDULO: Logistics (NUEVO - TMS)
    └── Table: truck_receptions
        ├─ id, numero_turno, producer_id
        ├─ patente, guia, chofer_nombre
        ├─ peso_bruto, peso_tara, peso_neto
        ├─ estado (ESPERA, PESANDO_BRUTO, PESANDO_TARA, FINALIZADO)
        ├─ fecha_hora_entrada, fecha_hora_peso_bruto, fecha_hora_peso_tara
        ├─ numero_ticket, pdf_url
        └─ created_at, updated_at, created_by, deleted_at
```

---

## 🔄 FLUJO SIMPLIFICADO

```
┌────────────────────────────────────────────────────────────┐
│                   FLUJO TMS (4 ESTADOS)                    │
└────────────────────────────────────────────────────────────┘

[1. ESPERA]
  ├─ Camión llega
  ├─ Operador: "Nueva Recepción"
  ├─ Selecciona productor
  ├─ Ingresa: Patente, Guía, Chofer
  ├─ Sistema: TruckReception creada
  ├─ Estado: ESPERA
  └─ Monitor: Muestra en próximos

[2. PESANDO_BRUTO]
  ├─ Monitor: "ABC-1234 A BALANZA #1"
  ├─ Operador: Ingresa peso bruto (2500 kg)
  ├─ Estado: PESANDO_BRUTO → PESANDO_TARA
  ├─ Timer inicia
  └─ Chofer se va a descargar

[DESCARGANDO - EXTERNO]
  ├─ ⚠️ FUERA DEL TMS
  ├─ Otro subsistema lo maneja
  ├─ TMS NO controla esto
  └─ Chofer regresa cuando termina

[3. PESANDO_TARA]
  ├─ Chofer regresa
  ├─ Operador: "Listo para pesaje final"
  ├─ Ingresa peso tara (400 kg)
  ├─ Sistema calcula: 2500 - 400 = 2100 kg neto
  ├─ Valida: 2100 > 0 ✓
  └─ Estado: PESANDO_TARA

[4. FINALIZADO]
  ├─ Genera ticket PDF
  ├─ Calcula tiempos
  ├─ Guarda en storage
  ├─ Estado: FINALIZADO
  └─ Libera turno → Próximo en cola
```

---

## 🏗️ BACKEND ESTRUCTURA

### Módulo Logistics (NestJS)

```
backend/src/modules/logistics/
├── presentation/
│   └── truck-reception.controller.ts
│       ├─ POST /truck-receptions (crear)
│       ├─ PUT /truck-receptions/{id}/state (cambiar estado)
│       ├─ POST /truck-receptions/{id}/weighing (registrar peso)
│       ├─ GET /truck-receptions (listar)
│       └─ GET /truck-receptions/{id} (detalle)
│
├── application/
│   └── truck-reception.service.ts
│       ├─ createTruckReception()
│       ├─ updateState()
│       ├─ registerWeighing()
│       ├─ getTruckReception()
│       └─ finalizeTruckReception()
│
├── domain/
│   └── truck-reception.entity.ts
│       └─ TruckReception entity (TypeORM)
│
├── infrastructure/
│   └── truck-reception.repository.ts
│
├── dtos/
│   ├─ create-truck-reception.dto.ts
│   ├─ update-state.dto.ts
│   ├─ register-weighing.dto.ts
│   └─ truck-reception.response.dto.ts
│
└── logistics.module.ts
```

### Entity TypeORM

```typescript
// truck-reception.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Producer } from '../../producers/domain/producer.entity';

@Entity('truck_receptions')
export class TruckReception {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  numero_turno: number;

  @ManyToOne(() => Producer)
  producer: Producer;

  @Column()
  producer_id: string;

  @Column()
  patente: string;  // ABC-1234

  @Column()
  guia: string;

  @Column()
  chofer_nombre: string;

  @Column({ nullable: true })
  rut_chofer: string;

  // Pesajes
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  peso_bruto: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  peso_tara: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, generated: 'STORED', nullable: true })
  peso_neto: number;  // bruto - tara (calculado)

  // Estado
  @Column({ type: 'enum', enum: ['ESPERA', 'PESANDO_BRUTO', 'PESANDO_TARA', 'FINALIZADO'] })
  estado: string;

  // Timestamps
  @Column()
  fecha_hora_entrada: Date;

  @Column({ nullable: true })
  fecha_hora_peso_bruto: Date;

  @Column({ nullable: true })
  fecha_hora_peso_tara: Date;

  @Column({ nullable: true })
  fecha_hora_finalizacion: Date;

  // Ticket
  @Column({ nullable: true })
  numero_ticket: string;

  @Column({ nullable: true })
  pdf_url: string;

  // Auditoría
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  created_by: string;

  @Column({ nullable: true, type: 'datetime' })
  deleted_at: Date;
}
```

---

## 👤 ROL: LOGISTICS_OPERATOR

### Definición en BD

```sql
-- Crear rol
INSERT INTO roles (name, description) VALUES 
('logistics_operator', 'Operador de logística - Pesaje de camiones');

-- Permisos
INSERT INTO role_permissions (role_id, resource, action) VALUES
('logistics_operator', 'producers', 'view'),
('logistics_operator', 'producers', 'create'),
('logistics_operator', 'truck_receptions', 'create'),
('logistics_operator', 'truck_receptions', 'read'),
('logistics_operator', 'truck_receptions', 'update'),
('logistics_operator', 'truck_receptions', 'finalize'),
('logistics_operator', 'reports', 'view');
```

### Permisos Granulares

```typescript
interface LogisticsOperatorPermissions {
  producers: {
    view: true,        // Listar productores
    create: true,      // Crear nuevo productor
    edit: false,       // NO editar
    delete: false,     // NO eliminar
  },
  
  truck_receptions: {
    create: true,      // Crear recepción
    read: true,        // Ver recepciones
    update: true,      // Actualizar pesajes
    finalize: true,    // Finalizar recepción
    delete: false,     // NO eliminar
  },
  
  reports: {
    daily_summary: true,
    by_producer: true,
    export: false,
  },
  
  analytics: false,
  finances: false,
  settings: false,
}
```

---

## 📋 COMPARACIÓN: Extender vs Nueva Entidad

| Criterio | Extender Reception | Nueva Entidad (TruckReception) |
|----------|-------------------|-------------------------------|
| **Complejidad** | Media | Baja |
| **Riesgo** | Alto (afecta otros) | Bajo (aislado) |
| **Migrations** | Complejas | Simples |
| **Backward Compatible** | NO | SÍ |
| **Testing** | Afecta existing | Nuevo solo |
| **Mantenibilidad** | Baja | Alta |
| **Escalabilidad** | Media | Alta |
| **Seguridad** | Posibles conflictos | Limpio |
| **Recomendación** | ❌ NO | ✅ SÍ |

---

## 📁 ESTRUCTURA DE CARPETAS FINAL

```
frontend/src/
├── app/paddy/logistics/
│   ├── dispatch/                    # Monitor para choferes
│   │   └── page.tsx               # MonitorDisplay
│   ├── weighing/                    # Panel operador
│   │   ├── page.tsx               # AdminDashboard
│   │   └── [id]/page.tsx          # Detalle recepción
│   └── layout.tsx                 # LogisticsProvider
│
└── features/logistics/
    ├── context/
    │   ├── LogisticsContext.tsx
    │   ├── reducer.ts
    │   └── actions.ts
    ├── hooks/
    │   ├── useLogisticsData.ts
    │   ├── useRealtimeSync.ts
    │   └── useTruckState.ts
    ├── services/
    │   ├── truckReceptionService.ts
    │   └── realtimeService.ts
    ├── components/
    │   ├── AdminDashboard.tsx
    │   ├── MonitorDisplay.tsx
    │   ├── WeighingForm.tsx
    │   ├── TruckReceptionForm.tsx
    │   └── QueueList.tsx
    ├── types/
    │   └── logistics.types.ts
    ├── actions/
    │   └── truck-reception.action.ts
    └── utils/

backend/src/modules/
└── logistics/
    ├── presentation/
    │   └── truck-reception.controller.ts
    ├── application/
    │   └── truck-reception.service.ts
    ├── domain/
    │   └── truck-reception.entity.ts
    ├── infrastructure/
    │   └── truck-reception.repository.ts
    ├── dtos/
    │   ├── create-truck-reception.dto.ts
    │   ├── update-state.dto.ts
    │   └── register-weighing.dto.ts
    └── logistics.module.ts
```

---

## 🔐 MIGRACIONES BD

### Crear tabla truck_receptions

```sql
-- Crear tabla truck_receptions
CREATE TABLE truck_receptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_turno INT NOT NULL,
  producer_id UUID NOT NULL REFERENCES producers(id),
  
  patente VARCHAR(20) NOT NULL,
  guia VARCHAR(100) NOT NULL,
  chofer_nombre VARCHAR(150) NOT NULL,
  rut_chofer VARCHAR(15),
  
  peso_bruto DECIMAL(10, 2),
  peso_tara DECIMAL(10, 2),
  peso_neto DECIMAL(10, 2) GENERATED ALWAYS AS (peso_bruto - peso_tara) STORED,
  
  estado VARCHAR(30) NOT NULL DEFAULT 'ESPERA' 
    CHECK (estado IN ('ESPERA', 'PESANDO_BRUTO', 'PESANDO_TARA', 'FINALIZADO')),
  
  fecha_hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_hora_peso_bruto TIMESTAMP,
  fecha_hora_peso_tara TIMESTAMP,
  fecha_hora_finalizacion TIMESTAMP,
  
  numero_ticket VARCHAR(50),
  pdf_url VARCHAR(500),
  
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL REFERENCES users(id),
  deleted_at TIMESTAMP,
  
  UNIQUE (numero_ticket),
  INDEX idx_producer_id (producer_id),
  INDEX idx_estado (estado),
  INDEX idx_fecha_entrada (fecha_hora_entrada)
);

-- Índices para performance
CREATE INDEX idx_truck_receptions_numero_turno ON truck_receptions(numero_turno);
CREATE INDEX idx_truck_receptions_estado ON truck_receptions(estado);
CREATE INDEX idx_truck_receptions_created_at ON truck_receptions(created_at DESC);
```

### Crear rol LOGISTICS_OPERATOR

```sql
-- Insertar rol
INSERT INTO roles (name, slug, description) VALUES 
(
  'Logistics Operator',
  'logistics_operator',
  'Operador especializado en gestión de recepciones de camiones - Pesaje'
);

-- Obtener role_id (ajustar según tu schema)
SELECT id INTO @role_id FROM roles WHERE slug = 'logistics_operator';

-- Asignar permisos
INSERT INTO role_permissions (role_id, resource, action) VALUES
(@role_id, 'producers', 'view'),
(@role_id, 'producers', 'create'),
(@role_id, 'truck_receptions', 'create'),
(@role_id, 'truck_receptions', 'read'),
(@role_id, 'truck_receptions', 'update'),
(@role_id, 'truck_receptions', 'finalize'),
(@role_id, 'reports', 'read');
```

---

## ✅ VENTAJAS DE NUEVA ENTIDAD

### Técnicas
- ✅ Tabla nueva, sin modificar existentes
- ✅ Migrations simples
- ✅ Zero impact en Receipt existente
- ✅ Testing aislado
- ✅ Mejor performance (tabla dedicada)

### Operacionales
- ✅ Rol especializado claro
- ✅ Interface simplificada
- ✅ Flujo separado y dedicado
- ✅ Reportes específicos TMS

### Arquitectónicas
- ✅ Mejor separación de responsabilidades
- ✅ Escalable a futuro
- ✅ Bajo acoplamiento
- ✅ Fácil de mantener

---

## 🎯 PLAN DE IMPLEMENTACIÓN ACTUALIZADO

### FASE 1: Setup (1 semana)
- [ ] Crear estructura de carpetas
- [ ] Definir tipos TypeScript
- [ ] Context + Reducer
- [ ] Crear tabla `truck_receptions`

### FASE 2: Backend (1 semana)
- [ ] Entity TruckReception (TypeORM)
- [ ] Service con lógica
- [ ] Controller (5 endpoints)
- [ ] Tests E2E

### FASE 3: Frontend (1 semana)
- [ ] Hooks + Server Actions
- [ ] AdminDashboard
- [ ] MonitorDisplay
- [ ] Componentes

### FASE 4: Realtime + Testing (1 semana)
- [ ] Supabase Realtime
- [ ] Tests E2E (Playwright)
- [ ] Offline-first

### FASE 5: Producción (1 semana)
- [ ] Documentación
- [ ] Training
- [ ] Go-live

**TOTAL: 3-4 semanas**

---

## 📝 ENDPOINTS API

```
POST   /api/v1/logistics/truck-receptions
├─ Input:  { producer_id, patente, guia, chofer_nombre, rut_chofer }
└─ Output: TruckReception { id, numero_turno, estado: 'ESPERA' }

PUT    /api/v1/logistics/truck-receptions/{id}/state
├─ Input:  { nuevo_estado: 'PESANDO_BRUTO' | 'PESANDO_TARA' | 'FINALIZADO' }
└─ Output: TruckReception (actualizado)

POST   /api/v1/logistics/truck-receptions/{id}/weighing
├─ Input:  { tipo: 'bruto' | 'tara', peso: number }
└─ Output: TruckReception { peso_bruto, peso_tara, peso_neto }

GET    /api/v1/logistics/truck-receptions
└─ Output: TruckReception[] (lista actual)

GET    /api/v1/logistics/truck-receptions/{id}
└─ Output: TruckReception (detalle completo)

POST   /api/v1/logistics/truck-receptions/{id}/finalize
└─ Output: { numero_ticket, pdf_url, estado: 'FINALIZADO' }
```

---

## 🎉 CONCLUSIÓN

**Decisión Final Validada:**

❌ NO extender `Reception`  
✅ CREAR nueva entidad `TruckReception`

**Beneficios:**
- Aislamiento completo
- Sin riesgo para sistema existente
- Mantenibilidad superior
- Escalable a futuro
- Rol especializado claro

**Estado:** ✅ Listo para implementación

---

**Documento**: TRUCK_MANAGEMENT_FINAL_ARCHITECTURE.md  
**Versión**: 2.0 - Arquitectura Final Validada  
**Fecha**: 21 de abril de 2026  
**Decisión**: Nueva Entidad TruckReception (NO extender Reception)
