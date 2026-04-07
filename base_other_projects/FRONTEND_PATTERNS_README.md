# 🎨 Frontend Patterns - Arquitectura Feature-First + Clean Architecture

**Para**: Desarrolladores que necesitan aplicar esta estructura en otros proyectos frontend Next.js  
**Versión**: 1.0  
**Status**: ✅ Producción-Ready

---

## 📚 Documentación Disponible

Este repositorio contiene **documentación completa** para implementar la arquitectura Feature-First + Clean Architecture en proyectos frontend Next.js:

| Documento | Tiempo | Propósito | Audiencia |
|-----------|--------|----------|-----------|
| **[FRONTEND_PATTERNS_README.md](./FRONTEND_PATTERNS_README.md)** | 5 min | Índice y conceptos clave | Todos |
| **[FRONTEND_FEATURE_FIRST_GUIDE.md](./FRONTEND_FEATURE_FIRST_GUIDE.md)** | 30 min | Guía completa con ejemplos | Principiantes a Intermedios |
| **[FRONTEND_FEATURE_QUICK_REFERENCE.md](./FRONTEND_FEATURE_QUICK_REFERENCE.md)** | 5 min | Templates copy-paste lista | Todos (desarrollo rápido) |
| **[FRONTEND_MODULE_CHECKLIST.md](./FRONTEND_MODULE_CHECKLIST.md)** | - | Checklist de validación | Code Review / QA |

---

## 🎯 Principios Fundamentales

### 1️⃣ **App Router = Sistema de Rutas SOLAMENTE**

El `/app` NO es tu aplicación. Es SOLO el sistema de routing del framework.

```
❌ INCORRECTO:
app/
├── features/
├── components/
├── hooks/
└── business-logic/

✅ CORRECTO:
app/
├── page.tsx         (Página)
├── layout.tsx       (Layout)
└── [id]/
    └── page.tsx     (Página dinámica)

features/            (VA AQUÍ toda la lógica)
├── producers/
├── receptions/
└── ...
```

### 2️⃣ **Features = Módulos Independientes**

Cada feature es un **bounded context** con:
- Sus propios componentes
- Sus propias acciones (Server Actions)
- Sus propios tipos
- Sus propios hooks
- Todo lo que necesita para funcionar

```
features/producers/
├── actions/         (Server Actions para mutaciones)
├── components/      (Componentes que usan esta feature)
├── types/           (TypeScript types específicos)
├── index.ts         (Barrel export)
└── constants/       (Opcional: constantes)
```

### 3️⃣ **Shared = Reutilizable Globalmente**

Componentes y hooks que se usan en **múltiples features**:

```
shared/
├── components/      (UI Components: Button, TextField, DataGrid, etc.)
├── hooks/           (Hooks: useDebounce, useFetch, etc.)
├── utils/           (Utilidades puras: formatters, validators)
└── types/           (Tipos compartidos)
```

### 4️⃣ **Lib = Infraestructura**

Clients HTTP, configuración, autenticación:

```
lib/
├── api/             (HTTP client + interceptors)
├── auth.config.ts   (NextAuth configuración)
└── browser-compat.ts (Utilities de ambiente)
```

---

## 🏗️ Arquitectura Completa

```
frontend/
├── src/
│   ├── app/                    👈 SOLO RUTAS (Next.js App Router)
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   ├── (dashboard)/
│   │   └── api/
│   │
│   ├── features/               👈 LÓGICA = VAS AQUÍ
│   │   ├── producers/
│   │   │   ├── actions/
│   │   │   │   └── producers.action.ts
│   │   │   ├── components/
│   │   │   │   ├── ProducersPage.tsx
│   │   │   │   ├── ProducersDataGrid.tsx
│   │   │   │   ├── CreateProducerDialog.tsx
│   │   │   │   └── detail/
│   │   │   ├── types/
│   │   │   │   └── producers.types.ts
│   │   │   ├── constants/      (Opcional)
│   │   │   │   └── index.ts
│   │   │   └── index.ts        (Barrel export)
│   │   │
│   │   ├── receptions/
│   │   ├── finances/
│   │   ├── reports/
│   │   └── ...
│   │
│   ├── shared/                 👈 REUTILIZABLE GLOBALMENTE
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── TextField/
│   │   │   │   ├── Select/
│   │   │   │   ├── Button/
│   │   │   │   ├── DataGrid/
│   │   │   │   ├── Dialog/
│   │   │   │   └── ... (otros)
│   │   │   └── PrintDialog/
│   │   ├── hooks/
│   │   │   ├── useCan.ts
│   │   │   ├── useBrowserCompat.ts
│   │   │   └── ...
│   │   ├── utils/
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   └── ...
│   │   └── types/
│   │       └── global.types.ts
│   │
│   ├── lib/                    👈 INFRAESTRUCTURA
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   └── backend-connection-error.ts
│   │   ├── auth.config.ts
│   │   └── browser-compatibility.ts
│   │
│   ├── providers/              👈 CONTEXT PROVIDERS
│   │   └── SessionProvider.tsx
│   │
│   ├── middleware.ts
│   ├── global.d.ts
│   └── styles/
│       └── global.css
│
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.js
└── README.md
```

---

## 🎓 Conceptos Clave

### Feature-First Architecture

**Idea Principal**: Organiza por **funcionalidad** (features), no por tipo de archivo.

```
❌ ANTIGUO (Type-Based):
components/
  Button.tsx
  DataGrid.tsx
  ...

pages/
  producers.tsx
  receptions.tsx

hooks/
  useProducers.ts
  useReceptions.ts

services/
  producers.service.ts
  receptions.service.ts

❌ Este enfoque es difícil de:
- Encontrar código relacionado
- Entender qué feature usa qué
- Aislar un módulo para reutilizar

✅ NUEVO (Feature-Based):
features/
├── producers/
│   ├── actions/
│   ├── components/
│   └── types/
├── receptions/
│   ├── actions/
│   ├── components/
│   └── types/
└── shared/
    ├── components/ (UI compartida)
    └── hooks/

✅ Es fácil:
- Todo relacionado a una feature en un lugar
- Estructura predecible
- Fácil de aislar y reutilizar
```

### Clean Architecture en Frontend

**Capas**:

1. **Presentation (Componentes React)**
   - `components/*.tsx`
   - Lógica de UI solamente
   - Inyecta datos vía props

2. **Application (Server Actions)**
   - `actions/*.action.ts`
   - Orquesta la lógica de negocio
   - Hace llamadas HTTP al backend
   - Maneja errores

3. **Types (Tipado)**
   - `types/*.types.ts`
   - DTOs del backend
   - Tipos de componentes
   - Enums

4. **Infrastructure (Lib)**
   - `lib/api/` → HTTP client
   - `lib/auth.config.ts` → Autenticación
   - Abstracciones de servicios externos

---

## 🚀 Patrones Clave

### 1. Server Actions (Mutaciones)

```typescript
// ✅ features/producers/actions/producers.action.ts
'use server';

import { getServerSession } from 'next-auth';

export async function createProducerAction(
  payload: CreateProducerPayload,
): Promise<Producer> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user.id) {
    throw new Error('No autenticado');
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/producers`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.user.token}`,
        'Content-Type': 'application/json',
        'X-User-Id': session.user.id,
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  return response.json();
}
```

Características:
- `'use server'` en la parte superior
- Acceso a sesión/autenticación
- Manejo de errores
- Llamada HTTP al backend

### 2. Componentes Cliente que Usan Server Actions

```typescript
// ✅ features/producers/components/CreateProducerDialog.tsx
'use client';

import { useState } from 'react';
import { createProducerAction } from '../actions/producers.action';

export default function CreateProducerDialog() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (payload: CreateProducerPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      const newProducer = await createProducerAction(payload);
      // ✅ Actualizar estado, mostrar toast, etc.
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleCreate({ /* datos */ });
      }}>
        {/* Formulario aquí */}
      </form>
    </Dialog>
  );
}
```

Características:
- `'use client'` arriba
- Importa Server Action
- Usa estado local para UI (loading, error)
- Llama Server Action como función normal

### 3. Componentes Compartidos (UI)

```typescript
// ✅ shared/components/ui/TextField/TextField.tsx
// NO DUPLICAR EN FEATURES - usar este de shared

import { TextField } from '@/shared/components/ui/TextField/TextField';

// En componente de feature:
<TextField
  label="Nombre"
  type="text"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

// Tipos soportados:
- text       (texto normal)
- email      (correo)
- tel        (teléfono con phonePrefix)
- dni        (RUT chileno con formato XX.XXX.XXX-X)
- currency   (moneda con símbolo)
- password   (contraseña con toggle)
- number     (número)
```

### 4. Tipos Compartidos

```typescript
// ✅ features/producers/types/producers.types.ts
export interface Producer {
  id: string;
  name: string;
  rut: string;
  email: string;
  bankAccounts: BankAccount[];
  createdAt: Date;
}

export interface CreateProducerPayload {
  name: string;
  rut: string;
  email: string;
}

export type ProducerResponse = Producer;
```

---

## 🔄 Flujo Típico de Uso

### Crear una Nueva Feature

**Paso 1**: Crear carpeta de feature
```bash
mkdir -p src/features/[feature-name]/{actions,components,types}
```

**Paso 2**: Crear tipos
```typescript
// features/[feature-name]/types/[feature-name].types.ts
export interface MyFeature {
  id: string;
  // ...
}
```

**Paso 3**: Crear Server Actions
```typescript
// features/[feature-name]/actions/[feature-name].action.ts
'use server';
export async function createMyFeatureAction(payload) { /* ... */ }
```

**Paso 4**: Crear Componentes
```typescript
// features/[feature-name]/components/MyFeaturePage.tsx
'use client';
export default function MyFeaturePage() { /* ... */ }
```

**Paso 5**: Usar en App Router
```typescript
// app/[feature-name]/page.tsx
import { MyFeaturePage } from '@/features/[feature-name]/components';

export default function Page() {
  return <MyFeaturePage />;
}
```

---

## ✅ Checklist Rápido

Antes de implementar una feature, verifica:

- [ ] Feature está en `features/[feature-name]/`
- [ ] App router solo tiene rutas (no lógica)
- [ ] Componentes compartidos viven en `shared/components/ui/`
- [ ] Server Actions están en `actions/` con `'use server'`
- [ ] Tipos están en `types/`
- [ ] No hay componentes duplicados (reutilizar de `shared/`)
- [ ] HTTP calls solo en Server Actions (nunca en componentes cliente)
- [ ] Errors manejados correctamente
- [ ] TypeScript `strict: true` en tsconfig

---

## 📖 Próximos Pasos

1. **Principiante?** → Lee [FRONTEND_FEATURE_FIRST_GUIDE.md](./FRONTEND_FEATURE_FIRST_GUIDE.md) (30 minutos) ✅

2. **En desarrollo?** → Usa [FRONTEND_FEATURE_QUICK_REFERENCE.md](./FRONTEND_FEATURE_QUICK_REFERENCE.md) (templates) ✅

3. **En code review?** → Valida con [FRONTEND_MODULE_CHECKLIST.md](./FRONTEND_MODULE_CHECKLIST.md) ✅

4. **Ya entiendes la estructura?** → Salta directo a implementar usando templates ✅

---

## 🤔 FAQ

### ¿Puedo tener componentes en el app router?

Sí, pero **SOLO si son específicos de una página**:

```typescript
// ✅ app/orders/components/OrdersSummary.tsx (página específica)
// ❌ app/components/Button.tsx (reutilizable - va en shared)
// ❌ app/features/ (features NO van en app)
```

### ¿Dónde va un hook reutilizado?

- En una sola feature → `features/[feature]/hooks/`
- En múltiples features → `shared/hooks/`

### ¿Server Actions en shared?

**NO**. Server Actions son **específicos de feature**:

```
✅ features/producers/actions/producers.action.ts
❌ shared/actions/ (no existe)
```

### ¿Puedo tener una feature sin componentes?

Sí, si es solo Server Actions + tipos:

```
features/analytics/
├── actions/
│   └── analytics.action.ts
└── types/
    └── analytics.types.ts
```

### ¿Puedo importar de feature A en feature B?

❌ **NO**. Features son independientes.

```typescript
// ❌ INCORRECTO:
// features/receptions/components/Foo.tsx
import { ProducersDataGrid } from '@/features/producers/components';

// ✅ CORRECTO - usa shared si necesita reutilizar:
import { SharedDataGrid } from '@/shared/components/ui/DataGrid';
```

---

## 🎉 Conclusión

Esta arquitectura da:

- ✅ **Modularidad**: Features independientes
- ✅ **Escalabilidad**: Fácil agregar nuevas features
- ✅ **Mantenibilidad**: Código predecible y organizado
- ✅ **Reutilización**: Components compartidos en `shared/`
- ✅ **Testabilidad**: Componentes y acciones aisladas
- ✅ **Type Safety**: TypeScript en todas partes

**¡Ya puedes implementar esto en otros proyectos!** 🚀

