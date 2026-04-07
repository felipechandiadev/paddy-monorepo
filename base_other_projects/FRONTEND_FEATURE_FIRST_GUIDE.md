# 🎨 Frontend Feature-First Architecture - Guía Completa

**Tiempo**: 30 minutos  
**Nivel**: Principiante → Intermedio  
**Propósito**: Entender y aplicar Feature-First + Clean Architecture en Next.js

---

## Tabla de Contenidos

1. [Concepto Fundamental](#concepto-fundamental)
2. [Estructura Detallada](#estructura-detallada)
3. [Patrones Clave](#patrones-clave)
4. [Flujo Completo: Ejemplo Productor](#flujo-completo-ejemplo-productor)
5. [Best Practices](#best-practices)
6. [Decisiones de Arquitectura](#decisiones-de-arquitectura)

---

## Concepto Fundamental

### El Problema: Cómo NO Organizar un Frontend

Imagina que así está organizado tu proyecto:

```
❌ INCORRECTO (Tipo-Based):

src/
├── components/           (500+ componentes)
│   ├── Button.tsx
│   ├── TextField.tsx
│   ├── Dialog.tsx
│   ├── ProducersDataGrid.tsx
│   ├── CreateProducerForm.tsx
│   ├── ProducersPage.tsx
│   ├── ReceptionsDataGrid.tsx
│   ├── CreateReceptionForm.tsx
│   ├── ReceptionsPage.tsx
│   └── ... (100 más)
│
├── hooks/                (componentDirty)
│   ├── useProducers.ts
│   ├── useReceptions.ts
│   ├── useFinances.ts
│   └── ... (30 más)
│
├── services/             (Fat Services)
│   ├── producers.service.ts  (200 líneas, múltiples métodos)
│   └── receptions.service.ts (300 líneas)
│
└── pages/
    ├── producers.tsx
    ├── receptions.tsx
    ├── finances.tsx
    └── ... (20 más)

PROBLEMAS:
- Dónde pongo el código de Productor?
- Es un componente nuevo? Va en /components/
- Es una API call? Va en /services/
- Es un hook? Va en /hooks/
- Difícil de entender qué va junto
- Imposible aislar una feature para reutilizar
```

### La Solución: Feature-First Architecture

```
✅ CORRECTO (Feature-Based):

src/features/
├── producers/               👈 TODO lo de Productores
│   ├── actions/
│   │   └── producers.action.ts
│   ├── components/
│   │   ├── ProducersPage.tsx
│   │   ├── ProducersDataGrid.tsx
│   │   ├── CreateProducerDialog.tsx
│   │   └── detail/
│   ├── types/
│   │   └── producers.types.ts
│   └── index.ts
│
├── receptions/              👈 TODO lo de Recepciones
│   ├── actions/
│   │   └── receptions.action.ts
│   ├── components/
│   │   ├── ReceptionsPage.tsx
│   │   ├── ReceptionsDataGrid.tsx
│   │   └── CreateReceptionDialog.tsx
│   ├── types/
│   │   └── receptions.types.ts
│   └── index.ts
│
├── shared/                  👈 Código reutilizable
│   ├── components/ui/
│   │   ├── TextField/
│   │   ├── Select/
│   │   ├── DataGrid/
│   │   └── ...
│   └── hooks/
│       └── useCan.ts

VENTAJAS:
- ¿Nuevo código de Productor? → features/producers/
- Estructura predecible: actions, components, types
- Fácil aislar una feature (copiar carpeta = funciona)
- Crecimiento predecible y escalable
```

---

## Estructura Detallada

### 1. Carpeta `/app` - SOLO ROUTING

```
app/
├── layout.tsx             👈 Layout raíz
├── page.tsx               👈 Home page
├── globals.css            👈 Estilos globales
├── sitemap.ts
│
├── (dashboard)/           👈 Grupo de rutas (sin /dashboard en URL)
│   ├── layout.tsx         👈 Layout de dashboard
│   ├── page.tsx           👈 /dashboard (redirige a /paddy)
│   │
│   └── paddy/
│       ├── layout.tsx     👈 Layout de paddy
│       │
│       ├── page.tsx       👈 /paddy (home del dashboard)
│       │
│       ├── producers/
│       │   └── page.tsx   👈 /paddy/producers
│       │
│       ├── receptions/
│       │   ├── page.tsx   👈 /paddy/receptions
│       │   └── [id]/
│       │       └── page.tsx   👈 /paddy/receptions/:id
│       │
│       ├── reports/
│       │   └── page.tsx   👈 /paddy/reports
│       │
│       └── finances/
│           └── page.tsx   👈 /paddy/finances
│
└── api/
    └── auth/
        └── [...nextauth]/
            └── route.ts   👈 NextAuth endpoints
```

**REGLA CRÍTICA**:
```typescript
// ✅ app/paddy/producers/page.tsx DEBE TENER:
- Solo imports de features/producers
- Llamadas a Server Actions
- NO lógica de negocio

❌ app/paddy/producers/page.tsx NO DEBE TENER:
- Estado local complejo
- Componentes de UI específicos (van en features)
- HTTP calls (van en Server Actions)
- Validaciones (van en Server Actions)
```

**Ejemplo Correcto**:
```typescript
// ✅ app/paddy/producers/page.tsx
import { ProducersPage } from '@/features/producers/components';
import { listProducersAction } from '@/features/producers/actions';

export default async function Page() {
  const producers = await listProducersAction();
  
  return (
    <div>
      <h1>Productores</h1>
      <ProducersPage initialData={producers} />
    </div>
  );
}
```

### 2. Carpeta `/features` - LA LÓGICA VA AQUÍ

Cada feature es un **bounded context** independiente:

#### Estructura Base de Feature:

```
features/[feature-name]/
├── actions/
│   ├── [action-1].action.ts
│   ├── [action-2].action.ts
│   └── index.ts
│
├── components/
│   ├── [Feature]Page.tsx      (Componente principal)
│   ├── [Feature]DataGrid.tsx  (Lista)
│   ├── Create[Feature]Dialog.tsx
│   ├── Update[Feature]Dialog.tsx
│   ├── Delete[Feature]Dialog.tsx
│   ├── [Feature]Form.tsx      (Form compartido)
│   ├── detail/
│   │   └── [Feature]DetailDialog.tsx
│   └── index.ts
│
├── types/
│   └── [feature-name].types.ts
│
├── constants/                  (Opcional)
│   └── index.ts
│
└── index.ts                   (Barrel export)
```

#### Ejemplo Real: Feature Producers

```
features/producers/
├── actions/
│   ├── producers.action.ts    (Contiene: list, create, update, delete, addBankAccount)
│   └── index.ts
│
├── components/
│   ├── ProducersPage.tsx      (Componente principal con estado)
│   ├── ProducersDataGrid.tsx  (DataGrid de lista)
│   ├── CreateProducerDialog.tsx
│   ├── UpdateProducerDialog.tsx
│   ├── DeleteProducerDialog.tsx
│   ├── ProducerForm.tsx       (Form reutilizado en create/update)
│   ├── detail/
│   │   └── ProducerDetailDialog.tsx
│   └── index.ts
│
├── types/
│   └── producers.types.ts
│
└── index.ts
```

### 3. Carpeta `/shared` - COMPONENTES REUTILIZABLES

```
shared/
├── components/
│   ├── ui/                    👈 COMPONENTES VISUALES
│   │   ├── TextField/
│   │   │   ├── TextField.tsx
│   │   │   ├── TextField.types.ts
│   │   │   └── TextField.module.css
│   │   │
│   │   ├── Select/
│   │   │   ├── Select.tsx
│   │   │   └── ...
│   │   │
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── ...
│   │   │
│   │   ├── DataGrid/
│   │   │   ├── DataGrid.tsx
│   │   │   ├── DataGrid.types.ts
│   │   │   └── ...
│   │   │
│   │   ├── Dialog/
│   │   ├── Alert/
│   │   ├── Badge/
│   │   ├── IconButton/
│   │   ├── Switch/
│   │   └── ... (otros)
│   │
│   └── PrintDialog/           👈 COMPONENTES DE NEGOCIO (reutilizables)
│       ├── PrintDialog.tsx
│       └── usePrint.ts
│
├── hooks/                      👈 HOOKS REUTILIZABLES
│   ├── useCan.ts              (Verificar permisosrol)
│   ├── useBrowserCompat.ts    (Compatibilidad de navegador)
│   └── ... (otros)
│
├── utils/                      👈 UTILIDADES PURAS
│   ├── formatters.ts          (Formatear fecha, moneda, etc.)
│   ├── validators.ts          (Validaciones)
│   └── ...
│
├── types/                      👈 TIPOS GLOBALES
│   └── global.types.ts
│
└── providers/                  👈 CONTEXT PROVIDERS
    ├── SessionProvider.tsx
    └── ...
```

**REGLA**: Si lo necesitan múltiples features, va en `/shared`.

### 4. Carpeta `/lib` - INFRAESTRUCTURA

```
lib/
├── api/
│   ├── client.ts              (Configuración HTTP)
│   ├── interceptors.ts        (Interceptores de request/response)
│   └── backend-connection-error.ts
│
├── auth.config.ts             (Configuración NextAuth)
│
├── browser-compatibility.ts   (Detectar capacidades del navegador)
│
└── audit-headers.ts           (Headers para auditoría)
```

---

## Patrones Clave

### Patrón 1: Server Actions (Mutaciones)

```typescript
// ✅ features/producers/actions/producers.action.ts
'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { throwIfBackendUnavailable } from '@/lib/api/backend-connection-error';
import {
  Producer,
  CreateProducerPayload,
} from '../types/producers.types';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/producers`;

// --- STEP 1: Obtener headers de autenticación ---
function getAuthHeaders(token: string): HeadersInit {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

// --- STEP 2: Extraer error del backend ---
function extractBackendErrorMessage(
  errorData: any,
  fallback: string,
): string {
  // Parsear respuesta de error del backend
  if (errorData?.message) {
    return Array.isArray(errorData.message)
      ? errorData.message.join(', ')
      : errorData.message;
  }
  return fallback;
}

// --- STEP 3: Crear Productor ---
export async function createProducerAction(
  payload: CreateProducerPayload,
): Promise<Producer> {
  // Obtener sesión
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) {
    throw new Error('No autenticado');
  }

  await throwIfBackendUnavailable();

  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(session.user.token),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = extractBackendErrorMessage(
        errorData,
        `Error ${response.status}: ${response.statusText}`,
      );
      throw new Error(message);
    }

    return response.json();
  } catch (error) {
    throw error;
  }
}

// --- STEP 4: Listar Productores ---
export async function listProducersAction(): Promise<Producer[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) {
    throw new Error('No autenticado');
  }

  await throwIfBackendUnavailable();

  try {
    const response = await fetch(
      `${API_BASE_URL}?page=1&limit=100`,
      {
        headers: getAuthHeaders(session.user.token),
      },
    );

    if (!response.ok) {
      throw new Error(`Error de lista: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    throw error;
  }
}
```

**Características de Server Actions**:
- ✅ `'use server'` al principio
- ✅ Acceso a sesión (seguro en servidor)
- ✅ Llamadas HTTP (sin CORS)
- ✅ Manejo de errores
- ✅ Parsing de respuestat
- ✅ Sin exponer secrets

### Patrón 2: Componentes que Usan Server Actions

```typescript
// ✅ features/producers/components/CreateProducerDialog.tsx
'use client';

import React, { useState } from 'react';
import { createProducerAction } from '../actions/producers.action';
import { CreateProducerPayload, Producer } from '../types/producers.types';
import { TextField } from '@/shared/components/ui/TextField/TextField';
import { Button } from '@/shared/components/ui/Button/Button';
import { Dialog } from '@/shared/components/ui/Dialog/Dialog';

interface CreateProducerDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (producer: Producer) => void;
}

export default function CreateProducerDialog({
  open,
  onClose,
  onSuccess,
}: CreateProducerDialogProps) {
  // Estado local para UI
  const [name, setName] = useState('');
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Llamar Server Action
      const newProducer = await createProducerAction({
        name,
        rut,
        email,
      });

      // Éxito
      setName('');
      setRut('');
      setEmail('');
      onSuccess(newProducer);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title="Crear Productor">
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <TextField
          label="Nombre"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <TextField
          label="RUT"
          type="dni"  👈 Formatea automáticamente
          value={rut}
          onChange={(e) => setRut(e.target.value)}
          placeholder="12.345.678-9"
          required
        />

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            isLoading={isLoading}
          >
            Crear
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
```

**Características**:
- ✅ `'use client'` (componente cliente)
- ✅ Estado local para UI (loading, error, form values)
- ✅ Importa y llama Server Action
- ✅ Maneja respuestas y errores
- ✅ Usa componentes compartidos de `/shared`

### Patrón 3: Componente Principal (Página)

```typescript
// ✅ features/producers/components/ProducersPage.tsx
'use client';

import React, { useState, useCallback, useMemo } from 'react';
import ProducersDataGrid from './ProducersDataGrid';
import CreateProducerDialog from './CreateProducerDialog';
import { Producer } from '../types/producers.types';

interface ProducersPageProps {
  initialData: Producer[];
}

export default function ProducersPage({ initialData }: ProducersPageProps) {
  const [producers, setProducers] = useState<Producer[]>(initialData);
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Filtrar por búsqueda
  const filteredProducers = useMemo(() => {
    if (!searchQuery) return producers;

    const lowerQuery = searchQuery.toLowerCase();
    return producers.filter((p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.rut.toLowerCase().includes(lowerQuery) ||
      p.email.toLowerCase().includes(lowerQuery)
    );
  }, [producers, searchQuery]);

  const handleCreateSuccess = useCallback((newProducer: Producer) => {
    setProducers((prev) => [newProducer, ...prev]);
  }, []);

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Productores</h1>
        <button
          onClick={() => setCreateDialogOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Nuevo Productor
        </button>
      </div>

      <ProducersDataGrid
        producers={filteredProducers}
        onSearch={(query) => setSearchQuery(query)}
        searchValue={searchQuery}
      />

      <CreateProducerDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
```

### Patrón 4: Tipos y Interfases

```typescript
// ✅ features/producers/types/producers.types.ts

// Datos que vienen del backend
export interface Producer {
  id: string;
  name: string;
  rut: string;
  email: string;
  phone?: string;
  address?: string;
  bankAccounts: BankAccount[];
  createdAt: Date;
  updatedAt: Date;
}

// Datos para crear
export interface CreateProducerPayload {
  name: string;
  rut: string;
  email: string;
}

// Datos para actualizar
export interface UpdateProducerPayload {
  name?: string;
  rut?: string;
  email?: string;
}

// Cuenta bancaria
export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountType: 'checking' | 'savings';
}
```

---

## Flujo Completo: Ejemplo Productor

### Vista Previa

```
User clicks "Nuevo Productor"
    ↓
ProducersPage abre CreateProducerDialog
    ↓
User completa formulario y hace click "Crear"
    ↓
Dialog llama createProducerAction (Server Action)
    ↓
Server Action valida sesión
    ↓
Server Action hace POST a backend API
    ↓
Backend crea productor en DB
    ↓
Backend retorna Producer creado
    ↓
Server Action retorna al Dialog
    ↓
Dialog actualiza lista local
    ↓
User ve nuevo productor en DataGrid
```

### Step-by-Step Implementación

#### PASO 1: Crear tipos

```typescript
// features/producers/types/producers.types.ts
export interface Producer {
  id: string;
  name: string;
  rut: string;
  email: string;
}

export interface CreateProducerPayload {
  name: string;
  rut: string;
  email: string;
}
```

#### PASO 2: Crear Server Actions

```typescript
// features/producers/actions/producers.action.ts
'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';

export async function createProducerAction(
  payload: CreateProducerPayload,
): Promise<Producer> {
  const session = await getServerSession(authOptions);
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/producers`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.user.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) throw new Error('Crear productor falló');
  return response.json();
}

export async function listProducersAction(): Promise<Producer[]> {
  const session = await getServerSession(authOptions);
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/producers`,
    {
      headers: {
        'Authorization': `Bearer ${session.user.token}`,
      },
    },
  );

  if (!response.ok) throw new Error('Listar productores falló');
  return response.json();
}
```

#### PASO 3: Crear componentes

```typescript
// features/producers/components/CreateProducerDialog.tsx
'use client';
import { createProducerAction } from '../actions/producers.action';
import { Producer, CreateProducerPayload } from '../types/producers.types';

export default function CreateProducerDialog({ onSuccess, onClose }) {
  const [formData, setFormData] = useState<CreateProducerPayload>({...});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await createProducerAction(formData);
      onSuccess(result);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return <form onSubmit={handleSubmit}>{/* JSX */}</form>;
}
```

#### PASO 4: Usar en app router

```typescript
// app/paddy/producers/page.tsx
import { listProducersAction } from '@/features/producers/actions';
import { ProducersPage } from '@/features/producers/components';

export default async function Page() {
  const initialData = await listProducersAction();
  return <ProducersPage initialData={initialData} />;
}
```

---

## Best Practices

### 1. Nunca Hacer HTTP Calls en Componentes Cliente

```typescript
❌ INCORRECTO:
'use client';
async function ProducersList() {
  const [producers, setProducers] = useState([]);
  
  useEffect(() => {
    // ❌ NO: HTTP call desde cliente
    fetch('/api/producers')
      .then(r => r.json())
      .then(setProducers);
  }, []);
}

✅ CORRECTO:
// Server Action en features/producers/actions/producers.action.ts
'use server';
export async function listProducersAction() {
  const response = await fetch(...);
  return response.json();
}

// Cliente
'use client';
async function ProducersList({ initialData }: { initialData: Producer[] }) {
  const [producers, setProducers] = useState(initialData);
  // HTTP ya se hizo en servidor
}
```

### 2. Reutilizar Componentes de UI

```typescript
❌ INCORRECTO:
// features/producers/components/ProducerForm.tsx
export function ProducerForm() {
  return (
    <div>
      <input type="text" />  👈 NO: criar input custom
      <select>...selecthtml</select>  👈 NO: crear select custom
    </div>
  );
}

✅ CORRECTO:
import { TextField } from '@/shared/components/ui/TextField/TextField';
import { Select } from '@/shared/components/ui/Select/Select';

export function ProducerForm() {
  return (
    <div>
      <TextField label="Nombre" />
      <Select label="Banco" options={banks} />
    </div>
  );
}
```

### 3. Features Independientes

```typescript
❌ INCORRECTO:
// features/producers/components/Foo.tsx
import { ReceptionsDataGrid } from '@/features/receptions/components';
// ❌ NO: importar entre features

✅ CORRECTO:
// Si necesitan componente compartido:
import { SharedDataGrid } from '@/shared/components/ui/DataGrid/DataGrid';
// O crear su propia DataGrid en la feature
```

### 4. Errores Bien Manejados

```typescript
❌ INCORRECTO:
export async function createProducerAction(payload) {
  const response = await fetch(...);
  return response.json();
  // Si falla, error hacia el usuario sin detalles
}

✅ CORRECTO:
export async function createProducerAction(payload) {
  try {
    const response = await fetch(...);
    
    if (!response.ok) {
      const errorData = await response.json();
      const message = extractErrorMessage(errorData);
      throw new Error(message);
    }

    return response.json();
  } catch (error) {
    // Re-throw con mensaje claro
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Error desconocido al crear productor'
    );
  }
}
```

---

## Decisiones de Arquitectura

### ¿Componentes en App Router?

**Sí**, pero solo si son página-específicos:

```typescript
// ✅ app/paddy/producers/components/ProducersHeader.tsx
// OK - específico de página

// ❌ app/paddy/producers/components/Button.tsx
// MAL - usa esta: shared/components/ui/Button/

// ❌ app/paddy/producers/components/ProducersDataGrid.tsx
// MAL - usa esta: features/producers/components/ProducersDataGrid.tsx
```

### ¿Server Actions en Shared?

**No**. Server Actions son específicos de feature:

```typescript
// ✅ features/producers/actions/producers.action.ts

// ❌ shared/actions/  NIDAo existe
```

### ¿Dónde van los Hooks Auxiliares?

```typescript
// En una sola feature:
features/producers/hooks/useProducerForm.ts

// En múltiples features:
shared/hooks/useMyCustomHook.ts
```

### ¿DTOs vs Tipos Locales?

```typescript
// ✅ Tipos de backend como DTOs
export interface Producer {
  id: string;
  name: string;
  // ... desde backend
}

// ✅ Tipos locales del componente
interface ProducerFormData {
  name: string;
  rut: string;
  email: string;
}

// Usar ambos según contexto
```

---

## 🎉 Conclusión

Ahora sabes:

- ✅ Qué va en `/app` (SOLO rutas)
- ✅ Qué va en `/features` (TODA la lógica)
- ✅ Qué va en `/shared` (código REUTILIZABLE)
- ✅ Cómo hacer Server Actions
- ✅ Cómo conectar componentes con acciones
- ✅ Best practices y decisiones de arquitectura

**Próximo paso**: Usa [FRONTEND_FEATURE_QUICK_REFERENCE.md](./FRONTEND_FEATURE_QUICK_REFERENCE.md) para templates copy-paste.

