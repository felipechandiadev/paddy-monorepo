# 📚 Paddy - Documentación Completa de Patrones

**Status**: ✅ Completado  
**Última actualización**: Marzo 2026  
**Cobertura**: Backend DDD + Frontend Feature-First  

---

## 🎯 Propósito

Esta documentación permite a **cualquier desarrollador** entender e implementar:

1. **Backend DDD Pattern** - Domain-Driven Design con UseCase Pattern
2. **Frontend Feature-First** - Clean Architecture en Next.js

En **otros proyectos**, con total independencia.

---

## 📖 Documentación Disponible

### ✅ Backend (DDD + UseCase Pattern)

| Documento | Propósito | Audiencia | Tiempo |
|-----------|----------|-----------|--------|
| **[BACKEND_PATTERNS_README.md](./BACKEND_PATTERNS_README.md)** | Índice y conceptos clave DDD | Todos | 5 min |
| **[BACKEND_PATTERN_GUIDE.md](./BACKEND_PATTERN_GUIDE.md)** | Guía completa (30 min) + UseCase Pattern | Principiantes | 30 min |
| **[BACKEND_PATTERN_QUICK_REFERENCE.md](./BACKEND_PATTERN_QUICK_REFERENCE.md)** | Templates copy-paste + UseCase | Desarrollo | 5 min |
| **[BACKEND_MODULE_CHECKLIST.md](./BACKEND_MODULE_CHECKLIST.md)** | Validación de módulos DDD | Code Review | 15-20 min |
| **[USECASE_PATTERN_CHANGES.md](./USECASE_PATTERN_CHANGES.md)** | Resumen: UseCase Pattern agregado | Referencia | 10 min |

### ✅ Frontend (Feature-First + Clean Architecture)

| Documento | Propósito | Audiencia | Tiempo |
|-----------|----------|-----------|--------|
| **[FRONTEND_PATTERNS_README.md](./FRONTEND_PATTERNS_README.md)** | Índice y conceptos clave Feature-First | Todos | 5 min |
| **[FRONTEND_FEATURE_FIRST_GUIDE.md](./FRONTEND_FEATURE_FIRST_GUIDE.md)** | Guía completa (30 min) con ejemplos | Principiantes | 30 min |
| **[FRONTEND_FEATURE_QUICK_REFERENCE.md](./FRONTEND_FEATURE_QUICK_REFERENCE.md)** | 7 Templates copy-paste | Desarrollo | 5 min |
| **[FRONTEND_MODULE_CHECKLIST.md](./FRONTEND_MODULE_CHECKLIST.md)** | Validación de features | Code Review | 15-20 min |
| **[FRONTEND_FEATURE_FIRST_CHANGES.md](./FRONTEND_FEATURE_FIRST_CHANGES.md)** | Resumen: Frontend Feature-First | Referencia | 10 min |

---

## 🚀 Cómo Empezar

### Si es tu PRIMER DAY con Paddy

```
1. Lee: BACKEND_PATTERNS_README.md (5 min)
2. Lee: FRONTEND_PATTERNS_README.md (5 min)
3. Estudia BACKEND_PATTERN_GUIDE.md (30 min)
4. Estudia FRONTEND_FEATURE_FIRST_GUIDE.md (30 min)
5. Guarda los Quick References para referencia
6. Empieza a codar usando templates

Total: ~1.5 horas para entender toda la arquitectura
```

### Si necesitas CREAR una feature BACKEND

```
1. Lee: BACKEND_PATTERN_QUICK_REFERENCE.md (5 min)
2. Copia templates correspondientes
3. Implementa usando checklist
4. Valida: BACKEND_MODULE_CHECKLIST.md
5. Code review
```

### Si necesitas CREAR una feature FRONTEND

```
1. Lee: FRONTEND_FEATURE_QUICK_REFERENCE.md (5 min)
2. Copia 7 templates
3. Implementa usando checklist
4. Valida: FRONTEND_MODULE_CHECKLIST.md
5. Code review
```

### Si necesitas APLICAR en OTRO PROYECTO

```
BACKEND:
1. Copiar documentación Backend (4 archivos)
2. Leer BACKEND_PATTERN_GUIDE.md
3. Usar templates para crear módulos
4. Completar con UseCase Pattern

FRONTEND:
1. Copiar documentación Frontend (4 archivos)
2. Leer FRONTEND_FEATURE_FIRST_GUIDE.md
3. Usar 7 templates para crear features
4. Copiar estructura shared/ + lib/
```

---

## 📊 Estructura General

### Backend Architecture

```
backend/
├── src/
│   ├── app.module.ts
│   │
│   ├── modules/
│   │   └── [feature]/                 (Bounded Context)
│   │       ├── domain/
│   │       │   ├── entities/          (Entidades + Value Objects)
│   │       │   ├── repositories/      (Interfaces del repositorio)
│   │       │   └── services/          (Lógica de dominio)
│   │       │
│   │       ├── application/
│   │       │   ├── dtos/              (DTO de entrada/salida)
│   │       │   ├── usecases/          ⭐ NUEVO: Orquestación por acción
│   │       │   │   ├── create.usecase.ts
│   │       │   │   ├── update.usecase.ts
│   │       │   │   └── ...
│   │       │   ├── services/          (Servicios de aplicación)
│   │       │   └── mappers/           (DTO ← → Dominio)
│   │       │
│   │       ├── infrastructure/
│   │       │   ├── repositories/      (Implementación TypeORM)
│   │       │   ├── persistence/       (Entidades TypeORM)
│   │       │   └── http/              (Clientes HTTP)
│   │       │
│   │       ├── presentation/
│   │       │   └── controllers/       (Controladores NestJS)
│   │       │
│   │       └── [feature].module.ts    (Inyección de dependencias)
│   │
│   ├── shared/
│   │   ├── infrastructure/
│   │   ├── guards/
│   │   ├── decorators/
│   │   ├── filters/
│   │   └── interceptors/
│   │
│   └── config/
│       ├── database/
│       └── ...
```

**Capas Clave**:
1. **Domain**: Lógica pura de negocio
2. **Application**: Orquestación (UseCase Pattern)
3. **Infrastructure**: Detalles técnicos
4. **Presentation**: Controladores HTTP

---

### Frontend Architecture

```
frontend/src/
├── app/                              (SOLO ROUTING - Next.js)
│   ├── page.tsx
│   ├── layout.tsx
│   ├── (dashboard)/
│   │   └── paddy/
│   │       ├── page.tsx
│   │       ├── [feature]/
│   │       │   └── page.tsx          (Renderiza feature)
│   │       └── ...
│   └── api/
│       └── auth/[...nextauth]/
│
├── features/                         (TODA LA LÓGICA)
│   ├── [feature]/
│   │   ├── actions/                  (Server Actions - 'use server')
│   │   │   └── [feature].action.ts
│   │   │
│   │   ├── components/               (Cliente - 'use client')
│   │   │   ├── [Feature]Page.tsx
│   │   │   ├── [Feature]DataGrid.tsx
│   │   │   ├── Create[Feature]Dialog.tsx
│   │   │   └── ...
│   │   │
│   │   ├── types/
│   │   │   └── [feature].types.ts
│   │   │
│   │   └── index.ts                  (Barrel export)
│   │
│   ├── producers/
│   ├── receptions/
│   ├── finances/
│   └── ...
│
├── shared/                           (REUTILIZABLE GLOBALMENTE)
│   ├── components/ui/
│   │   ├── TextField/
│   │   ├── Select/
│   │   ├── Button/
│   │   ├── DataGrid/
│   │   ├── Dialog/
│   │   └── ...
│   │
│   ├── hooks/
│   │   ├── useCan.ts
│   │   └── ...
│   │
│   └── utils/
│       ├── formatters.ts
│       └── validators.ts
│
└── lib/                              (INFRAESTRUCTURA)
    ├── api/
    │   ├── client.ts
    │   └── ...
    ├── auth.config.ts
    └── browser-compat.ts
```

**Capas Clave**:
1. **App**: Routing framework
2. **Features**: Bounded contexts (módulos independientes)
3. **Shared**: Componentes y utilidades reutilizables
4. **Lib**: Infraestructura

---

## 🎯 Principios Clave

### Backend (DDD)

1. **Domain Layer**: Lógica pura (sin frameworks)
2. **UseCase Pattern**: Una acción = Un UseCase
3. **Entities**: Objetos con identidad en el dominio
4. **Value Objects**: Objetos sin identidad, inmutables
5. **Repositories**: Abstracciones para persistencia
6. **Services**: Lógica de aplicación que orquesta

**Regla de Oro**: Un método = Múltiples responsabilidades = PROBLEM ❌
**Solución**: UseCase Pattern = Una responsabilidad = SOLUTION ✅

### Frontend (Feature-First)

1. **App Router**: SOLO rutas (sin lógica)
2. **Features**: Módulos independientes (bounded contexts)
3. **Server Actions**: Mutaciones en servidor (`'use server'`)
4. **Components**: Presentación limpia (sin HTTP)
5. **Shared**: Reutilizable globalmente
6. **Types**: Type-safe en todo

**Regla de Oro**: App router con lógica = PROBLEM ❌
**Solución**: Feature-First con Server Actions = SOLUTION ✅

---

## 📚 Mapeo Rápido de Documentos

### Necesito entender...

| Necesidad | Lee Primero | Luego Lee | Referencia |
|-----------|-------------|-----------|-----------|
| **DDD en general** | BACKEND_PATTERNS_README.md | BACKEND_PATTERN_GUIDE.md | BACKEND_MODULE_CHECKLIST.md |
| **UseCase Pattern** | USECASE_PATTERN_CHANGES.md | BACKEND_PATTERN_GUIDE.md (sec 5) | BACKEND_PATTERN_QUICK_REFERENCE.md (Template 0) |
| **Clean Code Backend** | BACKEND_PATTERN_GUIDE.md | USECASE_PATTERN_CHANGES.md | BACKEND_MODULE_CHECKLIST.md |
| **Feature-First Frontend** | FRONTEND_PATTERNS_README.md | FRONTEND_FEATURE_FIRST_GUIDE.md | FRONTEND_MODULE_CHECKLIST.md |
| **Server Actions** | FRONTEND_FEATURE_FIRST_GUIDE.md (sec 3) | FRONTEND_FEATURE_QUICK_REFERENCE.md (Template 2) | FRONTEND_MODULE_CHECKLIST.md (sec D) |
| **Componentes UI** | FRONTEND_FEATURE_FIRST_GUIDE.md (sec 3.4) | FRONTEND_PATTERNS_README.md | FRONTEND_MODULE_CHECKLIST.md (sec E.4) |

### Necesito implementar...

| Feature Type | Backend Approach | Frontend Approach |
|--------------|-----------------|-------------------|
| **CRUD Simple** | Service (pequeño) | Server Actions + DataGrid |
| **Lógica Compleja** | UseCase Pattern | Server Actions complejos |
| **Query/Report** | Service read-only | Server Actions (fetch) |
| **Validación** | Entity o Value Object | Server Action (no confiar en cliente) |

---

## 🔁 Ciclo de Desarrollo Típico

### Agregar Feature Completa (Backend + Frontend)

**Paso 1: Definición** (Producto)
- [ ] Feature issue/spec escrito
- [ ] Campos definidos
- [ ] Flujos definidos

**Paso 2: Backend** (Dev Backend)
- [ ] Crear módulo DDD
- [ ] Entidades + Value Objects
- [ ] Repositorio
- [ ] UseCases
- [ ] DTOs
- [ ] Controller
- [ ] Tests
- [ ] Validar checklist

**Paso 3: Frontend** (Dev Frontend)
- [ ] Conectar a nueva API
- [ ] Crear types (DTOs)
- [ ] Crear Server Actions
- [ ] Crear componentes
- [ ] Tests
- [ ] Validar checklist

**Paso 4: QA**
- [ ] Test end-to-end
- [ ] Validar flujos
- [ ] Verificar seguridad

**Paso 5: Deploy**
- [ ] Backend → Staging → Production
- [ ] Frontend → Staging → Production
- [ ] Monitoreo

---

## ✅ Validación Completa

### Backend Validation

Usar: **BACKEND_MODULE_CHECKLIST.md**
- [ ] Pre-implementation
- [ ] Folder structure
- [ ] Domain layer
- [ ] Application layer ← UseCase validation aquí
- [ ] Infrastructure layer
- [ ] Presentation layer
- [ ] DTOs
- [ ] Database
- [ ] Tests

### Frontend Validation

Usar: **FRONTEND_MODULE_CHECKLIST.md**
- [ ] Pre-implementation
- [ ] Folder structure
- [ ] Types layer
- [ ] Actions layer (Server Actions)
- [ ] Components layer
- [ ] App router layer
- [ ] Imports & types
- [ ] Barrel exports
- [ ] Performance
- [ ] Security

---

## 🚀 Ejemplo Completo: Agregar Feature "Análisis"

### backend/src/modules/analysis/

```
1️⃣ Domain Layer
- entities/Analysis.ts → Clase con validaciones
- repositories/IAnalysisRepository.ts → Interfaz

2️⃣ Application Layer (UseCase Pattern)
- usecases/CreateAnalysisUseCase.ts
- usecases/UpdateAnalysisUseCase.ts
- dtos/CreateAnalysisDTO.ts
- dtos/AnalysisResponseDTO.ts

3️⃣ Infrastructure Layer
- repositories/AnalysisRepository.ts → TypeORM
- persistence/AnalysisEntity.ts → TypeORM Entity

4️⃣ Presentation Layer
- controllers/AnalysisController.ts → @Controller routes

5️⃣ Module
- analysis.module.ts → Inyecta UseCases + Repository
```

### frontend/src/features/analysis/

```
1️⃣ Types
- types/analysis.types.ts → Interfaces + Payloads

2️⃣ Server Actions
- actions/analysis.action.ts → create, list, update, delete

3️⃣ Components
- components/AnalysisPage.tsx → Página principal
- components/AnalysisDataGrid.tsx → Tabla
- components/CreateAnalysisDialog.tsx → Crear
- components/UpdateAnalysisDialog.tsx → Actualizar

4️⃣ Exports
- index.ts → Barrel export

5️⃣ App Router
- app/paddy/analysis/page.tsx → Renderiza [Feature]Page
```

---

## 📞 Soporte y Referencias

### Dentro del Proyecto

- Backend README: [backend/README.md](backend/README.md)
- Frontend README: [frontend/README.md](frontend/README.md)
- Arquitectura en el código real: Módulos existentes
  - Backend: `/src/modules/producers` (ejemplo real)
  - Frontend: `/src/features/producers` (ejemplo real)

### Externo

- NestJS: https://docs.nestjs.com
- Next.js: https://nextjs.org/docs
- TypeORM: https://typeorm.io
- NextAuth.js: https://next-auth.js.org

---

## 🎉 Resumen

Tienes **documentación completa** para:

✅ **Entender** la arquitectura (conceptos)
✅ **Implementar** nuevas features (templates)
✅ **Validar** código (checklists)
✅ **Aplicar** en otros proyectos (independiente)

**Documentos por rol**:
- 👨‍💼 **Manager**: Lee README de backend y frontend
- 👨‍💻 **Developer**: USA quick reference + checklist
- 👁️ **Code Reviewer**: USA checklist de validación
- 🚀 **Arquitecto**: LEE guides completas

**Próximos pasos**:
1. Compartir documentación con el equipo
2. Usar templates para crear nueva feature
3. Validar con checklist
4. Aplicar en otros proyectos si es necesario

---

**¡Disfruta la documentación!** 🎨🚀

