# 🎨 Sistema de Diseño y Normas Gráficas - Web Admin

**Guía oficial de desarrollo y normas visuales para la aplicación web-admin**

Este documento define los estándares de diseño, patrones de UI y normas de implementación para garantizar consistencia visual y de comportamiento en toda la aplicación.

---

## 📑 Tabla de Contenidos

1. [Sistema de Colores](#-sistema-de-colores)
2. [Tipografía](#-tipografía)
3. [Espaciado y Layout](#-espaciado-y-layout)
4. [Diseño de Cards](#-diseño-de-cards)
5. [Diseño de Diálogos](#-diseño-de-diálogos)
6. [Layouts Tipo List](#-layouts-tipo-list)
7. [Layouts Tipo DataGrid](#-layouts-tipo-datagrid)
8. [Componentes del Design System](#-componentes-del-design-system)
9. [Iconografía](#-iconografía)
10. [Estados y Feedback](#-estados-y-feedback)
11. [Badges y Pills](#-badges-y-pills)
12. [Botones y Acciones](#-botones-y-acciones)
13. [Formularios](#-formularios)
14. [Responsive Design](#-responsive-design)
15. [Reglas de Composición](#-reglas-de-composición)

---

## 🎨 Sistema de Colores

### Paleta Principal

La aplicación utiliza un sistema de colores basado en variables CSS para garantizar consistencia y facilitar cambios globales.

```css
:root {
  --color-primary: #1C2046;      /* Azul oscuro corporativo */
  --color-secondary: #04C9E7;    /* Cyan/turquesa */
  --color-background: #ffffff;   /* Fondo principal */
  --color-foreground: #131615;   /* Texto principal */
  --color-border: #c1c1c2;       /* Bordes */
  --color-accent: #2563a8;       /* Azul acento */
  --color-muted: #6b7280;        /* Texto secundario */
  --color-success: #4CAF50;      /* Verde éxito */
  --color-info: #2196F3;         /* Azul información */
  --color-warning: #FFC107;      /* Amarillo alerta */
  --color-error: #F44336;        /* Rojo error */
  --color-neutral: #F3F4F6;      /* Gris neutro */
}
```

### Uso de Colores

**Textos:**
- Primario: `text-foreground` (#131615)
- Secundario: `text-muted` o `text-neutral-600`
- Marca: `text-primary` (#1C2046)
- Acento: `text-secondary` (#04C9E7)

**Fondos:**
- Principal: `bg-white` o `bg-background`
- Neutro: `bg-neutral` o `bg-gray-50`
- Primario: `bg-primary` (azul oscuro)
- Secundario: `bg-secondary` (cyan)
- Acento: `bg-accent`

**Bordes:**
- Standard: `border-gray-200` o `border-neutral-200`
- Primario: `border-primary`
- Acento: `border-accent`

**Estados:**
- Éxito: `bg-success` / `text-success` (#4CAF50)
- Error: `bg-error` / `text-error` (#F44336)
- Warning: `bg-warning` / `text-warning` (#FFC107)
- Info: `bg-info` / `text-info` (#2196F3)

### Variantes de Transparencia

```css
bg-primary/10    /* Primary al 10% */
bg-primary/20    /* Primary al 20% */
bg-secondary/5   /* Secondary al 5% */
bg-secondary/20  /* Secondary al 20% */
```

**Uso común:**
- Fondos de imágenes: `bg-primary/10`
- Hover suave: `hover:bg-primary/5`
- Badges outlined: `border-primary bg-primary/10 text-primary`

---

## 📝 Tipografía

### Fuentes

```css
font-family: 
  - Sans: 'Inter', 'System UI', sans-serif
  - Mono: 'Geist Mono', monospace
```

### Jerarquía de Textos

**Títulos:**
```tsx
<h1 className="text-3xl font-bold text-primary">      {/* Títulos principales */}
<h2 className="text-2xl font-bold text-primary">      {/* Subtítulos de sección */}
<h3 className="text-xl font-bold text-foreground">    {/* Títulos de card/módulo */}
<h3 className="text-lg font-bold text-foreground">    {/* Títulos de diálogo */}
```

**Cuerpo:**
```tsx
<p className="text-base text-foreground">             {/* Texto normal */}
<p className="text-sm text-neutral-600">              {/* Texto secundario */}
<p className="text-xs text-neutral-500">              {/* Texto auxiliar */}
```

**Énfasis:**
```tsx
<span className="font-bold">                          {/* Negrita */}
<span className="font-semibold">                      {/* Semi-negrita */}
<span className="font-medium">                        {/* Medio */}
<span className="font-light">                         {/* Light */}
```

### Truncamiento y Límite de Líneas

```tsx
<p className="truncate">                              {/* 1 línea con ... */}
<p className="line-clamp-2">                          {/* 2 líneas máximo */}
<p className="line-clamp-3">                          {/* 3 líneas máximo */}
```

---

## 📐 Espaciado y Layout

### Sistema de Espaciado

Basado en múltiplos de 4px (escala de Tailwind):

```tsx
p-1   = 4px      gap-1   = 4px      m-1   = 4px
p-2   = 8px      gap-2   = 8px      m-2   = 8px
p-4   = 16px     gap-4   = 16px     m-4   = 16px
p-6   = 24px     gap-6   = 24px     m-6   = 24px
p-8   = 32px     gap-8   = 32px     m-8   = 32px
```

### Grids Responsivos

**Grid de Cards (3 columnas):**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
  {/* Cards aquí */}
</div>
```

**Grid de 2 columnas:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Contenido */}
</div>
```

**Grid de 4 columnas:**
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {/* Contenido */}
</div>
```

### Máximos de Ancho

```tsx
max-w-sm    = 384px      {/* Campos de búsqueda */}
max-w-md    = 448px      {/* Diálogos pequeños */}
max-w-lg    = 512px      {/* Diálogos medianos */}
max-w-xl    = 576px      {/* Diálogos grandes */}
max-w-4xl   = 896px      {/* Contenedores de página */}
```

---

## 🃏 Diseño de Cards

### Anatomía de un Card

Un card se compone de:

1. **Contenedor Base** (obligatorio)
2. **Imagen/Media** (opcional)
3. **Contenido Principal** (obligatorio)
4. **Badges/Etiquetas** (opcional)
5. **Información Secundaria** (opcional)
6. **Footer de Acciones** (obligatorio si hay acciones)

### Estructura Base Obligatoria

```tsx
<article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
  {/* Contenido del card */}
</article>
```

**Clases obligatorias:**
- `bg-white` - Fondo blanco
- `rounded-lg` - Bordes redondeados
- `shadow-sm` - Sombra ligera (NO cambia en hover)
- `border border-gray-200` - Borde sutil
- `overflow-hidden` - Oculta desbordes (importante para imágenes)

### Card con Imagen

```tsx
<article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
  {/* Imagen full-width */}
  <div className="w-full aspect-video bg-primary/10 flex items-center justify-center overflow-hidden">
    {imageUrl ? (
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-full object-cover"
      />
    ) : (
      <span className="material-symbols-outlined text-primary" style={{ fontSize: '3rem' }}>
        inventory_2
      </span>
    )}
  </div>

  {/* Contenido */}
  <div className="p-2">
    {/* Contenido aquí */}
  </div>

  {/* Footer de acciones */}
  <div className="flex gap-2 justify-end pt-2 border-t border-gray-200">
    <IconButton icon="edit" variant="basicSecondary" />
    <IconButton icon="delete" variant="basicSecondary" />
  </div>
</article>
```

**Reglas para imágenes:**
- Usar `aspect-video` (16:9) para ratio consistente
- Fondo `bg-primary/10` cuando no hay imagen
- Imagen con `object-cover` para llenar el espacio
- Icono placeholder de 3rem

### Card sin Imagen

```tsx
<article className="border border-neutral-200 bg-white rounded-lg shadow-sm p-2 flex flex-col justify-between min-w-[260px]">
  {/* Contenido principal */}
  <div>
    {/* Avatar/Icono (opcional) */}
    <div className="flex gap-4 mb-4">
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-foreground truncate">
          {title}
        </h3>
        <p className="text-xs font-light text-neutral-600 truncate">
          {subtitle}
        </p>
      </div>
      
      {/* Avatar derecha */}
      <div className="flex-shrink-0">
        <div className="h-16 w-16 bg-primary/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '1.8rem' }}>
            person
          </span>
        </div>
      </div>
    </div>

    {/* Info secundaria */}
    <div className="space-y-2 text-xs mb-4">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-neutral-500" style={{ fontSize: '0.875rem' }}>
          email
        </span>
        <p className="text-neutral-500 truncate">{email}</p>
      </div>
    </div>
  </div>

  {/* Footer de acciones */}
  <div className="flex justify-end items-center gap-1 pt-2 border-t border-neutral-100">
    <IconButton icon="edit" variant="basic" size="sm" />
    <IconButton icon="delete" variant="basic" size="sm" />
  </div>
</article>
```

### Padding y Espaciado en Cards

**Regla general:**
- Padding del contenedor: `p-2` (8px) - **OBLIGATORIO**
- Contenido interno: `px-6 py-4` cuando se necesita más espacio (NO en el contenedor base)
- Espaciado entre secciones: `mb-2` o `mb-4`
- Gap de badges: `gap-2`

### Footer de Acciones

**Estructura obligatoria:**
```tsx
<div className="flex gap-2 justify-end pt-2 border-t border-gray-200">
  <IconButton icon="edit" variant="basicSecondary" />
  <IconButton icon="delete" variant="basicSecondary" />
</div>
```

**Reglas:**
- Siempre usar `flex gap-2 justify-end` para alinear a la derecha
- Separador superior: `border-t border-gray-200`
- Padding superior: `pt-2`
- Botones con variante: `basicSecondary` (obligatorio en cards con imagen) o `basic` (en cards sin imagen)
- Tamaño: `size="sm"` para cards más compactos

### Layout Flexible para Footer Fijo

Para garantizar que el footer siempre quede abajo:

```tsx
<article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col justify-between">
  {/* Imagen (si aplica) */}
  <div className="w-full aspect-video bg-primary/10">
    {/* ... */}
  </div>

  {/* Contenido - flex-grow hace que ocupe espacio disponible */}
  <div className="flex-grow p-2">
    {/* Contenido principal */}
  </div>

  {/* Footer fijo abajo */}
  <div className="flex gap-2 justify-end pt-2 border-t border-gray-200">
    {/* Acciones */}
  </div>
</article>
```

**Clases necesarias:**
- Contenedor: `flex flex-col justify-between`
- Contenido: `flex-grow`
- Footer: sin clase especial (naturalmente va abajo)

### Badges en Cards

**Alineación izquierda (recomendado):**
```tsx
<div className="flex justify-start gap-2 mb-2">
  <Badge variant="primary-outlined">Categoría</Badge>
  <Badge variant="secondary-outlined">Unidad</Badge>
</div>
```

**Información con iconos:**
```tsx
<div className="space-y-2 text-xs mb-4">
  <div className="flex items-center gap-2">
    <span className="material-symbols-outlined text-neutral-500" style={{ fontSize: '0.875rem' }}>
      email
    </span>
    <p className="text-neutral-500 truncate">{email}</p>
  </div>
  
  <div className="flex items-center gap-2">
    <span className="material-symbols-outlined text-neutral-500" style={{ fontSize: '0.875rem' }}>
      phone
    </span>
    <p className="text-neutral-500 truncate">{phone}</p>
  </div>
</div>
```

### Título y Descripción en Cards

```tsx
{/* Título principal */}
<div className="text-center mb-2">
  <h3 className="text-lg font-bold text-foreground">{name}</h3>
</div>

{/* Descripción opcional */}
{description && (
  <p className="text-sm text-neutral-600 text-center mb-4 line-clamp-2">
    {description}
  </p>
)}
```

**Reglas:**
- Título: `text-lg font-bold text-foreground`
- Descripción: `text-sm text-neutral-600`
- Usar `line-clamp-2` para limitar a 2 líneas
- Centrado con `text-center` (o left según el caso)

### Información de Precio/Moneda

```tsx
<div className="space-y-2 mb-4">
  <div className="flex items-center gap-2 text-sm text-neutral-700">
    <span className="font-medium">
      {new Intl.NumberFormat('es-CL', { 
        style: 'currency', 
        currency: 'CLP', 
        minimumFractionDigits: 0 
      }).format(price)}
    </span>
  </div>
</div>
```

### Ancho Mínimo

Para cards sin imagen, establecer ancho mínimo:
```tsx
<article className="... min-w-[260px]">
```

---

## 💬 Diseño de Diálogos

### Anatomía de un Diálogo

Un diálogo se compone de:

1. **Overlay** (fondo oscuro)
2. **Contenedor Modal** (card centrado)
3. **Header** (título + opcional botón cerrar)
4. **Body** (formulario/contenido)
5. **Footer** (botones de acción)

### Estructura Base Obligatoria

```tsx
{open && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
      </div>

      {/* Body - Formulario */}
      <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
        {/* Campos del formulario */}
        
        {/* Error Alert (siempre antes de botones) */}
        {error && (
          <Alert variant="error" message={error} />
        )}

        {/* Footer - Botones */}
        <div className="flex gap-3 pt-4 justify-between">
          <Button 
            variant="outlined" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </div>
  </div>
)}
```

### Overlay

**Clases obligatorias:**
```tsx
className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
```

- `fixed inset-0` - Cubre toda la pantalla
- `bg-black bg-opacity-50` - Fondo negro al 50%
- `flex items-center justify-center` - Centra el modal
- `z-50` - Z-index alto para estar encima de todo

### Contenedor Modal

**Clases obligatorias:**
```tsx
className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
```

- `bg-white` - Fondo blanco
- `rounded-lg` - Bordes redondeados
- `shadow-xl` - Sombra dramática
- `max-w-md` - Ancho máximo 448px (ajustar según necesidad)
- `w-full` - Ancho completo hasta el máximo
- `mx-4` - Margen horizontal en móviles
- `max-h-[90vh]` - Altura máxima 90% del viewport
- `overflow-y-auto` - Scroll interno si es necesario

**Tamaños de diálogo:**
```tsx
max-w-sm   = 384px   {/* Diálogos muy pequeños */}
max-w-md   = 448px   {/* Diálogos estándar */}
max-w-lg   = 512px   {/* Diálogos medianos */}
max-w-xl   = 576px   {/* Diálogos grandes */}
max-w-2xl  = 672px   {/* Diálogos muy grandes */}
```

### Header del Diálogo

```tsx
<div className="px-6 py-4 border-b border-gray-200">
  <h2 className="text-lg font-bold text-foreground">{title}</h2>
</div>
```

**Reglas:**
- Padding: `px-6 py-4`
- Separador inferior: `border-b border-gray-200`
- Título: `text-lg font-bold text-foreground`
- No incluir botón de cerrar (X) a menos que sea explícitamente necesario

### Body del Diálogo

```tsx
<form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
  {/* Campos del formulario */}
  <TextField
    label="Nombre"
    required
    value={name}
    onChange={(e) => setName(e.target.value)}
  />

  <Select
    label="Categoría"
    value={category}
    onChange={setCategory}
    options={categories}
  />

  {/* Más campos... */}

  {/* Alert de error SIEMPRE antes de botones */}
  {error && (
    <Alert variant="error" message={error} />
  )}

  {/* Footer dentro del form */}
  <div className="flex gap-3 pt-4 justify-between">
    {/* Botones */}
  </div>
</form>
```

**Reglas:**
- Padding: `px-6 py-4`
- Espaciado entre campos: `space-y-4`
- Usar componentes del Design System (TextField, Select, etc.)
- Alert de error SIEMPRE antes de los botones
- Footer dentro del `<form>`

### Footer de Diálogo (Botones)

**Estructura estándar:**
```tsx
<div className="flex gap-3 pt-4 justify-between">
  <Button 
    variant="outlined" 
    onClick={onClose}
    disabled={isLoading}
  >
    Cancelar
  </Button>
  <Button 
    variant="primary" 
    type="submit"
    disabled={isLoading}
  >
    {isLoading ? 'Guardando...' : 'Guardar'}
  </Button>
</div>
```

**Reglas:**
- Layout: `flex gap-3 pt-4 justify-between`
- Gap entre botones: `gap-3` (12px)
- Padding superior: `pt-4` (16px)
- Justificación: `justify-between` (botones en extremos)
- Botón izquierdo: `variant="outlined"` (Cancelar)
- Botón derecho: `variant="primary"` (Acción principal)
- Deshabilitar botones cuando `isLoading={true}`
- Cambiar texto del botón principal cuando está cargando

### Diálogos de Eliminación (Destructivos)

Para diálogos de confirmación de eliminación:

```tsx
<div className="flex gap-3 pt-4 justify-between">
  <Button 
    variant="outlined" 
    onClick={onClose}
    disabled={isLoading}
  >
    Cancelar
  </Button>
  <Button 
    variant="primary"
    className="bg-red-500 text-white hover:bg-red-600 rounded-full"
    onClick={handleDelete}
    disabled={isLoading}
  >
    {isLoading ? 'Eliminando...' : 'Eliminar'}
  </Button>
</div>
```

**Clases especiales para botón eliminar:**
- `bg-red-500` - Fondo rojo
- `text-white` - Texto blanco
- `hover:bg-red-600` - Hover más oscuro
- `rounded-full` - Bordes totalmente redondeados

**Consistencia:** Todos los diálogos de eliminación deben usar este estilo.

### Limpieza de Estado al Cerrar

**OBLIGATORIO:** Todos los diálogos deben resetear su estado cuando se cierran.

```tsx
const resetForm = () => {
  setName('');
  setDescription('');
  setError(null);
  setIsLoading(false);
  // ... resetear todos los campos
};

useEffect(() => {
  if (!open) resetForm();
}, [open]);
```

**O usando callback en onClose:**
```tsx
const handleClose = () => {
  resetForm();
  onClose();
};
```

**Esto incluye:**
- Todos los campos del formulario
- Mensajes de error
- Estados de carga
- Archivos seleccionados
- Cualquier estado temporal

### Validación en Diálogos

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setIsLoading(true);

  // Validaciones
  if (!name.trim()) {
    setError('El nombre es obligatorio');
    setIsLoading(false);
    return;
  }

  if (!unitId || !uuidRegex.test(unitId)) {
    setError('Por favor selecciona una unidad válida');
    setIsLoading(false);
    return;
  }

  try {
    const result = await createAction(data);
    
    if (!result.success) {
      setError(result.error || 'Error al guardar');
      return;
    }

    // Éxito - cerrar diálogo
    onClose();
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Error desconocido');
  } finally {
    setIsLoading(false);
  }
};
```

### Display del Diálogo

**Condicional con retorno early:**
```tsx
if (!open) return null;

return (
  <div className="...">
    {/* Contenido del modal */}
  </div>
);
```

**O condicional directo:**
```tsx
{open && (
  <div className="...">
    {/* Contenido del modal */}
  </div>
)}
```

---

## 📋 Layouts Tipo List

Los layouts tipo List son usados para mostrar colecciones de items en formato de cards con funcionalidades de búsqueda y creación.

### Estructura Completa

```tsx
'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TextField } from '@/shared/components/ui/TextField/TextField';
import IconButton from '@/shared/components/ui/IconButton/IconButton';
import ItemCard from './ItemCard';
import CreateItemDialog from './CreateItemDialog';

interface ItemListProps {
  items: Item[];
}

const ItemList: React.FC<ItemListProps> = ({ items }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [_isPending, startTransition] = useTransition();

  // Estado local para updates optimistas
  const [localItems, setLocalItems] = useState<Item[]>(items);

  const handleCreated = (item: Item) => {
    setLocalItems((prev) => [item, ...prev]);
  };

  const handleUpdated = (item: Item) => {
    setLocalItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setSearch(value);

    startTransition(() => {
      const params = new URLSearchParams(searchParams);

      if (value) {
        params.set('search', value);
      } else {
        params.delete('search');
      }

      router.replace(`/ruta?${params.toString()}`);
    });
  };

  // Filtrado local
  const filteredItems = localItems.filter((item) => {
    const searchLower = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="w-full">
      {/* Header con búsqueda y botón agregar */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <IconButton
          icon="add"
          variant="ghost"
          onClick={() => setOpenCreateDialog(true)}
          title="Crear Item"
        />

        <div className="w-full max-w-sm">
          <TextField
            label="Buscar"
            value={search}
            onChange={handleSearchChange}
            placeholder="Buscar"
            startIcon="search"
          />
        </div>
      </div>

      {/* Grid de cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {filteredItems && filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onUpdated={handleUpdated}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-neutral-500 py-12">
            {search ? `No hay coincidencias para "${search}"` : 'No hay items para mostrar'}
          </div>
        )}
      </div>

      {/* Diálogo de creación */}
      <CreateItemDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onCreated={handleCreated}
      />
    </div>
  );
};

export default ItemList;
```

### Componentes del Layout List

**1. Contenedor Principal:**
```tsx
<div className="w-full">
```

**2. Header (Búsqueda + Botón Crear):**
```tsx
<div className="flex items-center justify-between mb-6 gap-4">
  {/* IconButton crear */}
  {/* TextField búsqueda */}
</div>
```

**Características:**
- Layout: `flex items-center justify-between`
- Margin inferior: `mb-6` (24px)
- Gap entre elementos: `gap-4` (16px)

**3. IconButton de Crear:**
```tsx
<IconButton
  icon="add"
  variant="ghost"
  onClick={() => setOpenCreateDialog(true)}
  title="Crear [Entidad]"
/>
```

**Reglas:**
- Icono: `add` (símbolo +)
- Variante: `ghost` (fondo transparente con hover)
- Ubicación: Izquierda del header
- Title descriptivo para accesibilidad

**4. Campo de Búsqueda:**
```tsx
<div className="w-full max-w-sm">
  <TextField
    label="Buscar"
    value={search}
    onChange={handleSearchChange}
    placeholder="Buscar"
    startIcon="search"
  />
</div>
```

**Características:**
- Contenedor: `w-full max-w-sm` (máximo 384px)
- Icono de inicio: `search`
- Label: "Buscar"
- Placeholder descriptivo

**5. Grid de Cards:**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
  {/* Cards aquí */}
</div>
```

**Breakpoints:**
- Móvil: 1 columna
- Tablet (sm): 2 columnas
- Desktop (lg): 3 columnas
- Gap: `gap-6` (24px)

**6. Estado Vacío:**
```tsx
<div className="col-span-full text-center text-neutral-500 py-12">
  {search 
    ? `No hay coincidencias para "${search}"` 
    : 'No hay items para mostrar'
  }
</div>
```

**Características:**
- Span completo: `col-span-full`
- Centrado: `text-center`
- Color: `text-neutral-500`
- Padding vertical: `py-12` (48px)
- Mensaje diferente para búsqueda vs vacío

### Gestión del Estado de Búsqueda

**Con persistencia en URL:**
```tsx
const router = useRouter();
const searchParams = useSearchParams();
const [search, setSearch] = useState(searchParams.get('search') || '');

const handleSearchChange = (e: React.ChangeEvent<...>) => {
  const value = e.target.value;
  setSearch(value);

  startTransition(() => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    router.replace(`/ruta?${params.toString()}`);
  });
};
```

### Updates Optimistas

Mantener estado local para reflejar cambios inmediatamente sin recargar:

```tsx
const [localItems, setLocalItems] = useState<Item[]>(items);

const handleCreated = (item: Item) => {
  setLocalItems((prev) => [item, ...prev]); // Agregar al inicio
};

const handleUpdated = (item: Item) => {
  setLocalItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
};

const handleDeleted = (itemId: string) => {
  setLocalItems((prev) => prev.filter((i) => i.id !== itemId));
};
```

### Filtrado Local

```tsx
const filteredItems = localItems.filter((item) => {
  const searchLower = search.toLowerCase();
  return (
    item.name.toLowerCase().includes(searchLower) ||
    item.description?.toLowerCase().includes(searchLower) ||
    item.category?.toLowerCase().includes(searchLower)
  );
});
```

---

## 📊 Layouts Tipo DataGrid

Los layouts tipo DataGrid son tablas avanzadas con paginación, ordenamiento, filtros y acciones por fila.

### Estructura de Página con DataGrid

**Paso 1: page.tsx (Server Component)**

```tsx
// app/admin/clientes/page.tsx
import { fetchCustomers } from '@/features/customers/actions/customers.action';
import CustomersPage from '@/features/customers/components/CustomersPage';

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    sortField?: string;
    sort?: string;
  }>;
}

export default async function CustomersRoute({ searchParams }: PageProps) {
  const params = await searchParams;
  
  const result = await fetchCustomers({
    page: params.page ? parseInt(params.page) : 1,
    limit: params.limit ? parseInt(params.limit) : 25,
    search: params.search || '',
    sortField: params.sortField || 'createdAt',
    sort: (params.sort as 'ASC' | 'DESC') || 'DESC',
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-primary mb-6">Clientes</h1>
      <CustomersPage initialRows={result.data} total={result.total} />
    </div>
  );
}
```

**Paso 2: CustomersPage.tsx (Client Component)**

```tsx
'use client';

import { useState } from 'react';
import CustomerDataGrid from './CustomerDataGrid';
import CreateCustomerDialog from './CreateCustomerDialog';
import UpdateCustomerDialog from './UpdateCustomerDialog';
import DeleteCustomerDialog from './DeleteCustomerDialog';

interface CustomersPageProps {
  initialRows: Customer[];
  total: number;
}

export default function CustomersPage({ initialRows, total }: CustomersPageProps) {
  const [rows, setRows] = useState(initialRows);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Customer | null>(null);

  const handleCreate = () => setOpenCreate(true);
  
  const handleEdit = (row: Customer) => {
    setSelectedRow(row);
    setOpenUpdate(true);
  };

  const handleDelete = (row: Customer) => {
    setSelectedRow(row);
    setOpenDelete(true);
  };

  return (
    <>
      <CustomerDataGrid
        rows={rows}
        totalRows={total}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CreateCustomerDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />

      {selectedRow && (
        <>
          <UpdateCustomerDialog
            open={openUpdate}
            onClose={() => setOpenUpdate(false)}
            customer={selectedRow}
          />

          <DeleteCustomerDialog
            open={openDelete}
            onClose={() => setOpenDelete(false)}
            customer={selectedRow}
          />
        </>
      )}
    </>
  );
}
```

**Paso 3: CustomerDataGrid.tsx (Configuración del Grid)**

```tsx
'use client';

import React from 'react';
import DataGrid, { DataGridColumn, DataGridProps } from '@/shared/components/ui/DataGrid';
import IconButton from '@/shared/components/ui/IconButton/IconButton';
import Badge from '@/shared/components/ui/Badge/Badge';

export interface CustomerDataGridProps extends Omit<DataGridProps, 'columns'> {
  onCreate?: () => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
}

export const CustomerDataGrid: React.FC<CustomerDataGridProps> = ({
  onCreate,
  onEdit,
  onDelete,
  ...props
}) => {
  const columns: DataGridColumn[] = [
    {
      field: 'firstName',
      headerName: 'Nombre',
      flex: 1,
      sortable: true,
      valueGetter: (params) => params.row.person?.firstName || '',
    },
    {
      field: 'lastName',
      headerName: 'Apellido',
      flex: 1,
      sortable: true,
      valueGetter: (params) => params.row.person?.lastName || '',
    },
    {
      field: 'documentNumber',
      headerName: 'DNI',
      width: 120,
      valueGetter: (params) => params.row.person?.documentNumber || '',
    },
    {
      field: 'phone',
      headerName: 'Teléfono',
      width: 130,
      valueGetter: (params) => params.row.person?.phone || '',
    },
    {
      field: 'currentBalance',
      headerName: 'Saldo',
      width: 120,
      type: 'number',
      renderType: 'currency',
      sortable: true,
    },
    {
      field: 'status',
      headerName: 'Estado',
      width: 100,
      renderCell: ({ value }) => (
        <Badge variant={value === 'ACTIVE' ? 'success' : 'error'}>
          {value === 'ACTIVE' ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 120,
      sortable: false,
      filterable: false,
      actionComponent: ({ row }) => (
        <div className="flex gap-1">
          <IconButton
            icon="edit"
            variant="basicSecondary"
            size="sm"
            onClick={() => onEdit?.(row)}
            title="Editar"
          />
          <IconButton
            icon="delete"
            variant="basicSecondary"
            size="sm"
            onClick={() => onDelete?.(row)}
            title="Eliminar"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <DataGrid 
        columns={columns} 
        onAddClick={onCreate}
        title="Clientes"
        showSearch={true}
        showSortButton={true}
        enablePagination={true}
        {...props} 
      />
    </div>
  );
};

export default CustomerDataGrid;
```

### Definición de Columnas

**Tipos de columnas:**

```tsx
const columns: DataGridColumn[] = [
  {
    field: 'id',
    headerName: 'ID',
    width: 80,
    type: 'string',
    sortable: true,
  },
  {
    field: 'name',
    headerName: 'Nombre',
    flex: 1,              // Ancho flexible
    minWidth: 200,        // Ancho mínimo
    sortable: true,
    filterable: true,
  },
  {
    field: 'price',
    headerName: 'Precio',
    width: 120,
    type: 'number',
    sortable: true,
    renderType: 'currency',  // Auto-formatea como moneda
    align: 'right',
  },
  {
    field: 'date',
    headerName: 'Fecha',
    width: 150,
    type: 'date',
    renderType: 'dateString',  // Formatea fecha
  },
  {
    field: 'status',
    headerName: 'Estado',
    width: 120,
    renderCell: ({ value }) => (
      <Badge variant={value === 'ACTIVE' ? 'success' : 'error'}>
        {value}
      </Badge>
    ),
  },
  {
    field: 'actions',
    headerName: 'Acciones',
    width: 120,
    sortable: false,
    filterable: false,
    actionComponent: ({ row }) => (
      <div className="flex gap-1">
        <IconButton icon="edit" size="sm" onClick={() => edit(row)} />
        <IconButton icon="delete" size="sm" onClick={() => remove(row)} />
      </div>
    ),
  },
];
```

### Tipos de Renderizado

**1. Currency (Moneda):**
```tsx
{
  field: 'price',
  type: 'number',
  renderType: 'currency',  // $1.234.567
}
```

**2. Date/DateTime:**
```tsx
{
  field: 'createdAt',
  type: 'date',
  renderType: 'dateString',  // 01/01/2024
}
```

**3. Badge:**
```tsx
{
  field: 'status',
  renderType: 'badge',  // Renderiza como Badge automáticamente
}
```

**4. Custom (Personalizado):**
```tsx
{
  field: 'avatar',
  renderCell: (params) => (
    <img 
      src={params.row.avatarUrl} 
      className="w-10 h-10 rounded-full"
      alt={params.row.name}
    />
  ),
}
```

### Value Getters (Transformación de Datos)

Para datos anidados:

```tsx
{
  field: 'firstName',
  headerName: 'Nombre',
  valueGetter: (params) => params.row.person?.firstName || '',
}
```

### Columna de Acciones

**Estructura estándar:**
```tsx
{
  field: 'actions',
  headerName: 'Acciones',
  width: 120,
  sortable: false,
  filterable: false,
  actionComponent: ({ row }) => (
    <div className="flex gap-1">
      <IconButton
        icon="edit"
        variant="basicSecondary"
        size="sm"
        onClick={() => onEdit?.(row)}
        title="Editar"
      />
      <IconButton
        icon="delete"
        variant="basicSecondary"
        size="sm"
        onClick={() => onDelete?.(row)}
        title="Eliminar"
      />
    </div>
  ),
}
```

**Reglas:**
- Ancho fijo: `width: 120`
- No ordenable: `sortable: false`
- No filtrable: `filterable: false`
- Usar `actionComponent` en lugar de `renderCell`
- Gap entre botones: `gap-1` (4px)
- Variante: `basicSecondary`
- Tamaño: `sm`

### Props del DataGrid

```tsx
<DataGrid
  columns={columns}                    // Definición de columnas
  rows={data}                          // Datos a mostrar
  totalRows={total}                    // Total para paginación
  title="Tabla"                        // Título opcional
  onAddClick={handleCreate}            // Callback botón crear
  showSearch={true}                    // Mostrar búsqueda
  showSortButton={true}                // Mostrar ordenamiento
  showFilterButton={true}              // Mostrar filtros
  showExportButton={true}              // Mostrar exportar
  enablePagination={true}              // Habilitar paginación
  limit={25}                           // Items por página
  height="70vh"                        // Altura personalizada
  expandable={true}                    // Filas expandibles
  expandableRowContent={(row) => (     // Contenido expandido
    <div className="p-4 bg-gray-50">
      {/* Detalles adicionales */}
    </div>
  )}
/>
```

### Diseño Responsivo del DataGrid

El DataGrid es automáticamente responsivo, pero algunos ajustes:

```tsx
{
  field: 'description',
  headerName: 'Descripción',
  flex: 1,           // Se adapta al espacio disponible
  minWidth: 200,     // Ancho mínimo
  hide: 'mobile',    // Ocultar en móvil (custom)
}
```

---

## 🧩 Componentes del Design System

Todos los componentes están ubicados en `/src/shared/components/ui/`

### Regla Fundamental

**PROHIBIDO usar elementos HTML nativos en componentes:**

❌ **INCORRECTO:**
```tsx
<div className="p-4 border">
  <button onClick={handleClick}>Click</button>
  <input type="text" />
</div>
```

✅ **CORRECTO:**
```tsx
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { TextField } from '@/shared/components/ui/TextField/TextField';

<Card>
  <Button onClick={handleClick}>Click</Button>
  <TextField value={value} onChange={handleChange} />
</Card>
```

### Componentes Disponibles

**Formularios:**
- `TextField` - Campo de texto/número/email/etc
- `Select` - Selector desplegable
- `AutoComplete` - Autocompletar
- `NumberStepper` - Incrementador numérico
- `Switch` - Toggle switch
- `RangeSlider` - Rango deslizante
- `LocationPicker` - Selector de ubicación

**Botones:**
- `Button` - Botón estándar
- `IconButton` - Botón con icono

**Navegación:**
- `TopBar` - Barra superior
- `SideBar` - Menú lateral
- `Tabs` - Pestañas

**Overlay:**
- `Dialog` - Diálogos/modales

**Visualización:**
- `DataGrid` - Tabla de datos
- `Badge` - Etiquetas/badges
- `Alert` - Alertas/notificaciones
- `Card` - Tarjetas (si existe)

**Feedback:**
- `DotProgress` - Indicador de carga

**Archivos:**
- `MultimediaUploader` - Subir imágenes/archivos
- `MultimediaUpdater` - Actualizar archivos

### Importación Correcta

**SIEMPRE usar path alias:**
```tsx
import { TextField } from '@/shared/components/ui/TextField/TextField';
import { Button } from '@/shared/components/ui/Button/Button';
import IconButton from '@/shared/components/ui/IconButton/IconButton';
import Badge from '@/shared/components/ui/Badge/Badge';
import DataGrid from '@/shared/components/ui/DataGrid';
```

**NUNCA:**
```tsx
import TextField from '../../../components/TextField';  // ❌ Path relativo
import { Button } from '@/ui/Button';                   // ❌ Path incorrecto
```

---

## 🎭 Iconografía

### Material Symbols

La aplicación utiliza **Material Symbols** en tres variantes:

- `material-symbols-outlined` (Principal)
- `material-symbols-rounded`
- `material-symbols-sharp`

### Uso en HTML

```tsx
<span className="material-symbols-outlined">
  search
</span>

<span className="material-symbols-outlined text-primary" style={{ fontSize: '2rem' }}>
  person
</span>
```

### Tamaños de Iconos

```tsx
style={{ fontSize: '0.875rem' }}  // 14px - Muy pequeño
style={{ fontSize: '1rem' }}      // 16px - Pequeño
style={{ fontSize: '1.5rem' }}    // 24px - Estándar (default)
style={{ fontSize: '1.8rem' }}    // 28.8px - Mediano
style={{ fontSize: '2rem' }}      // 32px - Grande
style={{ fontSize: '3rem' }}      // 48px - Muy grande
```

### Colores de Iconos

```tsx
text-primary        // Azul corporativo
text-secondary      // Cyan
text-foreground     // Negro/gris oscuro
text-muted          // Gris
text-neutral-500    // Gris medio
text-success        // Verde
text-error          // Rojo
text-warning        // Amarillo
```

### Iconos Comunes

**Acciones:**
- `add` - Crear/Agregar
- `edit` - Editar
- `delete` - Eliminar
- `save` - Guardar
- `cancel` - Cancelar
- `close` - Cerrar
- `check` - Confirmar

**Navegación:**
- `arrow_back` - Volver
- `arrow_forward` - Siguiente
- `expand_more` - Expandir
- `expand_less` - Colapsar
- `menu` - Menú

**Información:**
- `info` - Información
- `warning` - Advertencia
- `error` - Error
- `check_circle` - Éxito

**Búsqueda y filtros:**
- `search` - Buscar
- `filter_list` - Filtrar
- `sort` - Ordenar

**Datos:**
- `person` - Usuario/Persona
- `group` - Grupos
- `inventory_2` - Producto
- `category` - Categoría
- `email` - Email
- `phone` - Teléfono
- `badge` - DNI/ID
- `business` - Empresa
- `location_on` - Ubicación

### Uso en IconButton

```tsx
<IconButton 
  icon="edit"              // Nombre del icono
  variant="basicSecondary"
  size="sm"
  onClick={handleEdit}
  title="Editar"          // Tooltip
/>
```

---

## 🎯 Estados y Feedback

### Estados de Botones

**Normal:**
```tsx
<Button variant="primary">Guardar</Button>
```

**Hover:**
- Automático: cambio de color más oscuro
- Ejemplo: `hover:bg-primary/90`

**Loading:**
```tsx
<Button 
  variant="primary" 
  disabled={isLoading}
>
  {isLoading ? 'Guardando...' : 'Guardar'}
</Button>
```

**Disabled:**
```tsx
<Button 
  variant="primary" 
  disabled={true}
>
  Guardar
</Button>
```

### Estados de Cards

**Normal:**
- Sombra: `shadow-sm`
- Borde: `border-gray-200`

**NO usar sombra en hover:**
- La sombra NO cambia en hover
- Mantener `shadow-sm` constante

### Estados de Inputs

**Normal:**
```tsx
<TextField
  label="Nombre"
  value={value}
  onChange={handleChange}
/>
```

**Error:**
```tsx
<TextField
  label="Nombre"
  value={value}
  onChange={handleChange}
  error={errors.name}
/>
```

**Disabled:**
```tsx
<TextField
  label="Nombre"
  value={value}
  onChange={handleChange}
  disabled={true}
/>
```

**ReadOnly:**
```tsx
<TextField
  label="Nombre"
  value={value}
  onChange={handleChange}
  readOnly={true}
/>
```

### Feedback de Carga

**DotProgress (indicador global):**
```tsx
import DotProgress from '@/shared/components/ui/DotProgress/DotProgress';

{isLoading && <DotProgress />}
```

**Skeleton (para cards/listas):**
```tsx
<div className="bg-gray-200 animate-pulse h-40 rounded-lg"></div>
```

**Texto de carga en botones:**
```tsx
{isLoading ? 'Guardando...' : 'Guardar'}
{isLoading ? 'Eliminando...' : 'Eliminar'}
{isLoading ? 'Creando...' : 'Crear'}
```

### Alertas y Mensajes

**Alert component:**
```tsx
import Alert from '@/shared/components/ui/Alert/Alert';

{error && (
  <Alert variant="error" message={error} />
)}

{success && (
  <Alert variant="success" message="Guardado exitosamente" />
)}
```

**Variantes:**
- `success` - Verde
- `error` - Rojo
- `warning` - Amarillo
- `info` - Azul

**Posición en diálogos:**
- SIEMPRE antes de los botones del footer

### Estados Vacíos

**En listas:**
```tsx
<div className="col-span-full text-center text-neutral-500 py-12">
  {search 
    ? `No hay coincidencias para "${search}"` 
    : 'No hay items para mostrar'
  }
</div>
```

**En tablas:**
```tsx
<div className="flex items-center justify-center h-64 text-neutral-500">
  No hay datos disponibles
</div>
```

---

## 🏷️ Badges y Pills

### Variantes de Badge

```tsx
import Badge from '@/shared/components/ui/Badge/Badge';

<Badge variant="primary">Primary</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="success">Éxito</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="warning">Advertencia</Badge>
<Badge variant="info">Info</Badge>

{/* Outlined */}
<Badge variant="primary-outlined">Primary</Badge>
<Badge variant="secondary-outlined">Secondary</Badge>
```

### Uso en Cards

**Con iconos:**
```tsx
<div className="flex justify-start gap-2 mb-2">
  <Badge variant="primary-outlined">Categoría</Badge>
  <Badge variant="secondary-outlined">Unidad</Badge>
</div>
```

**Estados:**
```tsx
<Badge variant={status === 'ACTIVE' ? 'success' : 'error'}>
  {status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
</Badge>
```

### Tamaños

Los badges se adaptan al tamaño del texto contenido. Para tamaños personalizados:

```tsx
<Badge variant="primary" className="text-xs">Small</Badge>
<Badge variant="primary" className="text-sm">Medium</Badge>
<Badge variant="primary" className="text-base">Large</Badge>
```

---

## 🔘 Botones y Acciones

### Button Component

**Variantes:**

```tsx
<Button variant="primary">Primary</Button>
<Button variant="outlined">Outlined</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="text">Text</Button>
```

**Tamaños:**
```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>   // Default
<Button size="lg">Large</Button>
```

**Estados:**
```tsx
<Button disabled={true}>Disabled</Button>
<Button disabled={isLoading}>
  {isLoading ? 'Cargando...' : 'Continuar'}
</Button>
```

**Con iconos:**
```tsx
<Button 
  variant="primary"
  startIcon="save"
>
  Guardar
</Button>

<Button 
  variant="outlined"
  endIcon="arrow_forward"
>
  Siguiente
</Button>
```

### IconButton Component

**Variantes:**

```tsx
<IconButton icon="edit" variant="basic" />
<IconButton icon="edit" variant="basicSecondary" />
<IconButton icon="edit" variant="ghost" />
<IconButton icon="edit" variant="text" />
<IconButton icon="edit" variant="primary" />
<IconButton icon="edit" variant="danger" />
```

**Tamaños:**
```tsx
<IconButton icon="add" size="sm" />
<IconButton icon="add" size="md" />   // Default
<IconButton icon="add" size="lg" />
```

**Uso en Cards:**
```tsx
<div className="flex gap-2 justify-end pt-2 border-t border-gray-200">
  <IconButton icon="edit" variant="basicSecondary" />
  <IconButton icon="delete" variant="basicSecondary" />
</div>
```

**Uso en DataGrid:**
```tsx
<IconButton
  icon="edit"
  variant="basicSecondary"
  size="sm"
  onClick={() => onEdit?.(row)}
  title="Editar"
/>
```

### Reglas de Variantes

**En Cards con imagen:**
- `basicSecondary` (obligatorio)

**En Cards sin imagen:**
- `basic` o `basicSecondary`

**En DataGrid:**
- `basicSecondary` con `size="sm"`

**En Headers/Toolbars:**
- `ghost` para botones de crear/agregar

**En Diálogos:**
- Footer: `outlined` para cancelar, `primary` para acción principal

---

## 📝 Formularios

### Estructura de Formulario en Diálogo

```tsx
<form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
  <TextField
    label="Nombre"
    required
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="Ingrese el nombre"
  />

  <TextField
    label="Descripción"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    placeholder="Descripción opcional"
    rows={3}
  />

  <TextField
    label="Precio"
    required
    type="currency"
    currencySymbol="$"
    value={price}
    onChange={(e) => setPrice(e.target.value)}
  />

  <Select
    label="Categoría"
    required
    value={category}
    onChange={setCategory}
    options={categories}
    placeholder="Seleccionar categoría"
  />

  {error && (
    <Alert variant="error" message={error} />
  )}

  <div className="flex gap-3 pt-4 justify-between">
    <Button variant="outlined" onClick={onClose} disabled={isLoading}>
      Cancelar
    </Button>
    <Button variant="primary" type="submit" disabled={isLoading}>
      {isLoading ? 'Guardando...' : 'Guardar'}
    </Button>
  </div>
</form>
```

### TextField Variants

**Text normal:**
```tsx
<TextField
  label="Nombre"
  value={value}
  onChange={handleChange}
  placeholder="Nombre completo"
/>
```

**Textarea:**
```tsx
<TextField
  label="Descripción"
  value={value}
  onChange={handleChange}
  rows={3}
/>
```

**Number:**
```tsx
<TextField
  label="Cantidad"
  type="number"
  value={value}
  onChange={handleChange}
  min={0}
  max={100}
  step={1}
/>
```

**Currency:**
```tsx
<TextField
  label="Precio"
  type="currency"
  currencySymbol="$"
  value={value}
  onChange={handleChange}
/>
```

**Email:**
```tsx
<TextField
  label="Email"
  type="email"
  value={value}
  onChange={handleChange}
/>
```

**Password:**
```tsx
<TextField
  label="Contraseña"
  type="password"
  value={value}
  onChange={handleChange}
  passwordVisibilityToggle={true}
/>
```

**DNI (RUT Chileno):**
```tsx
<TextField
  label="RUT"
  type="dni"
  value={value}
  onChange={handleChange}
/>
```

**Phone:**
```tsx
<TextField
  label="Teléfono"
  type="tel"
  phonePrefix="+56"
  value={value}
  onChange={handleChange}
/>
```

**Date:**
```tsx
<TextField
  label="Fecha"
  type="date"
  value={value}
  onChange={handleChange}
/>
```

### TextField con Iconos

**Start Icon:**
```tsx
<TextField
  label="Buscar"
  value={value}
  onChange={handleChange}
  startIcon="search"
/>
```

**End Icon:**
```tsx
<TextField
  label="Usuario"
  value={value}
  onChange={handleChange}
  endIcon="person"
/>
```

### Select Component

```tsx
<Select
  label="Categoría"
  required
  value={selectedValue}
  onChange={handleChange}
  options={[
    { id: '1', label: 'Opción 1' },
    { id: '2', label: 'Opción 2' },
    { id: '3', label: 'Opción 3' },
  ]}
  placeholder="Seleccionar opción"
/>
```

### Validación de Formularios

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setIsLoading(true);

  // Validaciones
  if (!name.trim()) {
    setError('El nombre es obligatorio');
    setIsLoading(false);
    return;
  }

  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    setError('Email inválido');
    setIsLoading(false);
    return;
  }

  try {
    const result = await submitAction(data);
    
    if (!result.success) {
      setError(result.error || 'Error al guardar');
      return;
    }

    onClose();
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Error desconocido');
  } finally {
    setIsLoading(false);
  }
};
```

### MultimediaUploader

```tsx
import MultimediaUploader from '@/shared/components/ui/FileUploader/MultimediaUploader';

<MultimediaUploader
  label="Imagen del Producto"
  value={image}
  onChange={setImage}
  accept="image/*"
  maxSize={5} // MB
/>
```

---

## 📱 Responsive Design

### Breakpoints de Tailwind

```css
sm:  640px   /* Tablet pequeña */
md:  768px   /* Tablet */
lg:  1024px  /* Desktop */
xl:  1280px  /* Desktop grande */
2xl: 1536px  /* Desktop muy grande */
```

### Grid Responsivo

**3 columnas (recomendado para cards):**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
```

**2 columnas:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
```

**4 columnas:**
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
```

### Ocultar/Mostrar según Pantalla

```tsx
<div className="hidden md:block">Solo desktop</div>
<div className="block md:hidden">Solo móvil</div>
```

### Espaciado Responsivo

```tsx
<div className="p-4 md:p-6 lg:p-8">
  {/* Padding aumenta con la pantalla */}
</div>

<div className="gap-2 sm:gap-4 lg:gap-6">
  {/* Gap aumenta con la pantalla */}
</div>
```

### Texto Responsivo

```tsx
<h1 className="text-xl sm:text-2xl lg:text-3xl">
  Título Responsivo
</h1>
```

### Diálogos Responsivos

Los diálogos ya son responsivos con:
```tsx
className="max-w-md w-full mx-4"
```

- `max-w-md`: Máximo 448px en desktop
- `w-full`: Ancho completo en móvil (con máximo)
- `mx-4`: Márgenes laterales de 16px

### DataGrid Responsivo

El DataGrid maneja automáticamente el scroll horizontal en móviles. Opcionalmente ocultar columnas:

```tsx
{
  field: 'description',
  headerName: 'Descripción',
  hide: 'mobile',  // Custom prop (implementar si necesario)
}
```

---

## 📐 Reglas de Composición

### Jerarquía de Componentes

**Evitar anidación profunda:**

❌ **MALO:**
```tsx
<div>
  <div>
    <div>
      <div>
        <div>
          <Component />
        </div>
      </div>
    </div>
  </div>
</div>
```

✅ **BUENO:**
```tsx
<Card>
  <Component />
</Card>
```

### Reutilización vs Duplicación

**Crear componente compartido si:**
- Se usa en 2+ features
- Tiene lógica compleja
- Es parte del Design System

**Mantener en feature si:**
- Se usa en 1 feature únicamente
- Es específico del dominio
- No tiene lógica reutilizable

**Ubicaciones:**
- Global: `/shared/components/ui/`
- Feature: `/features/{feature}/components/`
- Page: `/app/{route}/components/`

### Composición de Cards

**Card compone componentes UI:**
```tsx
<article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
  <div className="p-2">
    <Badge variant="primary">Estado</Badge>
    <h3 className="text-lg font-bold text-foreground">Título</h3>
  </div>
  
  <div className="flex gap-2 justify-end pt-2 border-t border-gray-200">
    <IconButton icon="edit" variant="basicSecondary" />
  </div>
</article>
```

### Composición de Diálogos

**Diálogo usa componentes UI:**
```tsx
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
    <div className="px-6 py-4 border-b border-gray-200">
      <h2>Título</h2>
    </div>
    
    <form className="px-6 py-4 space-y-4">
      <TextField label="Nombre" />
      <Select label="Categoría" />
      
      <Alert variant="error" />
      
      <div className="flex gap-3 pt-4 justify-between">
        <Button variant="outlined">Cancelar</Button>
        <Button variant="primary">Guardar</Button>
      </div>
    </form>
  </div>
</div>
```

### Separación de Responsabilidades

**Page → List → Card → Dialog**

```
page.tsx (Server)
  ↓
ItemList.tsx (Client)
  ↓ (mapea items)
  ├── ItemCard.tsx (UI)
  │     ↓ (abre dialog)
  │     ├── UpdateItemDialog.tsx
  │     └── DeleteItemDialog.tsx
  └── CreateItemDialog.tsx
```

**Page → DataGrid → Dialog**

```
page.tsx (Server)
  ↓ (fetch data)
CustomersPage.tsx (Client)
  ↓ (maneja state)
  ├── CustomerDataGrid.tsx (UI) 
  │     ↓ (callbacks)
  ├── CreateCustomerDialog.tsx
  ├── UpdateCustomerDialog.tsx
  └── DeleteCustomerDialog.tsx
```

---

## ✅ Checklist de Implementación

### Al Crear un Card:

- [ ] Usar contenedor base: `bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden`
- [ ] Padding del contenedor: `p-2`
- [ ] Si tiene imagen: `aspect-video bg-primary/10`
- [ ] Footer con: `border-t border-gray-200 pt-2`
- [ ] IconButton con variante: `basicSecondary` (o `basic` si no hay imagen)
- [ ] Usar `flex flex-col justify-between` si el footer debe quedar abajo
- [ ] Truncar textos largos: `truncate` o `line-clamp-2`
- [ ] Badge con alineación: `flex justify-start gap-2`

### Al Crear un Diálogo:

- [ ] Overlay: `fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`
- [ ] Contenedor: `bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto`
- [ ] Header: `px-6 py-4 border-b border-gray-200`
- [ ] Título: `text-lg font-bold text-foreground`
- [ ] Form: `px-6 py-4 space-y-4`
- [ ] Alert ANTES de botones
- [ ] Footer: `flex gap-3 pt-4 justify-between`
- [ ] Botones: `outlined` + `primary` (o rojo para eliminar)
- [ ] Deshabilitar botones con `disabled={isLoading}`
- [ ] Cambiar texto botón cuando carga
- [ ] Reset de formulario al cerrar: `useEffect(() => { if (!open) reset(); }, [open])`
- [ ] Validaciones con mensajes claros

### Al Crear un Layout List:

- [ ] Contenedor: `w-full`
- [ ] Header: `flex items-center justify-between mb-6 gap-4`
- [ ] IconButton crear: `icon="add" variant="ghost"`
- [ ] TextField búsqueda: `max-w-sm` con `startIcon="search"`
- [ ] Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`
- [ ] Estado vacío: `col-span-full text-center text-neutral-500 py-12`
- [ ] Gestión de búsqueda con URL params
- [ ] Estado local para updates optimistas
- [ ] Filtrado local de items

### Al Crear un Layout DataGrid:

- [ ] Separar: page.tsx (server) + Page.tsx (client) + DataGrid.tsx (UI)
- [ ] Page.tsx recibe params y fetcha datos
- [ ] Client component maneja diálogos
- [ ] DataGrid.tsx define columnas
- [ ] Columna de acciones: `sortable: false, filterable: false`
- [ ] IconButton en acciones: `size="sm" variant="basicSecondary"`
- [ ] Props: `onAddClick`, `onCreate`, `onEdit`, `onDelete`
- [ ] Usar `renderType` para currency/date/badge
- [ ] Usar `valueGetter` para datos anidados

### Al Usar Componentes UI:

- [ ] NUNCA usar elementos HTML nativos
- [ ] Importar desde `@/shared/components/ui/`
- [ ] Usar variantes correctas según contexto
- [ ] Aplicar tamaños apropiados
- [ ] Incluir `title` en IconButton para accesibilidad
- [ ] Usar Material Symbols para iconos
- [ ] Aplicar colores del sistema (no hardcoded)

---

## 📚 Referencias Adicionales

### Documentos Relacionados

- `/src/shared/components/ui/DOCUMENTATION.md` - Documentación completa de componentes
- `/src/shared/components/ui/DataGrid/README.md` - Guía completa de DataGrid
- `/.github/DIALOGS_AND_CARDS_STYLES.md` - Normas de diálogos y cards (base)
- `/.github/copilot-instructions.md` - Arquitectura y reglas del proyecto

### Convenciones de Nombres

**Files:**
- Components: PascalCase - `ProductCard.tsx`
- Actions: camelCase + `.action.ts` - `createProduct.action.ts`
- Hooks: camelCase + `.ts` - `useProducts.ts`
- Services: camelCase + `.service.ts` - `products.service.ts`
- Types: camelCase + `.types.ts` - `product.types.ts`

**Components:**
- React Components: PascalCase - `ProductList`
- Functions: camelCase - `handleCreate`
- Constants: UPPER_SNAKE_CASE - `PAGE_SIZE`

---

## 🔄 Actualizaciones

**Última actualización:** Marzo 2, 2026

**Versión:** 1.0.0

**Cambios importantes:**
- Documento inicial completo con todas las secciones
- Basado en archivo existente DIALOGS_AND_CARDS_STYLES.md
- Expandido con análisis completo del proyecto web-admin
- Incluye layouts List y DataGrid
- Define sistema completo de componentes

---

## 📞 Soporte

Para dudas o sugerencias sobre estas normas:

1. Consultar este documento primero
2. Revisar documentación de componentes UI
3. Ver ejemplos en componentes existentes
4. Mantener consistencia con el resto de la aplicación

**Recuerda:** La consistencia visual y de código es clave para la mantenibilidad del proyecto.

---

> Este documento es la guía definitiva de diseño y desarrollo para web-admin.
> Cuando el diseño cambie, actualiza este archivo para que el equipo tenga la versión más reciente.
