# Copilot Instructions for Paddy Project

## 🎯 Project Overview
**Paddy** is a rice reception & financial management system with two integrated services:
- **Backend** (NestJS + TypeORM + MySQL): `backend/` → Rice reception processing, transactions, producer management, auditing
  - ✅ **Status**: DDD Architecture implemented (auth, users, producers modules complete)
  - **Setup**: See [backend/README.md](../backend/README.md)


## 🚀 Quick Start

```bash
# Terminal 1: Backend
cd backend
npm install
npm run db:setup        # Initialize MySQL & seed data
npm run start:dev       # Run on localhost:3000

# Terminal 2: Frontend

```

## 📋 Backend Status

### ✅ COMPLETED (100% DDD Implementation)
- **Authentication Module**: JWT tokens, login/register/refresh, Passport.js strategy
- **Users Module**: CRUD operations, Admin-only access, role management
- **Producers Module**: Full CRUD, bank account management (JSON arrays), RUT validation
- **Configuration Module**: RiceTypes, Seasons, Templates, AnalysisParams - all CRUD with default templates
- **Operations Module**: Receptions and AnalysisRecords with complete workflow (in_process → analyzed → settled)
- **Finances Module**: Advances, Transactions, Settlements with complex calculations (IVA, interest, settlement completion)
- **Analytics Module**: 6 read-only report endpoints with aggregations and filters
- **Shared Infrastructure**: Guards (JwtAuthGuard, RolesGuard), decorators (@Roles, @GetUser), filters, interceptors
- **Database**: TypeORM MySQL with 11 entities, soft deletes, audit timestamps, relationships
- **DTOs**: Complete validation with class-validator for all modules
- **Seeding**: Test data (3 users, 10 producers, 6 rice types, 2 seasons)

---

## 🎨 Frontend Architecture (Next.js Web Admin)

### Scope

These rules apply **ONLY** to Next.js frontend code:

- ✅ **Applies to:** `/PaddyFrontEnd/` (all application code)
- ❌ **Does NOT apply to:** `/backend`, or any other directory

### CRITICAL RULE

**GitHub Copilot is STRICTLY PROHIBITED from:**
- Creating files outside `/PaddyFrontEnd`
- Modifying code outside `/PaddyFrontEnd`
- Moving files outside `/PaddyFrontEnd`
- Affecting other applications (`/backend`)

**All frontend web logic MUST live within `/PaddyFrontEnd`**

---

### Architecture: Feature-First + Clean Architecture + App Router

The application follows **Feature-First Organization** with **Clean Architecture** adapted to Next.js App Router.

#### Fundamental Principle

**The folder `/app` does NOT represent the application.**

It represents **ONLY the routing system of the framework**.

Therefore, `/app` **MUST NOT contain:**
- ❌ Business logic
- ❌ HTTP calls
- ❌ Mutations
- ❌ API access
- ❌ Global state
- ❌ Domain validations
- ❌ Stores
- ❌ Application logic

**All business logic MUST live in `/features/*`**

---

### Mandatory Project Structure

```
PaddyFrontEnd/
├── src/
│   ├── app/              (Routes & layouts only - NO business logic)
│   ├── features/         (Business modules - MOST of the code)
│   ├── shared/           (Shared components, hooks, utilities)
│   ├── lib/              (HTTP clients, validators, utilities)
│   ├── config/           (Configuration & constants)
│   ├── styles/           (Global styles)
│   └── providers/        (Global providers)
```

---

### App Router (`/app`)

The `/app` folder **MUST contain ONLY:**
- `page.tsx` - Route pages (minimal logic)
- `layout.tsx` - Page layouts
- `loading.tsx` - Loading states
- `error.tsx` - Error handling
- `route.ts` - API routes
- `components/` - Page-specific components ONLY

#### App Router Rules

**The `/app` MUST NOT contain:**
- ❌ Business logic
- ❌ State management
- ❌ Reusable hooks
- ❌ Services
- ❌ API clients
- ❌ Domain validations
- ❌ Stores or Zustand

**Example WRONG structure:**
```
❌ app/orders/page.tsx          // Contains: API calls, state, logic
❌ app/orders/useOrders.ts      // Hooks shouldnot be here
❌ app/orders/ordersService.ts  // Services shouldnot be here
```

**Example CORRECT structure:**
```
✅ app/orders/page.tsx                          // Imports from features
✅ app/(dashboard)/orders/components/OrdersList.tsx  // Page-specific only
```

---

### Features (`/features`)

**ALL business functionality lives in: `/features`**

Each feature is self-contained and creates its own bounded context.

#### Feature Folder Pattern

```
features/{feature-name}/
├── actions/              (Server Actions - .action.ts)
│   ├── create.action.ts
│   ├── update.action.ts
│   ├── delete.action.ts
│   └── fetch.action.ts
├── components/           (UI Components for this feature)
│   ├── List.tsx
│   ├── Form.tsx
│   ├── Card.tsx
│   └── Dialog.tsx
├── hooks/                (Feature-specific hooks)
│   ├── useList.ts
│   ├── useForm.ts
│   └── useFilters.ts
├── services/             (Business logic, API calls)
│   ├── api.ts            (HTTP client calls)
│   ├── transformer.ts    (Data transformation)
│   └── validator.ts      (Domain validation)
├── store/                (Zustand store - if needed)
│   └── {feature}.store.ts
├── types/                (TypeScript types)
│   └── {feature}.types.ts
├── constants/            (Feature constants)
│   └── index.ts
└── index.ts              (Barrel export)
```

#### Example Feature: Orders

```
features/orders/
├── actions/
│   ├── createOrder.action.ts    // Server action for creation
│   ├── updateOrder.action.ts
│   ├── deleteOrder.action.ts
│   └── fetchOrders.action.ts
├── components/
│   ├── OrdersList.tsx           // Display orders
│   ├── OrderForm.tsx            // Create/Edit form
│   ├── OrderCard.tsx
│   └── OrderFilters.tsx
├── hooks/
│   ├── useOrdersList.ts         // Manages list state
│   ├── useOrderForm.ts          // Manages form state
│   └── useOrderFilters.ts
├── services/
│   ├── orders.api.ts            // HTTP calls to backend
│   ├── orders.transformer.ts    // DTO ↔ Domain mapping
│   └── orders.validator.ts      // Business rules validation
├── store/
│   └── orders.store.ts          // Zustand state if needed
├── types/
│   └── orders.types.ts
├── constants/
│   └── index.ts
└── index.ts                     // export { ... }
```

#### Feature Usage in App Router

```typescript
// app/(dashboard)/orders/page.tsx
import { OrdersList } from '@/features/orders/components'
import { fetchOrders } from '@/features/orders/actions'

export default async function OrdersPage() {
  const orders = await fetchOrders()
  
  return (
    <div>
      <h1>Orders</h1>
      <OrdersList initialData={orders} />
    </div>
  )
}
```

---

### Shared (`/shared`)

Shared components and utilities used across features.

```
shared/
├── components/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Dialog.tsx
│   ├── Modal.tsx
│   └── Table.tsx
├── hooks/
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── useFetch.ts
├── utils/
│   ├── formatters.ts
│   ├── validators.ts
│   └── helpers.ts
└── types/
    └── common.types.ts
```

---

### Lib (`/lib`)

HTTP clients, API utilities, and infrastructure code.

```
lib/
├── http/
│   ├── client.ts        // Axios/Fetch configuration
│   ├── interceptors.ts  // Request/Response interceptors
│   └── errorHandler.ts
├── validation/
│   ├── schemas.ts       // Zod/Yup schemas
│   └── validators.ts
└── utils/
    └── index.ts
```

---

### Key Rules for Contributors

1. **Features are independent modules** - Each feature can be understood in isolation
2. **No circular dependencies** - Features should not import from each other
3. **Server Actions for mutations** - All data mutations must be Server Actions
4. **Type safety everywhere** - All API responses must have TypeScript types
5. **Single responsibility** - Each file has one clear purpose
6. **Naming conventions**:
   - Server Actions: `*.action.ts`
   - Hooks: `use*.ts`
   - Components: `*.tsx`
   - Services: `*.service.ts` or `*.api.ts`
   - Types: `*.types.ts`

---

### 🔴 **OBLIGATORY: Use UI Components from `/shared/components/ui`**

**This is a PRIMARY OBLIGATION.** NEVER create TextField, Input, Select, Switch, Button, or any UI components from scratch.

#### Available UI Components in `/src/shared/components/ui`:

```
shared/components/ui/
├── TextField/           👈 USE for ALL text inputs, email, tel, dni, currency fields
├── Select/              👈 USE for dropdowns
├── Switch/              👈 USE for toggles and boolean fields
├── Button/              👈 USE for buttons
├── DataGrid/            👈 USE for table displays
├── Dialog/              👈 USE for modals
├── Alert/               👈 USE for alerts
├── Badge/               👈 USE for status badges
├── IconButton/          👈 USE for icon buttons
└── ... (other components)
```

#### TextField Types Supported:
- `type="text"` - Regular text input
- `type="email"` - Email input
- `type="tel"` - Telephone with phonePrefix support (e.g., "+56")
- `type="dni"` - Chilean DNI/RUT with automatic formatting (XX.XXX.XXX-X)
- `type="currency"` - Currency with symbol formatting
- `type="password"` - Password with visibility toggle
- `type="number"` - Number input

#### ✅ CORRECT Example:
```typescript
// ✅ Import from shared/components/ui
import { TextField } from '@/shared/components/ui/TextField/TextField';
import { Switch } from '@/shared/components/ui/Switch/Switch';
import { Select } from '@/shared/components/ui/Select/Select';

// ✅ Use in component
<TextField
  label="RUT"
  type="dni"
  value={rut}
  onChange={(e) => setRut(e.target.value)}
  placeholder="12.345.678-9"
/>

<TextField
  label="Teléfono"
  type="tel"
  phonePrefix="+56"
  value={phone}
  onChange={handleChange}
/>

<Switch
  label="Activo"
  checked={isActive}
  onChange={(checked) => setIsActive(checked)}
/>
```

#### ❌ WRONG Examples:
```typescript
// ❌ Creating custom TextField
const MyTextField = () => <input className="..." />

// ❌ Using plain HTML input
<input type="text" />

// ❌ Creating custom checkbox
<input type="checkbox" />

// ❌ Creating custom currency field
const CurrencyField = () => { /* ... */ }
```

#### 🛑 **Before Writing Any UI Code:**
1. **Check** `/src/shared/components/ui` for existing components
2. **Use** the appropriate component from this folder
3. **NEVER** create HTML inputs/selects/buttons from scratch
4. **NEVER** create custom styling duplicating existing components

---

### Test Users & Backend Connection

**Backend API**: `http://localhost:3000/api/v1`

**Test Credentials:**
```
admin@example.com / admin123 (ADMIN)
lab@example.com / admin123 (LABORATORISTA)
pesaje@example.com / admin123 (PESAJE)
```

**Environment Variables** (`.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
JWT_TOKEN_STORAGE_KEY=paddy_token
```

