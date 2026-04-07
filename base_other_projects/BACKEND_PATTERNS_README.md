# 🏛️ Backend Architecture Patterns & Guidelines

**Repositorio oficial de patrones DDD para proyectos NestJS**

Este directorio contiene la documentación completa sobre cómo implementar, mantener y escalar aplicaciones backend siguiendo Domain-Driven Design (DDD) en NestJS.

---

## 📚 Documentos Disponibles

### 1. **[BACKEND_PATTERN_GUIDE.md](./BACKEND_PATTERN_GUIDE.md)** 
**La Guía Completa (30 min read)**

Guía exhaustiva con explicaciones detalladas de cada capa de la arquitectura DDD.

**Contiene:**
- Visión general de DDD
- Principios fundamentales (Ubiquitous Language, Bounded Contexts, etc.)
- Estructura de carpetas completa
- Patrones por capa (Domain, Application, DTO, Presentation, Module)
- **🎯 PATRÓN UseCase (Evitar Fat Services)** ← NUEVO
  - Qué es un UseCase
  - Cuándo usarlo vs Service tradicional
  - Estructura completa con ejemplos
  - Testing de UseCases
- Ejemplo práctico completo: crear módulo de "Inspections"
- Convenciones de código (naming, métodos, rutas)
- Seguridad & autorización
- Infraestructura & persistencia (TypeORM, migraciones, seeders)
- Testing (unitarios y E2E)
- Checklist de implementación
- Troubleshooting común

**Cuándo usar:**
- ✅ Primera vez implementando DDD
- ✅ Necesitas entender **por qué** hacemos algo
- ✅ Querés ver ejemplos completos de código
- ✅ Buscas referencia detallada de un patrón
- ✅ Estás enseñando a otros desarrolladores

---

### 2. **[BACKEND_PATTERN_QUICK_REFERENCE.md](./BACKEND_PATTERN_QUICK_REFERENCE.md)**
**Referencia Rápida (5 min read)**

"Hoja de trucos" - Una sola página con lo esencial.

**Contiene:**
- Creación de módulo en 5 minutos (paso a paso)
- 5 templates de código copy-paste listos (Entity, DTOs, Service, Controller, Module)
- Tabla de responsabilidades por capa
- Decoradores comunes
- Guards & auth flow
- Operaciones de BD
- Errores comunes & soluciones
- Comandos npm
- Alias de imports

**Cuándo usar:**
- ✅ Necesitas recordar la estructura rápido
- ✅ Vas a implementar un módulo nuevo
- ✅ Buscas template copy-paste
- ✅ Necesitas solucionar algo rápido
- ❌ No para aprender desde cero

---

### 3. **[BACKEND_MODULE_CHECKLIST.md](./BACKEND_MODULE_CHECKLIST.md)**
**Validación & QA (10 min)**

Checklist interactivo para validar que implementaste correctamente.

**Contiene:**
- Pre-implementación (requisitos antes de empezar)
- Validación de estructura de carpetas
- Validación Domain layer (entidades, métodos, Value Objects)
- Validación Application layer (dependencias, CRUD, auditoría, errores)
- Validación DTO (validadores, tipos)
- Validación Presentation (guards, roles, mapeos)
- Validación Module (wiring)
- Validación seguridad
- Validación BD (migraciones, seeders)
- Validación testing
- Validación documentación
- Sign-off final

**Cuándo usar:**
- ✅ Después de implementar un módulo
- ✅ Antes de hacer merge/PR
- ✅ Para code review
- ✅ Para asegurar consistencia del equipo
- ✅ Onboarding de nuevos desarrolladores

---

## 🚀 Guía de Inicio Rápido

### Si es tu **primera vez** implementando un módulo:

1. **Lee primero**: [BACKEND_PATTERN_GUIDE.md](./BACKEND_PATTERN_GUIDE.md) - Secciones:
   - "Visión General" (2 min)
   - "Principios DDD" (5 min)
   - "Estructura de Carpetas" (3 min)
   - "Patrones por Capa" (15 min con ejemplos)

2. **Usa templates**: [BACKEND_PATTERN_QUICK_REFERENCE.md](./BACKEND_PATTERN_QUICK_REFERENCE.md) - Secc "File Templates"

3. **Valida**: [BACKEND_MODULE_CHECKLIST.md](./BACKEND_MODULE_CHECKLIST.md) - Marcar todos ☑️

---

### Si tienes **experiencia** y necesitas crear rápido:

1. **Mira**: [BACKEND_PATTERN_QUICK_REFERENCE.md](./BACKEND_PATTERN_QUICK_REFERENCE.md) - Secc "5-Minute Module Creation"

2. **Copia**: Los 5 templates de código

3. **Valida**: [BACKEND_MODULE_CHECKLIST.md](./BACKEND_MODULE_CHECKLIST.md)

---

### Si necesitas **resolver un problema**:

1. **Búsqueda rápida**: [BACKEND_PATTERN_QUICK_REFERENCE.md](./BACKEND_PATTERN_QUICK_REFERENCE.md) - Secc "Common Errors & Fixes"

2. **Búsqueda detallada**: [BACKEND_PATTERN_GUIDE.md](./BACKEND_PATTERN_GUIDE.md) - Secc "Troubleshooting"

3. **Código real**: Mira ejemplos en `src/modules/producers/` o `src/modules/operations/`

---

## 🎯 Concepto Clave: UseCase Pattern (Evita Fat Services)

**Problema**: Los Services pueden tener 50+ métodos (fat services)

**Solución**: UseCase Pattern - Cada acción de negocio = Una clase independiente

```typescript
// ❌ SIN UseCase Pattern (FAT SERVICE)
ProducersService {
  create()
  update()
  delete()
  addBankAccount()
  removeBankAccount()
  toggleActive()
  calculateDebt()
  sendNotification()
  generateReport()
  exportToExcel()
  // ... 40 métodos más
}

// ✅ CON UseCase Pattern (LIMPIO)
CreateProducerUseCase { execute() }
UpdateProducerUseCase { execute() }
DeleteProducerUseCase { execute() }
AddBankAccountUseCase { execute() }
RemoveBankAccountUseCase { execute() }
// Cada uno responsable de UNA cosa
```

**Ventajas:**
- 🎯 Responsabilidad única (SRP)
- 🧪 Fácil de testear (una cosa = un test)
- 🔄 Reutilizable (UseCases entre módulos)
- 📖 Fácil de navegar (archivo = acción)

**¿Cuándo usar?**
- ✅ Lógica compleja (3+ pasos)
- ✅ Que sea testeable independientemente
- ❌ NO para queries simples (GET, búsquedas)

[→ Ver sección completa en BACKEND_PATTERN_GUIDE.md](./BACKEND_PATTERN_GUIDE.md#patrón-usecase---evitar-fat-services)

---

```
┌──────────────────────────────────────────────────────────┐
│             PRESENTATION (controllers.ts)                 │
│  Maneja HTTP, Guards (JWT, Roles), valida DTOs          │
├──────────────────────────────────────────────────────────┤
│             APPLICATION (services.ts)                     │
│  Orquesta dominio, maneja persistencia, auditoría        │
├──────────────────────────────────────────────────────────┤
│ DOMAIN (entity.ts)  │  DTO (dto.ts)  │  MODULE (*.ts)    │
│ Lógica negocio      │  Contrato HTTP │  Wiring           │
│ Pura, sin deps      │  Validación    │  Exports          │
└──────────────────────────────────────────────────────────┘
         ↓ Responsabilidad ↓
    Clear separation of concerns
```

---

## 🎯 Módulos Implementados (Ejemplos de Referencia)

Estos módulos están **100% implementados siguiendo estas guías**:

| Módulo | Ruta | Descripción |
|--------|------|-------------|
| **Auth** | `src/modules/auth/` | Autenticación JWT + NextAuth |
| **Users** | `src/modules/users/` | Gestión de funcionarios |
| **Producers** | `src/modules/producers/` | 👑 Módulo de referencia (mejor ejemplo) |
| **Configuration** | `src/modules/configuration/` | RiceTypes, Seasons, Templates |
| **Operations** | `src/modules/operations/` | Receptions, AnalysisRecords |
| **Finances** | `src/modules/finances/` | Advances, Transactions, Settlements |
| **Analytics** | `src/modules/analytics/` | Reportes (read-only) |
| **Audit** | `src/modules/audit/` | Logging transversal |

**👑 Mejor referencia**: `src/modules/producers/` - Úsalo como template

---

## 📋 Estructura de Archivos Esperada

```
backend/
├── BACKEND_PATTERN_GUIDE.md              # ← TÚ ESTÁS AQUÍ
├── BACKEND_PATTERN_QUICK_REFERENCE.md    # ← Referencia rápida
├── BACKEND_MODULE_CHECKLIST.md           # ← Validación
│
├── src/
│   ├── modules/
│   │   ├── [nueva-feature]/              # Nuevo módulo sigue el patrón
│   │   │   ├── domain/
│   │   │   │   └── feature.entity.ts
│   │   │   ├── application/
│   │   │   │   └── feature.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-feature.dto.ts
│   │   │   │   └── feature.dto.ts
│   │   │   ├── presentation/
│   │   │   │   └── feature.controller.ts
│   │   │   └── feature.module.ts
│   │   │
│   │   ├── producers/                    # Referencia: módulo completo
│   │   │   ├── domain/
│   │   │   ├── application/
│   │   │   ├── dto/
│   │   │   ├── presentation/
│   │   │   └── producers.module.ts
│   │   │
│   │   └── ... (otros módulos)
│   │
│   ├── shared/                           # Código compartido
│   │   ├── domain/base.entity.ts        # BaseEntity con createdAt, etc.
│   │   ├── enums/                       # Enums globales
│   │   ├── guards/                      # JwtAuthGuard, RolesGuard
│   │   ├── decorators/                  # @GetUser(), @Roles()
│   │   ├── filters/                     # HttpExceptionFilter
│   │   └── interceptors/                # TransformInterceptor
│   │
│   └── infrastructure/
│       ├── database/
│       │   ├── datasource.ts
│       │   └── config.ts
│       └── persistence/
│           ├── migrations/
│           └── seeders/
│
├── test/
│   ├── integration/
│   │   └── [feature].e2e-spec.ts
│   └── unit/
│       └── [feature].service.spec.ts
│
├── package.json
├── tsconfig.json
└── .env.example
```

---

## 🔑 Principios Clave (Resumen)

1. **Domain es PURO**
   - Sin frameworks, sin inyección, sin BD
   - Solo lógica de negocio
   - Métodos representan acciones reales

2. **Application ORQUESTA**
   - Usa dominio + persistencia
   - Maneja transacciones
   - Audita cambios

3. **DTO VALIDA**
   - Contrato HTTP
   - Clase-validator
   - Sin lógica

4. **Controller DELEGA**
   - Maneja HTTP only
   - Guards + autorización
   - Mapea entidades a DTOs

5. **Module CONECTA**
   - Registra dependencias
   - Importa otros módulos
   - Exporta servicios

### 🎯 BONUS: UseCase Pattern (NUEVO - Evita Fat Services)
6. **UseCase = Una acción de negocio = Una clase**
   - No fat services (50+ métodos en un Service)
   - Single Responsibility Principle (SRP)
   - Cada UseCase testeable independientemente
   - Reutilizable cross-módulos
   - **[→ Ver sección completa aquí](./BACKEND_PATTERN_GUIDE.md#patrón-usecase---evitar-fat-services)**

---

## 🛠️ Herramientas & Comandos

### Crear nuevo módulo (desde cero)

```bash
# 1. Crear estructura
mkdir -p src/modules/myfeature/{domain,application,dto,presentation}

# 2. Usar templates de BACKEND_PATTERN_QUICK_REFERENCE.md

# 3. Registrar en app.module.ts
echo "MyFeatureModule" >> imports[]

# 4. Compilar
npm run build

# 5. Validar con checklist
# → BACKEND_MODULE_CHECKLIST.md
```

### Generar migración de BD

```bash
npm run typeorm migration:generate -- src/migrations/Create[Feature]

# Ejecutar
npm run db:migrate
```

### Ejecutar tests

```bash
npm test                          # Unit tests
npm run test:e2e                 # E2E tests
npm run test:cov                 # Coverage
```

---

## ❓ FAQ

### P: ¿Dónde pongo lógica de negocio compleja?
**R**: En Domain layer (`entity.ts`). Métodos de la clase, NO servicios.

### P: ¿Debo validar en Domain o DTO?
**R**: 
- DTO: Validación de formato (email, length, type)
- Domain: Validación de reglas de negocio (RUT único, status permitido)

### P: ¿Cómo relaciono dos módulos?
**R**: 
- Módulo A importa ServiceB de Módulo B
- ServiceA injected ServiceB
- ✅ NO acceder entidades de otro módulo directamente

### P: ¿Cómo auditar cambios?
**R**: Inyectar AuditService, llamar `auditService.log()` en create/update/delete

### P: ¿Qué roles existen?
**R**: `enum RoleEnum { ADMIN, LABORATORISTA, PESAJE }`  
Definido en `src/shared/enums/role.enum.ts`

### P: ¿Cómo sé cuándo crear un nuevo módulo vs Feature dentro de uno existente?
**R**: 
- **Nuevo módulo**: Si es un bounded context completamente separado
- **Dentro de módulo**: Si es parte del mismo dominio pero funcionalidad relacionada

---

## 🎓 Learning Path

### Principiante (0-1 semana)
1. Lee: Sección "Principios DDD" en GUIDE
2. Estudia: Módulo `producers/` como referencia
3. Ejercicio: Implementa módulo simple (Categories, Tags, etc.)
4. Valida: Con CHECKLIST

### Intermedio (1-2 semanas)
1. Lee: Sección "Patrones por Capa" en GUIDE
2. Estudia: Módulo `operations/` (más complejo)
3. Ejercicio: Implementa módulo con relaciones
4. Valida: Con CHECKLIST + code review

### Avanzado (2-4 semanas)
1. Lee: GUIDE completa + referencias externas
2. Estudia: Módulo `finances/` (más complejo)
3. Ejercicio: Implementa módulo crítico con transacciones
4. Valida: Code review + tests

---

## 🤝 Contributing

Al agregar cambios al backend:

1. **Sigue el patrón**: BACKEND_PATTERN_GUIDE.md
2. **Respeta la estructura**: Carpetas descritas arriba
3. **Usa los templates**: BACKEND_PATTERN_QUICK_REFERENCE.md
4. **Valida completamente**: BACKEND_MODULE_CHECKLIST.md
5. **Prueba**: Tests unitarios + E2E
6. **Documenta**: Código comentado, rutas documentadas

---

## 📞 Support

**Si tienes preguntas:**
1. Busca en TROUBLESHOOTING sections de los guías
2. Mira el código en modules/ (ejemplos reales)
3. Pregunta al equipo (Slack o reuniones)

---

## 📝 Version History

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | Mar 2026 | Documentación inicial de patrones DDD |
| - | - | - |

---

## 🎯 Objetivo

**Lograr que ANY desarrollador pueda:**
- ✅ Entender la arquitectura en 30 minutos
- ✅ Crear un nuevo módulo correcto en 1 hora
- ✅ Mantener el código consistente y escalable
- ✅ Onboarding sin fricción

---

**Empeza aquí** → [BACKEND_PATTERN_GUIDE.md](./BACKEND_PATTERN_GUIDE.md)

---

**Última actualización**: Marzo 2026  
**Autores**: Paddy Development Team
