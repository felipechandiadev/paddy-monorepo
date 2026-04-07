# 🧩 Frontend Components Styles - Estilos de Componentes

**Propósito**: Especificación detallada de estilos para componentes UI comunes  
**Versión**: 1.0  
**Última actualización**: Marzo 2026  
**Status**: ✅ Production-Ready

---

## Tabla de Contenidos

1. [Cards](#-cards)
2. [Dialogs (Modales)](#-dialogs-modales)
3. [Formularios](#-formularios)
4. [Botones](#-botones)
5. [Listas y Listados](#-listas-y-listados)
6. [DataGrid](#-datagrid)
7. [Estados y Feedback](#-estados-y-feedback)
8. [Badges y Pills](#-badges-y-pills)

---

## 🎴 Cards

### Anatomía Base

Las cards son contenedores fundamentales para presentar información agrupada.

**Estructura HTML:**
```tsx
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
  {/* Contenido */}
</div>
```

**Componentes Obligatorios:**
- `bg-white` - Fondo blanco
- `rounded-lg` - Esquinas redondeadas (8px)
- `shadow-sm` - Sombra ligera
- `border border-gray-200` - Borde gris claro
- `p-2` - **Padding interno 8px (OBLIGATORIO)**

### Secciones dentro de Card

#### 1. Header (Opcional)

```tsx
<div className="border-b border-gray-200 pb-2 mb-2">
  <h3 className="text-lg font-bold text-foreground">Título de Card</h3>
  <p className="text-sm text-neutral-600">Descripción opcional</p>
</div>
```

**Reglas:**
- Borde inferior: `border-b border-gray-200`
- Padding bottom: `pb-2` (8px)
- Margin bottom: `mb-2` (8px)
- Título: `text-lg font-bold`
- Descripción: `text-sm text-neutral-600`

#### 2. Contenido Principal

```tsx
<div className="space-y-2">
  {/* Contenido: texto, campos, etc */}
  <p className="text-base text-foreground">Contenido principal</p>
  <p className="text-sm text-neutral-600">Contenido secundario</p>
</div>
```

**Reglas:**
- Espaciado vertical: `space-y-2` (8px entre elementos)
- Texto principal: `text-base text-foreground`
- Texto secundario: `text-sm text-neutral-600`

#### 3. Image (Opcional)

Si la card incluye imagen:

```tsx
<div className="relative -mx-2 -mt-2 mb-2 rounded-t-lg overflow-hidden">
  <img 
    src={imageUrl} 
    alt="Card image"
    className="w-full h-auto object-cover"
  />
</div>
```

**Reglas:**
- Márgenes negativos: `-mx-2 -mt-2` (para extender al borde de la card)
- Rounded top: `rounded-t-lg` (solo esquinas superiores)
- Overflow: `overflow-hidden` (para evitar imagen fuera de bordes)
- Width: `w-full` (ancho completo)
- Height: `h-auto` (altura automática)
- Object fit: `object-cover` (cubrir sin distorsión)

#### 4. Badges/Tags

Dentro del contenido:

```tsx
<div className="flex flex-wrap gap-2">
  <span className="inline-block bg-primary/10 text-primary text-xs font-medium rounded px-3 py-1">
    Badge
  </span>
  <span className="inline-block bg-secondary/10 text-secondary text-xs font-medium rounded px-3 py-1">
    Tag
  </span>
</div>
```

**Reglas:**
- Flex wrap para cuando hay muchos: `flex flex-wrap gap-2`
- Fondo sutil: `bg-primary/10` (10% opacidad)
- Texto del color: `text-primary`
- Tamaño: `text-xs font-medium`
- Padding: `px-3 py-1`
- Redondeado: `rounded` (4px)

#### 5. Footer (Acciones)

```tsx
<div className="border-t border-gray-200 pt-2 mt-2 flex gap-2 justify-end">
  <button className="px-3 py-2 text-sm font-medium rounded border border-gray-200 hover:bg-gray-50">
    Cancelar
  </button>
  <button className="px-3 py-2 text-sm font-medium rounded bg-primary text-white hover:bg-primary/80">
    Guardar
  </button>
</div>
```

**Reglas:**
- Borde superior: `border-t border-gray-200`
- Padding: `pt-2 mt-2` (8px arriba y abajo)
- Flexbox: `flex gap-2 justify-end`
- Botones secundarios: `border border-gray-200 hover:bg-gray-50`
- Botones primarios: `bg-primary text-white hover:bg-primary/80`

### Ejemplo Completo de Card

```tsx
function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
      {/* Header */}
      <div className="border-b border-gray-200 pb-2 mb-2">
        <h3 className="text-lg font-bold text-foreground">
          {product.name}
        </h3>
        <p className="text-sm text-neutral-600">
          Código: {product.code}
        </p>
      </div>

      {/* Image */}
      <div className="relative -mx-2 -mt-0 mb-2 rounded-lg overflow-hidden h-32">
        <img 
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenido */}
      <div className="space-y-2 mb-2">
        <p className="text-base text-foreground">
          ${product.price.toFixed(2)}
        </p>
        <div className="flex flex-wrap gap-2">
          {product.tags.map(tag => (
            <span key={tag} className="inline-block bg-primary/10 text-primary text-xs font-medium rounded px-3 py-1">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 pt-2 mt-2 flex gap-2 justify-end">
        <button className="px-3 py-2 text-sm font-medium rounded border border-gray-200 hover:bg-gray-50">
          Editar
        </button>
        <button className="px-3 py-2 text-sm font-medium rounded bg-primary text-white hover:bg-primary/80">
          Comprar
        </button>
      </div>
    </div>
  );
}
```

---

## 💬 Dialogs (Modales)

### Anatomía Base

Los diálogos son ventanas modales que capturan la atención del usuario.

**Estructura HTML:**
```tsx
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
    {/* Contenido del diálogo */}
  </div>
</div>
```

**Componentes Obligatorios (Overlay):**
- `fixed inset-0` - Fijo en toda la pantalla
- `bg-black/50` - Fondo oscuro semi-transparente (50%)
- `flex items-center justify-center` - Centrado
- `z-50` - Encima de todo

**Componentes Obligatorios (Modal):**
- `bg-white` - Fondo blanco
- `rounded-lg` - Esquinas redondeadas (8px)
- `shadow-xl` - Sombra grande
- `max-w-lg` - Ancho máximo 512px
- `w-full mx-4` - Responsivo con margen en mobile

### Secciones del Dialog

#### 1. Header (Título + Cierre)

```tsx
<div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
  <h2 className="text-lg font-bold text-foreground">
    Título del Diálogo
  </h2>
  <button
    onClick={onClose}
    className="text-neutral-600 hover:text-foreground transition-colors"
    aria-label="Cerrar"
  >
    ✕
  </button>
</div>
```

**Reglas:**
- Padding: `px-6 py-4` (24px horizontal, 16px vertical)
- Borde inferior: `border-b border-gray-200`
- Flexbox: `flex items-center justify-between`
- Título: `text-lg font-bold`
- Botón cerrar: Sin fondo, hover cambia color

#### 2. Body (Contenido Principal)

```tsx
<div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
  {/* Contenido: texto, campos, listas, etc */}
  <p className="text-base text-foreground">Contenido principal</p>
  
  {/* Formularios */}
  <div className="space-y-3">
    <input className="w-full border border-gray-200 rounded-lg px-3 py-2" />
  </div>
</div>
```

**Reglas:**
- Padding: `px-6 py-4` (24px horizontal, 16px vertical)
- Espaciado vertical: `space-y-4` (16px)
- Máxima altura: `max-h-[70vh]` (70% viewport)
- Overflow: `overflow-y-auto` (scroll si es necesario)
- Contenido: `text-base text-foreground`

#### 3. Footer (Acciones)

```tsx
<div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
  <button className="px-4 py-2 text-sm font-medium rounded border border-gray-200 hover:bg-gray-50">
    Cancelar
  </button>
  <button className="px-4 py-2 text-sm font-medium rounded bg-primary text-white hover:bg-primary/80">
    Confirmar
  </button>
</div>
```

**Reglas:**
- Padding: `px-6 py-4` (24px horizontal, 16px vertical)
- Borde superior: `border-t border-gray-200`
- Flexbox: `flex gap-3 justify-end`
- Botones: Alineados a la derecha
- Gap: `gap-3` (12px entre botones)

#### 4. Botón Destructivo (Eliminar)

Si el diálogo es para confirmar eliminación:

```tsx
<button className="px-4 py-2 text-sm font-medium rounded bg-error text-white hover:bg-error/80">
  Eliminar
</button>
```

**Reglas:**
- Color: `bg-error text-white`
- Hover: `hover:bg-error/80` (más oscuro)
- Siempre a la derecha (después de cancelar)

### Ejemplo Completo de Dialog

```tsx
function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  isDestructive = false 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-foreground">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-600 hover:text-foreground"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <p className="text-base text-foreground">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded border border-gray-200 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium rounded text-white ${
              isDestructive
                ? 'bg-error hover:bg-error/80'
                : 'bg-primary hover:bg-primary/80'
            }`}
          >
            {isDestructive ? 'Eliminar' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Reglas Especiales de Limpieza

**Importante al cerrar un diálogo:**

1. Limpiar estado de formulario
2. Remover listeners globales (ESC, click afuera)
3. Restaurar scroll de página si estaba deshabilitado
4. Focus management (devolver focus al elemento que lo abrió)

```tsx
useEffect(() => {
  if (isOpen) {
    // Prevenir scroll
    document.body.style.overflow = 'hidden';
    
    // ESC para cerrar
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      // Limpieza al cerrar
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEsc);
    };
  }
}, [isOpen, onClose]);
```

---

## 📋 Formularios

### Estructura Base

```tsx
<form className="space-y-4 max-w-sm">
  {/* Campos */}
</form>
```

**Reglas:**
- Espaciado: `space-y-4` (16px entre campos)
- Ancho máximo: `max-w-sm` (384px)

### Campo de Entrada (Text Input)

```tsx
<div className="flex flex-col gap-2">
  <label className="text-sm font-medium text-neutral-700">
    Etiqueta del Campo
  </label>
  <input
    type="text"
    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
    placeholder="Placeholder..."
  />
  <p className="text-xs text-neutral-600">Texto de ayuda opcional</p>
</div>
```

**Estructura:**
- Label: `text-sm font-medium text-neutral-700`
- Input: `w-full border border-gray-200 rounded-lg px-3 py-2 text-base`
- Focus: `focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`
- Helper text: `text-xs text-neutral-600`

### Campo Select (Dropdown)

```tsx
<div className="flex flex-col gap-2">
  <label className="text-sm font-medium text-neutral-700">
    Selecciona una opción
  </label>
  <select
    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
  >
    <option value="">-- Selecciona --</option>
    <option value="1">Opción 1</option>
    <option value="2">Opción 2</option>
  </select>
</div>
```

### Campo Textarea

```tsx
<div className="flex flex-col gap-2">
  <label className="text-sm font-medium text-neutral-700">
    Descripción
  </label>
  <textarea
    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
    rows={4}
    placeholder="Escribe aquí..."
  />
</div>
```

### Campo con Error

```tsx
<div className="flex flex-col gap-2">
  <label className="text-sm font-medium text-neutral-700">
    Campo requerido
  </label>
  <input
    type="text"
    className="w-full border-2 border-error rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent"
  />
  <p className="text-xs text-error">Este campo es requerido</p>
</div>
```

**Reglas de error:**
- Borde: `border-2 border-error` (más grueso)
- Ring: `focus:ring-error`
- Mensaje: `text-xs text-error`

### Checkbox y Radio

```tsx
{/* Checkbox */}
<label className="flex items-center gap-2 cursor-pointer">
  <input
    type="checkbox"
    className="w-4 h-4 border border-gray-300 rounded focus:ring-primary"
  />
  <span className="text-sm text-foreground">
    Estoy de acuerdo con los términos
  </span>
</label>

{/* Radio Button */}
<label className="flex items-center gap-2 cursor-pointer">
  <input
    type="radio"
    name="option"
    className="w-4 h-4 border border-gray-300 text-primary focus:ring-primary"
  />
  <span className="text-sm text-foreground">
    Opción 1
  </span>
</label>
```

---

## 🔘 Botones

### Botón Primario

```tsx
<button className="bg-primary text-white rounded px-4 py-2 font-medium hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all">
  Acción Principal
</button>
```

**Clases:**
- `bg-primary text-white`
- `rounded px-4 py-2`
- `font-medium`
- `hover:bg-primary/80`
- `focus:ring-2 focus:ring-primary`

### Botón Secundario

```tsx
<button className="border border-primary text-primary bg-white rounded px-4 py-2 font-medium hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary transition-all">
  Acción Secundaria
</button>
```

**Clases:**
- `border border-primary text-primary`
- `bg-white`
- `hover:bg-primary/5`

### Botón Ghost (Sin fondo)

```tsx
<button className="text-primary font-medium hover:bg-primary/5 px-4 py-2 rounded transition-all">
  Acciones
</button>
```

### Botón Destructivo

```tsx
<button className="bg-error text-white rounded px-4 py-2 font-medium hover:bg-error/80 focus:outline-none focus:ring-2 focus:ring-error transition-all">
  Eliminar
</button>
```

### Botón Disabled

```tsx
<button disabled className="bg-gray-200 text-gray-500 rounded px-4 py-2 font-medium cursor-not-allowed">
  Deshabilitado
</button>
```

---

## 📝 Listas y Listados

### Lista Simple

```tsx
<div className="space-y-2">
  {items.map(item => (
    <div key={item.id} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{item.name}</p>
        <p className="text-xs text-neutral-600">{item.description}</p>
      </div>
      <button className="ml-4 text-neutral-600 hover:text-foreground">
        ⋯
      </button>
    </div>
  ))}
</div>
```

### Lista con Header

```tsx
<div>
  {/* Header con search y botón crear */}
  <div className="flex items-center justify-between mb-4 gap-4">
    <input
      type="text"
      placeholder="Buscar..."
      className="flex-1 max-w-sm border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
    />
    <button className="bg-primary text-white rounded px-4 py-2 text-sm font-medium hover:bg-primary/80">
      + Crear Nuevo
    </button>
  </div>

  {/* Items */}
  <div className="space-y-2">
    {items.map(item => (
      <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
        {/* Item content */}
      </div>
    ))}
  </div>
</div>
```

---

## 📊 DataGrid

### Estructura Base

```tsx
<div className="overflow-x-auto">
  <table className="w-full text-sm">
    <thead className="bg-neutral border-b border-gray-200">
      <tr>
        <th className="px-4 py-2 text-left font-semibold text-foreground">Columna 1</th>
        <th className="px-4 py-2 text-left font-semibold text-foreground">Columna 2</th>
      </tr>
    </thead>
    <tbody>
      {items.map(item => (
        <tr key={item.id} className="border-b border-gray-200 hover:bg-neutral">
          <td className="px-4 py-2 text-foreground">{item.col1}</td>
          <td className="px-4 py-2 text-foreground">{item.col2}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

**Reglas:**
- Header: `bg-neutral border-b border-gray-200`
- Celdas header: `px-4 py-2 font-semibold`
- Celdas body: `px-4 py-2`
- Filas: `border-b border-gray-200 hover:bg-neutral`

---

## ✔️ Estados y Feedback

### Success

```tsx
<div className="flex gap-3 p-3 bg-success/10 border border-success/20 rounded-lg">
  <span className="text-success">✓</span>
  <div>
    <p className="text-sm font-medium text-success">Éxito</p>
    <p className="text-xs text-success/80">Operación completada correctamente</p>
  </div>
</div>
```

### Error

```tsx
<div className="flex gap-3 p-3 bg-error/10 border border-error/20 rounded-lg">
  <span className="text-error">✕</span>
  <div>
    <p className="text-sm font-medium text-error">Error</p>
    <p className="text-xs text-error/80">Algo salió mal en la operación</p>
  </div>
</div>
```

### Warning

```tsx
<div className="flex gap-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
  <span className="text-warning">!</span>
  <div>
    <p className="text-sm font-medium text-warning">Advertencia</p>
    <p className="text-xs text-warning/80">Revisa antes de continuar</p>
  </div>
</div>
```

### Info

```tsx
<div className="flex gap-3 p-3 bg-info/10 border border-info/20 rounded-lg">
  <span className="text-info">ℹ</span>
  <div>
    <p className="text-sm font-medium text-info">Información</p>
    <p className="text-xs text-info/80">Esto es información importante</p>
  </div>
</div>
```

### Loader

```tsx
<div className="flex items-center justify-center gap-2">
  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  <span className="text-sm text-neutral-600">Cargando...</span>
</div>
```

---

## 🏷️ Badges y Pills

### Badge Simple

```tsx
<span className="inline-block bg-primary/10 text-primary text-xs font-medium rounded px-3 py-1">
  Badge
</span>
```

### Badge con Color

```tsx
{/* Success */}
<span className="inline-block bg-success/10 text-success text-xs font-medium rounded px-3 py-1">
  Activo
</span>

{/* Error */}
<span className="inline-block bg-error/10 text-error text-xs font-medium rounded px-3 py-1">
  Inactivo
</span>

{/* Warning */}
<span className="inline-block bg-warning/10 text-warning text-xs font-medium rounded px-3 py-1">
  Pendiente
</span>
```

### Pill con Cierre

```tsx
<div className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium rounded-full px-3 py-1">
  <span>Badge</span>
  <button className="hover:text-primary/80">✕</button>
</div>
```

---

**Referencias**: 
- [FRONTEND_DESIGN_SYSTEM_COMPLETE.md](./FRONTEND_DESIGN_SYSTEM_COMPLETE.md)
- [FRONTEND_STYLES_GUIDE.md](./FRONTEND_STYLES_GUIDE.md)

**Próximo Documento**: [FRONTEND_PATTERNS_AND_LAYOUTS.md](./FRONTEND_PATTERNS_AND_LAYOUTS.md)

