# 🏗️ Guía de Patrones Backend - Arquitectura DDD en NestJS

**Versión**: 1.0  
**Última Actualización**: Marzo 2026  
**Propósito**: Guiar implementación consistente del patrón Domain-Driven Design (DDD) en proyectos NestJS

---

## 📋 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Principios DDD](#principios-ddd)
3. [Estructura de Carpetas](#estructura-de-carpetas)
4. [Patrones por Capa](#patrones-por-capa)
5. [Patrón UseCase (IMPORTANTE)](#patrón-usecase---evitar-fat-services)
6. [Ejemplo Práctico: Crear un Nuevo Módulo](#ejemplo-práctico-crear-un-nuevo-módulo)
7. [Convenciones de Código](#convenciones-de-código)
8. [Seguridad & Autorización](#seguridad--autorización)
9. [Infraestructura & Persistencia](#infraestructura--persistencia)
10. [Testing](#testing)
11. [Checklist de Implementación](#checklist-de-implementación)

---

## Visión General

Este proyecto implementa **Domain-Driven Design (DDD)** con NestJS, organizando la lógica de negocio en módulos independientes y cohesivos. Cada módulo representa un **bounded context** diferente, con responsabilidades claras y bien definidas.

### Beneficios del Enfoque DDD

✅ **Mantenibilidad**: Lógica de negocio clara y centralizada  
✅ **Escalabilidad**: Módulos independientes pueden crecer sin afectar otros  
✅ **Testing**: Cada capa tiene responsabilidades testables  
✅ **Colaboración**: Lenguaje ubicuo entre desarrolladores  
✅ **Reusabilidad**: Shared layer centraliza código común  

---

## Principios DDD

### 1. **Ubiquitous Language** (Lenguaje Ubicuo)
- Usar términos de negocio consistentes en código, documentación y conversaciones
- Ejemplo: `Producer` (no `Supplier`), `Reception` (no `Intake`), `Advance` (no `Loan`)

### 2. **Bounded Contexts** (Contextos Delimitados)
- Cada módulo es independiente con su propio dominio
- Comunicación clara entre módulos (servicios exportados)
- No acceso directo a entidades de otros módulos

### 3. **Entities vs Value Objects**
- **Entities**: Tienen identidad única (id), representan áreas de negocio grandes
  ```typescript
  Producer // Identidad: rut
  Reception // Identidad: id único
  ```
- **Value Objects**: Sin identidad, inmutables, definen características
  ```typescript
  BankAccount // Valor embebido en Producer
  PriceRange // Valor para análisis
  ```

### 4. **Aggregates & Aggregate Roots**
- **Aggregate Root**: Control de consistencia del dominio
  ```typescript
  Producer
    ├── bankAccounts (Value Object embebido)
    └── transactions (referenciadas por id)
  ```
- Las transacciones solo ocurren en el root

---

## Estructura de Carpetas

```
backend/
├── src/
│   ├── modules/                          # Lógica de negocio
│   │   ├── auth/                         # Autenticación (bounded context)
│   │   │   ├── application/              # UseCases/Services
│   │   │   │   └── auth.service.ts
│   │   │   ├── domain/                   # Entidades
│   │   │   │   └── (no entidades, solo lógica)
│   │   │   ├── dto/                      # Data Transfer Objects
│   │   │   │   ├── login.dto.ts
│   │   │   │   └── register.dto.ts
│   │   │   ├── presentation/             # Controllers
│   │   │   │   └── auth.controller.ts
│   │   │   └── auth.module.ts            # Orquestador
│   │   │
│   │   ├── producers/                    # Productores (bounded context)
│   │   │   ├── application/
│   │   │   │   └── producers.service.ts
│   │   │   ├── domain/
│   │   │   │   └── producer.entity.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-producer.dto.ts
│   │   │   │   ├── update-producer.dto.ts
│   │   │   │   └── producer.dto.ts
│   │   │   ├── presentation/
│   │   │   │   └── producers.controller.ts
│   │   │   └── producers.module.ts
│   │   │
│   │   ├── operations/                   # Receptions (core)
│   │   │   ├── application/
│   │   │   │   ├── receptions.service.ts
│   │   │   │   └── analysis-records.service.ts
│   │   │   ├── domain/
│   │   │   │   ├── reception.entity.ts
│   │   │   │   └── analysis-record.entity.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-reception.dto.ts
│   │   │   │   ├── analysis-record.dto.ts
│   │   │   │   └── ...
│   │   │   ├── presentation/
│   │   │   │   ├── receptions.controller.ts
│   │   │   │   └── analysis-records.controller.ts
│   │   │   └── operations.module.ts
│   │   │
│   │   ├── configuration/                # Settings globales
│   │   │   ├── application/
│   │   │   │   ├── rice-types.service.ts
│   │   │   │   ├── seasons.service.ts
│   │   │   │   └── ...
│   │   │   ├── domain/
│   │   │   │   ├── rice-type.entity.ts
│   │   │   │   ├── season.entity.ts
│   │   │   │   └── ...
│   │   │   ├── presentation/
│   │   │   └── configuration.module.ts
│   │   │
│   │   ├── finances/                     # Financiero
│   │   │   ├── application/
│   │   │   │   ├── advances.service.ts
│   │   │   │   ├── transactions.service.ts
│   │   │   │   └── settlements.service.ts
│   │   │   ├── domain/
│   │   │   │   ├── advance.entity.ts
│   │   │   │   ├── transaction.entity.ts
│   │   │   │   └── settlement.entity.ts
│   │   │   ├── dto/
│   │   │   ├── presentation/
│   │   │   └── finances.module.ts
│   │   │
│   │   ├── analytics/                    # Reportes (read-only)
│   │   │   ├── application/
│   │   │   │   └── analytics.service.ts
│   │   │   ├── presentation/
│   │   │   │   └── analytics.controller.ts
│   │   │   └── analytics.module.ts
│   │   │
│   │   └── audit/                        # Cross-cutting
│   │       ├── application/
│   │       │   └── audit.service.ts
│   │       ├── domain/
│   │       │   └── audit-log.entity.ts
│   │       └── audit.module.ts
│   │
│   ├── shared/                           # Código reutilizable (compartido)
│   │   ├── domain/
│   │   │   └── base.entity.ts            # Entidad base con createdAt, etc.
│   │   ├── enums/
│   │   │   ├── role.enum.ts
│   │   │   ├── reception-status.enum.ts
│   │   │   └── ...
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts         # Verificar token JWT
│   │   │   └── roles.guard.ts            # Verificar roles
│   │   ├── decorators/
│   │   │   ├── get-user.decorator.ts     # Extraer usuario actual
│   │   │   └── roles.decorator.ts        # Marcar requerimientos de rol
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts  # Formatear errores
│   │   ├── interceptors/
│   │   │   └── transform.interceptor.ts  # Envolver respuestas
│   │   ├── utils/
│   │   │   ├── validators.ts             # validateRut(), etc.
│   │   │   └── formatters.ts             # formatCLP(), etc.
│   │   └── types/
│   │       └── index.ts                  # Tipos globales
│   │
│   ├── infrastructure/                   # Configuración técnica
│   │   ├── database/
│   │   │   ├── datasource.ts             # TypeORM DataSource
│   │   │   └── config.ts                 # Configuración BD
│   │   └── persistence/
│   │       ├── migrations/               # Cambios de esquema
│   │       └── seeders/                  # Datos iniciales
│   │
│   ├── main.ts                           # Entry point Bootstrap
│   ├── app.module.ts                     # Orquestador principal
│   └── config/
│       └── environment.config.ts         # Validación .env
│
├── test/                                 # Tests E2E
├── package.json
├── tsconfig.json
├── .env.example
└── .env (git-ignored)
```

---

## Patrones por Capa

### 📦 **CAPA 1: DOMAIN (Dominio)**

**Responsabilidad**: Entidades y lógica de negocio puro

#### Archivo: `producer.entity.ts`
```typescript
import { Entity, PrimaryColumn, Column, BaseEntity } from 'typeorm';
import { BaseEntity as DomainEntity } from '@shared/domain/base.entity';

@Entity('producers')
export class Producer extends DomainEntity {
  @PrimaryColumn('varchar', { length: 20 })
  rut: string; // Identidad única

  @Column('varchar')
  name: string;

  @Column('varchar', { nullable: true })
  email: string;

  @Column('json', { default: [] })
  bankAccounts: BankAccount[]; // Value Objects embebidos

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  totalDebt: number;

  @Column('boolean', { default: true })
  isActive: boolean;

  // Métodos de negocio (lógica pura, sin dependencias externas)
  addBankAccount(account: BankAccount): void {
    if (!account || !account.accountNumber) {
      throw new Error('Invalid bank account');
    }
    this.bankAccounts.push(account);
  }

  removeBankAccount(index: number): void {
    if (index < 0 || index >= this.bankAccounts.length) {
      throw new Error('Invalid index');
    }
    this.bankAccounts.splice(index, 1);
  }

  calculateTotalDebt(): number {
    // Lógica de negocio puro
    return this.bankAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  }
}

// Value Object (Sin identidad, inmutable)
export interface BankAccount {
  bankName: string;
  accountType: 'Cuenta Corriente' | 'Cuenta de Ahorros';
  accountNumber: string;
  accountHolder: string;
  balance?: number;
}
```

**Principios de Domain:**
- ✅ Contiene lógica de negocio PURA
- ✅ NO depende de bases de datos, frameworks o HTTP
- ✅ Métodos representan acciones de negocio
- ✅ Valida invariantes del dominio
- ❌ NO llama a servicios, APIs, o BD
- ❌ NO tiene dependencias inyectadas

---

### 💼 **CAPA 2: APPLICATION (Aplicación)**

**Responsabilidad**: Orquestar el dominio, manejar casos de uso, persistencia

#### Archivo: `producers.service.ts`
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producer } from '../domain/producer.entity';
import { CreateProducerDto } from '../dto/create-producer.dto';
import { UpdateProducerDto } from '../dto/update-producer.dto';
import { AuditService } from '@modules/audit/application/audit.service';

@Injectable()
export class ProducersService {
  constructor(
    @InjectRepository(Producer)
    private readonly producerRepository: Repository<Producer>,
    private readonly auditService: AuditService, // Inyectar otros servicios
  ) {}

  /**
   * Crear un productor
   * Caso de uso: Alta inicial de productor
   */
  async create(
    dto: CreateProducerDto,
    userId: string,
  ): Promise<Producer> {
    // 1. Validar RUT único
    const existing = await this.producerRepository.findOne({
      where: { rut: dto.rut },
    });
    if (existing) {
      throw new Error('RUT already exists');
    }

    // 2. Crear instancia del dominio
    const producer = new Producer();
    producer.rut = dto.rut;
    producer.name = dto.name;
    producer.email = dto.email;
    producer.bankAccounts = [];
    producer.isActive = true;

    // 3. Persistir
    const created = await this.producerRepository.save(producer);

    // 4. Auditar
    await this.auditService.log({
      action: 'CREATE_PRODUCER',
      entityId: created.rut,
      userId,
      metadata: { rut: created.rut },
    });

    return created;
  }

  /**
   * Actualizar un productor
   */
  async update(
    rut: string,
    dto: UpdateProducerDto,
    userId: string,
  ): Promise<Producer> {
    // 1. Recuperar entidad
    const producer = await this.findByRut(rut);

    // 2. Aplicar cambios (mutaciones del dominio)
    if (dto.name !== undefined) producer.name = dto.name;
    if (dto.email !== undefined) producer.email = dto.email;

    // 3. Persistir
    const updated = await this.producerRepository.save(producer);

    // 4. Auditar
    await this.auditService.log({
      action: 'UPDATE_PRODUCER',
      entityId: rut,
      userId,
      metadata: { changes: dto },
    });

    return updated;
  }

  /**
   * Agregar cuenta bancaria
   */
  async addBankAccount(
    rut: string,
    account: BankAccount,
    userId: string,
  ): Promise<Producer> {
    const producer = await this.findByRut(rut);

    // Delegar al dominio
    try {
      producer.addBankAccount(account);
    } catch (error) {
      throw new Error(error.message);
    }

    const updated = await this.producerRepository.save(producer);

    await this.auditService.log({
      action: 'ADD_BANK_ACCOUNT',
      entityId: rut,
      userId,
      metadata: { bankName: account.bankName },
    });

    return updated;
  }

  /**
   * Listar todos los productores activos
   */
  async findAll(): Promise<Producer[]> {
    return this.producerRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  /**
   * Obtener por RUT
   */
  async findByRut(rut: string): Promise<Producer> {
    const producer = await this.producerRepository.findOne({
      where: { rut },
    });

    if (!producer) {
      throw new NotFoundException(`Producer with RUT ${rut} not found`);
    }

    return producer;
  }

  /**
   * Soft delete
   */
  async delete(rut: string, userId: string): Promise<void> {
    const producer = await this.findByRut(rut);
    producer.isActive = false;
    await this.producerRepository.save(producer);

    await this.auditService.log({
      action: 'DELETE_PRODUCER',
      entityId: rut,
      userId,
    });
  }
}

// Importar BankAccount del dominio
import { BankAccount } from '../domain/producer.entity';
```

**Principios de Application:**
- ✅ Orquesta el dominio
- ✅ Maneja persistencia
- ✅ Coordina dependencias (otros servicios, BD)
- ✅ Implementa casos de uso
- ✅ Maneja excepciones y validaciones
- ❌ NO contiene lógica compleja de negocio (eso está en Domain)
- ❌ NO maneja HTTP directamente (eso es Controllers)

---

### 🎯 **CAPA 3: DTO (Transfer Objects)**

**Responsabilidad**: Definir estructura de datos en entrada/salida HTTP

#### Archivo: `create-producer.dto.ts`
```typescript
import { IsNotEmpty, IsEmail, Length } from 'class-validator';

export class CreateProducerDto {
  @IsNotEmpty()
  @Length(9, 12, { message: 'RUT must be 9-12 characters' })
  rut: string; // "12345678-9"

  @IsNotEmpty()
  @Length(3, 100)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
```

#### Archivo: `producer.dto.ts` (Respuesta)
```typescript
export class ProducerDto {
  rut: string;
  name: string;
  email: string;
  bankAccounts: BankAccountDto[];
  totalDebt: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class BankAccountDto {
  bankName: string;
  accountType: string;
  accountNumber: string;
  accountHolder: string;
}
```

**Principios de DTO:**
- ✅ Contienen validación con `class-validator`
- ✅ Definen estructura esperada de HTTP
- ✅ Se usan en Controllers (input/output)
- ✅ Pueden transformar datos para presentación
- ❌ NO contienen lógica de negocio
- ❌ NO acceden a base de datos

---

### 🎮 **CAPA 4: PRESENTATION (Presentación)**

**Responsabilidad**: Manejar HTTP, autenticación, validación de entrada

#### Archivo: `producers.controller.ts`
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
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
import { Roles } from '@shared/decorators/roles.decorator';
import { GetUser } from '@shared/decorators/get-user.decorator';
import { ProducersService } from '../application/producers.service';
import { CreateProducerDto } from '../dto/create-producer.dto';
import { UpdateProducerDto } from '../dto/update-producer.dto';
import { ProducerDto } from '../dto/producer.dto';
import { RoleEnum } from '@shared/enums/role.enum';
import { User } from '@modules/users/domain/user.entity';

@Controller('api/v1/producers')
export class ProducersController {
  constructor(private readonly producersService: ProducersService) {}

  /**
   * GET /producers
   * Listar todos los productores (público, lectura)
   */
  @Get()
  async findAll(): Promise<ProducerDto[]> {
    const producers = await this.producersService.findAll();
    return producers.map(this.mapToDto);
  }

  /**
   * GET /producers/:rut
   */
  @Get(':rut')
  async findOne(@Param('rut') rut: string): Promise<ProducerDto> {
    const producer = await this.producersService.findByRut(rut);
    return this.mapToDto(producer);
  }

  /**
   * POST /producers
   * Crear nuevo productor (solo ADMIN)
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @HttpCode(201)
  async create(
    @Body() dto: CreateProducerDto,
    @GetUser() user: User,
  ): Promise<ProducerDto> {
    try {
      const producer = await this.producersService.create(dto, user.id);
      return this.mapToDto(producer);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * PUT /producers/:rut
   * Actualizar productor (solo ADMIN)
   */
  @Put(':rut')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async update(
    @Param('rut') rut: string,
    @Body() dto: UpdateProducerDto,
    @GetUser() user: User,
  ): Promise<ProducerDto> {
    const producer = await this.producersService.update(rut, dto, user.id);
    return this.mapToDto(producer);
  }

  /**
   * DELETE /producers/:rut
   * Soft delete (solo ADMIN)
   */
  @Delete(':rut')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @HttpCode(204)
  async delete(
    @Param('rut') rut: string,
    @GetUser() user: User,
  ): Promise<void> {
    await this.producersService.delete(rut, user.id);
  }

  /**
   * POST /producers/:rut/bank-accounts
   * Agregar cuenta bancaria
   */
  @Post(':rut/bank-accounts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async addBankAccount(
    @Param('rut') rut: string,
    @Body() account: BankAccountDto,
    @GetUser() user: User,
  ): Promise<ProducerDto> {
    const producer = await this.producersService.addBankAccount(
      rut,
      account,
      user.id,
    );
    return this.mapToDto(producer);
  }

  /**
   * Helper: Mapear entidad a DTO
   */
  private mapToDto(producer: Producer): ProducerDto {
    return {
      rut: producer.rut,
      name: producer.name,
      email: producer.email,
      bankAccounts: producer.bankAccounts,
      totalDebt: producer.totalDebt,
      isActive: producer.isActive,
      createdAt: producer.createdAt,
      updatedAt: producer.updatedAt,
    };
  }
}
```

**Principios de Presentation:**
- ✅ Maneja solicitudes HTTP
- ✅ Aplica Guards (@UseGuards)
- ✅ Aplica autenticación y autorización
- ✅ Valida DTOs (class-validator)
- ✅ Mapea entidades a DTOs
- ✅ Devuelve respuestas formateadas
- ❌ NO contiene lógica de negocio
- ❌ NO accede directamente a BD
- ❌ NO maneja errores técnicos complejos

---

### 📦 **CAPA 5: MODULE (Orquestador)**

**Responsabilidad**: Ensamblar las capas y exportar servicios

#### Archivo: `producers.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProducersService } from './application/producers.service';
import { ProducersController } from './presentation/producers.controller';
import { Producer } from './domain/producer.entity';
import { AuditModule } from '@modules/audit/audit.module'; // Importar módulo externo

@Module({
  imports: [
    TypeOrmModule.forFeature([Producer]), // Registrar entidades
    AuditModule, // Importar otros módulos
  ],
  providers: [ProducersService], // Inyectable
  controllers: [ProducersController], // Maneja HTTP
  exports: [ProducersService], // Exportar para otros módulos
})
export class ProducersModule {}
```

**Principios de Module:**
- ✅ Centraliza importaciones
- ✅ Registra servicios y controllers
- ✅ Exporta servicios para otros módulos
- ✅ Mantiene independencia (bajo acoplamiento)

---

## 🎯 Patrón UseCase - Evitar "Fat Services"

### El Problema: Services Saturados

Cuando un Service crece, termina así:

```typescript
// ❌ MALO: Fat Service (antipatrón)
@Injectable()
export class ProducersService {
  // 50+ métodos diferentes
  async create(dto) { ... }
  async update(id, dto) { ... }
  async delete(id) { ... }
  async addBankAccount(id, account) { ... }
  async removeBankAccount(id, index) { ... }
  async toggleActive(id) { ... }
  async calculateDebt(id) { ... }
  async sendNotification(id) { ... }
  async generateReport(id) { ... }
  async exportToExcel(id) { ... }
  async importFromCSV(file) { ... }
  // ... y más y más métodos
}
```

**Problemas:**
- ❌ Difícil de testear (muchas dependencias)
- ❌ Difícil de reutilizar (lógica mezclada)
- ❌ Difícil de mantener (responsabilidades múltiples)
- ❌ Viola Single Responsibility Principle (SRP)

### La Solución: UseCase Pattern

**UseCase** = Cada acción de negocio es una clase independiente

```typescript
// ✅ BUENO: UseCase Pattern
class CreateProducerUseCase { }
class UpdateProducerUseCase { }
class AddBankAccountUseCase { }
class ToggleProducerActiveUseCase { }
class CalculateProducerDebtUseCase { }
// ... cada uno en su archivo
```

### Concepto Clave

**Un UseCase = Una y solo Una acción de negocio**

- `CreateProducer` → Crear productor
- `UpdateProducerName` → Cambiar nombre del productor
- `AddBankAccount` → Agregar cuenta bancaria
- `RemoveBankAccount` → Eliminar cuenta bancaria
- `ToggleProducerActive` → Activar/Desactivar productor

### Estructura de UseCase

```
features/[feature]/
├── application/
│   ├── usecases/                           # ← NUEVO
│   │   ├── create-[feature].usecase.ts    # Por cada acción
│   │   ├── update-[feature].usecase.ts
│   │   ├── delete-[feature].usecase.ts
│   │   └── [special-action].usecase.ts
│   │
│   └── [feature].service.ts                # Orquestador (opcional)
├── domain/
├── dto/
├── presentation/
└── [feature].module.ts
```

### Implementación: UseCase Completo

#### Paso 1: Input DTO (lo que recibe del Controller)

```typescript
// application/usecases/dtos/create-producer.usecase.dto.ts
export class CreateProducerUseCaseInput {
  rut: string;
  name: string;
  email: string;
  bankAccounts?: BankAccount[];
}

// Output del UseCase
export class CreateProducerUseCaseOutput {
  id: string;
  rut: string;
  name: string;
  message: string;
}
```

#### Paso 2: El UseCase Mismo

```typescript
// application/usecases/create-producer.usecase.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producer } from '../../domain/producer.entity';
import { AuditService } from '@modules/audit/application/audit.service';
import { CreateProducerUseCaseInput, CreateProducerUseCaseOutput } from './dtos/create-producer.usecase.dto';

/**
 * UseCase: Crear Productor
 * 
 * Responsabilidad única: Alta de nuevo productor en el sistema
 * Entrada: RUT, nombre, email
 * Salida: Productor creado con ID
 * 
 * Incluye:
 * - Validación de RUT único
 * - Creación de entidad
 * - Persistencia
 * - Auditoría
 */
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
    const existing = await this.producerRepository.findOne({
      where: { rut: input.rut },
    });
    if (existing) {
      throw new Error(`Producer with RUT ${input.rut} already exists`);
    }

    // Step 2: Crear instancia de dominio
    const producer = new Producer();
    producer.rut = input.rut;
    producer.name = input.name;
    producer.email = input.email;
    producer.bankAccounts = input.bankAccounts || [];
    producer.isActive = true;

    // Step 3: Persistir
    const created = await this.producerRepository.save(producer);

    // Step 4: Auditar
    await this.auditService.log({
      action: 'CREATE_PRODUCER',
      entityId: created.rut,
      userId,
      metadata: { rut: created.rut, name: created.name },
    });

    // Step 5: Retornar output
    return {
      id: created.id,
      rut: created.rut,
      name: created.name,
      message: 'Producer created successfully',
    };
  }
}
```

#### Paso 3: Otro UseCase (UpdateProducer)

```typescript
// application/usecases/update-producer.usecase.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producer } from '../../domain/producer.entity';
import { AuditService } from '@modules/audit/application/audit.service';

export class UpdateProducerUseCaseInput {
  rut: string;
  name?: string;
  email?: string;
}

export class UpdateProducerUseCaseOutput {
  rut: string;
  name: string;
  message: string;
}

@Injectable()
export class UpdateProducerUseCase {
  constructor(
    @InjectRepository(Producer)
    private readonly producerRepository: Repository<Producer>,
    private readonly auditService: AuditService,
  ) {}

  async execute(
    input: UpdateProducerUseCaseInput,
    userId: string,
  ): Promise<UpdateProducerUseCaseOutput> {
    // Step 1: Obtener productor existente
    const producer = await this.producerRepository.findOne({
      where: { rut: input.rut },
    });
    if (!producer) {
      throw new Error(`Producer not found`);
    }

    // Step 2: Aplicar cambios
    if (input.name !== undefined) {
      if (input.name.length < 3) {
        throw new Error('Name must be at least 3 characters');
      }
      producer.name = input.name;
    }

    if (input.email !== undefined) {
      producer.email = input.email;
    }

    // Step 3: Persistir
    const updated = await this.producerRepository.save(producer);

    // Step 4: Auditar
    await this.auditService.log({
      action: 'UPDATE_PRODUCER',
      entityId: input.rut,
      userId,
      metadata: { changes: input },
    });

    // Step 5: Retornar output
    return {
      rut: updated.rut,
      name: updated.name,
      message: 'Producer updated successfully',
    };
  }
}
```

#### Paso 4: Agregar BankAccountUseCase

```typescript
// application/usecases/add-bank-account.usecase.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producer, BankAccount } from '../../domain/producer.entity';
import { AuditService } from '@modules/audit/application/audit.service';

export class AddBankAccountUseCaseInput {
  producerRut: string;
  bankName: string;
  accountType: 'Cuenta Corriente' | 'Cuenta de Ahorros';
  accountNumber: string;
  accountHolder: string;
}

@Injectable()
export class AddBankAccountUseCase {
  constructor(
    @InjectRepository(Producer)
    private readonly producerRepository: Repository<Producer>,
    private readonly auditService: AuditService,
  ) {}

  async execute(
    input: AddBankAccountUseCaseInput,
    userId: string,
  ): Promise<Producer> {
    // Step 1: Obtener productor
    const producer = await this.producerRepository.findOne({
      where: { rut: input.producerRut },
    });
    if (!producer) throw new Error('Producer not found');

    // Step 2: Crear cuenta
    const account: BankAccount = {
      bankName: input.bankName,
      accountType: input.accountType,
      accountNumber: input.accountNumber,
      accountHolder: input.accountHolder,
    };

    // Step 3: Delegar al dominio (validación)
    try {
      producer.addBankAccount(account);
    } catch (error) {
      throw new Error(error.message);
    }

    // Step 4: Persistir
    const updated = await this.producerRepository.save(producer);

    // Step 5: Auditar
    await this.auditService.log({
      action: 'ADD_BANK_ACCOUNT',
      entityId: input.producerRut,
      userId,
      metadata: { bankName: account.bankName },
    });

    return updated;
  }
}
```

#### Paso 5: Registrar UseCases en Module

```typescript
// producers.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producer } from './domain/producer.entity';
import { AuditModule } from '@modules/audit/audit.module';

// UseCases
import { CreateProducerUseCase } from './application/usecases/create-producer.usecase';
import { UpdateProducerUseCase } from './application/usecases/update-producer.usecase';
import { AddBankAccountUseCase } from './application/usecases/add-bank-account.usecase';
import { DeleteProducerUseCase } from './application/usecases/delete-producer.usecase';

// Controllers
import { ProducersController } from './presentation/producers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Producer]), AuditModule],
  providers: [
    // ← Registrar todos los UseCases aquí
    CreateProducerUseCase,
    UpdateProducerUseCase,
    AddBankAccountUseCase,
    DeleteProducerUseCase,
  ],
  controllers: [ProducersController],
  exports: [
    CreateProducerUseCase,
    UpdateProducerUseCase,
    AddBankAccountUseCase,
  ],
})
export class ProducersModule {}
```

#### Paso 6: Usar en Controller

```typescript
// presentation/producers.controller.ts
import { Controller, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
import { Roles } from '@shared/decorators/roles.decorator';
import { GetUser } from '@shared/decorators/get-user.decorator';
import { RoleEnum } from '@shared/enums/role.enum';
import { User } from '@modules/users/domain/user.entity';

// UseCases
import { CreateProducerUseCase } from '../application/usecases/create-producer.usecase';
import { UpdateProducerUseCase } from '../application/usecases/update-producer.usecase';
import { AddBankAccountUseCase } from '../application/usecases/add-bank-account.usecase';
import { CreateProducerDto } from '../dto/create-producer.dto';

@Controller('api/v1/producers')
export class ProducersController {
  constructor(
    private readonly createProducerUseCase: CreateProducerUseCase,
    private readonly updateProducerUseCase: UpdateProducerUseCase,
    private readonly addBankAccountUseCase: AddBankAccountUseCase,
  ) {}

  /**
   * POST /producers
   * Crear nuevo productor
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async create(
    @Body() dto: CreateProducerDto,
    @GetUser() user: User,
  ) {
    return this.createProducerUseCase.execute(
      {
        rut: dto.rut,
        name: dto.name,
        email: dto.email,
      },
      user.id,
    );
  }

  /**
   * PUT /producers/:rut
   * Actualizar productor
   */
  @Put(':rut')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async update(
    @Param('rut') rut: string,
    @Body() dto: UpdateProducerDto,
    @GetUser() user: User,
  ) {
    return this.updateProducerUseCase.execute(
      {
        rut,
        name: dto.name,
        email: dto.email,
      },
      user.id,
    );
  }

  /**
   * POST /producers/:rut/bank-accounts
   * Agregar cuenta bancaria
   */
  @Post(':rut/bank-accounts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async addBankAccount(
    @Param('rut') rut: string,
    @Body() body: Any,
    @GetUser() user: User,
  ) {
    return this.addBankAccountUseCase.execute(
      {
        producerRut: rut,
        bankName: body.bankName,
        accountType: body.accountType,
        accountNumber: body.accountNumber,
        accountHolder: body.accountHolder,
      },
      user.id,
    );
  }
}
```

### Ventajas del UseCase Pattern

| Aspecto | Sin UseCase | Con UseCase |
|--------|-------------|------------|
| **Métodos por Service** | 30-50+ | 1 por archivo UseCase |
| **Testabilidad** | Difícil (muchas dependencias) | Fácil (una responsabilidad) |
| **Reutilización** | Difícil (lógica embebida) | Fácil (UseCase independiente) |
| **Mantenibilidad** | Difícil (encontrar dónde buscar) | Fácil (archivo = una acción) |
| **Responsabilidad** | Múltiple | Single Responsibility |
| **Líneas de código por archivo** | 1000+ | 50-150 |

### Estructura Completa Recomendada

```
src/modules/[feature]/
├── application/
│   ├── usecases/
│   │   ├── dtos/
│   │   │   ├── create-[feature].usecase.dto.ts
│   │   │   ├── update-[feature].usecase.dto.ts
│   │   │   └── [specific-action].usecase.dto.ts
│   │   ├── create-[feature].usecase.ts        # ← UseCase
│   │   ├── update-[feature].usecase.ts        # ← UseCase
│   │   ├── delete-[feature].usecase.ts        # ← UseCase
│   │   ├── [special-action].usecase.ts        # ← UseCase
│   │   └── index.ts                           # Barrel export
│   │
│   └── [feature].service.ts                   # Opcional: orquestador antiguo
│
├── domain/
│   └── [feature].entity.ts
├── dto/
│   ├── create-[feature].dto.ts
│   ├── update-[feature].dto.ts
│   └── [feature].dto.ts
├── presentation/
│   └── [feature].controller.ts
└── [feature].module.ts
```

### Testing de UseCases

```typescript
// test/unit/create-producer.usecase.spec.ts
import { Test } from '@nestjs/testing';
import { CreateProducerUseCase } from '@modules/producers/application/usecases/create-producer.usecase';
import { AuditService } from '@modules/audit/application/audit.service';

describe('CreateProducerUseCase', () => {
  let usecase: CreateProducerUseCase;
  let mockRepository: any;
  let mockAuditService: any;

  beforeEach(async () => {
    mockRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    mockAuditService = {
      log: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        CreateProducerUseCase,
        {
          provide: 'ProducerRepository',
          useValue: mockRepository,
        },
        {
          provide: AuditService,
          useValue: mockAuditService,
        },
      ],
    }).compile();

    usecase = module.get<CreateProducerUseCase>(CreateProducerUseCase);
  });

  it('should create a producer successfully', async () => {
    mockRepository.findOne.mockResolvedValue(null);
    mockRepository.save.mockResolvedValue({
      id: '123',
      rut: '12345678-9',
      name: 'John Doe',
    });

    const result = await usecase.execute(
      {
        rut: '12345678-9',
        name: 'John Doe',
        email: 'john@example.com',
      },
      'user-123',
    );

    expect(result.rut).toBe('12345678-9');
    expect(mockAuditService.log).toHaveBeenCalled();
  });

  it('should throw error if RUT already exists', async () => {
    mockRepository.findOne.mockResolvedValue({
      rut: '12345678-9',
    });

    await expect(
      usecase.execute(
        {
          rut: '12345678-9',
          name: 'John Doe',
          email: 'john@example.com',
        },
        'user-123',
      ),
    ).rejects.toThrow('already exists');
  });
});
```

### Cuándo Usar UseCase Pattern

**✅ USA UseCase cuando:**
- La acción requiere 3+ pasos
- Es testeable independientemente
- Puede ser reutilizada desde otro contexto
- La lógica es compleja

**❌ NO necesitas UseCase cuando:**
- Es un simple CRUD (create, read, update, delete básicos)
- Solo delega al dominio sin lógica
- Es una operación trivial

**Ejemplo de decisión:**
```typescript
// ❌ No necesita UseCase (simple)
async getProducer(rut: string): Promise<Producer> {
  return this.repo.findOne({ where: { rut } });
}

// ✅ Necesita UseCase (compleja)
async settleProducerPayment(producerRut: string, seasonId: string) {
  // 1. Calcular deuda total
  // 2. Validar avances
  // 3. Procesar transacciones
  // 4. Actualizar estado
  // 5. Auditar
  // ... 50+ líneas de lógica
}
```

---

## Ejemplo Práctico: Crear un Nuevo Módulo

### Escenario: Implementar módulo de **Inspections** (Inspecciones de Calidad)

**Paso 1: Crear estructura de carpetas**
```bash
mkdir -p src/modules/inspections/{application,domain,dto,presentation}
touch src/modules/inspections/inspections.module.ts
```

**Paso 2: Definir la entidad de dominio**

Archivo: `src/modules/inspections/domain/inspection.entity.ts`
```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@shared/domain/base.entity';
import { Reception } from '@modules/operations/domain/reception.entity';

@Entity('inspections')
export class Inspection extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  receptionId: string;

  @ManyToOne(() => Reception)
  @JoinColumn({ name: 'receptionId' })
  reception: Reception;

  @Column('varchar')
  inspectorId: string;

  @Column('varchar')
  status: 'pending' | 'approved' | 'rejected'; // Enum en shared

  @Column('text', { nullable: true })
  notes: string;

  @Column('json')
  checkpoints: InspectionCheckpoint[];

  // Lógica de negocio
  approve(notes?: string): void {
    this.status = 'approved';
    if (notes) this.notes = notes;
  }

  reject(reason: string): void {
    if (!reason) throw new Error('Rejection reason required');
    this.status = 'rejected';
    this.notes = reason;
  }
}

export interface InspectionCheckpoint {
  name: string;
  passed: boolean;
  comment?: string;
}
```

**Paso 3: Crear DTOs**

Archivo: `src/modules/inspections/dto/create-inspection.dto.ts`
```typescript
import { IsUUID, IsArray, IsNotEmpty } from 'class-validator';
import { InspectionCheckpoint } from '../domain/inspection.entity';

export class CreateInspectionDto {
  @IsUUID()
  receptionId: string;

  @IsArray()
  @IsNotEmpty()
  checkpoints: InspectionCheckpoint[];
}
```

Archivo: `src/modules/inspections/dto/inspection.dto.ts`
```typescript
export class InspectionDto {
  id: string;
  receptionId: string;
  inspectorId: string;
  status: string;
  checkpoints: any[];
  notes?: string;
  createdAt: Date;
}
```

**Paso 4: Crear servicio de aplicación**

Archivo: `src/modules/inspections/application/inspections.service.ts`
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inspection } from '../domain/inspection.entity';
import { CreateInspectionDto } from '../dto/create-inspection.dto';
import { AuditService } from '@modules/audit/application/audit.service';

@Injectable()
export class InspectionsService {
  constructor(
    @InjectRepository(Inspection)
    private readonly inspectionRepository: Repository<Inspection>,
    private readonly auditService: AuditService,
  ) {}

  async create(
    dto: CreateInspectionDto,
    inspectorId: string,
  ): Promise<Inspection> {
    const inspection = new Inspection();
    inspection.receptionId = dto.receptionId;
    inspection.inspectorId = inspectorId;
    inspection.checkpoints = dto.checkpoints;
    inspection.status = 'pending';

    const created = await this.inspectionRepository.save(inspection);

    await this.auditService.log({
      action: 'CREATE_INSPECTION',
      entityId: created.id,
      userId: inspectorId,
    });

    return created;
  }

  async approve(id: string, userId: string, notes?: string): Promise<void> {
    const inspection = await this.findOne(id);
    inspection.approve(notes);
    await this.inspectionRepository.save(inspection);

    await this.auditService.log({
      action: 'APPROVE_INSPECTION',
      entityId: id,
      userId,
    });
  }

  async findOne(id: string): Promise<Inspection> {
    const inspection = await this.inspectionRepository.findOne({ where: { id } });
    if (!inspection) throw new NotFoundException('Inspection not found');
    return inspection;
  }
}
```

**Paso 5: Crear controller**

Archivo: `src/modules/inspections/presentation/inspections.controller.ts`
```typescript
import { Controller, Post, Patch, Get, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
import { Roles } from '@shared/decorators/roles.decorator';
import { GetUser } from '@shared/decorators/get-user.decorator';
import { InspectionsService } from '../application/inspections.service';
import { CreateInspectionDto } from '../dto/create-inspection.dto';
import { RoleEnum } from '@shared/enums/role.enum';
import { User } from '@modules/users/domain/user.entity';

@Controller('api/v1/inspections')
export class InspectionsController {
  constructor(private readonly inspectionsService: InspectionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.LABORATORISTA)
  async create(
    @Body() dto: CreateInspectionDto,
    @GetUser() user: User,
  ) {
    return this.inspectionsService.create(dto, user.id);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async approve(
    @Param('id') id: string,
    @Body() body: { notes?: string },
    @GetUser() user: User,
  ) {
    await this.inspectionsService.approve(id, user.id, body.notes);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.inspectionsService.findOne(id);
  }
}
```

**Paso 6: Crear el módulo**

Archivo: `src/modules/inspections/inspections.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InspectionsService } from './application/inspections.service';
import { InspectionsController } from './presentation/inspections.controller';
import { Inspection } from './domain/inspection.entity';
import { AuditModule } from '@modules/audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([Inspection]), AuditModule],
  providers: [InspectionsService],
  controllers: [InspectionsController],
  exports: [InspectionsService],
})
export class InspectionsModule {}
```

**Paso 7: Registrar el módulo en app.module.ts**
```typescript
import { InspectionsModule } from '@modules/inspections/inspections.module';

@Module({
  imports: [
    // ... otros módulos
    InspectionsModule,
  ],
})
export class AppModule {}
```

---

## Convenciones de Código

### 📛 Naming Conventions

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| **Entidades** | PascalCase, singular | `Producer`, `Reception`, `Inspection` |
| **Servicios** | PascalCase (clase), camelCase (archivo) | `ProducersService` → `producers.service.ts` |
| **Controllers** | PascalCase (clase), camelCase (archivo) | `ProducersController` → `producers.controller.ts` |
| **DTOs** | PascalCase, suffix `-Dto` | `CreateProducerDto`, `ProducerDto` |
| **Enums** | PascalCase | `RoleEnum`, `ReceptionStatusEnum` |
| **Guards** | PascalCase, suffix `-Guard` | `JwtAuthGuard`, `RolesGuard` |
| **Decoradores** | camelCase, con @ | `@GetUser()`, `@Roles()` |
| **Rutas** | kebab-case, plural | `/api/v1/producers`, `/api/v1/bank-accounts` |
| **Métodos de BD** | camelCase | `findByRut()`, `findAll()` |
| **Errores** | Excepciones de NestJS | `NotFoundException`, `BadRequestException` |

### 📝 Patrones de Métodos

#### Servicio (Application)
```typescript
// GET (Lectura)
async find[Entity](): Promise<Entity[]>
async findOne(id): Promise<Entity>
async findBy[Field](value): Promise<Entity[]>

// POST (Crear)
async create(dto, userId?): Promise<Entity>

// PUT/PATCH (Actualizar)
async update(id, dto, userId?): Promise<Entity>
async [action](id, params, userId?): Promise<Entity> // approve, reject, etc.

// DELETE
async delete(id, userId?): Promise<void>
```

#### Controller
```typescript
@Get() // Listar
@Get(':id') // Obtener uno
@Post() // Crear
@Put(':id') // Actualizar total
@Patch(':id') // Actualizar parcial
@Delete(':id') // Eliminar
```

---

## Seguridad & Autorización

### 🔐 Guards & Decoradores

```typescript
// Verificar autenticación
@UseGuards(JwtAuthGuard)

// Verificar roles
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleEnum.ADMIN, RoleEnum.LABORATORISTA)

// Extraer usuario actual
@GetUser() user: User
```

### 📊 Roles Disponibles

```typescript
// shared/enums/role.enum.ts
export enum RoleEnum {
  ADMIN = 'admin',               // Control total
  LABORATORISTA = 'laboratorista', // Análisis de calidad
  PESAJE = 'pesaje',             // Pesada de receptions
}
```

### Matriz de Permisos

| Acción | Admin | Laboratorista | Pesaje |
|--------|-------|---------------|--------|
| Crear productor | ✅ | ❌ | ❌ |
| Listar productores | ✅ | ✅ | ✅ |
| Crear reception | ✅ | ✅ | ✅ |
| Crear análisis | ✅ | ✅ | ❌ |
| Crear avance | ✅ | ❌ | ❌ |

---

## Infraestructura & Persistencia

### 🗄️ TypeORM Setup

Cada entidad DEBE:
1. Heredar de `BaseEntity`
2. Tener `@Entity('table_name')`
3. Definir columnas con `@Column()`
4. Usar `createdAt`, `updatedAt` (heredadas)

```typescript
// Ejemplo completo
import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '@shared/domain/base.entity';

@Entity('advanced')
export class Advance extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  producerId: string;

  @Column('uuid')
  seasonId: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @ManyToOne(() => Producer)
  producer: Producer;

  // Heredado de BaseEntity:
  // createdAt, updatedAt, deletedAt (soft delete)
}
```

### 📋 Migraciones

```bash
# Generar migración nueva
npm run typeorm migration:generate -- src/migrations/YourMigration

# Ejecutar migraciones
npm run db:migrate

# Revertir última
npm run typeorm migration:revert
```

### 🌱 Seeding

Archivo: `src/infrastructure/persistence/seeders/initial.seeder.ts`
```typescript
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Producer } from '@modules/producers/domain/producer.entity';

export async function seedInitialData(dataSource: DataSource) {
  const logger = new Logger('Seeding');
  const producerRepository = dataSource.getRepository(Producer);

  const count = await producerRepository.count();
  if (count > 0) {
    logger.log('Database already seeded, skipping...');
    return;
  }

  const producers = [
    { rut: '12345678-9', name: 'Juan Pérez', email: 'juan@example.com' },
    { rut: '98765432-1', name: 'María García', email: 'maria@example.com' },
  ];

  for (const data of producers) {
    const producer = new Producer();
    producer.rut = data.rut;
    producer.name = data.name;
    producer.email = data.email;
    await producerRepository.save(producer);
  }

  logger.log(`✅ Seeded ${producers.length} producers`);
}
```

---

## Testing

### 🧪 Estructura de Tests

```
test/
├── integration/
│   ├── auth.e2e-spec.ts
│   ├── producers.e2e-spec.ts
│   └── operations.e2e-spec.ts
└── unit/
    ├── producers.service.spec.ts
    └── inspections.service.spec.ts
```

### Ejemplo: Test E2E

```typescript
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@src/app.module';

describe('Producers (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'admin@example.com', password: 'admin123' });

    authToken = res.body.access_token;
  });

  it('POST /producers - Create', async () => {
    const dto = {
      rut: '12345678-9',
      name: 'New Producer',
      email: 'producer@example.com',
    };

    const response = await request(app.getHttpServer())
      .post('/api/v1/producers')
      .set('Authorization', `Bearer ${authToken}`)
      .send(dto)
      .expect(201);

    expect(response.body.rut).toBe(dto.rut);
    expect(response.body.name).toBe(dto.name);
  });

  afterAll(async () => {
    await app.close();
  });
});
```

### Ejecutar Tests

```bash
# Todos
npm test

# En modo watch
npm run test:watch

# Coverage
npm run test:cov

# E2E específico
npm run test:e2e -- producers.e2e-spec
```

---

## Checklist de Implementación

Cuando crees un nuevo módulo, verifica:

### ✅ Estructura
- [ ] Carpeta `/modules/[feature]/` creada
- [ ] Subcarpetas: `application/`, `domain/`, `dto/`, `presentation/`
- [ ] Archivo `[feature].module.ts` en raíz

### ✅ Dominio
- [ ] Entidad extiende de `BaseEntity`
- [ ] `@Entity('table_name')` presente
- [ ] Métodos de negocio implementados
- [ ] Value Objects definidos si aplica
- [ ] Sin dependencias inyectadas

### ✅ DTOs
- [ ] `Create[Entity]Dto` con `@IsNotEmpty()`, `@IsEmail()`, etc.
- [ ] `Update[Entity]Dto` (opcional para campos opcionales)
- [ ] `[Entity]Dto` de respuesta
- [ ] Importados en Controller

### ✅ Servicio (Application)
- [ ] Métodos CRUD: `findAll()`, `findOne()`, `create()`, `update()`, `delete()`
- [ ] Injected: `@InjectRepository(Entity)`, otros servicios
- [ ] Llamadas a auditoría: `auditService.log()`
- [ ] Manejo de errores: `NotFoundException`, `BadRequestException`
- [ ] Exportado en Module

### ✅ Controller
- [ ] Rutas: `@Get()`, `@Post()`, `@Put()`, `@Delete()`
- [ ] Guards: `@UseGuards(JwtAuthGuard, RolesGuard)`
- [ ] Roles: `@Roles(RoleEnum.ADMIN)`
- [ ] Extractors: `@GetUser()`, `@Param()`, `@Body()`
- [ ] DTOs validados en parámetros
- [ ] Mapeo entidad → DTO en respuestas

### ✅ Module
- [ ] `TypeOrmModule.forFeature([Entity])`
- [ ] Módulos importados
- [ ] Servicio en `providers`
- [ ] Controller en `controllers`
- [ ] Servicio exportado (si es usado por otros)

### ✅ Integración
- [ ] Módulo registrado en `app.module.ts`
- [ ] Entidad registrada en `@Module` de infraestructura
- [ ] Migración creada (si es BD nueva)
- [ ] Rutas documentadas en README

### ✅ Testing
- [ ] Tests unitarios para servicio
- [ ] Tests E2E para controller
- [ ] Casos de error cubiertos

---

## Troubleshooting Común

### ❌ "Circular dependency detected"
**Causa**: Dos módulos se importan mutuamente  
**Solución**: Extraer código compartido a `shared/`, usar servicios exportados

### ❌ "Cannot find module error"
**Causa**: Path alias incorrecto  
**Solución**: Verificar `tsconfig.json` tiene `compilerOptions.paths.@*`

### ❌ "TS4053: Return type of exported function incompatible"
**Causa**: Interfaz local no exportada en tipo de retorno  
**Solución**: Exportar interfaz o ampliar tipo de retorno

### ❌ Datos no persisten en BD
**Causa**: Entidad no registrada en module o migración no ejecutada  
**Solución**: 
```bash
npm run db:migrate
# O recrear índice
npm run typeorm migration:generate
```

---

## Referencias Rápidas

### Imports Comunes
```typescript
// Modules
import { Module, Injectable, Controller } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Validación
import { IsNotEmpty, IsEmail, Length, IsUUID } from 'class-validator';

// Guards
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';

// Decoradores
import { GetUser } from '@shared/decorators/get-user.decorator';
import { Roles } from '@shared/decorators/roles.decorator';

// Excepciones
import { NotFoundException, BadRequestException } from '@nestjs/common';

// TypeORM
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@shared/domain/base.entity';
```

### Scripts NPM
```bash
npm run start:dev              # Dev + hot reload
npm run build                  # Compilar TypeScript
npm run db:setup               # Migrar + Seed
npm test                        # Ejecutar tests
npm run typeorm migration:generate -- src/migrations/Name
```

---

## Conclusión

Este patrón DDD proporciona:
- 🎯 **Claridad**: Cada capa tiene una responsabilidad clara
- 🔒 **Mantenibilidad**: Cambios localizados en una capa
- 🧪 **Testabilidad**: Cada capa es independientemente testeable
- 📈 **Escalabilidad**: Nuevos módulos siguen el mismo patrón
- 👥 **Colaboración**: Lenguaje ubicuo entre el equipo

**Recuerda**: El dominio es el corazón del sistema. Protégelo de dependencias externas y asegúrate que capture toda la lógica de negocio.

---

**¿Preguntas?** Consulta el código en los módulos existentes: `producers/`, `operations/`, `finances/`

**Última revisión**: Marzo 2026
