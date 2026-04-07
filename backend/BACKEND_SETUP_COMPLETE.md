# Paddy Backend - Setup Complete ✅

## System Status

**Backend**: Running on `http://localhost:3000`  
**API Prefix**: `/api/v1/`  
**Database**: MySQL (paddy database - localhost:3306)  

## Test Users Available

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | admin123 | ADMIN |
| lab@example.com | admin123 | LABORATORISTA |
| pesaje@example.com | admin123 | PESAJE |

## Quick Start

### 1. Login to Get JWT Token
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

Response includes `access_token` - use this for authenticated requests:
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGc...",
    "userId": 1,
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

### 2. Access Protected Endpoints
```bash
curl -X GET http://localhost:3000/api/v1/producers \
  -H "Authorization: Bearer <TOKEN>"
```

## Reference Data Available

### Rice Types (4 types)
- DIAMANTE (600 $/kg)
- ZAFIRO (550 $/kg)
- PANTERA (500 $/kg)
- CUARZO (520 $/kg)

### Seasons (2 active)
- SUMMER2026: Jan 1 - Mar 31, 2026
- WINTER2026: Apr 1 - Jun 30, 2026

### Producers (3 test producers)
- Juan García (RUT: 12345678-9)
- María López (RUT: 87654321-K)
- Carlos Rodríguez (RUT: 11223344-5)

## Module Endpoints

| Module | Base URL | Operations |
|--------|----------|------------|
| Auth | `/api/v1/auth` | login, register, refresh, me, health |
| Users | `/api/v1/users` | CRUD, role management |
| Producers | `/api/v1/producers` | CRUD, bank account management |
| Configuration | `/api/v1/configuration` | Rice types, seasons, templates, analysis params |
| Operations | `/api/v1/operations` | Receptions, analysis records |
| Finances | `/api/v1/finances` | Advances, transactions, settlements |
| Analytics | `/api/v1/analytics` | Reports and aggregations |

## Database Schema

The database includes 11 entities with proper relationships:
- **users** - System users with roles
- **producers** - Rice producers
- **rice_types** - Rice variety catalog
- **seasons** - Harvest seasons
- **receptions** - Rice reception records
- **analysis_records** - Quality analysis data
- **analysis_params** - Analysis parameter templates
- **advances** - Producer financial advances
- **transactions** - Financial transactions
- **settlements** - Settlement records
- **templates** - DDD configuration templates

## Commands

**Start Backend** (if not running):
```bash
cd /Users/felipe/dev/paddy/backend
npm run start:dev
```

**Build Backend**:
```bash
npm run build
```

**Run Tests**:
```bash
npm run test
npm run test:e2e
```

**Database**:
```bash
# Seed database with test data
npm run db:seed

# Run migrations
npm run db:migrate
```

## Next Steps

1. ✅ Backend running and operational
2. ✅ Test users created
3. ✅ Database seeded with reference data
4. ⏳ Integrate frontend (NextJS) with backend
5. ⏳ Test complete workflows (Reception → Analysis → Settlement)
6. ⏳ Deploy to production

## API Documentation

Access Swagger documentation (if enabled):
```
http://localhost:3000/api/docs
```

## Notes

- All timestamps are stored in UTC
- Passwords are hashed with bcryptjs (10 rounds)
- JWT tokens expire in 15 minutes
- API uses role-based access control (RBAC)
- Database auto-synchronizes on startup for development

---
**Last Updated**: 2026-03-08
**Backend Version**: 1.0.0
**NestJS**: v10.3.3
**TypeORM**: v0.3.17
