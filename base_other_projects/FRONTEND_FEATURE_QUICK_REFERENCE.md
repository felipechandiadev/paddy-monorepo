# 🎨 Frontend Feature-First - Quick Reference & Templates

**Tiempo**: 5 minutos  
**Propósito**: Copy-paste ready templates para nueva features  
**Nivel**: Todos (desarrollo rápido)

---

## Estructura Base Feature

Copia esta estructura para crear una nueva feature:

```bash
mkdir -p src/features/[feature-name]/{actions,components,types}
```

---

## Template 1: Types File

Copia esto a `features/[feature]/types/[feature].types.ts`:

```typescript
// features/[feature-name]/types/[feature-name].types.ts

/**
 * DTO del backend
 */
export interface [Feature] {
  id: string;
  // ... agregar campos según tu feature
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Payload para crear
 */
export interface Create[Feature]Payload {
  // ... campos para crear
}

/**
 * Payload para actualizar
 */
export interface Update[Feature]Payload {
  // ... campos para actualizar (todos opcionales)
}

/**
 * Payload para una acción específica
 */
export interface [SpecificAction][Feature]Payload {
  // ... campos específicos
}
```

**Ejemplo Real (Productor)**:

```typescript
export interface Producer {
  id: string;
  name: string;
  rut: string;
  email: string;
  bankAccounts: BankAccount[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProducerPayload {
  name: string;
  rut: string;
  email: string;
}

export interface UpdateProducerPayload {
  name?: string;
  rut?: string;
  email?: string;
}

export interface AddBankAccountProducerPayload {
  bankName: string;
  accountNumber: string;
  accountType: 'checking' | 'savings';
}
```

---

## Template 2: Server Actions

Copia esto a `features/[feature]/actions/[feature].action.ts`:

```typescript
// features/[feature-name]/actions/[feature-name].action.ts
'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { throwIfBackendUnavailable } from '@/lib/api/backend-connection-error';
import {
  [Feature],
  Create[Feature]Payload,
  Update[Feature]Payload,
} from '../types/[feature-name].types';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/[feature-plural]`;

/**
 * Obtener headers de autenticación
 */
function getAuthHeaders(token: string): HeadersInit {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Extraer mensaje de error del backend
 */
function extractBackendErrorMessage(
  errorData: any,
  fallback: string,
): string {
  const parseMessage = (value: unknown): string | null => {
    if (Array.isArray(value)) {
      const parsed = value
        .map((entry) => {
          if (typeof entry === 'string') return entry;
          if (entry && typeof entry === 'object' && 'message' in entry) {
            const nested = (entry as any).message;
            return typeof nested === 'string' ? nested : String(nested);
          }
          return String(entry);
        })
        .filter((entry) => entry.trim().length > 0);

      return parsed.length > 0 ? parsed.join(', ') : null;
    }

    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }

    return null;
  };

  return (
    parseMessage(errorData?.message) ||
    parseMessage(errorData?.error) ||
    fallback
  );
}

/**
 * CREAR: Crea nuevo [feature]
 */
export async function create[Feature]Action(
  payload: Create[Feature]Payload,
): Promise<[Feature]> {
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
        `Error al crear: ${response.statusText}`,
      );
      throw new Error(message);
    }

    return response.json();
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error('Error desconocido al crear');
  }
}

/**
 * LISTAR: Obtiene lista de [features]
 */
export async function list[Features]Action(): Promise<[Feature][]> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.token) {
    throw new Error('No autenticado');
  }

  await throwIfBackendUnavailable();

  try {
    const response = await fetch(`${API_BASE_URL}?page=1&limit=100`, {
      headers: getAuthHeaders(session.user.token),
    });

    if (!response.ok) {
      throw new Error('Error al listar');
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error('Error desconocido al listar');
  }
}

/**
 * OBTENER UN: Por ID
 */
export async function get[Feature]Action(id: string): Promise<[Feature]> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.token) {
    throw new Error('No autenticado');
  }

  await throwIfBackendUnavailable();

  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      headers: getAuthHeaders(session.user.token),
    });

    if (!response.ok) {
      throw new Error('No encontrado');
    }

    return response.json();
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error('Error desconocido al obtener');
  }
}

/**
 * ACTUALIZAR: Actualiza [feature]
 */
export async function update[Feature]Action(
  id: string,
  payload: Update[Feature]Payload,
): Promise<[Feature]> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.token) {
    throw new Error('No autenticado');
  }

  await throwIfBackendUnavailable();

  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(session.user.token),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = extractBackendErrorMessage(
        errorData,
        `Error al actualizar: ${response.statusText}`,
      );
      throw new Error(message);
    }

    return response.json();
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error('Error desconocido al actualizar');
  }
}

/**
 * ELIMINAR: Elimina [feature]
 */
export async function delete[Feature]Action(id: string): Promise<void> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.token) {
    throw new Error('No autenticado');
  }

  await throwIfBackendUnavailable();

  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(session.user.token),
    });

    if (!response.ok) {
      throw new Error('Error al eliminar');
    }
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error('Error desconocido al eliminar');
  }
}
```

---

## Template 3: Create Dialog

Copia esto a `features/[feature]/components/Create[Feature]Dialog.tsx`:

```typescript
// features/[feature-name]/components/Create[Feature]Dialog.tsx
'use client';

import React, { useState } from 'react';
import { create[Feature]Action } from '../actions/[feature-name].action';
import {
  [Feature],
  Create[Feature]Payload,
} from '../types/[feature-name].types';
import { TextField } from '@/shared/components/ui/TextField/TextField';
import { Button } from '@/shared/components/ui/Button/Button';
import { Dialog } from '@/shared/components/ui/Dialog/Dialog';

interface Create[Feature]DialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: ([feature]: [Feature]) => void;
}

export default function Create[Feature]Dialog({
  open,
  onClose,
  onSuccess,
}: Create[Feature]DialogProps) {
  const [formData, setFormData] = useState<Create[Feature]Payload>({
    // Inicializar campos
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await create[Feature]Action(formData);
      setFormData({ /* reset */ });
      onSuccess(result);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Crear [Feature]"
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <TextField
          label="Campo 1"
          name="field1"
          type="text"
          value={formData.field1 || ''}
          onChange={handleChange}
          required
        />

        <TextField
          label="Campo 2"
          name="field2"
          type="email"
          value={formData.field2 || ''}
          onChange={handleChange}
          required
        />

        {/* Agregar más campos según payload */}

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

---

## Template 4: DataGrid Component

Copia esto a `features/[feature]/components/[Features]DataGrid.tsx`:

```typescript
// features/[feature-name]/components/[Features]DataGrid.tsx
'use client';

import React, { useMemo } from 'react';
import { DataGrid } from '@/shared/components/ui/DataGrid/DataGrid';
import { [Feature] } from '../types/[feature-name].types';

interface [Features]DataGridProps {
  [features]: [Feature][];
  onSearch?: (query: string) => void;
  onEdit?: (item: [Feature]) => void;
  onDelete?: (item: [Feature]) => void;
  searchValue?: string;
}

export default function [Features]DataGrid({
  [features],
  onSearch,
  onEdit,
  onDelete,
  searchValue = '',
}: [Features]DataGridProps) {
  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 100,
      },
      {
        accessorKey: 'field1',
        header: 'Campo 1',
      },
      {
        accessorKey: 'field2',
        header: 'Campo 2',
      },
      // Agregar columnas según [Feature]
    ],
    [],
  );

  return (
    <DataGrid
      columns={columns}
      data={[features]}
      onSearch={onSearch}
      searchValue={searchValue}
      onRowClick={(row) => onEdit?.(row.original)}
      rowMenu={[
        {
          label: 'Editar',
          onClick: (row) => onEdit?.(row),
        },
        {
          label: 'Eliminar',
          onClick: (row) => onDelete?.(row),
          isDangerous: true,
        },
      ]}
    />
  );
}
```

---

## Template 5: Feature Page Component

Copia esto a `features/[feature]/components/[Features]Page.tsx`:

```typescript
// features/[feature-name]/components/[Features]Page.tsx
'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useCan } from '@/shared/hooks/useCan';
import [Features]DataGrid from './[Features]DataGrid';
import Create[Feature]Dialog from './Create[Feature]Dialog';
import { [Feature] } from '../types/[feature-name].types';

interface [Features]PageProps {
  initialData: [Feature][];
}

export default function [Features]Page({
  initialData,
}: [Features]PageProps) {
  const { can } = useCan();
  const [[features], set[Features]] = useState<[Feature][]>(initialData);
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Filtrar por búsqueda
  const filtered[Features] = useMemo(() => {
    if (!searchQuery) return [features];

    const lowerQuery = searchQuery.toLowerCase();
    return [features].filter((item) =>
      // Agregar criterios de búsqueda según tus campos
      String(item.field1).toLowerCase().includes(lowerQuery) ||
      String(item.field2).toLowerCase().includes(lowerQuery)
    );
  }, [[features], searchQuery]);

  const handleCreateSuccess = useCallback((new[Feature]: [Feature]) => {
    set[Features]((prev) => [new[Feature], ...prev]);
  }, []);

  const handleDeleteSuccess = useCallback(([featureId]: string) => {
    set[Features]((prev) =>
      prev.filter((item) => item.id !== [featureId])
    );
  }, []);

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">[Features]</h1>
        {can('create', '[feature]') && (
          <button
            onClick={() => setCreateDialogOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Nueva [Feature]
          </button>
        )}
      </div>

      <[Features]DataGrid
        [features]={filtered[Features]}
        onSearch={(query) => setSearchQuery(query)}
        searchValue={searchQuery}
      />

      {can('create', '[feature]') && (
        <Create[Feature]Dialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
}
```

---

## Template 6: App Router Page

Copia esto a `app/paddy/[feature]/page.tsx`:

```typescript
// app/paddy/[feature-name]/page.tsx

import { [Features]Page } from '@/features/[feature-name]/components';
import { list[Features]Action } from '@/features/[feature-name]/actions';

export const metadata = {
  title: '[Features]',
};

export default async function Page() {
  const initialData = await list[Features]Action();

  return (
    <div>
      <[Features]Page initialData={initialData} />
    </div>
  );
}
```

---

## Template 7: Barrel Export (Index)

Copia esto a `features/[feature]/index.ts`:

```typescript
// features/[feature-name]/index.ts

// Components
export { default as [Features]Page } from './components/[Features]Page';
export { default as [Features]DataGrid } from './components/[Features]DataGrid';
export { default as Create[Feature]Dialog } from './components/Create[Feature]Dialog';

// Actions
export * from './actions/[feature-name].action';

// Types
export type * from './types/[feature-name].types';
```

---

## Checklist: Feature Completa

Cuando termines, verifica:

- [ ] Carpeta `features/[feature]/` creada
- [ ] `types/[feature].types.ts` con interfaces
- [ ] `actions/[feature].action.ts` con Server Actions
- [ ] `components/[Features]Page.tsx` (principal)
- [ ] `components/[Features]DataGrid.tsx` (lista)
- [ ] `components/Create[Feature]Dialog.tsx` (crear)
- [ ] `index.ts` con barrel exports
- [ ] `app/paddy/[feature]/page.tsx` creado
- [ ] No hay lógica de negocio en app router
- [ ] USA componentes compartidos de `/shared`
- [ ] Tipos TypeScript completos (no `any`)

---

## Pasos Rápidos (5 minutos)

```bash
# 1. Crear estructura
mkdir -p src/features/mi-feature/{actions,components,types}

# 2. Copiar templates
# - Copiar Template 1 → src/features/mi-feature/types/mi-feature.types.ts
# - Copiar Template 2 → src/features/mi-feature/actions/mi-feature.action.ts
# - Copiar Template 3 → src/features/mi-feature/components/CreateMiFeatureDialog.tsx
# - Copiar Template 5 → src/features/mi-feature/components/MiFeaturesPage.tsx
# - Copiar Template 7 → src/features/mi-feature/index.ts

# 3. Copiar page en app router
# - Copiar Template 6 → app/paddy/mi-feature/page.tsx

# 4. Reemplazar placeholders:
# [feature] → mi-feature
# [Feature] → MiFeature
# [Features] → MiFeatures
# [feature-plural] → mis-features

# 5. npm run build && npm run dev
```

---

## 🎉 Listo!

Ya tienes todo para crear features rápidamente. ¡A codificar! 🚀

