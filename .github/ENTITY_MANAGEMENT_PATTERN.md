# Entity Management Screen Pattern

## Nombre del Patrón
**Entity Management Screen Pattern**

---

## Descripción del Patrón
Este patrón organiza una pantalla para gestionar entidades (por ejemplo, usuarios) con las siguientes características:

1. **Header**:
   - Contiene un título descriptivo de la entidad (por ejemplo, "Gestión de Usuarios").
   - Incluye un **TextField** para buscar entidades.
   - Incluye un **IconButton** para abrir un **diálogo de creación**.

2. **Grid de Cards**:
   - Muestra una lista de entidades en formato de **cards**.
   - Cada card incluye:
     - Información básica de la entidad (nombre, email, etc.).
     - Botones de acción (editar, eliminar).
     - Al hacer clic en el card o en los botones, se abren **diálogos contextuales**:
       - **Diálogo de edición**: Permite modificar los datos de la entidad.
       - **Diálogo de eliminación**: Solicita confirmación para eliminar la entidad.

3. **Diálogos Contextuales**:
   - **Diálogo de Creación**:
     - Se abre desde el **IconButton** en el header.
     - Contiene un formulario para crear una nueva entidad.
   - **Diálogo de Edición**:
     - Se abre desde el botón "Editar" en el card.
     - Contiene un formulario prellenado con los datos de la entidad seleccionada.
   - **Diálogo de Eliminación**:
     - Se abre desde el botón "Eliminar" en el card.
     - Solicita confirmación antes de eliminar la entidad.

---

## Estructura del Código
El patrón se organiza en carpetas siguiendo el enfoque **Feature-First + Clean Architecture**. Aquí está la estructura recomendada:

```
features/{entity}/
├── actions/
│   ├── create{Entity}.action.ts   // Acción para crear la entidad
│   ├── update{Entity}.action.ts   // Acción para actualizar la entidad
│   ├── delete{Entity}.action.ts   // Acción para eliminar la entidad
├── hooks/
│   ├── use{Entity}Query.ts        // Hook para obtener la lista de entidades
│   ├── useCreate{Entity}.ts       // Hook para manejar la creación
│   ├── useUpdate{Entity}.ts       // Hook para manejar la edición
│   ├── useDelete{Entity}.ts       // Hook para manejar la eliminación
├── services/
│   └── {entity}.service.ts        // Llamadas HTTP relacionadas con la entidad
├── store/
│   └── {entity}.store.ts          // Estado global específico de la entidad
├── components/
│   ├── {Entity}Card.tsx           // Componente para mostrar la información de la entidad
│   ├── {Entity}Grid.tsx           // Componente para organizar las cards en un grid
│   ├── {Entity}Header.tsx         // Header con el título, TextField y botón de creación
│   ├── Create{Entity}Dialog.tsx   // Diálogo para crear una nueva entidad
│   ├── Edit{Entity}Dialog.tsx     // Diálogo para editar una entidad existente
│   ├── Delete{Entity}Dialog.tsx   // Diálogo para confirmar la eliminación
├── types/
│   └── {entity}.types.ts          // Tipos e interfaces de la entidad
└── utils/
    └── {entity}Helpers.ts         // Funciones auxiliares específicas de la entidad
```

---

## Flujo de Trabajo
1. **Header**:
   - Renderiza el título de la pantalla.
   - Incluye un **TextField** para buscar entidades.
   - Incluye un **IconButton** que abre el **diálogo de creación**.

2. **Grid de Cards**:
   - Utiliza el hook `use{Entity}Query` para obtener la lista de entidades.
   - Renderiza un componente `Card` para cada entidad.
   - Cada card incluye:
     - Información básica de la entidad.
     - Botones para editar y eliminar.

3. **Diálogos**:
   - **Diálogo de Creación**:
     - Se abre desde el header.
     - Utiliza el hook `useCreate{Entity}` para manejar la lógica de creación.
   - **Diálogo de Edición**:
     - Se abre desde el botón "Editar" en el card.
     - Utiliza el hook `useUpdate{Entity}` para manejar la lógica de edición.
   - **Diálogo de Eliminación**:
     - Se abre desde el botón "Eliminar" en el card.
     - Utiliza el hook `useDelete{Entity}` para manejar la lógica de eliminación.

---

## Ejemplo de Implementación

### **1. Header**
```tsx
// features/users/components/UsersHeader.tsx
'use client';

import { TextField } from '@/shared/components/ui/TextField';
import { IconButton } from '@/shared/components/ui/IconButton';
import { useState } from 'react';
import { CreateUserDialog } from './CreateUserDialog';

export function UsersHeader() {
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <div className="flex justify-between items-center">
      <h1>Gestión de Usuarios</h1>
      <TextField placeholder="Buscar usuarios..." />
      <IconButton
        icon="add"
        onClick={() => setCreateDialogOpen(true)}
      />
      {isCreateDialogOpen && (
        <CreateUserDialog onClose={() => setCreateDialogOpen(false)} />
      )}
    </div>
  );
}
```

---

### **2. Card**
```tsx
// features/users/components/UserCard.tsx
'use client';

import { EditUserDialog } from './EditUserDialog';
import { DeleteUserDialog } from './DeleteUserDialog';
import { useState } from 'react';

export function UserCard({ user }) {
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <div className="card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => setEditDialogOpen(true)}>Editar</button>
      <button onClick={() => setDeleteDialogOpen(true)}>Eliminar</button>

      {isEditDialogOpen && (
        <EditUserDialog user={user} onClose={() => setEditDialogOpen(false)} />
      )}
      {isDeleteDialogOpen && (
        <DeleteUserDialog user={user} onClose={() => setDeleteDialogOpen(false)} />
      )}
    </div>
  );
}
```

---

### **3. Grid**
```tsx
// features/users/components/UsersGrid.tsx
'use client';

import { useUsersQuery } from '../hooks/useUsersQuery';
import { UserCard } from './UserCard';

export function UsersGrid() {
  const { data: users, isLoading } = useUsersQuery();

  if (isLoading) return <p>Cargando...</p>;

  return (
    <div className="grid">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

---

## Cómo Replicarlo para Otra Entidad
1. **Sustituye `users` por el nombre de la nueva entidad** (por ejemplo, `products`).
2. Crea una carpeta `features/{entity}` con la misma estructura.
3. Ajusta los nombres de los componentes, hooks, y servicios para la nueva entidad.
4. Reutiliza componentes del **Design System** (`TextField`, `IconButton`, etc.).

---

## Ventajas del Patrón
- **Modularidad**: Cada entidad tiene su propia carpeta y lógica encapsulada.
- **Reutilización**: Los componentes del Design System se reutilizan en todas las entidades.
- **Escalabilidad**: Fácil de extender para nuevas entidades.
- **Separación de responsabilidades**: La lógica de negocio, presentación y estado están claramente separadas.

Este patrón es ideal para aplicaciones con múltiples entidades que requieren pantallas CRUD similares.