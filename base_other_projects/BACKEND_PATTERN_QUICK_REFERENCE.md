# 🚀 Backend Pattern Quick Reference

**TL;DR Version of BACKEND_PATTERN_GUIDE.md**

---

## 5-Minute Module Creation

```bash
# 1. Create folder structure
mkdir -p src/modules/myfeature/{application,domain,dto,presentation}

# 2. Create these 5 files (templates below)
# → domain/myfeature.entity.ts
# → application/myfeature.service.ts
# → dto/{create-myfeature.dto.ts, myfeature.dto.ts}
# → presentation/myfeature.controller.ts
# → myfeature.module.ts

# 3. Register in app.module.ts
# → Add MyFeatureModule to imports[]

# 4. Done! Test with:
npm run start:dev
```

---

## File Templates

### Template 0: UseCase (ANTES DE SERVICE!)
**`application/usecases/[action].usecase.ts`**
```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MyFeature } from '../../domain/myfeature.entity';
import { AuditService } from '@modules/audit/application/audit.service';

// Input DTO
export class CreateMyFeatureUseCaseInput {
  name: string;
  // ... otros campos
}

// Output DTO
export class CreateMyFeatureUseCaseOutput {
  id: string;
  name: string;
  message: string;
}

/**
 * UseCase: Crear MyFeature
 * Una responsabilidad única: crear y persistir una entidad
 */
@Injectable()
export class CreateMyFeatureUseCase {
  constructor(
    @InjectRepository(MyFeature)
    private repo: Repository<MyFeature>,
    private auditService: AuditService,
  ) {}

  async execute(
    input: CreateMyFeatureUseCaseInput,
    userId: string,
  ): Promise<CreateMyFeatureUseCaseOutput> {
    // Step 1: Validar entrada
    if (!input.name || input.name.length < 3) {
      throw new Error('Invalid name');
    }

    // Step 2: Crear entidad
    const entity = new MyFeature();
    entity.name = input.name;

    // Step 3: Persistir
    const created = await this.repo.save(entity);

    // Step 4: Auditar
    await this.auditService.log({
      action: 'CREATE_MYFEATURE',
      entityId: created.id,
      userId,
    });

    // Step 5: Retornar output tipado
    return {
      id: created.id,
      name: created.name,
      message: 'Created successfully',
    };
  }
}
```

### Template 1: Entity (`domain/myfeature.entity.ts`)
```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from '@shared/domain/base.entity';

@Entity('myfeatures')
export class MyFeature extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  status: 'active' | 'inactive';

  // Business logic methods
  activate(): void {
    this.status = 'active';
  }

  deactivate(): void {
    this.status = 'inactive';
  }
}
```

### Template 2: DTOs
**`dto/create-myfeature.dto.ts`**
```typescript
import { IsNotEmpty, Length } from 'class-validator';

export class CreateMyFeatureDto {
  @IsNotEmpty()
  @Length(3, 100)
  name: string;
}
```

**`dto/myfeature.dto.ts`**
```typescript
export class MyFeatureDto {
  id: string;
  name: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Template 3: Service (`application/myfeature.service.ts`)
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MyFeature } from '../domain/myfeature.entity';
import { CreateMyFeatureDto } from '../dto/create-myfeature.dto';
import { AuditService } from '@modules/audit/application/audit.service';

@Injectable()
export class MyFeatureService {
  constructor(
    @InjectRepository(MyFeature)
    private repo: Repository<MyFeature>,
    private auditService: AuditService,
  ) {}

  async create(dto: CreateMyFeatureDto, userId: string): Promise<MyFeature> {
    const entity = new MyFeature();
    entity.name = dto.name;
    entity.status = 'active';
    
    const created = await this.repo.save(entity);
    await this.auditService.log({
      action: 'CREATE_MYFEATURE',
      entityId: created.id,
      userId,
    });
    return created;
  }

  async findAll(): Promise<MyFeature[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<MyFeature> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Not found');
    return entity;
  }

  async update(
    id: string,
    dto: Partial<CreateMyFeatureDto>,
    userId: string,
  ): Promise<MyFeature> {
    const entity = await this.findOne(id);
    if (dto.name) entity.name = dto.name;

    const updated = await this.repo.save(entity);
    await this.auditService.log({
      action: 'UPDATE_MYFEATURE',
      entityId: id,
      userId,
    });
    return updated;
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
    await this.auditService.log({
      action: 'DELETE_MYFEATURE',
      entityId: id,
      userId,
    });
  }
}
```

### Template 4: Controller (`presentation/myfeature.controller.ts`)
```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
import { Roles } from '@shared/decorators/roles.decorator';
import { GetUser } from '@shared/decorators/get-user.decorator';
import { RoleEnum } from '@shared/enums/role.enum';
import { User } from '@modules/users/domain/user.entity';

// ← Inyectar UseCases directamente, no Service
import { CreateMyFeatureUseCase } from '../application/usecases/create-myfeature.usecase';
import { UpdateMyFeatureUseCase } from '../application/usecases/update-myfeature.usecase';
import { DeleteMyFeatureUseCase } from '../application/usecases/delete-myfeature.usecase';
import { CreateMyFeatureDto } from '../dto/create-myfeature.dto';

@Controller('api/v1/myfeatures')
export class MyFeatureController {
  constructor(
    private readonly createUseCase: CreateMyFeatureUseCase,
    private readonly updateUseCase: UpdateMyFeatureUseCase,
    private readonly deleteUseCase: DeleteMyFeatureUseCase,
  ) {}

  @Get()
  async findAll() {
    // ReadOnly queries pueden ir en QueryService
    // o directo en repositorio si es simple
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // ReadOnly query
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async create(
    @Body() dto: CreateMyFeatureDto,
    @GetUser() user: User,
  ) {
    // Delegar al UseCase
    return this.createUseCase.execute(dto, user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateMyFeatureDto>,
    @GetUser() user: User,
  ) {
    // Delegar al UseCase
    return this.updateUseCase.execute({ id, ...dto }, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async delete(
    @Param('id') id: string,
    @GetUser() user: User,
  ) {
    // Delegar al UseCase
    return this.deleteUseCase.execute(id, user.id);
  }
}
```

### Template 5: Module (`myfeature.module.ts`)
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyFeature } from './domain/myfeature.entity';
import { AuditModule } from '@modules/audit/audit.module';

// UseCases (accioness de negocio)
import { CreateMyFeatureUseCase } from './application/usecases/create-myfeature.usecase';
import { UpdateMyFeatureUseCase } from './application/usecases/update-myfeature.usecase';
import { DeleteMyFeatureUseCase } from './application/usecases/delete-myfeature.usecase';

// Controller
import { MyFeatureController } from './presentation/myfeature.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MyFeature]), AuditModule],
  // ← Registrar UseCases aquí, no Service
  providers: [
    CreateMyFeatureUseCase,
    UpdateMyFeatureUseCase,
    DeleteMyFeatureUseCase,
  ],
  controllers: [MyFeatureController],
  exports: [
    CreateMyFeatureUseCase,
    UpdateMyFeatureUseCase,
    DeleteMyFeatureUseCase,
  ],
})
export class MyFeatureModule {}
```
```

---

## 🎯 UseCase Pattern: Cuándo Usar

**UseCase = Una acción de negocio = Una clase**

### ✅ USA UseCase para:
```typescript
// Crear (con validaciones múltiples)
class CreateProducerUseCase { }

// Actualizar (con lógica de negocio)
class UpdateProducerUseCase { }

// Relacionadas (agregar cuenta bancaria)
class AddBankAccountUseCase { }

// Acciones especiales (calcular deuda, procesar pago)
class CalculateDebtUseCase { }
class ProcessPaymentUseCase { }
```

### ❌ NO necesitas UseCase para:
```typescript
// Consultas simples (GET)
// Usa QueryHandler o directo de repositorio

// CRUD trivial (solo llamar a repo)
// Usa directamente Service si es muy simple

// Cuando solo delegas al dominio
// UseCase es overhead
```

### Estructura con UseCase

```
application/
├── usecases/
│   ├── dtos/
│   │   └── [action].usecase.dto.ts
│   ├── create-[feature].usecase.ts     ← Inyectar en controller
│   ├── update-[feature].usecase.ts     ← Inyectar en controller
│   └── [action].usecase.ts             ← Inyectar en controller
└── (NO necesitas service.ts)
```

---

| Layer | File | Responsibility | ❌ Never Do |
|-------|------|-----------------|-----------|
| **Domain** | `entity.ts` | Business logic, validation | ❌ Inject services, access DB |
| **Application** | `service.ts` | Orchestrate domain, persist, audit | ❌ Handle HTTP, format responses |
| **DTO** | `dto.ts` | Define HTTP contract, validation | ❌ Business logic, DB access |
| **Presentation** | `controller.ts` | Handle HTTP, guards, auth | ❌ Business logic, complex DB |
| **Module** | `.module.ts` | Wire everything together | ❌ Business logic, exports |

---

## Common Decorators

```typescript
// Controllers
@Get()                                 // GET  /route
@Post()                                // POST /route
@Put(':id')                            // PUT  /route/:id
@Delete(':id')                         // DELETE /route/:id
@UseGuards(JwtAuthGuard, RolesGuard)   // Require JWT + Role
@Roles(RoleEnum.ADMIN)                 // Require specific role
@HttpCode(201)                         // Custom status code

// Parameters
@Param('id') id: string               // From URL: /users/123
@Body() dto: CreateDto                 // From HTTP body
@Query('page') page: number           // From query: ?page=1
@Headers('authorization') auth: string // From headers

// Inject user
@GetUser() user: User                  // Current authenticated user

// Injection
@InjectRepository(Entity)              // TypeORM repository
property: Repository<Entity>
```

---

## Guards & Auth Flow

```typescript
// Always use this combo for protected routes:
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleEnum.ADMIN)  // optional, if role check needed
async myMethod(@GetUser() user: User) {
  // user is now authenticated
}

// Public routes: no @UseGuards()
@Get('public-data')
async publicMethod() {
  // No guards = anyone can access
}
```

---

## Database Operations Quick Reference

```typescript
// Create
const entity = new MyFeature();
entity.name = 'value';
await this.repo.save(entity);

// Read
const one = await this.repo.findOne({ where: { id } });
const all = await this.repo.find({ order: { createdAt: 'DESC' } });

// Update
entity.name = 'new value';
await this.repo.save(entity);

// Delete (hard)
await this.repo.delete(id);

// Soft delete (entity must extend BaseEntity)
entity.isActive = false;
await this.repo.save(entity);
```

---

## Common Errors & Fixes

| Error | Solution |
|-------|----------|
| `Cannot find module '@modules/...'` | Check `tsconfig.json` path aliases |
| `Circular dependency` | Extract shared logic to `shared/` |
| `Column not found` | Run `npm run db:migrate` |
| `TS4053: Return type incompatible` | Export interface in domain layer |
| `Auth token expired` | Token is 15min, refresh with `/auth/refresh` |

---

## Folder Naming Rules

```bash
# ✅ CORRECT
src/modules/myfeature/domain/myfeature.entity.ts
src/modules/myfeature/application/myfeature.service.ts
src/modules/myfeature/dto/create-myfeature.dto.ts
src/modules/myfeature/presentation/myfeature.controller.ts

# ❌ WRONG
src/myfeature/entity.ts                          # Missing module structure
src/modules/MyFeature/application/...             # CamelCase folder
src/modules/my-feature/...                        # kebab-case (use camelCase)
src/modules/myfeatures/domain/MyFeature.entity.ts # Inconsistent naming
```

---

## Running Commands

```bash
# Start
npm run start:dev              # Dev mode with hot reload

# Database
npm run db:setup               # Migrate + Seed
npm run db:migrate             # Just migrate
npm run typeorm migration:generate -- src/migrations/Name

# Testing
npm test                        # Unit tests
npm run test:e2e              # E2E tests
npm run test:cov              # Coverage

# Build
npm run build                  # Compile TypeScript
npm run format                 # Prettier formatting
npm run lint                   # ESLint check
```

---

## Import Aliases

```typescript
// Instead of: ../../../shared/guards/jwt-auth.guard
// Use:
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';

// Instead of: ../../modules/users/domain/user.entity
// Use:
import { User } from '@modules/users/domain/user.entity';
```

Defined in `tsconfig.json`:
```json
"paths": {
  "@/*": ["src/*"],
  "@modules/*": ["src/modules/*"],
  "@shared/*": ["src/shared/*"],
  "@infrastructure/*": ["src/infrastructure/*"]
}
```

---

## Remember: DDD Core Rules

1. **Domain is pure** - No frameworks, no DI, business logic only
2. **Application orchestrates** - Uses domain + persistence
3. **Controller delegates** - Never has business logic
4. **DTO validates** - Only input/output format
5. **Module wires** - Brings everything together

Follow these 5 rules, and you'll have maintainable code.

---

**Next Step**: Copy a module (`producers/`) and rename it (via `producers.module.ts` → `myfeature.module.ts`). Fill the templates above and you're done in 10 minutes.

**Full Guide**: See `BACKEND_PATTERN_GUIDE.md` for detailed explanations.
