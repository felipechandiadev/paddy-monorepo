# 🎨 Frontend Design System - Sistema Completo

**Propósito**: Definición completa de colores, tipografía, espaciado y principios de diseño  
**Versión**: 1.0  
**Últim actualización**: Marzo 2026  
**Status**: ✅ Production-Ready

---

## Tabla de Contenidos

1. [Sistema de Colores](#-sistema-de-colores)
2. [Tipografía](#-tipografía)
3. [Espaciado y Dimensiones](#-espaciado-y-dimensiones)
4. [Sombras y Efectos](#-sombras-y-efectos)
5. [Iconografía](#-iconografía)
6. [Principios de Diseño](#-principios-de-diseño)

---

## 🎨 Sistema de Colores

### Paleta Principal

```css
:root {
  /* Colores Corporativos */
  --color-primary: #1C2046;        /* Azul oscuro (marca) */
  --color-secondary: #04C9E7;      /* Cyan (acento) */
  --color-accent: #FF6B6B;         /* Rojo (énfasis) */
  
  /* Texto */
  --color-foreground: #131615;     /* Negro (texto principal) */
  --color-muted: #6B7280;          /* Gris (texto secundario) */
  
  /* Fondos */
  --color-background: #FFFFFF;     /* Blanco */
  --color-neutral: #F3F4F6;        /* Gris muy claro */
  
  /* Estados */
  --color-success: #4CAF50;        /* Verde */
  --color-error: #F44336;          /* Rojo */
  --color-warning: #FFC107;        /* Amarillo */
  --color-info: #2196F3;           /* Azul */
}
```

### Uso en Tailwind

```tailwind
/* Colores de Texto */
text-foreground          → #131615 (texto negro)
text-muted              → #6B7280 (texto gris)
text-primary            → #1C2046 (texto azul oscuro)
text-secondary          → #04C9E7 (texto cyan)
text-accent             → #FF6B6B (texto rojo)

/* Colores de Fondo */
bg-white                → #FFFFFF
bg-background           → #FFFFFF
bg-neutral              → #F3F4F6 (gris claro)
bg-primary              → #1C2046 (azul oscuro)
bg-secondary            → #04C9E7 (cyan)
bg-success              → #4CAF50
bg-error                → #F44336
bg-warning              → #FFC107
bg-info                 → #2196F3

/* Colores de Borde */
border-gray-200         → #E5E7EB (bordes estándar)
border-primary          → #1C2046
border-secondary        → #04C9E7
border-error            → #F44336
```

### Variantes de Transparencia

Todas las clases de color soportan transparencia:

```tailwind
bg-primary/5            → 5% opacity
bg-primary/10           → 10% opacity (más usada)
bg-primary/20           → 20% opacity
bg-primary/30           → 30% opacity
bg-primary/50           → 50% opacity
bg-primary/75           → 75% opacity

bg-secondary/5          → Cyan al 5%
bg-secondary/10         → Cyan al 10%
bg-secondary/20         → Cyan al 20%

bg-black/50             → Negro al 50% (para overlays)
```

### Paleta Extendida (Grises)

```tailwind
gray-50    → #F9FAFB (muy claro)
gray-100   → #F3F4F6
gray-200   → #E5E7EB (bordes estándar)
gray-300   → #D1D5DB
gray-400   → #9CA3AF
gray-500   → #6B7280
gray-600   → #4B5563
gray-700   → #374151
gray-800   → #1F2937
gray-900   → #111827 (muy oscuro)
```

### Recomendaciones de Uso

**Para Fondos:**
```
- Contenedores principales: bg-white
- Fondos secundarios: bg-neutral, bg-gray-50
- Fondos sutiles: bg-primary/10, bg-secondary/5
- Overlays: bg-black/50 (50% opacidad)
```

**Para Textos:**
```
- Textos principales: text-foreground
- Textos secundarios: text-neutral-600
- Textos auxiliares: text-neutral-500
- Énfasis: text-primary, text-secondary
```

**Para Bordes:**
```
- Bordes estándar: border-gray-200
- Bordes de énfasis: border-primary, border-secondary
- Bordes de error: border-error
```

**Para Estados:**
```
- Éxito: bg-success, text-success
- Error: bg-error, text-error
- Advertencia: bg-warning, text-warning
- Información: bg-info, text-info
```

---

## 📝 Tipografía

### Fuentes Utilizadas

```css
/* Fuente Principal */
font-family: 'Inter', 'System UI', '-apple-system', 'BlinkMacSystemFont', sans-serif;

/* Fuente Monoespaciada */
font-family: 'Geist Mono', 'Courier New', monospace;
```

### Pesos Disponibles

```tailwind
font-light      → 300 (texto ligero)
font-normal     → 400 (texto normal)
font-medium     → 500 (texto semi-bold)
font-semibold   → 600 (texto semi-negrita)
font-bold       → 700 (texto negrita)
```

### Escalas de Tamaño

```tailwind
/* Títulos */
text-3xl        → 30px / 36px  (h1 - Títulos principales)
text-2xl        → 24px / 32px  (h2 - Subtítulos de sección)
text-xl         → 20px / 28px  (h3 - Títulos de card/módulo)
text-lg         → 18px / 28px  (h4 - Títulos de diálogo)

/* Cuerpo */
text-base       → 16px / 24px  (texto normal/párrafos)
text-sm         → 14px / 20px  (texto pequeño/labels)
text-xs         → 12px / 16px  (texto muy pequeño/badges)
```

### Altura de Línea (Line Height)

```tailwind
leading-tight   → 1.25x (para títulos)
leading-snug    → 1.375x (para subtítulos)
leading-normal  → 1.5x (para texto normal)
leading-relaxed → 1.625x (para párrafos largos)
leading-loose   → 2x (para textos con mucho espaciado)
```

### Composiciones Típicas

**Títulos Principales (h1)**
```tailwind
text-3xl font-bold text-primary
```

**Subtítulos (h2)**
```tailwind
text-2xl font-bold text-primary
```

**Títulos de Card (h3)**
```tailwind
text-lg font-bold text-foreground
```

**Títulos de Diálogo**
```tailwind
text-lg font-bold text-foreground
```

**Texto Normal**
```tailwind
text-base text-foreground
```

**Texto Secundario**
```tailwind
text-sm text-neutral-600
```

**Texto Auxiliar**
```tailwind
text-xs text-neutral-500
```

**Etiquetas (Labels)**
```tailwind
text-xs font-medium text-neutral-700
```

### Truncamiento de Texto

```tailwind
truncate           → Truncar en 1 línea con "..."
line-clamp-2       → Máximo 2 líneas
line-clamp-3       → Máximo 3 líneas
line-clamp-4       → Máximo 4 líneas
overflow-ellipsis  → "..." al final
```

**Uso Común:**
```tsx
{/* Nombre que puede ser largo */}
<h3 className="text-lg font-bold truncate">{name}</h3>

{/* Descripción limitada a 2 líneas */}
<p className="text-sm text-neutral-600 line-clamp-2">{description}</p>

{/* Email que puede ser muy largo */}
<p className="text-sm truncate">{email}</p>
```

---

## 📐 Espaciado y Dimensiones

### Sistema de Espaciado (4px base)

```tailwind
/* Padding */
p-1     = 4px      p-2     = 8px      p-3     = 12px
p-4     = 16px     p-6     = 24px     p-8     = 32px
p-10    = 40px     p-12    = 48px     p-16    = 64px

/* Horizontal Padding */
px-1    = 4px h    px-2    = 8px h    px-4    = 16px h
px-6    = 24px h   px-8    = 32px h

/* Vertical Padding */
py-1    = 4px v    py-2    = 8px v    py-4    = 16px v
py-6    = 24px v

/* Margin */
m-1     = 4px      m-2     = 8px      m-4     = 16px
m-6     = 24px     m-8     = 32px

/* Gap (espaciado en flexbox/grid) */
gap-1   = 4px      gap-2   = 8px      gap-3   = 12px
gap-4   = 16px     gap-6   = 24px     gap-8   = 32px
```

### Dimensiones Comunes

```tailwind
/* Ancho */
w-full              → 100%
w-1/2               → 50%
w-1/3               → 33.333%
w-2/3               → 66.666%
w-1/4               → 25%

Max-Width
max-w-sm            → 384px  (campos)
max-w-md            → 448px  (diálogos pequeños)
max-w-lg            → 512px  (diálogos medianos)
max-w-xl            → 576px  (diálogos grandes)
max-w-2xl           → 672px  (diálogos muy grandes)
max-w-4xl           → 896px  (contenedores de página)
max-w-6xl           → 1152px (layout ancho)

/* Altura */
h-full              → 100%
min-h-screen        → 100vh (pantalla completa)
min-h-[90vh]        → 90% de la pantalla
max-h-[90vh]        → Máximo 90% de la pantalla
```

### Recomendaciones de Espaciado

**Cards:**
- Padding interno: `p-2` (8px) - obligatorio
- Espaciado entre secciones: `mb-2`, `mb-4`
- Gap en badges: `gap-2`

**Diálogos:**
- Padding header/footer: `px-6 py-4` (24px horiz, 16px vert)
- Gap entre campos: `gap-4`, `space-y-4`
- Separador: `border-b` con padding `pt-4`

**Layouts (Grid):**
- Gap horizontal/vertical: `gap-4` o `gap-6`
- Máximo ancho contenedor: `max-w-4xl`
- Padding en mobile: `px-4`

**Búsqueda de campos:**
- Max-width: `max-w-sm` (384px)

---

## 🌑 Sombras y Efectos

### Sombras (Shadow)

```tailwind
shadow-none     → Sin sombra (default)
shadow-sm       → Sombra muy ligera (Cards estándar)
shadow-md       → Sombra media (Hover effects)
shadow-lg       → Sombra grande (Componentes elevados)
shadow-xl       → Sombra muy grande (Diálogos)
shadow-2xl      → Sombra dramática (Modales críticos)
```

### Uso Recomendado

**Cards sin interacción:**
```tailwind
shadow-sm
```

**Cards con hover (opcional):**
```tailwind
shadow-sm hover:shadow-md
```

**Diálogos:**
```tailwind
shadow-xl
```

**Buttons floating:**
```tailwind
shadow-lg
```

### Bordes Redondeados

```tailwind
rounded-none    → Sin redondeo
rounded-sm      → 2px
rounded         → 4px (buttons)
rounded-md      → 6px
rounded-lg      → 8px (cards, diálogos, inputs)
rounded-xl      → 12px
rounded-2xl     → 16px
rounded-3xl     → 24px
rounded-full    → 9999px (botones redondos)
```

### Bordes (Borders)

```tailwind
border          → 1px de borde (default)
border-0        → Sin borde
border-2        → 2px de borde
border-4        → 4px de borde

border-t        → Solo borde superior
border-b        → Solo borde inferior
border-l        → Solo borde izquierdo
border-r        → Solo borde derecho
```

---

## 🎯 Iconografía

### Sistema de Icons

La aplicación usa **Material Design Icons** (o similar):

```tsx
{/* Iconos comunes */}
icon="add"                {/* Símbolo + (crear) */}
icon="edit"               {/* Lápiz (editar) */}
icon="delete"             {/* Papelera (eliminar) */}
icon="search"             {/* Lupa (buscar) */}
icon="close"              {/* X (cerrar) */}
icon="menu"               {/* Hamburguesa (menú) */}
icon="settings"           {/* Engranaje (configuración) */}
icon="check"              {/* Check (éxito) */}
icon="alert"              {/* Exclamación (alerta) */}
icon="info"               {/* i (información) */}
icon="download"           {/* Flecha abajo (descargar) */}
icon="upload"             {/* Flecha arriba (subir) */}
icon="more"               {/* Tres puntos (más opciones) */}
```

### Tamaños de Iconos

```tailwind
{/* En buttons/icons */}
size="xs"       → 16x16px
size="sm"       → 20x20px
size="md"       → 24x24px (default)
size="lg"       → 32x32px
size="xl"       → 48x48px
```

### Colores de Iconos

```tailwind
{/* Heredan del texto por default */}
text-foreground     (Negro - default)
text-primary        (Azul oscuro)
text-secondary      (Cyan)
text-error          (Rojo)
text-success        (Verde)
text-warning        (Amarillo)
```

---

## 📋 Principios de Diseño

### Consistencia Visua

1. **Usa siempre las clases definidas**
   - No crees clases custom innecesarias
   - Reutiliza clases existentes
   - Documenta si creas nuevas

2. **Mantén la jerarquía de colores**
   - Primary: acciones principales
   - Secondary: acciones secundarias
   - Neutral: texto e información

3. **Respeta el espaciado**
   - Usa múltiplos de 4px
   - Mantén consistencia en márgenes
   - No mezcles sistemas

### Accesibilidad

1. **Contraste suficiente**
   - Texto oscuro sobre fondo claro
   - Ratio mínimo 4.5:1 para W3C AA

2. **Tamaños legibles**
   - Mínimo `text-sm` (14px) para cuerpo
   - Mínimo `text-xs` (12px) para auxiliar

3. **Espaciado adecuado**
   - Gap mínimo entre elementos: `gap-2`
   - Padding mínimo en botones: `p-2`

### Performance

1. **Limita el número de clases**
   - Más de 20 clases por elemento es excesivo
   - Considérate usar `@apply` en CSS

2. **Reutiliza estilos**
   - Extrae patrones comunes
   - Crea componentes para composiciones frecuentes

3. **Evita inline styles**
   - Usa clases Tailwind
   - Mantén separación de concerns

### Responsividad

1. **Mobile-first**
   - Empieza con estilos móviles
   - Agrega breakpoints progresivamente

2. **Breakpoints estándar**
   - `sm`: 640px
   - `md`: 768px
   - `lg`: 1024px

3. **Prueba en dispositivos reales**
   - No solo en devtools
   - Verifica touch en móviles

---

## ✅ Checklist de Implementación

Antes de usar este design system, verifica:

- [ ] Tailwind CSS configurado
- [ ] Colores en `tailwind.config.js` coinciden
- [ ] Tipografías (Inter + Geist Mono) instaladas
- [ ] Componentes UI base creados
- [ ] Breakpoints configurados correctamente
- [ ] Documentación del equipo actualizada
- [ ] Testing en mobile, tablet, desktop realizado

---

## 🔗 Referencias

- [Tailwind CSS Docs](https://tailwindcss.com)
- [Material Design Color System](https://material.io/design/color)
- [W3C Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Próximo Documento**: [FRONTEND_STYLES_GUIDE.md](./FRONTEND_STYLES_GUIDE.md) - Guía de clases Tailwind específicas

