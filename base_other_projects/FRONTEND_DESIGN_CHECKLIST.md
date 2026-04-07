# ✅ Frontend Design Checklist - Validación de Consistencia

**Propósito**: 80+ items de validación para garantizar consistencia del design system  
**Versión**: 1.0  
**Última actualización**: Marzo 2026  
**Status**: ✅ Production-Ready

---

## Cómo Usar Este Checklist

1. **Antes de crear un componente nuevo**
   - Verifica si ya existe en la librería
   - Revisa el patrón recomendado aquí

2. **Durante el desarrollo**
   - Marca items completados
   - Revisa secciones relevantes
   - Adhiere a los estándares

3. **En code review**
   - Usa este checklist para validar
   - Asegura consistencia
   - Reclama deuda técnica

4. **Antes de merge a main**
   - Todos los items ✅ marcados
   - No hay warnings
   - Mobile first probado

---

## 🎨 Colores y Tema

### Uso de Colores

- [ ] **Colores Solo de Paleta**: Se usan solo colores definidos en `tailwind.config.js`
- [ ] **Sin Colores Inline**: No hay `style={{ backgroundColor: '#ffffff' }}`
- [ ] **Sin Hex Custom**: No hay valores como `bg-[#ff0000]`
- [ ] **Primario para Acciones**: Buttons y CTAs usan `bg-primary`
- [ ] **Secundario para Énfasis**: Acentos usan `bg-secondary` o `text-secondary`
- [ ] **Grises Solo gray-X**: Bordes `border-gray-200`, texto `text-gray-500`
- [ ] **Transparencias Correctas**: Se usan `/10`, `/20`, `/50` para variantes
- [ ] **Estados Color Semánticos**: Success (verde), Error (rojo), Warning (amarillo)
- [ ] **Sin Colores Oscuros en Mobile**: Mejor contraste en pantalla pequeña
- [ ] **Contrast WCAG**: Ratio mínimo 4.5:1 para texto

### Fondo y Neutrales

- [ ] **Fondo Blanco**: `bg-white` en contenedores principales
- [ ] **Gris Claro para Alternancia**: `bg-neutral` (gris muy claro)
- [ ] **Bordes Grises**: `border-gray-200` (gris estándar)
- [ ] **Sin Fondos Negros**: Máximo `bg-neutral` (no `bg-gray-900`)
- [ ] **Transparencias en Overlays**: `bg-black/50` para modales

---

## 📝 Tipografía

### Escalas de Texto

- [ ] **Títulos H1**: `text-3xl font-bold text-primary`
- [ ] **Títulos H2**: `text-2xl font-bold text-primary`
- [ ] **Títulos H3**: `text-lg font-bold text-foreground`
- [ ] **Títulos H4**: `text-base font-bold text-foreground`
- [ ] **Body Texto**: `text-base text-foreground`
- [ ] **Labels**: `text-sm font-medium text-neutral-700`
- [ ] **Helper**: `text-xs text-neutral-600`
- [ ] **Sin Tamaños Custom**: No hay `text-[20px]`
- [ ] **Consistencia Peso**: No se mezclan pesos innecesariamente
- [ ] **Jerarquía Clara**: Es obvio qué es título vs body

### Fuentes

- [ ] **Fuente Principal**: Inter usada para UI
- [ ] **Fuente Mono**: Geist Mono para códigos
- [ ] **Sistemas Fallback**: `system-ui, sans-serif` o `monospace` incluidos
- [ ] **Kerning Auto**: Tailwind lo define automáticamente
- [ ] **Ligaduras**: Solo en contextos apropiados (títulos, no body)

### Línea de Texto (Leading)

- [ ] **Títulos Tight**: `leading-tight` (1.25x)
- [ ] **Body Normal**: `leading-normal` (1.5x) por defecto
- [ ] **Párrafos Largos**: `leading-relaxed` (1.625x)
- [ ] **Sin Custom Leading**: No hay `leading-[1.8]`

### Truncamiento

- [ ] **Una Línea**: `truncate` para nombres largos
- [ ] **Dos Líneas**: `line-clamp-2` para descripciones
- [ ] **Tres+ Líneas**: `line-clamp-3` o `line-clamp-4` para textos
- [ ] **Ellipsis Visual**: El "..." es visible en truncados

---

## 📐 Espaciado (Spacing)

### Padding Interno

- [ ] **Cards Default**: `p-2` (8px) OBLIGATORIO
- [ ] **Cards Grandes**: `p-4` (16px) máximo
- [ ] **Campos**: `px-3 py-2` (horizontal 12px, vertical 8px)
- [ ] **Buttons**: `px-4 py-2` (horizontal 16px, vertical 8px)
- [ ] **Sin Padding Asimétrico Innecesario**: `p-4 pb-8` solo si hay razón

### Margin Externo

- [ ] **Entre Secciones**: `mb-4` o `mb-6` (16px o 24px)
- [ ] **Entre Items en Lista**: `mb-2` (8px)
- [ ] **Sin Márgenes Negativos Random**: Solo `mx-auto` para centrado
- [ ] **Centrado Horizontal**: `mx-auto` en lugar de `m-auto`

### Gap en Flex/Grid

- [ ] **Gap Estándar**: `gap-4` (16px por defecto)
- [ ] **Gap Pequeño**: `gap-2` (8px para items cercanos)
- [ ] **Gap Grande**: `gap-6` o `gap-8` (24px o 32px)
- [ ] **Espaciado Vertical Consistente**: `space-y-4` en formularios
- [ ] **Sin Gap 0**: Si no necesitas gap, no lo incluyas

### Sistema 4px

- [ ] **Múltiplos de 4**: Todos los espacios son múltiplos de 4px
- [ ] **p-1=4px, p-2=8px, p-4=16px**: Escala correcta
- [ ] **gap-1=4px, gap-2=8px, gap-4=16px**: Escala correcta
- [ ] **Sin 3px, 5px, 6px Custom**: Mantén escala 4px

---

## 🎴 Cards

### Estructura

- [ ] **Contenedor Base**: `bg-white rounded-lg shadow-sm border border-gray-200`
- [ ] **Padding Obligatorio**: `p-2` (8px mínimo)
- [ ] **Sombra Correcta**: `shadow-sm` (no más fuerte)
- [ ] **Borde Gris**: `border-gray-200` (no `border-gray-300`)
- [ ] **Sin Padding Extra**: No `p-4` a menos que el contenido lo requiera

### Secciones

- [ ] **Header si existe**: `border-b border-gray-200 pb-2 mb-2`
- [ ] **Contenido**: `space-y-2` o `space-y-4` entre elementos
- [ ] **Imagen si existe**: `-mx-2 -mt-2 mb-2 rounded-t-lg overflow-hidden`
- [ ] **Badges**: `bg-primary/10 text-primary text-xs font-medium`
- [ ] **Footer si existe**: `border-t border-gray-200 pt-2 mt-2`

### Interactividad

- [ ] **Hover Subtle**: `hover:shadow-md transition-shadow` (opcional)
- [ ] **Sin Hover Agresivo**: No `hover:bg-gray-100` o cambios drásticos
- [ ] **Click Feedback**: El cursor cambia a `pointer`

---

## 💬 Dialogs (Modales)

### Overlay

- [ ] **Overlay Correcto**: `fixed inset-0 bg-black/50`
- [ ] **Z-index**: `z-50` para estar encima de todo
- [ ] **Centrado**: `flex items-center justify-center`
- [ ] **Sin Scroll**: `document.body.style.overflow = 'hidden'` al abrir

### Contenedor Modal

- [ ] **Tamaño**: `max-w-lg` (512px) mínimo
- [ ] **Responsive**: `w-full mx-4` en mobile
- [ ] **Sombra**: `shadow-xl` (más fuerte que cards)
- [ ] **Rounded**: `rounded-lg` (8px)

### Header

- [ ] **Estructura**: `flex items-center justify-between px-6 py-4`
- [ ] **Borde**: `border-b border-gray-200`
- [ ] **Título**: `text-lg font-bold`
- [ ] **Botón Cerrar**: `✕` sin fondo, hover cambia color

### Body

- [ ] **Padding**: `px-6 py-4`
- [ ] **Max Height**: `max-h-[70vh] overflow-y-auto`
- [ ] **Espaciado**: `space-y-4` entre elementos
- [ ] **Campos**: Labels + inputs con validación visual

### Footer

- [ ] **Padding**: `px-6 py-4`
- [ ] **Borde Superior**: `border-t border-gray-200`
- [ ] **Alineación**: `justify-end` (botones a la derecha)
- [ ] **Gap Botones**: `gap-3` (12px)
- [ ] **Botón Cancela Izq**: Outline secondary
- [ ] **Botón Confirma Der**: Full primary

### Limpieza

- [ ] **ESC para Cerrar**: `keydown` listener
- [ ] **Click Afuera Cierra**: Click en overlay cierra (opcional pero recomendado)
- [ ] **Scroll Restaurado**: `document.body.style.overflow = 'auto'` al cerrar
- [ ] **Event Listeners Removidos**: No memory leaks
- [ ] **Estado Formulario Limpio**: Inputs vaciados al cerrar

---

## 📋 Formularios

### Estructura

- [ ] **Contenedor**: `space-y-4 max-w-sm`
- [ ] **Max Width**: `max-w-sm` (384px) para campos
- [ ] **Espaciado**: `space-y-4` (16px) entre campos

### Etiquetas (Labels)

- [ ] **Tamaño**: `text-sm font-medium text-neutral-700`
- [ ] **Block**: `block mb-2` para estar encima del input
- [ ] **Requerido**: Marcar con `*` si es obligatorio

### Inputs

- [ ] **Padding**: `px-3 py-2` (border box)
- [ ] **Border**: `border border-gray-200`
- [ ] **Rounded**: `rounded-lg` (8px)
- [ ] **Focus**: `focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`
- [ ] **Transition**: `transition-all` para suavidad
- [ ] **Width**: `w-full` para ocupar contenedor

### Inputs con Error

- [ ] **Borde Grueso**: `border-2 border-error`
- [ ] **Ring Error**: `focus:ring-error`
- [ ] **Mensaje**: `text-xs text-error` debajo del input
- [ ] **Rojo Claro**: `bg-error/5` de fondo (opcional)

### Selects/Checkboxes

- [ ] **Tamaño**: `w-4 h-4` para cuadrados
- [ ] **Radio Buttons**: Redondos con `rounded-full` en wrapper

### Validación Visual

- [ ] **Required**: Asterisco `*` o marca visual
- [ ] **Invalid**: Borde rojo `border-error`
- [ ] **Helper Text**: `text-xs text-neutral-600` debajo
- [ ] **Disabled**: `opacity-50 cursor-not-allowed`

---

## 🔘 Botones

### Botón Primario

- [ ] **Color**: `bg-primary text-white`
- [ ] **Padding**: `px-4 py-2`
- [ ] **Rounded**: `rounded` (4px) o `rounded-lg` (8px)
- [ ] **Font**: `font-medium`
- [ ] **Hover**: `hover:bg-primary/80`
- [ ] **Focus**: `focus:ring-2 focus:ring-primary focus:ring-offset-2`
- [ ] **Transition**: `transition-colors` o `transition-all`
- [ ] **Cursor**: `cursor-pointer` (automático)

### Botón Secundario

- [ ] **Border**: `border border-primary`
- [ ] **Text**: `text-primary`
- [ ] **Background**: `bg-white`
- [ ] **Hover**: `hover:bg-primary/5`
- [ ] **Padding**: Igual que primario

### Botón Ghost (Sin Fondo)

- [ ] **Solo Texto**: `text-primary font-medium`
- [ ] **Hover**: `hover:bg-primary/5` o similar
- [ ] **No Borde**: Transparente

### Botón Destructivo

- [ ] **Color**: `bg-error text-white`
- [ ] **Hover**: `hover:bg-error/80`
- [ ] **Texto**: "Eliminar", "Aceptar Riesgo", etc.
- [ ] **Posición**: Siempre al final (derecha)

### Botón Deshabilitado

- [ ] **Opacity**: `opacity-50` o `bg-gray-200`
- [ ] **Cursor**: `cursor-not-allowed`
- [ ] **Atributo**: `disabled` en el HTML

### Tamaños

- [ ] **Standard**: `px-4 py-2` texto `text-sm`
- [ ] **Pequeño**: `px-3 py-1` texto `text-xs`
- [ ] **Grande**: `px-6 py-3` texto `text-base`

---

## 📊 DataGrid y Tablas

### Estructura

- [ ] **Overflow**: `overflow-x-auto` para scroll horizontal
- [ ] **Table**: `w-full text-sm`
- [ ] **Thead**: `bg-neutral border-b border-gray-200`
- [ ] **Tbody**: Filas con `border-b border-gray-200`

### Celdas

- [ ] **Header**: `px-4 py-2 font-semibold text-foreground`
- [ ] **Body**: `px-4 py-2 text-foreground`
- [ ] **Alineación**: `text-left` para texto, `text-right` para números

### Hover

- [ ] **Subtle**: `hover:bg-neutral` (cambio muy sutil)
- [ ] **Sin Highlight Agresivo**: No `hover:bg-primary` o similar

---

## 📱 Listas y Listados

### Contenedor

- [ ] **Spacing**: `space-y-2` (8px) entre items
- [ ] **Sin Margen Extra**: No `mb` en el contenedor

### Item Lista

- [ ] **Padding**: `p-2` mínimo
- [ ] **Border**: `border border-gray-200`
- [ ] **Rounded**: `rounded-lg`
- [ ] **Background**: `bg-white`
- [ ] **Hover**: `hover:bg-gray-50 transition-colors`

### Header Lista

- [ ] **Búsqueda**: Input con `max-w-sm`
- [ ] **Crear Button**: `bg-primary` a la derecha
- [ ] **Gap**: `gap-4` entre search y button
- [ ] **Margin Bottom**: `mb-4` separación

### Empty State

- [ ] **Centrado**: `text-center py-8`
- [ ] **Mensaje**: `text-neutral-600` claro

---

## 🎯 Estados y Feedback

### Success

- [ ] **Color**: `bg-success text-white` o `text-success`
- [ ] **Fondo Sutil**: `bg-success/10` para badges
- [ ] **Borde**: `border border-success/20`
- [ ] **Icon**: Chequeo `✓`

### Error

- [ ] **Color**: `bg-error text-white` o `text-error`
- [ ] **Fondo Sutil**: `bg-error/10` para badges
- [ ] **Borde**: `border border-error/20`
- [ ] **Icon**: X `✕`

### Warning

- [ ] **Color**: `bg-warning text-foreground` (contraste)
- [ ] **Fondo Sutil**: `bg-warning/10`
- [ ] **Borde**: `border border-warning/20`
- [ ] **Icon**: Exclamación `!`

### Info

- [ ] **Color**: `bg-info text-white` o `text-info`
- [ ] **Fondo Sutil**: `bg-info/10`
- [ ] **Borde**: `border border-info/20`
- [ ] **Icon**: Info `ℹ`

### Loading

- [ ] **Spinner**: Animado con CSS
- [ ] **Overlay**: `bg-white/50` si bloquea interacción
- [ ] **Mensaje**: "Cargando..." o similar

---

## 🏷️ Badges y Pills

### Badges Simple

- [ ] **Tamaño**: `text-xs font-medium`
- [ ] **Padding**: `px-3 py-1`
- [ ] **Rounded**: `rounded` (4px)
- [ ] **Color Fondo**: `bg-primary/10`
- [ ] **Color Texto**: `text-primary`

### Badges con Color

- [ ] **Success**: `bg-success/10 text-success`
- [ ] **Error**: `bg-error/10 text-error`
- [ ] **Warning**: `bg-warning/10 text-warning`

### Pills (Con Cierre)

- [ ] **Rounded**: `rounded-full` (completamente redondo)
- [ ] **Flex**: `inline-flex items-center gap-1`
- [ ] **Botón X**: `text-primary hover:opacity-70`

---

## 📱 Responsividad

### Breakpoints

- [ ] **Mobile First**: Estilos base sin prefijo
- [ ] **sm**: 640px+ con `sm:` (raro, casi no se usa)
- [ ] **md**: 768px+ con `md:` (tablet)
- [ ] **lg**: 1024px+ con `lg:` (desktop)
- [ ] **No xl/2xl**: Casi nunca necesarios

### Layout Responsivo

- [ ] **Grid**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- [ ] **Flex**: `flex flex-col md:flex-row`
- [ ] **Ocultar/Mostrar**: `hidden md:block` para desktop-only
- [ ] **Padding**: `px-4 md:px-6 lg:px-8` o similar

### Viewport

- [ ] **Meta Tag**: `width=device-width, initial-scale=1`
- [ ] **Sin Zoom Disable**: `user-scalable=yes` o permitido
- [ ] **Tested Mobile**: Probado en teléfono real
- [ ] **Tested Tablet**: Probado en tablet
- [ ] **Tested Desktop**: Probado en monitor 1080p+

---

## ♿ Accesibilidad

### Contrast

- [ ] **Ratio 4.5:1**: Texto sobre background
- [ ] **Bold si Débil**: Títulos sin bold se ven pálidos
- [ ] **Grises Oscuros**: `text-neutral-700` mínimo para body

### Labels

- [ ] **Labels en Inputs**: `<label htmlFor="input-id">`
- [ ] **Labels Visibles**: No solo placeholders
- [ ] **Asterisco Requerido**: `*` si es obligatorio

### Keyboard Navigation

- [ ] **Tab Order**: Lógico y predecible
- [ ] **Focus Visible**: Se ve dónde estoy con Tab
- [ ] **Enter en Forms**: Enviar con Enter
- [ ] **ESC en Dialogs**: Cerrar con ESC

### ARIA

- [ ] **aria-label**: En botones sin texto (ej: close button)
- [ ] **aria-hidden**: En iconos decorativos
- [ ] **role**: Si usar elemento custom (raro)

### Screen Reader

- [ ] **Buttons vs Links**: `<button>` para acciones, `<a>` para nav
- [ ] **Image Alt**: `alt="descripción"` en cada imagen
- [ ] **Empty Alt**: `alt=""` para decorativo

---

## ⚡ Performance

### CSS

- [ ] **Tailwind Solo**: No hay `<style>` inline
- [ ] **Clases Utilizadas**: No hay clases sin usar
- [ ] **Sin `!important`**: Especificidad mantenida
- [ ] **PurgeCSS**: Tailwind auto-purga en build

### JavaScript

- [ ] **Event Listeners Removidos**: `useEffect cleanup`
- [ ] **Memos**: Componentes costosos con `React.memo`
- [ ] **Code Splitting**: Imports dinámicos si es necesario
- [ ] **Console Clean**: Sin warnings o errors

### Imágenes

- [ ] **Next/Image**: Usado en lugar de `<img>`
- [ ] **Lazy Loading**: Automático con Next
- [ ] **Size Optimization**: 100KB máximo por imagen
- [ ] **WebP Format**: Soportado y usado

---

## 🧪 Testing

### Visual Testing

- [ ] **Desktop 1440px**: Se ve bien
- [ ] **Tablet 768px**: Responsive correcto
- [ ] **Mobile 375px**: Fully usable
- [ ] **Landscape**: Probado en horizontal
- [ ] **Zoom 200%**: No overflow o broken

### Interacción

- [ ] **Click/Tap**: Funciona en mouse y touch
- [ ] **Hover**: Se ve bien en desktop
- [ ] **Focus**: Visible en keyboard nav
- [ ] **Disabled**: Claramente identificable

### Cross-Browser

- [ ] **Chrome**: Probado ✓
- [ ] **Firefox**: Probado ✓
- [ ] **Safari**: Probado ✓
- [ ] **Edge**: Probado ✓

### Performance (Lighthouse)

- [ ] **Performance**: > 85
- [ ] **Accessibility**: > 90
- [ ] **Best Practices**: > 85
- [ ] **SEO**: > 90

---

## 📋 Código

### Organización

- [ ] **Clases Agrupadas**: Colores > Espaciado > Layout > Estados
- [ ] **Línea Legible**: Máximo 80-100 chars (Tailwind es excepción)
- [ ] **Sin Hardcoding**: Strings en constantes
- [ ] **Comments si Necesario**: Solo para lógica compleja

### Imports

- [ ] **Sin Unused Imports**: Limpieza automática
- [ ] **Orden Alfanumérico**: React > Nextjs > Others > Relative
- [ ] **Barrel Exports**: Usar `index.ts` en features

### Props

- [ ] **TypeScript**: Tipos definidos
- [ ] **Default Props**: Valores lógicos
- [ ] **Propchecker**: PropTypes o TS valida

### Naming

- [ ] **Components**: PascalCase (`Button`, `Card`)
- [ ] **Functions**: camelCase (`handleClick`, `formatDate`)
- [ ] **Constants**: SCREAMING_SNAKE_CASE (`MAX_WIDTH`, `COLORS`)
- [ ] **Archivos**: kebab-case (`button.tsx`, `use-form.ts`)

---

## 🎯 Antes de Merge

### Checklist Final

- [ ] Todos los ✅ arriba completados
- [ ] Code review aprobado
- [ ] Tests pasando (si existen)
- [ ] No hay console warnings
- [ ] No hay console errors
- [ ] Lighthouse > 85
- [ ] Mobile tested en dispositivo real
- [ ] Documentación actualizada

---

**Referencias**:
- [FRONTEND_DESIGN_SYSTEM_COMPLETE.md](./FRONTEND_DESIGN_SYSTEM_COMPLETE.md)
- [FRONTEND_COMPONENTS_STYLES.md](./FRONTEND_COMPONENTS_STYLES.md)
- [FRONTEND_RESPONSIVE_DESIGN.md](./FRONTEND_RESPONSIVE_DESIGN.md)

**Versión Imprimible**: Copia este documento a Markdown y usa para printear/PDF

