# 🎨 Frontend Feature-First - Module Checklist

**Propósito**: Validación de features seguiendo Feature-First + Clean Architecture  
**Audiencia**: Code Review, QA, Developers  
**Tiempo**: 15-20 minutos por feature

---

## Pre-Implementación

Antes de crear una feature, verifica:

- [ ] **Feature no existe** - No duplicar código existente
- [ ] **Feature no existe en shared** - Si es reutilizable globalmente, crear en `/shared`, no en `/features`
- [ ] **No es API route** - Si es solo Backend, crear en `lib/api/`, no en features
- [ ] **Alcance claro** - Documentación o issue describe qué componentes y acciones se necesitan

---

## Estructura de Carpetas

- [ ] **Carpeta principal**: `src/features/[feature-name]/` existe
- [ ] **Subcarpetas**:
  - [ ] `actions/` existe
  - [ ] `components/` existe
  - [ ] `types/` existe
  - [ ] `index.ts` (barrel export) existe
- [ ] **NO hay carpetas no permitidas**:
  - [ ] ❌ NO `hooks/` en features (van en shared si son reutilizables)
  - [ ] ❌ NO `utils/` en features (van en shared si son reutilizables)
  - [ ] ❌ NO `services/` en features (toda lógica va en Server Actions)

---

## Types Layer

Verifica `features/[feature]/types/[feature].types.ts`:

- [ ] **Interfaz Principal** existe:
  ```typescript
  export interface [Feature] {
    id: string;
    // ... otros campos
  }
  ```

- [ ] **Create Payload** existe:
  ```typescript
  export interface Create[Feature]Payload {
    // campos requeridos sin id
  }
  ```

- [ ] **Update Payload** existe:
  ```typescript
  export interface Update[Feature]Payload {
    // todos los campos opcionales
  }
  ```

- [ ] **Tipos específicos** (si aplica):
  ```typescript
  export interface [SpecificAction][Feature]Payload { }
  ```

- [ ] **Sin `any`**: Todos los tipos están correctamente tipados
  - [ ] Verifica: `grep "any" features/[feature]/types/`
  - [ ] Si hay `any`, replanificar tipos

- [ ] **Campos opcionales correctos**:
  - [ ] Create: campos requeridos (sin `?`)
  - [ ] Update: campos opcionales (con `?`)
  - [ ] Otros: según lógica de negocio

---

## Actions Layer (Server Actions)

Verifica `features/[feature]/actions/[feature].action.ts`:

### Estructura General

- [ ] **`'use server'` en línea 1**: Archivo comienza con `'use server';`
- [ ] **Helper functions**:
  ```typescript
  function getAuthHeaders(token: string): HeadersInit { }
  function extractBackendErrorMessage(errorData: any, fallback: string): string { }
  ```

- [ ] **No hay lógica de UI**: Solo orquestación y HTTP calls
- [ ] **Asincronía correcta**: Todas las funciones son `async`
- [ ] **Manejo de errores**:
  - [ ] Try-catch en cada acción
  - [ ] Errores descriptivos al usuario
  - [ ] No expone detalles de infraestructura

### Autenticación

- [ ] **Obtiene sesión**: `const session = await getServerSession(authOptions);`
- [ ] **Valida sesión**: `if (!session?.user?.token) throw new Error('No autenticado');`
- [ ] **Usa token en headers**: `Authorization: Bearer ${session.user.token}`

### HTTP Calls

- [ ] **API_BASE_URL** definida:
  ```typescript
  const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/[feature-plural]`;
  ```

- [ ] **Headers correctos**:
  ```typescript
  headers: getAuthHeaders(session.user.token)
  ```

- [ ] **Métodos HTTP correctos**:
  - [ ] GET: listado, detalle
  - [ ] POST: crear
  - [ ] PUT: actualizar (NO PATCH)
  - [ ] DELETE: eliminar

- [ ] **Parsear JSON**: `response.json()`
- [ ] **Validar respuesta**: `if (!response.ok) throw new Error(...)`

### Acciones CRUD Estándar

#### CREAR
- [ ] Función: `create[Feature]Action(payload: Create[Feature]Payload): Promise<[Feature]>`
- [ ] Método: POST
- [ ] Endpoint: `/[feature-plural]`
- [ ] Headers: Authorization + Content-Type
- [ ] Error handling: ✅

#### LISTAR
- [ ] Función: `list[Features]Action(): Promise<[Feature][]>`
- [ ] Método: GET
- [ ] Endpoint: `/[feature-plural]` (con paginación si aplica)
- [ ] Retorna: Array de items
- [ ] Maneja respuestas diferentes (array directo vs `data.data`)
- [ ] Error handling: ✅

#### OBTENER UNO
- [ ] Función: `get[Feature]Action(id: string): Promise<[Feature]>`
- [ ] Método: GET
- [ ] Endpoint: `/[feature-plural]/{id}`
- [ ] Valida ID: ✅
- [ ] Error handling: ✅

#### ACTUALIZAR
- [ ] Función: `update[Feature]Action(id: string, payload: Update[Feature]Payload): Promise<[Feature]>`
- [ ] Método: PUT (NO PATCH)
- [ ] Endpoint: `/[feature-plural]/{id}`
- [ ] Headers: Authorization + Content-Type
- [ ] Error handling: ✅

#### ELIMINAR
- [ ] Función: `delete[Feature]Action(id: string): Promise<void>`
- [ ] Método: DELETE
- [ ] Endpoint: `/[feature-plural]/{id}`
- [ ] No retorna data (o retorna void)
- [ ] Error handling: ✅

---

## Components Layer

### Organización

- [ ] **Sin componentes innecesarios**: Cada componente tiene un propósito claro
- [ ] **No hay componentes UI personalizados**:
  - [ ] ❌ NO: `components/MyButton.tsx` (usa `from '@/shared/components/ui/Button'`)
  - [ ] ❌ NO: `components/MyTextField.tsx` (usa `from '@/shared/components/ui/TextField'`)
  - [ ] ✅ SÍ: `components/MyDataGrid.tsx` (feature-specific)

- [ ] **Estructura recomendada**:
  - [ ] `[Feature]Page.tsx` (página principal)
  - [ ] `[Feature]DataGrid.tsx` (lista)
  - [ ] `[Feature]Form.tsx` (formulario compartido para create/update)
  - [ ] `Create[Feature]Dialog.tsx`
  - [ ] `Update[Feature]Dialog.tsx` (opcional si reutiliza form)
  - [ ] `Delete[Feature]Dialog.tsx`
  - [ ] `detail/[Feature]DetailDialog.tsx` (si necesita vista detallada)

### Componentes Cliente ('use client')

- [ ] **`'use client'` en línea 1**: Componentes interactivos empiezan con `'use client';`
- [ ] **Estado local**: 
  - [ ] Datos: obtenidos via props `initialData`, no en el componente
  - [ ] UI: `isLoading`, `error`, `isOpen`, etc. ✅
  - [ ] Form: valores del formulario ✅

- [ ] **Sin HTTP calls** (❌ CRÍTICO):
  - [ ] Verifica: `grep "fetch\|axios" components/`
  - [ ] Si hay: mover a Server Action
  - [ ] HTTP calls SOLO en `actions/` con `'use server'`

- [ ] **Importa Server Actions correctamente**:
  ```typescript
  import { createFeatureAction } from '../actions/[feature].action';
  ```

- [ ] **Llama Server Actions**:
  ```typescript
  const result = await createFeatureAction(payload);
  ```

- [ ] **Maneja errores de Server Action**:
  ```typescript
  try {
    await createFeatureAction(...);
  } catch (error) {
    setError(error.message);
  }
  ```

- [ ] **No expone errores internos**: Mensajes claros al usuario

### Componente Página ([Feature]Page.tsx)

- [ ] **Props**: recibe `initialData: [Feature][]`
  ```typescript
  interface [Features]PageProps {
    initialData: [Feature][];
  }
  ```

- [ ] **Estado**:
  - [ ] `[[features], set[Features]]` para la lista
  - [ ] `[searchQuery, setSearchQuery]` para búsqueda
  - [ ] Diálogos: `[createOpen, setCreateOpen]`, etc.

- [ ] **Búsqueda/Filtrado**: `useMemo` para filtrar por `searchQuery`

- [ ] **Renderiza**:
  - [ ] Encabezado con título y botón "Nuevo"
  - [ ] DataGrid con lista filtrada
  - [ ] Diálogos (create, update, delete, detail)

- [ ] **Callbacks**:
  - [ ] `handleCreateSuccess`: agrega a lista
  - [ ] `handleUpdateSuccess`: actualiza en lista
  - [ ] `handleDeleteSuccess`: remueve de lista

### Componente DataGrid ([Feature]DataGrid.tsx)

- [ ] **Props**:
  ```typescript
  interface [Features]DataGridProps {
    [features]: [Feature][];
    onSearch?: (query: string) => void;
    onEdit?: (item: [Feature]) => void;
    onDelete?: (item: [Feature]) => void;
    searchValue?: string;
  }
  ```

- [ ] **Usa DataGrid compartido**: `from '@/shared/components/ui/DataGrid'`
- [ ] **Columnas definidas**: `useMemo` de columnas
- [ ] **Menú de acciones**: Edit, Delete, etc.
- [ ] **Search integrado**: si `onSearch` se proporciona

### Componente Dialog ([Feature]Dialog.tsx)

- [ ] **Props**:
  ```typescript
  interface Create[Feature]DialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: ([feature]: [Feature]) => void;
  }
  ```

- [ ] **Estado de formulario**: `useState` con valores iniciales
- [ ] **Estados de UI**: `isLoading`, `error`
- [ ] **Resetea al crear**: `setFormData({ ... })`
- [ ] **Manejo de errores**: muestra en UI
- [ ] **Botones**: Cancelar + Crear/Actualizar
- [ ] **Deshabilita en loading**: `disabled={isLoading}`
- [ ] **Usa componentes UI compartidos**: TextField, Select, Button, etc.

### Formularios (si aplica)

- [ ] **Reutiliza componentes de UI**:
  ```typescript
  import { TextField } from '@/shared/components/ui/TextField/TextField';
  import { Select } from '@/shared/components/ui/Select/Select';
  import { Button } from '@/shared/components/ui/Button/Button';
  ```

- [ ] **Tipos soportados en TextField**:
  - [ ] `type="text"` ✅
  - [ ] `type="email"` ✅
  - [ ] `type="tel"` (con `phonePrefix`) ✅
  - [ ] `type="dni"` (formato RUT automático) ✅
  - [ ] `type="currency"` (con símbolo) ✅
  - [ ] `type="password"` (toggle visibilidad) ✅
  - [ ] `type="number"` ✅

- [ ] **NO crea inputs custom**:
  - [ ] ❌ `<input type="text" />` (usa TextField)
  - [ ] ❌ `<select>...` (usa Select)
  - [ ] ❌ `<button>` HTML (usa Button compartido)

- [ ] **Validación**: en form o en Server Action
- [ ] **Submit**: llama a Server Action

---

## App Router Layer

Verifica `app/paddy/[feature]/page.tsx`:

### Estructura

- [ ] **Archivo existe**: `app/paddy/[feature]/page.tsx`
- [ ] **Es async**: `export default async function Page() { }`
- [ ] **Obtiene datos**: llama Server Action
- [ ] **Pasa props**: `<[Features]Page initialData={data} />`

### Contenido REQUERIDO

- [ ] **Sin lógica de negocio**: solo routing
- [ ] **Sin componentes UI directos**: importa de features
- [ ] **Sin estado local**: data viene de Server Action
- [ ] **Importa de features**: `from '@/features/[feature]/components'`

### Contenido PROHIBIDO

- [ ] ❌ NO estado (`useState`)
- [ ] ❌ NO efectos (`useEffect`)
- [ ] ❌ NO `'use client'`
- [ ] ❌ NO componentes de UI personalizados
- [ ] ❌ NO Server Actions inline
- [ ] ❌ NO `fetch` directo (usa Server Actions)

### Ejemplo Correcto

```typescript
import { [Features]Page } from '@/features/[feature]/components';
import { list[Features]Action } from '@/features/[feature]/actions';

export const metadata = { title: '[Features]' };

export default async function Page() {
  const initialData = await list[Features]Action();
  return <[Features]Page initialData={initialData} />;
}
```

---

## Tipos y Imports

- [ ] **Tipos importados correctamente**:
  ```typescript
  import { [Feature], Create[Feature]Payload } from '../types/[feature].types';
  ```

- [ ] **Sin tipos duplicados**:
  - [ ] Si existe en backend, traer via API
  - [ ] Si es local, documentar por qué

- [ ] **Type safety**: `strict: true` en `tsconfig.json`
- [ ] **Sin `any`**:
  ```bash
  grep -r "any" src/features/[feature]/ # NO debería retornar nada
  ```

- [ ] **TypeScript compile**: `npm run build` sin errores

---

## Barrel Exports (index.ts)

Verifica `features/[feature]/index.ts`:

```typescript
// ✅ DEBE TENER:
export { default as [Features]Page } from './components/[Features]Page';
export { default as [Features]DataGrid } from './components/[Features]DataGrid';
export { default as Create[Feature]Dialog } from './components/Create[Feature]Dialog';
export * from './actions/[feature].action';
export type * from './types/[feature].types';
```

- [ ] **Exports nombrados correctamente**: Match con nombre de la feature
- [ ] **Usa `export type` para tipos**: import type { ... } from '@/features/[feature]'
- [ ] **Fácil de importar**: `from '@/features/[feature]'`

---

## Compartir Código (Shared)

Si hay código reutilizable en esta feature:

- [ ] **Componentes UI**: ¿necesita estar en `shared/components/ui/`?
- [ ] **Hooks**: ¿está en `shared/hooks/` si es reutilizable?
- [ ] **Utilities**: ¿está en `shared/utils/` si es reutilizable?
  
Si es específico de la feature: ✅ OK en features/[feature]/

---

## Testing (Opcional pero Recomendado)

- [ ] **Tests existen**: `__tests__/` en la feature
- [ ] **Server Actions**: tests de casos de éxito y error
- [ ] **Componentes**: tests de UI (rendering, click, etc.)
- [ ] **Coverage**: mínimo 80% en funciones críticas

---

## Performance

- [ ] **Usa `useMemo`**: para cálculos costosos (filtrado, sorting)
- [ ] **Lazy loading**: diálogos se cargan solo cuando se usan
- [ ] **No re-renders innecesarios**: props cambien solo cuando sea necesario
- [ ] **DataGrid**: tiene paginación si dataset es grande

---

## Accesibilidad

- [ ] **Labels en inputs**: todos los campos tienen `<label>` o atributo `aria-label`
- [ ] **Keyboard navigation**: diálogos se pueden cerrar con ESC
- [ ] **Focus management**: después de crear, foco en resultado o botón seguro
- [ ] **ARIA attributes**: si componentes complejos

---

## Seguridad

- [ ] **No expone secrets**: no hay API keys en componentes
- [ ] **Validación backend**: confía en backend, no solo en cliente
- [ ] **CSRF protection**: usa NextAuth (ya en lib)
- [ ] **XSS protection**: usa espacios seguros, no `dangerouslySetInnerHTML`
- [ ] **Roles y permisos**: si aplica, usa `useCan()` hook

---

## Documentación

- [ ] **Comentarios de tipos**: interfaces documentadas
- [ ] **JSDoc en funciones públicas**: Server Actions documentadas
- [ ] **README**: si feature es compleja, crear `features/[feature]/README.md`

---

## Build & Deployment

- [ ] **Sin errores TypeScript**: `npm run build` OK
- [ ] **Sin warnings**: revisar output de build
- [ ] **Sin console.log**: solo en desarrollo
- [ ] **Optimizado**: no hay imports innecesarios

---

## Checklist Final

- [ ] Toda estructura de carpetas ✅
- [ ] Types tipados correctamente ✅
- [ ] Server Actions completas ✅
- [ ] Componentes sin lógica HTTP ✅
- [ ] App router limpio ✅
- [ ] Imports y exports correctos ✅
- [ ] TypeScript compile sin errores ✅
- [ ] Build sin warnings ✅
- [ ] Code review aprobado ✅
- [ ] Funcionamiento probado en navegador ✅

---

## 🎉 Feature Lista!

Si todas las casillas están marcadas, tu feature está lista para producción ✅

**Próximo paso**: Deploy o code review 🚀

