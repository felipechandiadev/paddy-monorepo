# 📱 Frontend Responsive Design - Diseño Responsivo

**Propósito**: Estrategia completa de responsive design para mobile-first  
**Versión**: 1.0  
**Última actualización**: Marzo 2026  
**Status**: ✅ Production-Ready

---

## Tabla de Contenidos

1. [Principios Mobile-First](#-principios-mobile-first)
2. [Breakpoints](#-breakpoints)
3. [Viewport Meta Tag](#-viewport-meta-tag)
4. [Patrones Responsive Comunes](#-patrones-responsive-comunes)
5. [Testing Responsive](#-testing-responsive)
6. [Optimización de Imágenes](#-optimización-de-imágenes)

---

## 📱 Principios Mobile-First

### Philosophy

El diseño **mobile-first** significa:

1. **Empezar con estilos para móvil (320px+)**
2. **Agregar estilos más complejos para pantallas grandes**
3. **No quitar características, agregar funcionalidad**

### Ventajas

| Beneficio | Descripción |
|-----------|-------------|
| **Performance** | CSS más pequeño (solo agregamos, no quitamos) |
| **Accesibilidad** | Mejor enfoque en usuarios móviles |
| **SEO** | Mobile-first indexing de Google |
| **UX** | Interfaz adaptable que crece naturalmente |

### Antipattern: Desktop-First ❌

```css
/* ❌ MALO - Escondemos todo en mobile */
.sidebar {
  width: 300px;
  display: block;
}

@media (max-width: 768px) {
  .sidebar {
    display: none; /* Escondemos en mobile */
  }
}
```

### Pattern: Mobile-First ✅

```css
/* ✅ BUENO - Empezamos simples en mobile */
.sidebar {
  display: none; /* Oculto por defecto en mobile */
}

@media (min-width: 768px) {
  .sidebar {
    display: block; /* Mostramos en tablet+ */
    width: 300px;
  }
}
```

### Equivalente en Tailwind

```tsx
{/* ✅ BUENO - Clases base para mobile */}
<div className="
  block                {/* Mobile: bloque */}
  md:flex              {/* Tablet+: flex */}
  md:gap-4             {/* Tablet+: gap 16px */}
  px-4                 {/* Padding mobile 16px */}
  md:px-6              {/* Padding tablet+ 24px */}
">
  {/* Contenido */}
</div>

{/* ❌ MALO - Ocultando en mobile */}
<div className="hidden md:block">
  Esto se oculta en mobile
</div>
```

---

## 🎯 Breakpoints

### Breakpoints Estándar (Tailwind)

| Nombre | Pixel | Rango | Dispositivo | Prefijo |
|--------|-------|-------|------------|---------|
| **xs** | — | < 640px | Teléfono pequeño | (none) |
| **sm** | 640px | 640px - 767px | Teléfono | `sm:` |
| **md** | 768px | 768px - 1023px | Tablet | `md:` |
| **lg** | 1024px | 1024px - 1279px | Laptop | `lg:` |
| **xl** | 1280px | 1280px - 1535px | Desktop | `xl:` |
| **2xl** | 1536px | 1536px+ | Gran Desktop | `2xl:` |

### Estrategia de Uso

**Usa estos breakpoints:**

```tailwind
/* Mobile first = sin prefijo */
<div className="w-full">                    {/* Mobile: 100% */}

/* Tablet y arriba */
<div className="w-full md:w-1/2">           {/* Mobile: 100%, Tablet+: 50% */}

/* Dentro de tablet, cambios en desktop */
<div className="md:grid md:grid-cols-2 lg:grid-cols-3">

/* Para componentes específicos */
<div className="text-base md:text-lg lg:text-xl">
```

### NO Hagas Esto ❌

```tailwind
{/* Breakpoints customizados innecesarios */}
<div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
  {/* Demasiado específico */}
</div>

{/* Cambios cada breakpoint */}
<div className="px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6">
  {/* Mantén consistencia */}
</div>
```

### Consultas Media Personalizadas

Si necesitas un breakpoint custom en CSS:

```css
/* En tailwind.config.js */
module.exports = {
  theme: {
    extend: {
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        'custom': '900px',
      },
    },
  },
}

/* Uso */
// <div className="block custom:flex"></div>
```

---

## 🔧 Viewport Meta Tag

### Meta Tag Obligatorio

En `next.js`, agregalo en la raíz layout o cada página:

```tsx
// app/layout.tsx
export const metadata = {
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
```

**Qué significa:**
- `width=device-width` - Usa ancho del dispositivo
- `initial-scale=1` - No zoom al cargar

### Alternativa (HTML Manual)

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

### Sobre zoom y pinch

```html
{/* Permitir zoom (accesibilidad) */}
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">

{/* EVITAR: No deshabilites zoom - es malo para accesibilidad */}
<meta name="viewport" content="user-scalable=no"> {/* ❌ MALO */}
```

---

## 🎨 Patrones Responsive Comunes

### 1. Grid Responsivo (2-3 columnas)

```tsx
{/* Mobile: 1 col | Tablet: 2 cols | Desktop: 3 cols */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => (
    <div key={item.id} className="bg-white rounded-lg p-4">
      {item.name}
    </div>
  ))}
</div>
```

**Comportamiento:**
```
Mobile (< 768px):     1 columna (100% ancho)
Tablet (768-1024px):  2 columnas (50% cada una)
Desktop (1024px+):    3 columnas (33% cada una)
```

### 2. Sidebar Responsive

```tsx
{/* Desktop: lado a lado | Mobile: apilado */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Main content 2/3 */}
  <div className="lg:col-span-2">
    <h1>Contenido Principal</h1>
  </div>

  {/* Sidebar 1/3 */}
  <div className="lg:col-span-1">
    <h2>Sidebar</h2>
  </div>
</div>
```

**Comportamiento:**
```
Mobile:    Sidebar abajo (col-span-1)
Desktop:   Sidebar a la derecha (col-span-1)
```

### 3. Navegación Responsive

**Versión Mobile (Hamburger):**
```tsx
function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="font-bold">Logo</h1>

        {/* Hamburger button (mobile only) */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Menu mobile */}
      {isOpen && (
        <div className="md:hidden space-y-2 px-4 py-2 border-t border-gray-200">
          <a href="#" className="block py-2">Home</a>
          <a href="#" className="block py-2">About</a>
          <a href="#" className="block py-2">Contact</a>
        </div>
      )}

      {/* Menu desktop */}
      <div className="hidden md:flex px-4 py-3 gap-6">
        <a href="#" className="text-foreground hover:text-primary">Home</a>
        <a href="#" className="text-foreground hover:text-primary">About</a>
        <a href="#" className="text-foreground hover:text-primary">Contact</a>
      </div>
    </nav>
  );
}
```

### 4. Flexbox Responsive

```tsx
{/* Mobile: column | Desktop: row */}
<div className="flex flex-col md:flex-row gap-4">
  <div className="flex-1">Col 1</div>
  <div className="flex-1">Col 2</div>
  <div className="flex-1">Col 3</div>
</div>
```

**Comportamiento:**
```
Mobile:    Stack vertical (flex-col)
Desktop:   Horizontal (flex-row)
```

### 5. Padding Responsive

```tsx
{/* Mobile: 16px | Tablet: 32px | Desktop: 48px */}
<div className="px-4 md:px-8 lg:px-12">
  Contenido con padding responsivo
</div>
```

### 6. Texto Responsivo

```tsx
{/* Mobile: 16px | Tablet: 18px | Desktop: 20px */}
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Título responsivo
</h1>
```

### 7. Imagen Responsivo

```tsx
{/* Imagen que escala con contenedor */}
<div className="w-full max-w-4xl">
  <img
    src="/image.jpg"
    alt="Responsive image"
    className="w-full h-auto object-cover rounded-lg"
  />
</div>
```

---

## 🧪 Testing Responsive

### Chrome DevTools

1. **Abrir DevTools:** `F12` o `Cmd+Option+I`
2. **Toggle Device:** `Cmd+Shift+M` (Mac) o `Ctrl+Shift+M` (Windows)
3. **Seleccionar dispositivo:** Dropdown en la parte superior
4. **Testear breakpoints:** Redimensionar ventana

### Dispositivos Standard para Testear

| Dispositivo | Resolución | Breakpoint | Status |
|-------------|-----------|-----------|--------|
| iPhone SE | 375x667 | xs | ✅ Probado |
| iPhone 12 | 390x844 | xs | ✅ Probado |
| iPad | 768x1024 | md | ✅ Probado |
| iPad Pro | 1024x1366 | lg | ✅ Probado |
| MacBook | 1440x900 | lg/xl | ✅ Probado |

### Checklist antes de Deploy

- [ ] Mobile (375px): Prueba en iPhone
- [ ] Tablet (768px): Prueba en iPad
- [ ] Desktop (1024px+): Prueba en laptop
- [ ] Landscape: Rota el teléfono
- [ ] Touch: Prueba touch en mobile
- [ ] Zoom: Prueba con zoom 200%
- [ ] Slow 3G: Prueba con conexión lenta
- [ ] Imágenes: Cargan rápido
- [ ] Fuentes: Legibles en todos los tamaños

---

## 🖼️ Optimización de Imágenes

### Next.js Image Component

Usa siempre `next/image` en lugar de `<img>`:

```tsx
import Image from 'next/image';

export default function MyComponent() {
  return (
    <Image
      src="/image.jpg"
      alt="Descripción"
      width={800}
      height={600}
      className="w-full h-auto"
      quality={85} // Comprimir: 85% es suficiente
    />
  );
}
```

**Beneficios:**
- Lazy loading automático
- Responsive automático
- WebP si el navegador lo soporta
- Prevención de Cumulative Layout Shift (CLS)

### Imágenes Responsivas

```tsx
{/* Versiones múltiples según breakpoint */}
<Image
  src="/image-mobile.jpg"
  alt="Mobile image"
  className="block md:hidden"
  width={600}
  height={400}
/>

<Image
  src="/image-desktop.jpg"
  alt="Desktop image"
  className="hidden md:block"
  width={1200}
  height={600}
/>
```

### Atributo `sizes`

```tsx
{/* Optimizar srcset con sizes */}
<Image
  src="/large-image.jpg"
  alt="Hero"
  width={1200}
  height={600}
  sizes="(max-width: 768px) 100vw,
         (max-width: 1024px) 80vw,
         1200px"
  className="w-full h-auto"
/>
```

---

## ⚡ Performance en Mobile

### Lighthouse Checklist

Ejecuta en Chrome DevTools → Lighthouse:

- [ ] **Performance** > 85
- [ ] **Accessibility** > 90
- [ ] **Best Practices** > 85
- [ ] **SEO** > 90

### Optimizaciones Comunes

1. **Minifica CSS/JS**
   ```
   Next.js lo hace automáticamente en producción
   ```

2. **Comprime imágenes**
   ```
   Usa PNG/WebP, máx 100KB por imagen
   ```

3. **Evita bloqueadores de rendering**
   ```
   Carga scripts con async o defer
   ```

4. **Elimina CSS no usado**
   ```
   Tailwind lo hace automáticamente
   ```

5. **Code splitting**
   ```tsx
   {/* Lazy load componentes pesados */}
   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
     loading: () => <Skeleton />
   });
   ```

---

## 📚 Referencia Rápida

### Clases Responsivas Comunes

```tailwind
/* Grid */
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3

/* Flex */
flex flex-col md:flex-row gap-4

/* Padding */
px-4 md:px-6 lg:px-8

/* Texto */
text-base md:text-lg lg:text-xl

/* Display */
block md:hidden    (oculto en desktop)
hidden md:block    (oculto en mobile)

/* Ancho */
w-full md:w-1/2

/* Máxima altura */
max-h-screen md:max-h-[80vh]
```

### Mobile-First Template

```tsx
export default function ResponsivePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-4 md:px-6 lg:px-8 py-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
          Título
        </h1>
      </header>

      {/* Contenido */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Items */}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-4 md:px-6 lg:px-8 py-4 text-center text-sm text-neutral-600">
        © 2026 Paddy
      </footer>
    </div>
  );
}
```

---

**Referencias**:
- [FRONTEND_PATTERNS_AND_LAYOUTS.md](./FRONTEND_PATTERNS_AND_LAYOUTS.md)
- [FRONTEND_STYLES_GUIDE.md](./FRONTEND_STYLES_GUIDE.md)

**Próximo Documento**: [FRONTEND_DESIGN_CHECKLIST.md](./FRONTEND_DESIGN_CHECKLIST.md)

