# 🎯 UseCase Pattern - Resumen de Cambios

**Fecha**: Marzo 2026  
**Propósito**: Integración completa del patrón UseCase en la documentación DDD para evitar "Fat Services"

---

## ✨ Qué se Agregó a la Documentación

### 1. **BACKEND_PATTERN_GUIDE.md**

#### Nueva Sección: "Patrón UseCase - Evitar Fat Services"
- **Ubicación**: Línea ~715-1150
- **Contenido**:
  - ❌ El Problema: Services saturados con 50+ métodos
  - ✅ La Solución: UseCase Pattern
  - 📝 Concepto Clave: Una acción = Una clase
  - 🏗️ Estructura de UseCase
  - 💻 Implementación Completa: 6 pasos full ejemplo
    - Step 1: Input/Output DTOs
    - Step 2: El UseCase Mismo (CreateProducerUseCase)
    - Step 3: Otro UseCase (UpdateProducerUseCase)
    - Step 4: UseCase Complejo (AddBankAccountUseCase)
    - Step 5: Registrar en Module
    - Step 6: Usar en Controller
  - 📊 Tabla de Ventajas (SmUseCase vs Service tradicional)
  - 🗂️ Estructura Completa Recomendada
  - 🧪 Testing de UseCases (ejemplo completo)
  - ⚖️ Cuándo Usar UseCase vs Service

**Ejemplo de código agregado**:
```typescript
// CreateProducerUseCase - Ejemplo completo con 6 steps
@Injectable()
export class CreateProducerUseCase {
  constructor(
    @InjectRepository(Producer)
    private readonly producerRepository: Repository<Producer>,
    private readonly auditService: AuditService,
  ) {}

  async execute(
    input: CreateProducerUseCaseInput,
    userId: string,
  ): Promise<CreateProducerUseCaseOutput> {
    // Step 1: Validar RUT único
    // Step 2: Crear instancia de dominio
    // Step 3: Persistir
    // Step 4: Auditar
    // Step 5: Retornar output
  }
}
```

---

### 2. **BACKEND_PATTERN_QUICK_REFERENCE.md**

#### Nuevo Template 0: UseCase
- **Ubicación**: Antes del Template 1 (Entity)
- **Contenido**:
  - Template copy-paste de un UseCase
  - Input/Output DTOs integrados
  - 5 Steps clara  (Validar, Crear, Persistir, Auditar, Retornar)
  - Comments explanatorios

#### Updated Template 4: Controller
- **Cambio**: Ahora inyecta UseCases en lugar de Service
  ```typescript
  // Antes:
  constructor(private readonly service: MyFeatureService) {}

  // Ahora:
  constructor(
    private readonly createUseCase: CreateMyFeatureUseCase,
    private readonly updateUseCase: UpdateMyFeatureUseCase,
  ) {}
  ```
- **Métodos**: Llaman `usecase.execute()` en lugar de `service.create()`

#### Updated Template 5: Module  
- **Cambio**: Registra UseCases en providers, no Service
  ```typescript
  // Antes:
  providers: [MyFeatureService]

  // Ahora:
  providers: [
    CreateMyFeatureUseCase,
    UpdateMyFeatureUseCase,
    DeleteMyFeatureUseCase,
  ]
  ```

#### New Section: "UseCase Pattern: Cuándo Usar"
- Criterios claros para decidir UseCase vs Service
- Ejemplos de qué usar UseCase (create, update, custom actions)
- Ejemplos de qué NO necesita UseCase (GET simple)

---

### 3. **BACKEND_MODULE_CHECKLIST.md**

#### Updated Section: "Application Layer"
- **Cambio**: Ahora ofrece dosalternativas
  - **Option A: UseCase Pattern** (recomendado para lógica compleja)
  - **Option B: Service Pattern** (para CRUD simple)
  - Checklist específico para cada opción

#### New Section: "UseCase Pattern Validation"
- ☑️ Decisión arquitectónica documentada
- ☑️ Estructura de UseCase validada
- ☑️ Cada UseCase cumple criterios
- ☑️ Input/Output DTOs tipados
- ☑️ Inyección correcta en Controller
- ☑️ Registro correcto en Module
- ☑️ Testing de UseCase (mínimo 2 tests por UseCase)

#### Updated Section: "Controller Presentation"
- **Cambio**: Especifica inyección de UseCases
  ```typescript
  // Validar que inyecta correcto:
  - Si usas UseCase: private readonly [action]UseCase
  - Si usas Service: private readonly [feature]Service
  ```
- **Routers POST/PUT/DELETE**: Validar delegación correcta
  ```typescript
  // Si UseCase: this.createUseCase.execute(dto, user.id)
  // Si Service: this.service.create(dto, user.id)
  ```

#### Updated Section: "Module"
- **Cambio**: Específica qué registrar según patrón
  - Si UseCase: Registrar UseCases en providers
  - Si Service: Registrar Service en providers

---

### 4. **BACKEND_PATTERNS_README.md**

#### Updated Table of Contents
- Agregué "UseCase Pattern" en la lista

#### New Section: "Concepto Clave: UseCase Pattern"
- Antes: Fat Service con 50+ métodos
- Después: UseCases independientes
- Visual comparison
- **3 Ventajas principales**: SRP, Testable, Reutilizable
- Criterios: Cuándo usar

#### Updated Section: "Principios Clave"
- Agregué principio #6: **UseCase Pattern**
- Con enlace directo a la sección en BACKEND_PATTERN_GUIDE.md

---

## 🎯 Cambios Clave en la Documentación

| Documento | Cambio | Para Qué | Dónde |
|-----------|--------|----------|-------|
| **GUIDE** | Nueva sección de 400 líneas sobre UseCase | Explicación completa con ejemplos | Línea ~715-1150 |
| **QUICK REF** | Template 0 + Updated Templates 4,5 | Copy-paste ready UseCases | Línea ~17-280 |
| **CHECKLIST** | Sección UseCase validation + updated sections | Validar implementación correcta | Pre-implementation |
| **README** | Updated "Principios" + "Concepto Clave" | Visibilidad del patrón | Line 190-220 |

---

## 🚀 Cómo Usar Esta Nueva Documentación

### Para Principiantes

1. **Lee**: BACKEND_PATTERNS_README.md → Sección "Concepto Clave"
2. **Entiende**: BACKEND_PATTERN_GUIDE.md → Sección "UseCase Pattern"
3. **Implementa**: BACKEND_PATTERN_QUICK_REFERENCE.md → Template 0 (UseCase)
4. **Valida**: BACKEND_MODULE_CHECKLIST.md → Sección "UseCase Pattern Validation"

### Para Experimentados

1. **Template**: BACKEND_PATTERN_QUICK_REFERENCE.md → Template 0
2. **Copiar**: Renombra y adapta
3. **Check**: BACKEND_MODULE_CHECKLIST.md → UseCase Pattern section

---

## 📊 Estructura Actual vs Nueva

### Antes (Sin UseCase)
```
application/
├── [feature].service.ts  (50+ métodos - FAT SERVICE ❌)
└── NO había pattern para evitar esto
```

### Después (Con UseCase)
```
application/
├── usecases/
│   ├── dtos/
│   │   └── *.usecase.dto.ts
│   ├── create-[feature].usecase.ts
│   ├── update-[feature].usecase.ts
│   ├── delete-[feature].usecase.ts
│   └── [action].usecase.ts
└── (opcional) [feature].service.ts (si lo necesitas)
```

---

## ✅ Validaciones Agregadas

El **CHECKLIST** ahora valida:

1. **Decisión Arquitectónica**: ¿Por qué UseCases en este módulo?
2. **Estructura**: Carpeta `usecases/`, `dtos/`, archivos por UseCase
3. **Responsabilidad Única**: Una acción = Un UseCase
4. **Input/Output DTOs**: Tipados correctamente  
5. **Method Signature**: `async execute(input: Input, userId: string): Promise<Output>`
6. **Steps Secuenciales**: Validar → Obtener → Aplicar → Persistir → Auditar → Retornar
7. **Auditoría CRÍTICA**: `auditService.log()` obligatorio
8. **Inyección Correcta**: En Controller y Module
9. **Testing**: Mínimo 2 tests por UseCase
10. **No Fat Services**: Service malo si tiene 20+ métodos

---

## 🎓 Ejemplos de UseCase Comunes

```typescript
// Crear - Siempre UseCase (validaciones, persistencia, auditoría)
CreateProducerUseCase
CreateReceptionUseCase
CreateAdvanceUseCase

// Actualizar - Casi siempre UseCase (lógica de cambio)
UpdateProducerUseCase
UpdateReceptionStatusUseCase

// Delete - Siempre UseCase (soft delete + auditoría)
DeleteProducerUseCase

// Acciones Complejas - SIEMPRE UseCase
CalculateProducerDebtUseCase
ProcessSettlementUseCase
ApproveReceptionUseCase
RejectReceptionUseCase

// Queries/Gets - NO necesita UseCase (puede ser Service o directo repo)
GetProducerUseCase ❌ (No necesita, muy simple)
ListProducersUseCase ❌ (No necesita, es lectura)
```

---

## 🔗 Referencias Rápidas

**Para iniciar con UseCases:**
- [BACKEND_PATTERN_GUIDE.md - Sección UseCase](./BACKEND_PATTERN_GUIDE.md#patrón-usecase---evitar-fat-services)
- [BACKEND_PATTERN_QUICK_REFERENCE.md - Template 0](./BACKEND_PATTERN_QUICK_REFERENCE.md#template-0-usecase)
- [BACKEND_MODULE_CHECKLIST.md - UseCase Validation](./BACKEND_MODULE_CHECKLIST.md#-usecase-pattern-validation-si-aplica)

---

## 💡 Tip: Migración de Services a UseCases

Si tienes un Service existente grande:

```bash
# Paso 1: Identifica métodos CRUD vs Custom
grep "async [a-z]*(" src/modules/[feature]/application/[feature].service.ts

# Paso 2: Crea carpeta usecases
mkdir -p src/modules/[feature]/application/usecases/dtos

# Paso 3: Extrae cada método a su UseCase
# Por ejemplo: service.create() → CreateFeatureUseCase

# Paso 4: Actualiza Controller para inyectar UseCases
# Por ejemplo: this.service.create() → this.createUseCase.execute()

# Paso 5: Actualiza Module para registrar UseCases
# Por ejemplo: providers: [Service] → providers: [UseCase1, UseCase2, ...]

# Paso 6: Prueba todo
npm run build && npm test
```

---

## 📝 Tabla de Comparación: Service vs UseCase

| Aspecto | Service Tradicional | UseCase Pattern |
|--------|-------------------|-----------------|
| **Métodos** | 30-50+ | 1 (execute) |
| **Responsabilidad** | Múltiple | Única |
| **Testing** | Complejo (todo acoplado) | Simple (aislado) |
| **Reusabilidad** | Difícil | Fácil |
| **Tamaño del archivo** | 500+ líneas | 50-150 líneas |
| **Entendimiento** | Leer código para entender | Nombre = acción = uso |
| **Mantener** | Difícil (cambio en un método = riesgo) | Fácil (cambio aislado) |
| **Para CRUD simple** | ✅ OK | ❌ Overkill |
| **Para lógica compleja** | ❌ Fat Service | ✅ Perfecto |

---

## 🎉 Conclusión

La documentación ahora **ESPECIFICA COMPLETAMENTE**:

1. ✅ **Qué es UseCase Pattern**
2. ✅ **Cuándo usarlo**
3. ✅ **Cómo implementarlo** (templates ready)
4. ✅ **Cómo validar** (checklist)
5. ✅ **Testing de UseCases**
6. ✅ **Ejemplos reales** (3 UseCases completos)

**Los desarrolladores ya NO tienen excusa para crear Fat Services.** 🚀

---

**Próximos Pasos Recomendados:**

1. Leer sección UseCase en BACKEND_PATTERN_GUIDE.md
2. Mirar ejemplos de código completos
3. Usar templates en BACKEND_PATTERN_QUICK_REFERENCE.md
4. Aplicar validaciones de BACKEND_MODULE_CHECKLIST.md
5. Implementar en nuevo módulo
6. Code review verificando checklist

