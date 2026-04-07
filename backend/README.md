# Paddy Backend - NestJS DDD Architecture

Proyecto **Paddy Backend**: Sistema de recepción y gestión financiera de arroz.

## 🏗️ Arquitectura DDD (Domain-Driven Design)

```
/backend
├── src/
│   ├── modules/                # Lógica de negocio por dominios
│   │   ├── auth/               # Autenticación JWT/NextAuth
│   │   ├── users/              # Gestión de funcionarios
│   │   ├── producers/          # Maestro de productores
│   │   ├── configuration/      # Seasons, RiceTypes, Templates, AnalysisParams
│   │   ├── operations/         # Receptions y AnalysisRecords (core)
│   │   ├── finances/           # Advances, Transactions, Settlements
│   │   └── analytics/          # Reportes (read-only)
│   │
│   ├── shared/                 # Código reutilizable
│   │   ├── domain/             # BaseEntity
│   │   ├── enums/              # RoleEnum, StatusEnum, etc.
│   │   ├── guards/             # JwtAuthGuard, RolesGuard
│   │   ├── decorators/         # @GetUser(), @Roles()
│   │   ├── filters/            # HttpExceptionFilter
│   │   ├── interceptors/       # TransformInterceptor
│   │   └── utils/              # validateRut(), formatCLP()
│   │
│   ├── infrastructure/         # Configuración técnica
│   │   ├── database/           # TypeORM DataSource
│   │   └── persistence/        # Migraciones, Seeders
│   │
│   ├── main.ts                 # Punto de entrada
│   └── app.module.ts           # Orquestador de módulos
│
├── test/                       # Tests E2E
├── package.json
├── tsconfig.json
└── .env
```

## 🚀 Quick Start

### 1. Instalación de dependencias
```bash
cd backend
npm install
```

### 2. Configuración de variables de entorno
Copia `.env.example` a `.env`:
```bash
cp .env.example .env
```

Edita `.env` con tus valores:
```env
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=redbull90
DATABASE_NAME=paddy
JWT_SECRET=cambiar_en_produccion
NEXTAUTH_SECRET=cambiar_en_produccion
```

### 3. Crear base de datos MySQL
```bash
mysql -u root -p
> CREATE DATABASE paddy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> EXIT;
```

### 4. Iniciar servidor en desarrollo
```bash
npm run start:dev
```

El servidor estará en `http://localhost:3000`

## 📚 Endpoints Principales

### Autenticación (Públicos)
```bash
POST   /api/v1/auth/login       # { email, password }
POST   /api/v1/auth/register    # { email, password, firstName? }
POST   /api/v1/auth/refresh     # Refrescar token
GET    /api/v1/auth/me          # Datos del usuario autenticado
GET    /api/v1/auth/health      # Health check
```

### Usuarios (Admin)
```bash
GET    /api/v1/users            # Listar todos
GET    /api/v1/users/:id        # Obtener uno
PUT    /api/v1/users/:id        # Actualizar
DELETE /api/v1/users/:id        # Eliminar (soft delete)
PUT    /api/v1/users/:id/toggle-active
```

### Productores (Admin/Laboratorista/Pesaje - lectura)
```bash
GET    /api/v1/producers        # Listar todos
GET    /api/v1/producers/:id    # Obtener uno
POST   /api/v1/producers        # Crear (Admin)
PUT    /api/v1/producers/:id    # Actualizar (Admin)
DELETE /api/v1/producers/:id    # Eliminar (Admin)
POST   /api/v1/producers/:id/bank-accounts
DELETE /api/v1/producers/:id/bank-accounts/:index
```

## 🔐 Autenticación JWT

### Flujo de login:
1. `POST /auth/login` con email y password
2. Respuesta: `{ access_token, userId, email, role }`
3. Incluir en headers: `Authorization: Bearer <access_token>`

### Roles disponibles:
- `admin`: Acceso total
- `laboratorista`: Análisis de calidad
- `pesaje`: Pesada de receptions

### Token expiración: 15 minutos

## 📊 Entidades Principales

```typescript
// Usuarios
User { email, password, firstName, lastName, role, isActive }

// Productores
Producer { rut, name, address, email, bankAccounts: JSON[], totalDebt }

// Configuración
RiceType { code, name, referencePrice }
Season { code, year, startDate, endDate }
Template { name, producerId?, parameters... }
AnalysisParam { discountCode, rangeStart, rangeEnd, discountPercent }

// Operaciones
Reception { producerId, guideNumber, licensePlate, grossWeight, netWeight, status }
AnalysisRecord { receptionId (1:1), humedadRange, humedadPercent, ... }

// Finanzas
Advance { producerId, seasonId, amount, interestRate }
Transaction { producerId, type, amount, metadata }
Settlement { producerId, seasonId, totalReceptions, totalPrice, amountDue }
```

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run start:dev              # Modo watch
npm run build                  # Compilar TypeScript

# Testing
npm run test                   # Tests unitarios
npm run test:watch            # Tests en watch mode
npm run test:cov              # Coverage
npm run test:e2e              # E2E tests

# Base de datos
npm run db:migrate            # Ejecutar migraciones
npm run db:seed               # Seed inicial (crear datos de prueba)
npm run db:setup              # Migrate + seed

# Linting
npm run lint                   # ESLint
npm run format                 # Prettier
```

## 🔄 Flujo de Recepción (Ejemplo)

1. **Pesaje** (ReceptionController):
   - Crear Reception: `POST /receptions`
   - Datos: guideNumber, licensePlate, grossWeight, tareWeight, ricePrice
   - Status: `in_process`

2. **Análisis** (AnalysisController):
   - Crear AnalysisRecord vinculado a Reception
   - Ingresar parámetros: humedad, impurezas, granos verdes, etc.
   - Calcular descuentos según Template
   - Status: `analyzed`

3. **Liquidación** (SettlementController):
   - Agregar Transactions (descuentos, bonos)
   - Calcular totales, IVA
   - Generar Settlement
   - Status: `settled`

## 📝 DTOs (Data Transfer Objects)

Crear carpeta `src/modules/*/dto/` con:
```typescript
// reception.dto.ts
export class CreateReceptionDto {
  @IsNumber()
  producerId: number;

  @IsString()
  guideNumber: string;

  @IsDecimal()
  grossWeight: number;
  // ...
}
```

## 🧪 Ejemplo de Prueba (cURL)

### 1. Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### 2. Listar productores (reemplazar TOKEN)
```bash
curl -X GET http://localhost:3000/api/v1/producers \
  -H "Authorization: Bearer <TOKEN>"
```

### 3. Crear productor
```bash
curl -X POST http://localhost:3000/api/v1/producers \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "rut": "12345678-9",
    "name": "Juan Pérez",
    "address": "Calle Principal 123",
    "email": "juan@example.com"
  }'
```

## 🚨 Troubleshooting

| Problema | Solución |
|----------|----------|
| Port 3000 en uso | `lsof -i :3000` y matar proceso |
| Conexión BD fallida | Verificar `.env` y MySQL running |
| Token inválido | Token expirado (regenerar con `/auth/refresh`) |
| Permiso denegado | Verificar rol con `/auth/me` |
| TypeORM synchronize:false | Cambiar a `true` en `.env` NODE_ENV=development |

## 📖 Recursos

- [NestJS Docs](https://docs.nestjs.com)
- [TypeORM Docs](https://typeorm.io)
- [Passport.js JWT](http://www.passportjs.org/packages/passport-jwt/)
- [NextAuth Integration](https://next-auth.js.org)

## 📄 Licencia

MIT
