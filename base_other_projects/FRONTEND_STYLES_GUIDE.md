# 📘 Frontend Styles Guide - Guía de Clases Tailwind

**Propósito**: Referencia completa y organizada de todas las clases Tailwind utilizadas en el proyecto  
**Versión**: 1.0  
**Última actualización**: Marzo 2026  
**Status**: ✅ Production-Ready

---

## Tabla de Contenidos

1. [Texto (Typography)](#-texto-typography)
2. [Colores (Colors)](#-colores-colors)
3. [Espaciado (Spacing)](#-espaciado-spacing)
4. [Tamaños (Sizing)](#-tamaños-sizing)
5. [Bordes y Sombras](#-bordes-y-sombras)
6. [Flexbox y Grid](#-flexbox-y-grid)
7. [Posicionamiento](#-posicionamiento)
8. [Estados Interactivos](#-estados-interactivos)
9. [Combinaciones Comunes](#-combinaciones-comunes)

---

## 📝 Texto (Typography)

### Tamaños de Fuente

| Clase | Tamaño | Uso | Ejemplo |
|-------|---------|------|---------|
| `text-xs` | 12px | Badges, helpers | `<span className="text-xs text-neutral-500">Auxiliar</span>` |
| `text-sm` | 14px | Labels, pequeño | `<label className="text-sm text-neutral-700">Campo</label>` |
| `text-base` | 16px | Normal (defecto) | `<p className="text-base">Texto normal</p>` |
| `text-lg` | 18px | Títulos card | `<h3 className="text-lg font-bold">Título</h3>` |
| `text-xl` | 20px | Subtítulos | `<h2 className="text-xl font-bold">Subtítulo</h2>` |
| `text-2xl` | 24px | Títulos grandes | `<h2 className="text-2xl font-bold">Título Grande</h2>` |
| `text-3xl` | 30px | Títulos principales | `<h1 className="text-3xl font-bold">Principal</h1>` |

### Pesos de Fuente

| Clase | Peso | Uso | Ejemplo |
|-------|------|------|---------|
| `font-light` | 300 | Énfasis bajo | `<p className="font-light">Ligero</p>` |
| `font-normal` | 400 | Defecto | `<p className="font-normal">Normal</p>` |
| `font-medium` | 500 | Énfasis medio | `<span className="font-medium">Medio</span>` |
| `font-semibold` | 600 | Énfasis alto | `<span className="font-semibold">Importante</span>` |
| `font-bold` | 700 | Máximo énfasis | `<strong className="font-bold">Crítico</strong>` |

### Altura de Línea

| Clase | Valor | Uso |
|-------|-------|------|
| `leading-tight` | 1.25x | Títulos (compacto) |
| `leading-snug` | 1.375x | Subtítulos |
| `leading-normal` | 1.5x | Texto normal |
| `leading-relaxed` | 1.625x | Párrafos con espacio |
| `leading-loose` | 2x | Párrafos con mucho espaciado |

### Truncamiento

```tailwind
truncate        → Truncar en 1 línea con "..."
line-clamp-2    → Máximo 2 líneas
line-clamp-3    → Máximo 3 líneas
line-clamp-4    → Máximo 4 líneas
```

**Ejemplos:**
```tsx
{/* Nombre que puede ser largo */}
<h3 className="text-lg font-bold truncate">{producer.name}</h3>

{/* Email truncado */}
<p className="text-sm truncate">{email}</p>

{/* Descripción limitada a 2 líneas */}
<p className="text-sm text-neutral-600 line-clamp-2">{description}</p>
```

---

## 🎨 Colores (Colors)

### Colores de Texto

**Primarios:**
```tailwind
text-foreground     → Negro (#131615) - texto principal
text-primary        → Azul oscuro (#1C2046) - énfasis primario
text-secondary      → Cyan (#04C9E7) - énfasis secundario
text-accent         → Rojo (#FF6B6B) - énfasis crítico
```

**Neutrales:**
```tailwind
text-neutral-500    → Gris medio (#6B7280) - auxiliar
text-neutral-600    → Gris oscuro (#4B5563) - texto secundario
text-neutral-700    → Gris muy oscuro (#374151) - labels
text-neutral-400    → Gris claro (#9CA3AF) - very subtle
```

**Estados:**
```tailwind
text-success        → Verde (#4CAF50)
text-error          → Rojo (#F44336)
text-warning        → Amarillo (#FFC107)
text-info           → Azul (#2196F3)
```

### Colores de Fondo

**Primarios:**
```tailwind
bg-white            → Blanco (#FFFFFF)
bg-neutral          → Gris muy claro (#F3F4F6)
bg-gray-50          → Gris ligero (#F9FAFB)
bg-primary          → Azul oscuro (#1C2046)
bg-secondary        → Cyan (#04C9E7)
```

**Estados:**
```tailwind
bg-success          → Verde (#4CAF50)
bg-error            → Rojo (#F44336)
bg-warning          → Amarillo (#FFC107)
bg-info             → Azul (#2196F3)
```

**Con Transparencia:**
```tailwind
bg-primary/5        → Azul al 5% transparencia (muy sutil)
bg-primary/10       → Azul al 10% (hover backgrounds)
bg-primary/20       → Azul al 20% (focus backgrounds)
bg-primary/50       → Azul al 50% (opaco)
bg-secondary/5      → Cyan al 5%
bg-secondary/10     → Cyan al 10%
bg-secondary/20     → Cyan al 20%
bg-black/50         → Negro al 50% (modal overlays)
```

**Recomendaciones:**
```tsx
{/* Fondo de lista */}
<div className="bg-white">

{/* Fondo de sección alternada */}
<div className="bg-neutral">

{/* Fondo sutil de campo enfocado */}
<div className="bg-primary/5">

{/* Overlay de modal */}
<div className="fixed inset-0 bg-black/50">

{/* Estado de éxito */}
<div className="bg-success/10">
  <p className="text-success">Completado</p>
</div>
```

### Colores de Borde

```tailwind
border-gray-200     → Borde gris (estándar)
border-primary      → Borde azul oscuro (énfasis)
border-secondary    → Borde cyan (énfasis)
border-error        → Borde rojo (error)
border-success      → Borde verde (éxito)
border-warning      → Borde amarillo (advertencia)
```

---

## 📐 Espaciado (Spacing)

### Padding (Relleno Interno)

| Clase | Valor | Uso |
|-------|-------|------|
| `p-1` | 4px | Spacing muy pequeño |
| `p-2` | 8px | **Padding card estándar** |
| `p-3` | 12px | Padding pequeño |
| `p-4` | 16px | Padding medio (default) |
| `p-6` | 24px | Padding grande |
| `p-8` | 32px | Padding muy grande |
| `p-12` | 48px | Padding máximo |

**Padding Horizontal/Vertical:**
```tailwind
px-2        → 8px horizontal
px-4        → 16px horizontal
px-6        → 24px horizontal

py-2        → 8px vertical
py-4        → 16px vertical
py-6        → 24px vertical

pt-2        → 8px top
pb-2        → 8px bottom
pl-2        → 8px left
pr-2        → 8px right
```

### Margin (Espaciado Externo)

| Clase | Valor | Uso |
|-------|-------|------|
| `m-1` | 4px | Margin muy pequeño |
| `m-2` | 8px | Margin pequeño |
| `m-4` | 16px | Margin medio |
| `m-6` | 24px | Margin grande |
| `m-8` | 32px | Margin muy grande |

**Margin en direcciones específicas:**
```tailwind
mb-2        → Margin bottom 8px (separar elementos)
mb-4        → Margin bottom 16px
mt-2        → Margin top 8px
mr-2        → Margin right 8px
ml-2        → Margin left 8px
mx-auto     → Margin horizontal auto (centrar)
```

### Gap (Espaciado en Flex/Grid)

```tailwind
gap-1       → 4px entre elementos
gap-2       → 8px **gap estándar**
gap-3       → 12px
gap-4       → 16px (gap en grid)
gap-6       → 24px (gap grande)
gap-8       → 32px
```

**Espaciado Vertical:**
```tailwind
space-y-2   → 8px vertical entre hijos
space-y-3   → 12px vertical
space-y-4   → 16px vertical (default en formas)
space-y-6   → 24px vertical
```

---

## 📏 Tamaños (Sizing)

### Ancho (Width)

```tailwind
w-full          → 100% del contenedor
w-1/2           → 50%
w-1/3           → 33.333%
w-1/4           → 25%
w-2/3           → 66.666%
w-3/4           → 75%
```

### Ancho Máximo

| Clase | Valor | Uso |
|-------|-------|------|
| `max-w-sm` | 384px | **Campos entrada (input, select)** |
| `max-w-md` | 448px | Diálogos pequeños |
| `max-w-lg` | 512px | Diálogos medianos |
| `max-w-xl` | 576px | Diálogos grandes |
| `max-w-2xl` | 672px | Diálogos muy grandes |
| `max-w-4xl` | 896px | **Contenedores de página** |
| `max-w-6xl` | 1152px | Layout ancho |

**Ejemplos:**
```tsx
{/* Campo de entrada */}
<input className="max-w-sm" />

{/* Contenedor de página */}
<div className="max-w-4xl mx-auto">

{/* Diálogo */}
<dialog className="max-w-lg">
```

### Altura (Height)

```tailwind
h-full          → 100% del contenedor
h-screen        → 100vh (altura de pantalla)
min-h-screen    → Mínimo 100vh
min-h-[90vh]    → Mínimo 90% viewport
max-h-[90vh]    → Máximo 90% viewport

h-auto          → Auto según contenido
h-0             → 0px (oculto)
```

---

## 🎯 Bordes y Sombras

### Bordes (Borders)

```tailwind
border          → 1px sólido
border-0        → Sin borde
border-2        → 2px sólido
border-4        → 4px sólido (separadores)

border-t        → Borde superior solo
border-b        → Borde inferior solo
border-l        → Borde izquierdo solo
border-r        → Borde derecho solo

border-t-2      → Borde superior 2px
border-b-2      → Borde inferior 2px
```

**Colores de borde:**
```tailwind
border-gray-200     → Gris (estándar)
border-primary      → Azul oscuro (enfoque)
border-error        → Rojo (error)
border-success      → Verde (éxito)
```

### Redondeado (Border Radius)

| Clase | Valor | Uso |
|-------|-------|------|
| `rounded-none` | 0px | Sin redondeo |
| `rounded-sm` | 2px | Redondeo mínimo |
| `rounded` | 4px | **Redondeo estándar (buttons)** |
| `rounded-md` | 6px | Redondeo medio |
| `rounded-lg` | 8px | **Redondeo grande (cards, inputs)** |
| `rounded-xl` | 12px | Redondeo extra grande |
| `rounded-2xl` | 16px | Redondeo máximo |
| `rounded-full` | 9999px | Completamente redondo |

### Sombras (Shadows)

```tailwind
shadow-none     → Sin sombra (default)
shadow-sm       → **Sombra muy ligera (cards)**
shadow-md       → Sombra media (hover)
shadow-lg       → Sombra grande (componentes elevados)
shadow-xl       → **Sombra muy grande (diálogos)**
shadow-2xl      → Sombra dramática (críticos)
```

**Ejemplo:**
```tsx
{/* Card estándar */}
<div className="shadow-sm">

{/* Dialog/Modal */}
<div className="shadow-xl">

{/* Con efecto hover */}
<div className="shadow-sm hover:shadow-md transition-shadow">
```

---

## 🎲 Flexbox y Grid

### Flex

```tailwind
flex            → display: flex
flex-row        → flex-direction: row (defecto)
flex-col        → flex-direction: column
flex-wrap       → flex-wrap: wrap

justify-start   → align-items: flex-start
justify-center  → align-items: center
justify-between → align-items: space-between
justify-end     → align-items: flex-end

items-start     → align-content: flex-start
items-center    → align-content: center
items-between   → align-content: space-between
items-end       → align-content: flex-end

gap-2           → gap: 8px
gap-4           → gap: 16px

flex-1          → flex: 1
flex-grow       → flex-grow: 1
flex-shrink     → flex-shrink: 1
flex-nowrap     → flex-wrap: nowrap
```

**Ejemplos:**
```tsx
{/* Header flex con espacio entre */}
<div className="flex justify-between items-center gap-4">
  <h1>Título</h1>
  <button>Acción</button>
</div>

{/* Column con gap */}
<div className="flex flex-col gap-4">
  <input />
  <button />
</div>

{/* Row centered */}
<div className="flex items-center justify-center gap-2">
  <Icon />
  <span>Texto</span>
</div>
```

### Grid

```tailwind
grid                → display: grid
grid-cols-1         → 1 columna
grid-cols-2         → 2 columnas
grid-cols-3         → 3 columnas
grid-cols-4         → 4 columnas
grid-cols-12        → 12 columnas (Bootstrap style)

gap-4               → gap: 16px
gap-6               → gap: 24px
gap-8               → gap: 32px

col-span-1          → columna 1
col-span-2          → columns 2
col-span-full       → columnas todas
```

**Ejemplos:**
```tsx
{/* Grid 2 columnas */}
<div className="grid grid-cols-2 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

{/* Grid responsivo */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>

{/* Grid asimétrico */}
<div className="grid grid-cols-3 gap-4">
  <div className="col-span-2">Grande</div>
  <div>Pequeño</div>
</div>
```

---

## 🔲 Posicionamiento

### Position

```tailwind
static          → position: static (defecto)
fixed           → position: fixed (fijo en viewport)
absolute        → position: absolute
relative        → position: relative
sticky          → position: sticky

inset-0         → top: 0, right: 0, bottom: 0, left: 0
top-0           → top: 0
right-0         → right: 0
bottom-0        → bottom: 0
left-0          → left: 0
```

**Ejemplo (Modal Overlay):**
```tsx
<div className="fixed inset-0 bg-black/50 flex items-center justify-center">
  <div className="bg-white rounded-lg shadow-xl max-w-lg">
    {/* Contenido del modal */}
  </div>
</div>
```

### Z-Index

```tailwind
z-0             → z-index: 0
z-10            → z-index: 10
z-20            → z-index: 20
z-30            → z-index: 30
z-40            → z-index: 40
z-50            → z-index: 50 (modales)
z-auto          → z-index: auto
```

---

## 🔆 Estados Interactivos

### Hover

```tailwind
hover:bg-primary        → Cambiar fondo on hover
hover:text-primary      → Cambiar texto on hover
hover:shadow-md         → Cambiar sombra on hover
hover:border-primary    → Cambiar borde on hover
hover:opacity-80        → Cambiar opacidad on hover
```

**Ejemplo:**
```tsx
<button className="bg-primary hover:bg-primary/80 text-white rounded px-4 py-2">
  Botón
</button>
```

### Focus

```tailwind
focus:outline-none          → Remover outline defecto
focus:ring-2                → Agregar ring (outline)
focus:ring-primary          → Ring color primario
focus:ring-offset-2         → Offset del ring
focus:bg-primary/5          → Background on focus
```

**Ejemplo (Input):**
```tsx
<input className="border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
```

### Active/Disabled

```tailwind
active:scale-95         → Escala cuando se presiona
disabled:opacity-50     → Opacidad cuando deshabilitado
disabled:cursor-not-allowed → Cursor deshabilitado
disabled:bg-gray-200    → Fondo cuando deshabilitado

aria-disabled:opacity-50    → Accesible disabled
aria-invalid:border-error   → Accesible error
```

### Transitions

```tailwind
transition               → Transición default (propiedades comunes)
transition-colors       → Transición solo de colores
transition-all          → Transición de todas las propiedades
transition-none         → Sin transición

duration-75             → 75ms
duration-100            → 100ms
duration-150            → 150ms (defecto)
duration-200            → 200ms
duration-300            → 300ms
```

---

## ⭐ Combinaciones Comunes

### Botón Primario

```tailwind
bg-primary text-white rounded px-4 py-2 font-medium hover:bg-primary/80 transition-colors
```

```tsx
<button className="bg-primary text-white rounded px-4 py-2 font-medium hover:bg-primary/80 transition-colors">
  Crear
</button>
```

### Botón Secundario

```tailwind
border border-primary text-primary rounded px-4 py-2 font-medium hover:bg-primary/5 transition-colors
```

```tsx
<button className="border border-primary text-primary rounded px-4 py-2 font-medium hover:bg-primary/5 transition-colors">
  Cancelar
</button>
```

### Card

```tailwind
bg-white rounded-lg shadow-sm border border-gray-200 p-2
```

```tsx
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
  {/* Contenido */}
</div>
```

### Label + Input

```tailwind
<label className="text-sm font-medium text-neutral-700">Etiqueta</label>
<input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary" />
```

### Espaciador Vertical

```tailwind
space-y-4       → Espaciado vertical entre todos los hijos
space-y-6       → Espaciado grande
space-y-2       → Espaciado pequeño
```

```tsx
<div className="space-y-4">
  <input />
  <input />
  <button>Enviar</button>
</div>
```

### Contenedor Centrado (Máx width)

```tailwind
max-w-4xl mx-auto px-4
```

```tsx
<div className="max-w-4xl mx-auto px-4">
  {/* Contenido centrado y con máximo ancho */}
</div>
```

### Grid Responsivo

```tailwind
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4
```

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Items */}
</div>
```

---

## 🚫 Clases a Evitar

| ❌ No usar | ✅ Usar | Razón |
|----------|---------|-------|
| `w-screen` | `w-full` | `w-screen` incluye scrollbar |
| `h-screen` | `min-h-screen` | `h-screen` puede causar overflow |
| `text-[100px]` | `text-4xl` o usar `@apply` | Mantén escala consistente |
| `shadow-[0_0_20px]` | `shadow-lg` o `shadow-xl` | Sombras predefinidas son suficientes |
| `bg-[#ff0000]` | Usar colores de la paleta | Mantén consistencia |
| Inline styles | Clases Tailwind | Mejor mantenibilidad |

---

## 📚 Quick Copy-Paste Snippets

**Card Estándar:**
```tsx
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
  <h3 className="text-lg font-bold mb-2">Título</h3>
  <p className="text-sm text-neutral-600">Contenido</p>
</div>
```

**Flexbox Row:**
```tsx
<div className="flex items-center justify-between gap-4">
  <span>Izquierda</span>
  <span>Derecha</span>
</div>
```

**Grid 2 Columnas:**
```tsx
<div className="grid grid-cols-2 gap-4">
  <div>Col 1</div>
  <div>Col 2</div>
</div>
```

**Modal Overlay:**
```tsx
<div className="fixed inset-0 bg-black/50 flex items-center justify-center">
  <div className="bg-white rounded-lg shadow-xl max-w-lg p-6">
    Modal Content
  </div>
</div>
```

---

**Referencia Principal**: [FRONTEND_DESIGN_SYSTEM_COMPLETE.md](./FRONTEND_DESIGN_SYSTEM_COMPLETE.md)  
**Siguiente Documento**: [FRONTEND_COMPONENTS_STYLES.md](./FRONTEND_COMPONENTS_STYLES.md)

