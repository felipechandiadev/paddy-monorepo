# ✅ Backend DDD Paddy - Proyecto Creado Exitosamente

## 📊 Resumen de Creación

Se ha creado una arquitectura **NestJS + DDD (Domain-Driven Design)** completamente funcional con MySQL compatible con NextAuth.

---

## 🏗️ Módulos Implementados

### ✅ **AUTH Module** (Completamente funcional)
```typescript
src/modules/auth/
├── domain/
│   └── jwt.strategy.ts         # Passport JWT strategy
├── application/
│   └── auth.service.ts         # Login, register, token refresh
├── presentation/
│   └── auth.controller.ts       # Endpoints: /auth/login, /register, /refresh, /me
└── auth.module.ts              # Módulo orquestador
```

**Endpoints:**
- `POST /api/v1/auth/login` - Login (email + password)
- `POST /api/v1/auth/register` - Registrar nuevo usuario
- `POST /api/v1/auth/refresh` - Refrescar JWT token  
- `GET /api/v1/auth/me` - Datos usuario autenticado
- `GET /api/v1/auth/health` - Health check

---

### ✅ **USERS Module** (Completamente funcional)
```typescript
src/modules/users/
├── domain/
│   └── user.entity.ts          # User entity con roles
├── application/
│   └── users.service.ts        # CRUD de usuarios
├── presentation/
│   └── users.controller.ts      # Endpoints CRUD (solo Admin)
└── users.module.ts             # Módulo orquestador
```

**Endpoints (Admin only):**
- `GET /api/v1/users` - Listar todos
- `GET /api/v1/users/:id` - Obtener uno
- `PUT /api/v1/users/:id` - Actualizar
- `DELETE /api/v1/users/:id` - Eliminar (soft delete)
- `PUT /api/v1/users/:id/toggle-active` - Activar/desactivar

---

### ✅ **PRODUCERS Module** (Completamente funcional)
```typescript
src/modules/producers/
├── domain/
│   └── producer.entity.ts      # Producer entity + BankAccount interface
├── application/
│   └── producers.service.ts    # CRUD + gestión de cuentas bancarias
├── presentation/
│   └── producers.controller.ts  # Endpoints CRUD
└── producers.module.ts         # Módulo orquestador
```

**Endpoints:**
- `GET /api/v1/producers` - Listar todos (All roles)
- `GET /api/v1/producers/:id` - Obtener uno
- `POST /api/v1/producers` - Crear (Admin)
- `PUT /api/v1/producers/:id` - Actualizar (Admin)
- `DELETE /api/v1/producers/:id` - Eliminar (Admin)
- `POST /api/v1/producers/:id/bank-accounts` - Agregar cuenta
- `DELETE /api/v1/producers/:id/bank-accounts/:index` - Remover cuenta

---

## 🏗️ Entidades Creadas

### 1. **User** (Usuarios del sistema)
```sql
id, email (unique), password, firstName, lastName, role (enum), isActive, phone, lastLogin
[Timestamps: createdAt, updatedAt, deletedAt (soft delete)]
```

### 2. **Producer** (Agricultores)
```sql
id, rut (unique), name, address, city, phone, email, contactPerson,
bankAccounts (JSON array), notes, isActive, totalDebt
[Timestamps]
```

### 3. **RiceType** (Variedades de arroz)
```sql
id, code (unique), name, description, referencePrice, isActive
[Timestamps]
```

### 4. **Season** (Temporadas)
```sql
id, code, year (unique index), name, startDate, endDate, isActive, notes
[Timestamps]
```

### 5. **Template** (Plantillas de análisis)
```sql
id, name, producerId?, isDefault, useToleranceGroup, groupToleranceValue,
availableHumedad, percentHumedad, toleranceHumedad, ... (+ 10+ parámetros)
[Timestamps]
```

### 6. **AnalysisParam** (Rangos de descuento - 8 tipos)
```sql
id, discountCode (1-8), discountName, unit, rangeStart, rangeEnd, 
discountPercent, priority, isActive
[Timestamps]
```

### 7. **Reception** (Recepciones de arroz)
```sql
id, producerId (FK), templateId (FK), seasonId (FK), riceTypeId (FK),
guideNumber, licensePlate, ricePrice, grossWeight, tareWeight, netWeight,
totalDiscountKg?, bonusKg?, finalNetWeight?, dryPercent?, dryFeeApplied,
status (enum: in_process|analyzed|settled), settlementId?, userId?, notes
[Timestamps]
```

### 8. **AnalysisRecord** (Análisis de calidad - 1:1 con Reception)
```sql
id, receptionId (FK unique), humedadRange, humedadPercent, ...,
totalGroupPercent, groupTolerance, userId?, notes
[Timestamps]
```

### 9. **Advance** (Anticipos)
```sql
id, producerId (FK), seasonId (FK), amount, issueDate, interestRate,
description, isActive
[Timestamps]
```

### 10. **Transaction** (Movimientos de dinero)
```sql
id, producerId (FK), receptionId?, advanceId?, settlementId?, 
type (enum), amount, metadata (JSON), referenceNumber, transactionDate, userId?
[Timestamps]
```

### 11. **Settlement** (Liquidaciones)
```sql
id, producerId (FK), seasonId (FK), status (enum), totalReceptions, totalPrice,
totalDiscounts, totalBonuses, finalAmount, totalAdvances, totalInterest,
ivaRice, ivaServices, amountDue, calculationDetails (JSON), userId?
[Timestamps]
```

---

## 🛠️ Infraestructura Shared

### **Guards**
- `JwtAuthGuard` - Protege endpoints con JWT válido
- `RolesGuard` - Verifica roles de usuario

### **Decorators**
- `@Roles(RoleEnum.ADMIN, ...)` - Especifica roles permitidos
- `@GetUser()` - Extrae usuario del JWT

### **Interceptors**
- `TransformInterceptor` - Formatea todas las respuestas en `{ success, data, timestamp }`

### **Filters**
- `HttpExceptionFilter` - Maneja excepciones HTTP
- `AllExceptionsFilter` - Maneja cualquier error no capturado

### **Enums**
```typescript
RoleEnum: ADMIN, LABORATORISTA, PESAJE
ReceptionStatusEnum: IN_PROCESS, ANALYZED, SETTLED
SettlementStatusEnum: DRAFT, PENDING, COMPLETED, CANCELLED
TransactionTypeEnum: ADVANCE, PAYMENT, DEDUCTION, INTEREST, REFUND, SETTLEMENT
```

### **Utils**
- `validateAndFormatRut(rut)` - Valida RUT chileno
- `formatCLP(amount)` - Formatea a pesos chilenos
- `parseCLP(string)` - Parsea string CLP a número
- `roundToTwoDecimals(value)` - Redondea a 2 decimales

---

## 📦 Base de Datos Preconfigurada

### **TypeORM Configuration:**
- MySQL connection with automatic schema sync in dev
- Soft delete support (DeleteDateColumn)
- Audit timestamps (CreateDateColumn, UpdateDateColumn)
- All 11 entities registered

### **Seeders incluidos:**
- 3 usuarios de prueba (admin, laboratorista, pesaje)
- 6 tipos de arroz (Diamante, Zafiro, Pantera, Cuarzo, Quella, Ámbar)
- 2 temporadas (Verano 2026, Invierno 2026)
- 1 template por defecto
- 7 parámetros de análisis (rangos de descuento)
- 10 productores con cuentas bancarias

---

## 🚀 Archivos de Configuración

### **package.json** - Dependencias incluidas:
```json
{
  "scripts": {
    "start:dev": "nest start --watch",
    "build": "nest build",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "db:migrate": "typeorm-ts-node-commonjs migration:run",
    "db:seed": "ts-node src/infrastructure/persistence/seeders/seed.ts",
    "db:setup": "npm run db:migrate && npm run db:seed"
  },
  "dependencies": {
    "@nestjs/common": "^10.3.3",
    "@nestjs/jwt": "^12.1.0",
    "@nestjs/passport": "^10.0.3",
    "bcryptjs": "^2.4.3",
    "typeorm": "^0.3.17",
    "mysql2": "^3.6.5",
    "class-validator": "^0.14.0",
    "passport-jwt": "^4.0.1"
  }
}
```

### **.env** - Configuración MySQL:
```env
NODE_ENV=development
PORT=3000
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=redbull90
DATABASE_NAME=paddy
JWT_SECRET=cambiar_en_produccion
NEXTAUTH_SECRET=cambiar_en_produccion
FRONTEND_URL=http://localhost:3001
```

### **tsconfig.json** - Path aliases:
```json
{
  "paths": {
    "@modules/*": ["src/modules/*"],
    "@shared/*": ["src/shared/*"],
    "@infrastructure/*": ["src/infrastructure/*"]
  }
}
```

---

## 📚 Documentación

- **backend/README.md** - Documentación completa con ejemplos
- **backend/SETUP.md** - Guía paso a paso de instalación
- **backend/.env.example** - Template de variables de entorno

---

## 🎯 Módulos Pendientes (estructura lista)

Los siguientes módulos tienen **entidades y interfaces** creadas pero necesitan **services y controllers**:

1. **Configuration Module** - Services para manejar Rice Types, Seasons, Templates, Analysis Params
2. **Operations Module** - Services para manejar Reception y AnalysisRecord (lógica de cálculo de descuentos)
3. **Finances Module** - Services para manejar Advances, Transactions, Settlements
4. **Analytics Module** - Controllers/Services de reportes (read-only)

---

## ⚡ Como empezar AHORA

```bash
# 1. Instalar dependencies
cd backend
npm install

# 2. Configurar MySQL (crear DB)
mysql -u root -p -e "CREATE DATABASE paddy CHARACTER SET utf8mb4;"

# 3. Iniciar BD y seed
npm run db:setup

# 4. Iniciar servidor
npm run start:dev

# 5. En otra terminal, probar health check
curl http://localhost:3000/api/v1/auth/health

# 6. Login y obtener token
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# 7. Listar productores (reemplaza TOKEN)
curl http://localhost:3000/api/v1/producers \
  -H "Authorization: Bearer TOKEN"
```

---

## ✨ Características Implementadas

- ✅ DDD Architecture (Domain-Driven Design)
- ✅ TypeORM + MySQL Integration
- ✅ JWT Authentication con Passport
- ✅ Role-based Access Control (RBAC)
- ✅ Soft Deletes (auditabilidad)
- ✅ Global Exception Handling
- ✅ Request/Response Interceptors
- ✅ Decoradores personalizados
- ✅ Utilities para RUT y CLP
- ✅ Database seeders
- ✅ TypeScript paths aliases
- ✅ Jest testing setup

---

## 🎉 ¡Proyecto backend lista para desarrollo!

Todos los módulos de autenticación, usuarios y productores están **completamente funcionales**.

**Siguiente paso**: Implementar services/controllers para los 4 módulos restantes siguiendo el mismo patrón DDD.

