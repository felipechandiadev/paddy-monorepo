# Paddy Backend - NestJS DDD Architecture

Complete rice reception and financial management system backend built with NestJS, TypeORM, and MySQL.

## 🎯 Project Status

✅ **Complete DDD Implementation** (100%)
- 8 feature modules with domain/application/presentation separation
- 11 TypeORM entities with soft deletes and audit trails
- Role-based access control (RBAC) with JWT authentication
- Comprehensive DTOs with class-validator
- Database seeding with test data
- Production-ready MySQL integration

## 📁 Project Structure

```
/backend
├── src/
│   ├── modules/                    # Domain-driven modules
│   │   ├── auth/                   # Authentication & JWT tokens
│   │   │   ├── domain/
│   │   │   ├── application/        # AuthService: login, register, refresh
│   │   │   ├── presentation/       # AuthController: /auth endpoints
│   │   │   └── auth.module.ts
│   │   │
│   │   ├── users/                  # User management (Admin, Lab, Pesaje)
│   │   │   ├── domain/
│   │   │   ├── application/        # UserService: CRUD + roles
│   │   │   ├── presentation/       # UserController: /users
│   │   │   └── users.module.ts
│   │   │
│   │   ├── producers/              # Producer data + bank accounts
│   │   │   ├── domain/
│   │   │   ├── application/        # ProducerService: CRUD + accounts
│   │   │   ├── presentation/       # ProducerController: /producers
│   │   │   └── producers.module.ts
│   │   │
│   │   ├── configuration/          # System setup: Rice types, seasons, templates
│   │   │   ├── domain/
│   │   │   ├── application/        # ConfigurationService: 4 entity services
│   │   │   ├── presentation/       # ConfigurationController: /configuration
│   │   │   ├── dto/                # DTOs with validators
│   │   │   └── configuration.module.ts
│   │   │
│   │   ├── operations/             # Core workflow: Receptions & Analysis
│   │   │   ├── domain/
│   │   │   ├── application/        # OperationsService: workflow + calculations
│   │   │   ├── presentation/       # OperationsController: /operations
│   │   │   ├── dto/                # DTOs with validators
│   │   │   └── operations.module.ts
│   │   │
│   │   ├── finances/               # Financial management: Advances, settlements
│   │   │   ├── domain/
│   │   │   ├── application/        # FinancesService: 3 entity services
│   │   │   ├── presentation/       # FinancesController: /finances
│   │   │   ├── dto/                # DTOs with validators
│   │   │   └── finances.module.ts
│   │   │
│   │   └── analytics/              # Read-only: Reports & dashboards
│   │       ├── application/        # AnalyticsService: 6 report methods
│   │       ├── presentation/       # AnalyticsController: /analytics
│   │       └── analytics.module.ts
│   │
│   ├── shared/                     # Global reusable code
│   │   ├── domain/                 # BaseEntity
│   │   ├── enums/                  # All system enums
│   │   ├── guards/                 # JwtAuthGuard, RolesGuard
│   │   ├── decorators/             # @Roles(), @GetUser()
│   │   ├── filters/                # Exception handling
│   │   ├── interceptors/           # Response transformation
│   │   └── utils/                  # Helpers: RUT validation, formatting
│   │
│   ├── infrastructure/             # Technical setup
│   │   ├── database/               # TypeORM MySQL config
│   │   └── persistence/            # Migrations & seeders
│   │
│   ├── app.module.ts               # Module orchestrator
│   └── main.ts                     # Application entry point
│
├── test/                           # E2E & integration tests
├── .env                            # Environment variables
├── tsconfig.json                   # TypeScript config with path aliases
├── package.json                    # Dependencies
└── README.md                       # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- MySQL 8.0+

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# 3. Setup database
npm run db:setup    # Create tables + seed data

# 4. Start development server
npm run start:dev   # http://localhost:3000
```

## 🏗️ Architecture Overview

### Domain-Driven Design (DDD) Pattern

Each module follows strict separation of concerns:

```
Module/
├── domain/
│   └── entity.ts              # Business entity with validation
│
├── application/
│   └── module.service.ts      # Business logic & CRUD operations
│
├── presentation/
│   └── module.controller.ts   # HTTP endpoints & request handling
│
├── dto/
│   └── module.dto.ts          # Request/response DTOs with validators
│
└── module.module.ts           # NestJS module configuration
```

### Role-Based Access Control (RBAC)

Three roles with granular permissions:

| Role | Permissions |
|------|------------|
| **ADMIN** | Full access: Create/Read/Update/Delete all resources |
| **LABORATORISTA** | Create analysis records, view reports, manage records |
| **PESAJE** | Create receptions, view producer data |

Protected endpoints use:
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleEnum.ADMIN, RoleEnum.LABORATORISTA)
@Post()
createResource(@Body() dto: CreateDto) { ... }
```

## 📊 Database Schema

### 11 Entities with Relationships:

1. **User** - Operators (3 roles: Admin, Lab, Pesaje)
2. **Producer** - Rice farmers with bank account info
3. **RiceType** - Rice varieties with pricing
4. **Season** - Temporal grouping (start/end dates)
5. **Template** - Quality analysis configuration
6. **AnalysisParam** - Discount ranges by parameter
7. **Reception** - Initial truck weighing (1 per truck)
8. **AnalysisRecord** - Quality analysis (1:1 with Reception)
9. **Advance** - Pre-harvest funding with interest
10. **Transaction** - Money movements tracking
11. **Settlement** - Final liquidation document

### Key Features:
- ✅ Soft deletes (audit trail preservation)
- ✅ Auto timestamps (createdAt, updatedAt)
- ✅ Foreign key relationships
- ✅ JSON columns for flexible data (bankAccounts, metadata)

## 🔐 Authentication & Security

### JWT Workflow
```
1. Login → POST /auth/login → Get access + refresh tokens
2. API calls → Include Bearer token in Authorization header
3. Token expires (15 min) → POST /auth/refresh → New token
4. Logout → Token invalidated
```

### Password Security
- Bcrypt hashing with salt rounds: 10
- Minimum 8 characters with uppercase, lowercase, numbers
- Server-side validation on all password operations

## 🛣️ API Routes

### Authentication
```
POST   /auth/login               # Login with email/password
POST   /auth/register            # Register new user (Admin only)
POST   /auth/refresh             # Refresh access token
GET    /auth/me                  # Get current user profile
GET    /auth/health              # Health check
```

### Users (Admin only)
```
GET    /users                    # List all users
GET    /users/:id                # Get user by ID
POST   /users                    # Create user
PATCH  /users/:id                # Update user
DELETE /users/:id                # Soft delete user
```

### Producers
```
GET    /producers                # List all producers
GET    /producers/:id            # Get producer details
POST   /producers                # Create producer (Admin)
PATCH  /producers/:id            # Update producer (Admin)
DELETE /producers/:id            # Soft delete producer (Admin)
POST   /producers/:id/bank-accounts       # Add bank account
PATCH  /producers/:id/bank-accounts/:aid  # Update bank account
DELETE /producers/:id/bank-accounts/:aid  # Remove bank account
```

### Configuration
```
GET    /configuration/rice-types                # List rice types
GET    /configuration/rice-types/:id            # Get rice type
POST   /configuration/rice-types                # Create (Admin)
PATCH  /configuration/rice-types/:id            # Update (Admin)

GET    /configuration/seasons                   # List seasons
GET    /configuration/seasons/active            # Get active season
GET    /configuration/seasons/:id               # Get season
POST   /configuration/seasons                   # Create (Admin)
PATCH  /configuration/seasons/:id               # Update (Admin)

GET    /configuration/templates                 # List templates
GET    /configuration/templates/default         # Get default
GET    /configuration/templates/:id             # Get template
POST   /configuration/templates                 # Create (Admin)
PATCH  /configuration/templates/:id             # Update (Admin)

GET    /configuration/analysis-params           # List params
GET    /configuration/analysis-params/:id       # Get param
GET    /configuration/analysis-params/code/:code # By code
POST   /configuration/analysis-params           # Create (Admin)
PATCH  /configuration/analysis-params/:id       # Update (Admin)
```

### Operations (Core Workflow)
```
GET    /operations/receptions                              # List receptions
GET    /operations/receptions/:id                          # Get reception
GET    /operations/producers/:id/receptions                # By producer
POST   /operations/receptions                              # Create (Pesaje/Admin)
PATCH  /operations/receptions/:id                          # Update
DELETE /operations/receptions/:id                          # Soft delete

GET    /operations/receptions/:receptionId/analysis        # Get analysis
POST   /operations/receptions/:receptionId/analysis        # Create (Lab/Admin)
PATCH  /operations/receptions/:receptionId/analysis        # Update

POST   /operations/receptions/:receptionId/calculate-discounts  # Calculate
POST   /operations/receptions/:receptionId/settle               # Settle
```

### Finances
```
GET    /finances/advances                           # List advances
GET    /finances/advances/:id                       # Get advance
POST   /finances/advances                           # Create (Admin)
PATCH  /finances/advances/:id                       # Update (Admin)
GET    /finances/advances/:id/interest              # Calculate interest

GET    /finances/transactions                       # List transactions
GET    /finances/transactions/:id                   # Get transaction
POST   /finances/transactions                       # Create (Admin)

GET    /finances/settlements                        # List settlements
GET    /finances/settlements/:id                    # Get settlement
POST   /finances/settlements                        # Create (Admin)
PATCH  /finances/settlements/:id                    # Update (Admin)
POST   /finances/settlements/:id/calculate          # Calculate amounts
POST   /finances/settlements/:id/complete           # Complete (Admin)
POST   /finances/settlements/:id/cancel             # Cancel (Admin)
```

### Analytics (Read-only Reports)
```
GET    /analytics/dashboard                        # Dashboard stats
GET    /analytics/dashboard?seasonId=1             # By season

GET    /analytics/producers/:id                    # Producer stats
GET    /analytics/producers/top                    # Top 10 producers
GET    /analytics/producers/top?limit=5            # Top N producers

GET    /analytics/seasons/:id/report               # Season report
GET    /analytics/quality/report                   # Quality analysis
GET    /analytics/quality/report?seasonId=1        # By season
GET    /analytics/finances/report                  # Financial summary
GET    /analytics/finances/report?seasonId=1       # By season
```

## 🧪 Development

### Available Scripts

```bash
npm run start           # Production build & run
npm run start:dev      # Development watch mode
npm run build          # Compile TypeScript
npm run test           # Run Jest unit tests
npm run test:e2e       # Run E2E tests
npm run test:cov       # Coverage report
npm run lint           # Run ESLint
npm run format         # Format with Prettier
npm run db:setup       # Create tables + seed
npm run db:drop        # Drop all tables
npm run db:migrate     # Run migrations
npm run db:seed        # Seed test data
```

### Environment Variables

```bash
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=redbull90
DATABASE_NAME=paddy

# JWT
JWT_SECRET=your-secret-key-here-min-32-chars
JWT_EXPIRATION=15m
JWT_REFRESH_SECRET=refresh-secret-key-here
JWT_REFRESH_EXPIRATION=7d

# Logging
LOG_LEVEL=debug
```

## 🔗 Module Dependencies

```
Analytics ← Operations, Finances, Producers
  ↓
Finances ← Operations, Producers
  ↓
Operations ← Configuration, Producers
  ↓
Configuration ← -
Users ← -
Producers ← -
Auth ← Users
```

## 📝 DTOs with Validation

All endpoints use DTOs with `class-validator` decorators:

```typescript
// Example: CreateReceptionDto
export class CreateReceptionDto {
  @IsNumber()
  @IsPositive()
  producerId: number;

  @IsString()
  guideNumber: string;

  @IsNumber()
  @IsPositive()
  grossWeight: number;

  @IsOptional()
  @IsBoolean()
  dryFeeApplied?: boolean;
}
```

Validations:
- ✅ Type checking (IsNumber, IsString, etc.)
- ✅ Range validation (IsPositive, Min, Max)
- ✅ Email validation
- ✅ Strong password requirements
- ✅ RUT format validation
- ✅ Custom validators for business rules

## 🧑‍💻 Recommended Workflow

1. **Start Backend**
   ```bash
   npm run start:dev
   ```

2. **Test Authentication**
   ```bash
   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@paddy.com","password":"Admin123!"}'
   ```

3. **Use JWT Token**
   ```bash
   curl -X GET http://localhost:3000/producers \
     -H "Authorization: Bearer <JWT_TOKEN>"
   ```

4. **Create Reception Workflow**
   - Create Producer → Create Reception → Create AnalysisRecord → Calculate Discounts → Settle

5. **Generate Reports**
   ```bash
   curl -X GET "http://localhost:3000/analytics/dashboard?seasonId=1" \
     -H "Authorization: Bearer <JWT_TOKEN>"
   ```

## 🐛 Error Handling

All errors return standardized format:

```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "User not found",
    "code": "NOT_FOUND",
    "timestamp": "2024-03-15T10:30:00Z"
  }
}
```

## 📚 Database Seeding

Default test data created on `npm run db:setup`:

**Users:**
- admin@paddy.com / Admin123! (ADMIN)
- lab@paddy.com / Lab123! (LABORATORISTA)
- pesaje@paddy.com / Pesaje123! (PESAJE)

**Producers:** 10 sample producers with bank accounts
**Rice Types:** 6 varieties (Largo Fino, Diamante, etc.)
**Seasons:** 2 seasons (2025-2026)
**Templates:** Default template + specialized templates

## 🚀 Deployment Checklist

- [ ] Update `.env` with production database
- [ ] Set `NODE_ENV=production`
- [ ] Update `JWT_SECRET` to strong random value
- [ ] Enable HTTPS / SSL
- [ ] Setup database backups
- [ ] Configure logging to file/service
- [ ] Setup monitoring & alerts
- [ ] Test all endpoints in production environment
- [ ] Document API for frontend team

## 📖 Next Steps

1. **Add OpenAPI/Swagger** - Auto-generated API documentation
2. **Add Integration Tests** - Test module interactions
3. **Add E2E Tests** - Test complete workflows
4. **Performance Optimization** - Database indexes, query optimization
5. **Add Caching Layer** - Redis for high-frequency queries
6. **Setup CI/CD** - GitHub Actions or GitLab CI

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Follow DDD pattern for new modules
3. Add DTOs with validators for all endpoints
4. Add tests for business logic
5. Submit PR with description

## 📞 Support

For issues or questions, contact the development team or refer to the project documentation in `/backend/docs/`.

---

**Last Updated:** March 2024
**Backend Version:** 1.0.0
**NestJS Version:** 10.3.3
**TypeORM Version:** 0.3.17
