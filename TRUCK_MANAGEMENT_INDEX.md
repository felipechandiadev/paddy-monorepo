# 📚 PADDY TMS - TRUCK MANAGEMENT SYSTEM
## Índice y Guía de Documentos

**Nombre Oficial del Proyecto**: Paddy TMS  
**Carpeta**: `/paddy-tms/`  
**Última Actualización**: 21 de abril de 2026  
**Versión**: 2.0  
**Status**: ✅ Documentación Completa - Listo para Desarrollo

---

## 🎯 RÁPIDO ACCESO

### 📌 Descripción del Proyecto

**Paddy TMS** es un **Truck Management System** diseñado para gestionar el flujo logístico completo de recepción de arroz paddy. El sistema tiene dos componentes principales:

1. **📺 Monitor de Turnos** (Público - Sin Login)
   - Pantalla para choferes
   - Información clara: turno actual, próximos turnos
   - Acceso libre, sin autenticación

2. **⚖️ Panel de Pesaje** (Protegido - Con Login)
   - Interfaz para operadores logísticos
   - Control de pesajes (bruto/tara)
   - Generación de tickets
   - Requiere autenticación con rol LOGISTICS_OPERATOR

### Documentos Principales

| Documento | Propósito | Audiencia | Lectura |
|-----------|-----------|-----------|---------|
| **TRUCK_MANAGEMENT_ARCHITECTURE.md** | Diseño completo del sistema | Arquitectos, Leads, Developers | 30 min |
| **PADDY_TMS_ROUTING.md** | Rutas, autenticación y permisos | Developers, Security | 25 min |
| **TRUCK_MANAGEMENT_CODE_EXAMPLES.md** | Ejemplos implementación | Developers | 45 min |
| **TRUCK_MANAGEMENT_CHECKLIST.md** | Plan ejecución fase a fase | Project Manager, Team | 20 min |

---

## 📄 DESCRIPCIÓN DE DOCUMENTOS

### 1️⃣ TRUCK_MANAGEMENT_ARCHITECTURE.md

**Lo que encontrarás:**

- ✅ Descripción oficial del proyecto (Paddy TMS)
- ✅ Rutas del proyecto y estructura
- ✅ Visión general y objetivos del sistema
- ✅ Flujo completo de procesos (diagrama ASCII)
- ✅ Arquitectura técnica en capas
- ✅ Stack tecnológico (MySQL + Socket.io + Polling)
- ✅ Modelos de datos (TruckReception, Producer, etc)
- ✅ Máquina de estados con transiciones (4 estados)
- ✅ Estructura de carpetas completa (frontend + backend)
- ✅ Componentes frontend (MonitorDisplay, AdminDashboard, etc)
- ✅ Backend APIs y endpoints
- ✅ Sincronización en tiempo real (Socket.io + MySQL)
- ✅ Manejo de errores
- ✅ Plan de implementación

**Usarlo cuando:**
- Necesitas entender la arquitectura general
- Estás planificando el proyecto
- Necesitas hacer decisiones de diseño
- Estás en una reunión de stakeholders

**Secciones clave:**
- Sección 3: Flujo de Procesos
- Sección 4: Arquitectura Técnica
- Sección 5: Modelos de Datos
- Sección 6: Máquina de Estados
- Sección 7: Estructura de Carpetas

---

### 2️⃣ PADDY_TMS_ROUTING.md

**Lo que encontrarás:**

- ✅ Diagrama de navegación del sistema
- ✅ Rutas públicas (sin autenticación)
- ✅ Rutas protegidas (con autenticación)
- ✅ Estructura de autenticación (NextAuth.js)
- ✅ Roles y permisos (LOGISTICS_OPERATOR)
- ✅ Middleware de protección
- ✅ Configuración de base de datos
- ✅ Flujos completos de acceso
- ✅ Checklist de implementación

**Usarlo cuando:**
- Necesitas implementar autenticación
- Necesitas proteger rutas
- Necesitas entender roles y permisos
- Estás configurando NextAuth.js

**Secciones clave:**
- Visión de Rutas
- Rutas Públicas vs Protegidas
- Estructura de Autenticación
- Middleware de Protección

---

### 3️⃣ TRUCK_MANAGEMENT_CODE_EXAMPLES.md

**Lo que encontrarás:**

- ✅ Tipos TypeScript completos y listos para copiar
- ✅ Context + Reducer implementación
- ✅ Hooks personalizados (useLogisticsData, useRealtimeSync, useTruckState)
- ✅ Server Actions (createTruck, updateState, registerWeighing, etc)
- ✅ Componentes React (TruckInputForm, WeighingForm, etc)
- ✅ Backend Service (NestJS)
- ✅ Configuración y setup
- ✅ Ejemplos de flujos

**Usarlo cuando:**
- Estás escribiendo código
- Necesitas copiar-pegar tipos
- Necesitas ver la implementación real
- Tienes dudas sobre cómo conectar piezas

**Secciones clave:**
- Sección 1: Tipos TypeScript
- Sección 2: Context + Reducer
- Sección 3: Hooks Personalizados
- Sección 4: Server Actions
- Sección 5: Componentes React

---

### 4️⃣ TRUCK_MANAGEMENT_CHECKLIST.md

**Lo que encontrarás:**

- ✅ Checklist por fase (7 semanas)
- ✅ Desglose de tareas granulares
- ✅ Criterios de "Hecho" por item
- ✅ Tracking de progreso
- ✅ Preguntas/decisiones pendientes
- ✅ Definición de Hecho (DoD)

**Usarlo cuando:**
- Eres Project Manager
- Necesitas trackear progreso
- Necesitas asignar tareas
- Necesitas saber qué viene próximo

**Secciones clave:**
- Fase 1: Setup Inicial
- Fase 2: Backend APIs
- Fase 3: Frontend Hooks
- Fase 4: Componentes
- Fase 5: Sincronización RT
- Fase 6: Testing
- Fase 7: Producción

---

## 🗺️ MAPA DE CONTENIDOS

```
PROYECTO: Paddy TMS (Truck Management System)
Carpeta: /paddy-tms/

ARQUITECTURA
├── Documentos
│   ├── TRUCK_MANAGEMENT_ARCHITECTURE.md ← Diseño General
│   ├── PADDY_TMS_ROUTING.md ← Rutas y Autenticación
│   ├── TRUCK_MANAGEMENT_CODE_EXAMPLES.md ← Implementación
│   └── TRUCK_MANAGEMENT_CHECKLIST.md ← Ejecución
│
├── FRONTEND (Next.js 16+)
│   ├── /app/paddy/
│   │   ├── auth/login/ ← 🔐 Login (PÚBLICA)
│   │   ├── dashboard/ ← 📊 Dashboard (PROTEGIDA)
│   │   └── logistics/
│   │       ├── monitor/ ← 📺 Monitor de turnos (PÚBLICA)
│   │       └── weighing/ ← ⚖️ Panel de pesaje (PROTEGIDA)
│   │
│   └── /features/logistics/
│       ├── context/ ← Estado global + Reducer
│       ├── hooks/ ← Lógica de negocio
│       ├── services/ ← Comunicación API
│       ├── components/ ← Componentes UI
│       ├── types/ ← TypeScript types
│       ├── actions/ ← Server Actions
│       └── utils/ ← Utilidades
│
├── BACKEND (NestJS)
│   └── /modules/logistics/
│       ├── presentation/ ← Controller
│       ├── application/ ← Service + Gateway
│       ├── domain/ ← Entity (TruckReception)
│       ├── infrastructure/ ← Adapters (Socket.io, Balanza)
│       └── dtos/ ← DTOs
│
└── DATA LAYER
    ├── MySQL (BD principal - TypeORM)
    ├── IndexedDB (offline-first frontend)
    ├── Service Workers (caching)
    └── Socket.io + Polling (realtime sync)
```

---

## 🚀 CÓMO EMPEZAR

### Para Arquitectos / Leads

1. Leer **TRUCK_MANAGEMENT_ARCHITECTURE.md** (Secciones 1-4)
2. Leer **PADDY_TMS_ROUTING.md** (Visión General)
3. Revisar **Flujo de Procesos** (ARCHITECTURE - Sección 3)
4. Revisar **Arquitectura Técnica** (ARCHITECTURE - Sección 4)
5. Confirmar con equipo antes de empezar

### Para Desarrolladores Frontend

1. Leer **PADDY_TMS_ROUTING.md** (completo)
2. Leer **Sección 7** de ARCHITECTURE.md (Estructura de Carpetas)
3. Leer **TRUCK_MANAGEMENT_CODE_EXAMPLES.md** (completo)
4. Empezar con FASE 1 del CHECKLIST
5. Crear estructura de carpetas
6. Copiar tipos del documento de ejemplos

### Para Desarrolladores Backend

1. Leer **Sección 4-6** de ARCHITECTURE.md
2. Leer **Backend APIs** (ARCHITECTURE - Sección 9)
3. Revisar **DTOs** en CODE_EXAMPLES.md
4. Leer **PADDY_TMS_ROUTING.md** (Base de Datos)
5. Empezar FASE 2 del CHECKLIST
6. Crear Entity (TruckReception) + DTOs
7. Implementar Service + Gateway
8. Crear Controller

### Para Project Manager

1. Leer **TRUCK_MANAGEMENT_CHECKLIST.md** (completo)
2. Leer **PADDY_TMS_ROUTING.md** (primeras secciones)
3. Revisar FASES y estimaciones
4. Usar checklist para trackear progreso
5. Compartir status semanal con equipo

---

## 📊 ESTIMACIONES

### Por Rol

**Arquitecto/Lead**: 2-3 horas
- Revisión diseño
- Decisiones técnicas
- Kick-off meeting

**Developer Frontend**: 3-4 semanas
- Setup + Context: 1 semana
- Componentes: 1 semana
- Socket.io + Testing: 1-2 semanas

**Developer Backend**: 2-3 semanas
- Entity + DTOs: 3-4 días
- Service + Controller + Gateway: 1 semana
- Tests: 3-4 días

**Conjunto**: 4-5 semanas (con overlap)

---

## 🎯 DECISIONES CRÍTICAS

Antes de empezar, resolver estos puntos:

| Decisión | Opciones | Impacto | Dueño |
|----------|----------|--------|-------|
| **Integración Balanza** | RS232 / USB / API | 🔴 Alto | Tech Lead |
| **Multi-site** | Sí / No | 🔴 Alto | Product |
| **PDF Storage** | S3 / CloudStorage / Local | 🟡 Medio | Backend |
| **Socket.io Setup** | Ya config / Necesita setup | 🔴 Alto | DevOps |
| **Audio Alerts** | Sí / No | 🟢 Bajo | Frontend |

---

## 🔗 ESTRUCTURA DE RUTAS CLAVE

### Rutas Públicas (Sin Login)
- `GET /paddy/logistics/monitor` → Pantalla de choferes (tiempo real)
- `GET /paddy/auth/login` → Formulario de autenticación

### Rutas Protegidas (Con Login + LOGISTICS_OPERATOR)
- `GET /paddy/dashboard` → Panel principal
- `GET /paddy/logistics/weighing` → Panel de pesajes
- `POST /paddy/logistics/weighing` → Registrar camión
- `GET /paddy/logistics/weighing/[id]` → Detalles

---

## 📞 PRÓXIMOS PASOS

### Esta Semana
- [ ] Revisar documentación (todos)
- [ ] Revisar PADDY_TMS_ROUTING.md
- [ ] Resolver decisiones críticas
- [ ] Confirmar stack tecnológico
- [ ] Crear kick-off meeting

### Semana 1
- [ ] Crear estructura de carpetas
- [ ] Definir tipos TypeScript
- [ ] Setup Context
- [ ] Crear tabla `truck_receptions` en BD

### Semana 2-3
- [ ] Implementar APIs backend
- [ ] Crear componentes frontend
- [ ] Setup Socket.io (backend + frontend)

### Semana 4
- [ ] Testing completo
- [ ] Performance tuning
- [ ] Documentación usuario

---

## ✅ VALIDACIÓN ANTES DE EMPEZAR

Asegúrate que:

- [ ] Equipo leyó documentación
- [ ] PADDY_TMS_ROUTING.md revisado
- [ ] Decisiones críticas resueltas
- [ ] Stack tecnológico confirmado (MySQL + Socket.io + Next.js)
- [ ] BD schema aprobado
- [ ] Credenciales en variables de entorno
- [ ] Estructura de carpetas creada
- [ ] Primer commit hecho

---

## 📝 NOTAS FINALES

Este documento es un **artefacto vivo**. Actualizar conforme:
- Cambios en requisitos
- Decisiones técnicas nuevas
- Aprendizajes de desarrollo
- Feedback de usuarios

**Actualización cada**: 1 semana o al cerrar cada fase

---

**Creado**: 21 de abril de 2026  
**Versión**: 2.0  
**Estado**: ✅ Listo para iniciar desarrollo  
**Proyecto**: Paddy TMS  
**Carpeta**: `/paddy-tms/`

Para preguntas o clarificaciones, revisar secciones correspondientes en documentos principales.
