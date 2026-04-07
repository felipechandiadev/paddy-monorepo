# ✅ Backend Module Implementation Checklist

Use this checklist cuando termines de implementar un nuevo módulo en el backend.

---

## 📋 Pre-Implementation

- [ ] **Nombre del módulo decidido**: ________________________
- [ ] **Bounded context claro**: (Qué área de negocio representa?)
  - _____________________________________________________________________
- [ ] **Features principales identificados**:
  - [ ] Feature 1: ________________________
  - [ ] Feature 2: ________________________
  - [ ] Feature 3: ________________________
- [ ] **Entidades principales identificadas**:
  - [ ] Entity 1: ________________________
  - [ ] Entity 2: ________________________

---

## 📁 Folder Structure

### Carpetas Creadas
- [ ] `src/modules/[feature]/` creada
- [ ] `src/modules/[feature]/domain/` con archivos .entity.ts
- [ ] `src/modules/[feature]/application/` con archivos .service.ts
- [ ] `src/modules/[feature]/dto/` con archivos .dto.ts
- [ ] `src/modules/[feature]/presentation/` con archivos .controller.ts
- [ ] `src/modules/[feature]/[feature].module.ts` en raíz

### Archivos Creados (por archivo requiere validacion)

```
src/modules/[feature]/
├── domain/
│   └── [ ] [feature].entity.ts (Entidad principal)
├── application/
│   └── [ ] [feature].service.ts (Servicio)
├── dto/
│   ├── [ ] create-[feature].dto.ts
│   ├── [ ] update-[feature].dto.ts (opcional)
│   └── [ ] [feature].dto.ts (respuesta)
├── presentation/
│   └── [ ] [feature].controller.ts
└── [ ] [feature].module.ts
```

---

## 🎯 Domain Layer (`domain/*.entity.ts`)

### Estructura de Entidad
- [ ] Clase extiende `BaseEntity` (hereda `createdAt`, `updatedAt`, `deletedAt`)
- [ ] Decorador `@Entity('table_name')` presente
- [ ] PrimaryColumn/PrimaryGeneratedColumn definido:
  - [ ] Tipo: ________________
  - [ ] Estrategia: UUID / Auto-increment / Manual

### Columnas
- [ ] Todas las columnas tienen `@Column()` con tipo correcto
- [ ] Tipos especificados: `'varchar'`, `'uuid'`, `'decimal'`, `'json'`, `'boolean'`, `'date'`
- [ ] Campos opcionales tienen `{ nullable: true }`
- [ ] Decimal/Currency tienen `{ precision: X, scale: 2 }`
- [ ] Timestamp: `createdAt` y `updatedAt` heredados de BaseEntity

### Relaciones
- [ ] Relations definidas con `@ManyToOne()`, `@OneToMany()`, etc.
- [ ] `@JoinColumn()` dónde sea necesario
- [ ] Foreign keys referenciados correctamente

### Métodos de Negocio
- [ ] **Mínimo 2-3 métodos** que representen acciones de negocio
- [ ] Métodos usan **lógica pura** (sin inyección)
- [ ] Métodos **validan invariantes** del dominio
- [ ] **Sin dependencias externas** (BD, HTTP, servicios)

**Ejemplo esperado**:
```typescript
activate(): void {
  if (this.status !== 'inactive') {
    throw new Error('Can only activate inactive entities');
  }
  this.status = 'active';
}
```

### Value Objects (si aplica)
- [ ] Interfaces de Value Objects definidas en entities
- [ ] Value Objects embebidos como JSON o relaciones

**Válida esto**:
```bash
grep -n "class.*{" src/modules/[feature]/domain/[feature].entity.ts
# Debe haber métodos de negocio, no solo getters
```

---

## 💼 Application Layer (`application/*.service.ts` o `usecases/`)

### ⚠️ IMPORTANTE: UseCase Pattern
- [ ] **Decisión**: ¿Usar UseCase Pattern o Service simple?
  - [ ] UseCase (recomendado para lógica compleja)
  - [ ] Service (solo para CRUD simple)

### Si usas UseCase Pattern

#### Estructura de Carpetas
- [ ] `application/usecases/` creada
- [ ] `application/usecases/dtos/` para DTOs de entrada/salida
- [ ] Archivo por UseCase: `[action].usecase.ts`
  - [ ] `create-[feature].usecase.ts`
  - [ ] `update-[feature].usecase.ts`
  - [ ] `delete-[feature].usecase.ts`
  - [ ] `[special-action].usecase.ts` (si aplica)

#### Implementación de UseCase
- [ ] Clase: `@Injectable()` decorator presente
- [ ] Método: `async execute(input: InputDto, userId: string): Promise<OutputDto>`
- [ ] Input DTO: Tipado con fields específicos
- [ ] Output DTO: Tipado con respuesta
- [ ] Lógica clara:
  - [ ] Step 1: Validar entrada
  - [ ] Step 2: Obtener entidad (si aplica)
  - [ ] Step 3: Aplicar lógica
  - [ ] Step 4: Persistir (save/delete)
  - [ ] Step 5: Auditar
  - [ ] Step 6: Retornar output tipado
- [ ] Responsabilidad única: Una acción = Un UseCase
- [ ] Sin métodos adicionales innecesarios

#### Inyección
- [ ] `@InjectRepository(Entity)` para BD
- [ ] `AuditService` inyectado
- [ ] Otros servicios si son necesarios
- [ ] NO múltiples responsabilidades por UseCase

### Si usas Service Pattern (CRUD simple)

#### Inyección de Dependencias
- [ ] `@Injectable()` decorador presente
- [ ] `@InjectRepository(Entity)` para la entidad principal
- [ ] Otros servicios inyectados si son necesarios (AuditService, etc.)

#### Métodos CRUD
- [ ] `async findAll(): Promise<Entity[]>` implementado
- [ ] `async findOne(id): Promise<Entity>` implementado
- [ ] `async create(dto, userId?): Promise<Entity>` implementado
- [ ] `async update(id, dto, userId?): Promise<Entity>` implementado
- [ ] `async delete(id, userId?): Promise<void>` implementado

### Métodos Adicionales (por negocio)
- [ ] Métodos ad-hoc implementados: ________________________
  - [ ] Lógica delegada al dominio donde sea posible
  - [ ] Validaciones adicionales si es necesario
  - [ ] Cada método tiene responsabilidad clara

### Auditoría (Crítico)
- [ ] `auditService.log()` llamada en CADA UseCase:
  - [ ] create/CreateUseCase → log CREATE
  - [ ] update/UpdateUseCase → log UPDATE
  - [ ] delete/DeleteUseCase → log DELETE
  - [ ] custom actions → log ACTION_NAME
- [ ] Log incluye: `action`, `entityId`, `userId`, `metadata` opcional
- [ ] **NO** olvidar auditoría → puntos de penalización en code review

**Verifica**:
```bash
# Si usas UseCase:
find src/modules/[feature]/application/usecases -name "*.usecase.ts" | \
  xargs grep -l "auditService.log"
# Debe tener al menos 1 por UseCase

# Si usas Service:
grep -c "auditService.log" src/modules/[feature]/application/[feature].service.ts
# Debería haber al menos 3 (create, update, delete)
```

### Manejo de Errores
- [ ] `NotFoundException` lanzado cuando entidad no existe
- [ ] `BadRequestException` o custom errors para validaciones
- [ ] Mensajes de error descriptivos

### Transacciones (si es crítico)
- [ ] Operaciones críticas envueltas en transacciones (si aplica)
- [ ] Rollback manejo si es necesario

---

## 📨 DTO Layer (`dto/*.dto.ts`)

### Validación con `class-validator`
- [ ] Import: `import { IsNotEmpty, IsEmail, ... } from 'class-validator'`

### CreateDto
- [ ] Campos requeridos tienen `@IsNotEmpty()`
- [ ] Email tiene `@IsEmail()` si aplica
- [ ] Strings tienen `@Length()` o `@MinLength()`
- [ ] Números tienen `@IsNumber()` o `@Min()/@Max()`
- [ ] Enums tienen `@IsEnum()`

### UpdateDto
- [ ] Todos los campos son opcionales
- [ ] Mismas validaciones que CreateDto (pero en campos opcionales)
- [ ] O usar `Partial<CreateDto>` si es simple

### ResponseDto
- [ ] Todos los campos públicos/listos para respuesta HTTP
- [ ] Sin datos sensibles (passwords, tokens)
- [ ] Tipos coinciden con entidad

**Verifica**:
```bash
# Validadores presentes
grep "@Is" src/modules/[feature]/dto/*.dto.ts
# Debería haber al menos 5 validadores
```

---

## 🎮 Controller / Presentation (`presentation/*.controller.ts`)

### Estructura
- [ ] `@Controller('api/v1/[feature-plural]')` presente
- [ ] Constructor injected:
  - [ ] Si usas UseCase: `private readonly [action]UseCase`
  - [ ] Si usas Service: `private readonly [feature]Service`

### Inyección de Dependencias
- [ ] **UseCase Pattern**: Inyectar direct UseCases
  ```typescript
  constructor(
    private readonly createUseCase: CreateFeatureUseCase,
    private readonly updateUseCase: UpdateFeatureUseCase,
  ) {}
  ```
- [ ] **Service Pattern**: Inyectar Service (si lo necesitas)
  ```typescript
  constructor(
    private readonly featureService: FeatureService,
  ) {}
  ```

### Rutas GET (Lectura)
- [ ] `@Get()` para listar todo
  - [ ] Retorna `T[]`
- [ ] `@Get(':id')` para obtener uno
  - [ ] `@Param('id')` extrae ID
  - [ ] Retorna `T`

### Rutas POST (Crear)
- [ ] `@Post()` presente
- [ ] `@Body()` con DTO validado
- [ ] `@UseGuards(JwtAuthGuard, RolesGuard)` aplicado
- [ ] `@Roles(RoleEnum.ADMIN)` o roles específicos
- [ ] `@GetUser()` para extraer usuario autenticado
- [ ] `@HttpCode(201)` para respuesta de creación
- [ ] **Delegación correcta**:
  - [ ] Si usas UseCase: `return this.createUseCase.execute(dto, user.id)`
  - [ ] Si usas Service: `return this.service.create(dto, user.id)`

### Rutas PUT/PATCH (Actualizar)
- [ ] `@Put(':id')` o `@Patch(':id')`
- [ ] `@Param('id')` extrae ID
- [ ] `@Body()` con DTO
- [ ] Guards y roles aplicados
- [ ] **Delegación correcta**:
  - [ ] Si usas UseCase: `return this.updateUseCase.execute({id, ...dto}, user.id)`
  - [ ] Si usas Service: `return this.service.update(id, dto, user.id)`
- [ ] Retorna entidad actualizada (o OutputDto si usas UseCase)

### Rutas DELETE (Eliminar)
- [ ] `@Delete(':id')`
- [ ] `@HttpCode(204)` o similar
- [ ] Guards y roles aplicados
- [ ] **Delegación correcta**:
  - [ ] Si usas UseCase: `return this.deleteUseCase.execute(id, user.id)`
  - [ ] Si usas Service: `return this.service.delete(id, user.id)`
- [ ] Retorno: `void` o sin contenido

### Métodos Adicionales
- [ ] Rutas PUT/PATCH para acciones específicas: ________________________
  - Ejemplo: `@Patch(':id/activate')`, `@Post(':id/archive')`

### Mapeo Entidad → DTO
- [ ] Helper privado `private mapToDto(entity: T): TDto` o similar
- [ ] Usado en **todos** los returns
- [ ] No retorna entidad raw directamente

**Verifica**:
```bash
# Guards presentes en métodos protegidos
grep "@Post\|@Put\|@Delete" src/modules/[feature]/presentation/[feature].controller.ts -A 2
# Debería haber @UseGuards después @Post/@Put/@Delete
```

---

## 📦 Module (`[feature].module.ts`)

### Imports
- [ ] `TypeOrmModule.forFeature([Entity])` - registra entidad
- [ ] Otros módulos importados si son necesarios (AuditModule, etc.)

### Providers (Crítico: Usar Patrón Correcto)

**Si usas UseCase Pattern:**
- [ ] Los UseCases enlistados en `providers`:
  ```typescript
  providers: [
    CreateFeatureUseCase,
    UpdateFeatureUseCase,
    DeleteFeatureUseCase,
  ]
  ```
- [ ] NO registres un Service genérico

**Si usas Service Pattern:**
- [ ] Service enlistado en `providers: [Service]`

### Controllers
- [ ] Controller enlistado en `controllers: [Controller]`

### Exports (Criterio)
- [ ] Si usas UseCase: Exportar los UseCases que otros módulos necesiten
  ```typescript
  exports: [
    CreateFeatureUseCase,
    UpdateFeatureUseCase,
  ]
  ```
- [ ] Si usas Service: Exportar service si es usado por otros módulos
  ```typescript
  exports: [Service]
  ```
- [ ] (Si no es usado por otros, no exporte)

**Template esperado**:
```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([Entity]),
    OtherModule,
  ],
  providers: [Service],
  controllers: [Controller],
  exports: [Service], // Si aplica
})
export class FeatureModule {}
```

---

## 🎯 UseCase Pattern Validation (Si aplica)

### Decisión Arquitectónica
- [ ] **Decisión documentada**: ¿Por qué UseCases en este módulo?
  - [ ] Porque tiene lógica compleja (3+ pasos)
  - [ ] Porque queremos reutilizabilidad cross-módulo
  - [ ] Porque el Service sería muy gordo (30+ métodos)

### Estructura de UseCase
- [ ] Carpeta `application/usecases/` creada
- [ ] Subcarpeta `dtos/` con Input/Output DTOs
- [ ] Un archivo per UseCase: `[action].usecase.ts`
- [ ] Nombre describes action: Create, Update, Delete, Custom

### Cada UseCase
- [ ] Clase: `@Injectable()`
- [ ] Método: `async execute(input: InputDto, userId: string): Promise<OutputDto>`
- [ ] Responsabilidad única (una acción = un UseCase)
- [ ] Steps claros y secuenciales (comentados)
- [ ] Validaciones en primer step
- [ ] Persistencia en middle steps
- [ ] Auditoría (SIEMPRE, no olvidar)
- [ ] Output tipado (no Entity raw)

### Input/Output DTOs de UseCase
- [ ] Input DTO: Contiene campos necesarios para acción
- [ ] Output DTO: Contiene resultado de acción
- [ ] NO reuses Response DTOs para output (usar DTOs específicos)

### Inyección en Controller
- [ ] UseCases inyectados directamente:
  ```typescript
  constructor(
    private readonly createUseCase: CreateFeatureUseCase,
    private readonly updateUseCase: UpdateFeatureUseCase,
  ) {}
  ```
- [ ] **Métodos llaman execute()**:
  ```typescript
  @Post()
  async create(@Body() dto, @GetUser() user) {
    return this.createUseCase.execute(dto, user.id); // ← Correcto
  }
  ```

### Registro en Module
- [ ] Todos los UseCases en `providers: [...]`
- [ ] UseCases exportados si son necesarios en otro módulo
- [ ] **NO** registrar Service genérico

### Testing de UseCase
- [ ] Test por UseCase (no un test para todo el service)
- [ ] Tests para success path
- [ ] Tests para error paths (validaciones)
- [ ] Verificar auditoría se llama
- [ ] Mock de dependencias (repository, auditService)

**Verifica**: Cada UseCase tiene mínimo 2 tests (success + error)

---

### Protected Routes
- [ ] Routes que modifican datos (`POST`, `PUT`, `DELETE`) tienen guards:
  - [ ] `@UseGuards(JwtAuthGuard, RolesGuard)`
  - [ ] `@Roles(RoleEnum.ADMIN)` o rol específico
  
### Public Routes
- [ ] Rutas de lectura (`GET`, `POST` login) NO tienen guards
  - [ ] O tienen `@UseGuards(JwtAuthGuard)` solo si requieren auth

### User Extraction
- [ ] Métodos que necesitan usuario actual usan `@GetUser() user: User`
- [ ] Usuario pasado a service para auditoría

**Valida**:
```bash
# Contar guards por ruta
grep "@Post\|@Put\|@Delete" src/modules/[feature]/presentation/[feature].controller.ts
# Todas las modificaciones deben tener guards
```

---

## 🗄️ Database Integration

### TypeORM Configuration
- [ ] Entidad importada en TypeOrmModule
- [ ] Columnas con tipos correctos
- [ ] Relaciones definidas aunque sea una tabla simple

### Migraciones
- [ ] [ ] Migración generada:
  ```bash
  npm run typeorm migration:generate -- src/migrations/Create[Feature]
  ```
- [ ] Migración ejecutada:
  ```bash
  npm run db:migrate
  ```
- [ ] Tabla visible en BD:
  ```bash
  mysql -u root -p paddy -e "DESCRIBE [table_name];"
  ```

### Seeders (si aplica)
- [ ] Seeder creado en `src/infrastructure/persistence/seeders/`
- [ ] Datos iniciales agregados (opcional pero recomendado)

---

## 🧪 Testing

### Unit Tests
- [ ] Archivo `[feature].service.spec.ts` creado en `test/unit/`
- [ ] Tests para métodos principales:
  - [ ] `create()` success path
  - [ ] `create()` error path (validación)
  - [ ] `findOne()` success
  - [ ] `findOne()` not found
  - [ ] `update()` success
  - [ ] `delete()` success

### E2E Tests
- [ ] Archivo `[feature].controller.e2e-spec.ts` creado en `test/e2e/`
- [ ] Tests para rutas:
  - [ ] `GET /api/v1/[features]` - listar
  - [ ] `GET /api/v1/[features]/:id` - obtener uno
  - [ ] `POST /api/v1/[features]` - crear (con auth)
  - [ ] `PUT /api/v1/[features]/:id` - actualizar (con auth)
  - [ ] `DELETE /api/v1/[features]/:id` - eliminar (con auth)
  - [ ] Error cases (404, 401, 403)

### Test Execution
- [ ] Tests corren sin errores:
  ```bash
  npm test
  ```
- [ ] E2E tests corren:
  ```bash
  npm run test:e2e -- [feature]
  ```

---

## 📝 Documentation

### README o Inline Docs
- [ ] Método de service comentado con JSDoc (opcional pero recomendado):
  ```typescript
  /**
   * Obtener por ID
   * @param id - UUID de la entidad
   * @returns Entidad encontrada
   * @throws NotFoundException si no existe
   */
  async findOne(id: string): Promise<Entity> { ... }
  ```

### API Routes Documentadas
- [ ] Rutas listadas en README o comentario del controller:
  ```typescript
  /**
   * GET /api/v1/[features]
   * Listar todos
   */
  @Get()
  async findAll() { ... }
  ```

---

## 🔗 Integration

### Module Registration
- [ ] Module registrado en `src/app.module.ts`:
  ```typescript
  imports: [
    // ... otros
    FeatureModule, // ← Agregado aquí
  ]
  ```
- [ ] App compilado sin errores:
  ```bash
  npm run build
  ```

### Dependencies
- [ ] Si el módulo depende de otro, módulo dependencia está importado en `.module.ts`
- [ ] No hay circular dependencies:
  ```bash
  npm start:dev 2>&1 | grep -i "circular"
  # No debería haber output
  ```

---

## ✨ Final Validation

### Compilación
- [ ] Sin errores TypeScript:
  ```bash
  npm run build
  ```
- [ ] Sin warnings de module resolution:
  ```bash
  npm start:dev 2>&1 | head -20
  ```

### Rutas Accesibles
- [ ] Server inicia:
  ```bash
  npm run start:dev
  ```
- [ ] Rutas GET respondent:
  ```bash
  curl http://localhost:3000/api/v1/[features]
  ```
- [ ] Rutas POST requieren auth (401 sin token):
  ```bash
  curl -X POST http://localhost:3000/api/v1/[features]
  # Should return 401 Unauthorized
  ```

### Auditoría Funciona
- [ ] Crear entidad y verificar log en tabla `audit_logs`:
  ```bash
  mysql paddy -u root -p -e "SELECT * FROM audit_logs WHERE action = 'CREATE_[FEATURE]';"
  ```

---

## 📝 Sign-Off

**Developer Name**: ________________________  
**Date**: ________________________  
**Module Name**: ________________________  

### Final Checklist
- [ ] **Todos los ✓ arriba verificados**
- [ ] **Código pasó code review** (si aplica)
- [ ] **Tests pasaron**
- [ ] **Documentación completa**
- [ ] **Sin TODOs pendientes en archivos**

**Ready for Production**: [ ] Yes [ ] No

---

## 🆘 Common Issues & Fixes

| Síntoma | Causa | Fix |
|---------|-------|-----|
| `Cannot find module '@modules/...'` | Path alias incorrecto | Verificar `tsconfig.json` |
| `TS4053 error` | Tipo no exportado en dominio | Exportar interfaz/tipo |
| `Circular dependency` | Módulo A importa B, B importa A | Mover shared code a `shared/` |
| `Column not found` | Migración no ejecutada | `npm run db:migrate` |
| `401 Unauthorized` | JWT token inválido o expirado | Hacer login primero, usar token en header `Authorization: Bearer <token>` |
| `Type 'X' has no properties in common with type 'Y'` | DTO y Entity tipos incompatibles | Revisar mapeo en `mapToDto()` |

---

## 📚 References

- **Full Guide**: `BACKEND_PATTERN_GUIDE.md`
- **Quick Ref**: `BACKEND_PATTERN_QUICK_REFERENCE.md`
- **Example Module**: `src/modules/producers/` (modelo a seguir)
- **Shared Guards**: `src/shared/guards/`
- **Shared Decorators**: `src/shared/decorators/`
- **Base Entity**: `src/shared/domain/base.entity.ts`

---

**Última revisión**: Marzo 2026

¡Listo! Seguiste el patrón DDD correctamente. 🎉
