# ⚡ Design System - Quick Reference (1 Página)

**Imprime esto o mira en tu monitor lado a lado mientras codeas**

---

## 🎨 Colores

```tailwind
Primario:      bg-primary text-primary border-primary (#1C2046 azul oscuro)
Secundario:    bg-secondary text-secondary (#04C9E7 cyan)
Fondo:         bg-white (contenedores) | bg-neutral (alternancia)
Texto:         text-foreground (negro) | text-neutral-600 (gris)
Estados:       bg-success/error/warning/info
Bordes:        border-gray-200 (estándar)
Overlay:       bg-black/50 (modales)
```

## 📝 Tipografía

```tailwind
h1: text-3xl font-bold text-primary           (Títulos principales)
h2: text-2xl font-bold text-primary           (Subtítulos)
h3: text-lg font-bold text-foreground         (Card titles)
Body: text-base text-foreground               (Texto normal)
Small: text-sm text-neutral-600               (Labels, helper)
Tiny: text-xs text-neutral-600                (Badges)
```

## 📐 Espaciado (Sistema 4px)

```tailwind
Padding:   p-2 (8px cards)  | p-4 (16px) | p-6 (24px dialogs)
Margin:    mb-2 (8px) | mb-4 (16px) | mb-6 (24px)
Gap:       gap-2 (8px items) | gap-4 (16px) | gap-6 (24px)
Espacios:  space-y-4 (16px vertical)
```

## 🎴 Cards

```tsx
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
  {/* OBLIGATORIO: p-2 (8px) */}
  {/* Opcional: header con border-b, contenido, imagen, badges, footer */}
</div>
```

## 💬 Dialogs

```tsx
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
    {/* Header: px-6 py-4 border-b */}
    {/* Body: px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto */}
    {/* Footer: px-6 py-4 border-t flex justify-end gap-3 */}
  </div>
</div>
```

## 🔘 Botones

```tailwind
Primario:     bg-primary text-white px-4 py-2 rounded hover:bg-primary/80
Secundario:   border border-primary text-primary bg-white px-4 py-2 hover:bg-primary/5
Ghost:        text-primary font-medium hover:bg-primary/5
Destructivo:  bg-error text-white px-4 py-2 hover:bg-error/80
```

## 📋 Formularios

```tsx
<div className="space-y-4 max-w-sm">
  <div>
    <label className="text-sm font-medium text-neutral-700 block mb-2">
      Label
    </label>
    <input className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
  </div>
</div>
```

## 📱 Responsivo (Mobile-First)

```tailwind
Base = Mobile (sin prefijo)
md:  = Tablet (768px+) - MÁS USADO
lg:  = Desktop (1024px+)

Ejemplos:
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
flex flex-col md:flex-row gap-4
hidden md:block (oculto en mobile)
block md:hidden (oculto en desktop)
```

## 🎯 Patrones Más Usados

### Grid de Cards (Mobile → Desktop)
```tailwind
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
```

### Sidebar Responsivo
```tailwind
grid grid-cols-1 lg:grid-cols-3 gap-6
{/* Content: lg:col-span-2 */}
{/* Sidebar: lg:col-span-1 */}
```

### Lista con Search + Create
```tailwind
<div className="space-y-4">
  <div className="flex gap-4 justify-between">
    <input className="flex-1 max-w-sm" /> {/* Search */}
    <button>+ Crear</button>
  </div>
  <div className="space-y-2">
    {/* Items */}
  </div>
</div>
```

## ⚠️ NO HAGAS ESTO ❌

```tailwind
❌ bg-[#ffffff]         → Usa bg-white
❌ text-[20px]          → Usa text-xl, text-2xl
❌ w-screen             → Usa w-full
❌ -mt-px               → Usa -mt-[1px] solo si realmente necesitas
❌ hidden sm:block      → Usa block md:hidden (sm casi nunca)
❌ style={{ ... }}      → Usa Tailwind classes
❌ !important           → Aumenta especificidad en lugar de eso
```

## ✅ ESTO SÍ ✅

```tailwind
✅ bg-white
✅ text-lg font-bold
✅ rounded-lg
✅ shadow-sm
✅ border border-gray-200
✅ p-4 gap-4
✅ grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
✅ max-w-sm max-w-lg max-w-4xl
✅ fixed inset-0 z-50
✅ focus:ring-2 focus:ring-primary
```

## 🧪 Validación Rápida (Antes de Merge)

- [ ] ¿Usa colores de paleta? (no hex custom)
- [ ] ¿Cards tienen `p-2`?
- [ ] ¿Dialogs tienen `fixed inset-0 bg-black/50`?
- [ ] ¿Mobile-first? (sin prefijo primero, luego `md:` y `lg:`)
- [ ] ¿Contraste suficiente? (4.5:1)
- [ ] ¿Responsive probado? (mobile, tablet, desktop)
- [ ] ¿Labels en inputs?
- [ ] ¿Sin inline styles?

## 📞 ¿Dónde está qué?

| Quiero... | Miro... |
|-----------|---------|
| Crear una card | FRONTEND_COMPONENTS_STYLES.md → Cards |
| Crear un dialog | FRONTEND_COMPONENTS_STYLES.md → Dialogs |
| Saber qué colores existen | FRONTEND_DESIGN_SYSTEM_COMPLETE.md |
| Encontrar una clase Tailwind | FRONTEND_STYLES_GUIDE.md |
| Hacer responsive | FRONTEND_RESPONSIVE_DESIGN.md |
| Validar calidad | FRONTEND_DESIGN_CHECKLIST.md |
| Layouts y patrones | FRONTEND_PATTERNS_AND_LAYOUTS.md |
| Todo en una página | ← TÚ ESTÁS AQUÍ |

---

**Bookmark esta página** 🔖 | **Imprímela** 🖨️ | **Mírala en 2do monitor** 🖥️

