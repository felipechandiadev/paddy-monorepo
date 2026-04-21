# 🎨 GUÍA DE MIGRACIÓN DE COMPONENTES A PADDY TMS

**Documento**: Instrucciones para copiar componentes compartidos del frontend  
**Fecha**: 21 de abril de 2026  
**Propósito**: Establecer componentes UI reutilizables para Paddy TMS

---

## 📋 ÍNDICE

1. [Componentes a Copiar](#componentes-a-copiar)
2. [Configuración Necesaria](#configuración-necesaria)
3. [Estructura de Carpetas](#estructura-de-carpetas)
4. [Librerías y Dependencias](#librerías-y-dependencias)
5. [Archivos de Configuración](#archivos-de-configuración)
6. [Pasos de Implementación](#pasos-de-implementación)
7. [Checklist de Verificación](#checklist-de-verificación)

---

## 🎯 COMPONENTES A COPIAR

### Componentes Principales (Recomendados)

```
✅ Button.tsx          → Botones con variantes
✅ TextField.tsx       → Inputs de texto
✅ Select.tsx          → Dropdowns/selects
✅ Alert.tsx           → Alertas y notificaciones
✅ Dialog.tsx          → Modales/diálogos
✅ Badge.tsx           → Etiquetas/badges
✅ Switch.tsx          → Interruptores on/off
✅ IconButton.tsx      → Botones de ícono
✅ AutoComplete.tsx    → Campos autocompleta
✅ RangeSlider.tsx     → Sliders de rango
✅ Tabs.tsx            → Pestañas/tabs
✅ NumberStepper.tsx   → Contador numérico
✅ DropdownList.tsx    → Listas desplegables
✅ DataGrid.tsx        → Tablas de datos
✅ TopBar.tsx          → Barra superior
✅ SplashScreen.tsx    → Pantalla de carga
```

### Componentes Opcionales

```
⚠️ FileUploader/       → Carga de archivos (si es necesario)
⚠️ LocationPicker/     → Mapa interactivo (depende de leaflet)
⚠️ PrintDialog/        → Diálogos de impresión
⚠️ BaseForm/           → Formularios base
```

---

## ⚙️ CONFIGURACIÓN NECESARIA

### 1. Tailwind CSS

**Archivo**: `frontend/tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
    './src/providers/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        border: 'var(--color-border)',
        accent: 'var(--color-accent)',
        muted: 'var(--color-muted)',
        success: 'var(--color-success)',
        info: 'var(--color-info)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        neutral: 'var(--color-neutral)',
      },
      fontFamily: {
        sans: ['Inter', 'System UI', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
```

**Instalación**: Ya está en `package.json`

### 2. Estilos Globales

**Archivo**: `frontend/src/app/globals.css`

```css
/* COPIAR COMPLETO DEL FRONTEND EXISTENTE */
/* Incluye:
   - Imports de fuentes (Material Symbols, Leaflet)
   - Tailwind directives
   - Variables CSS de colores
   - Estilos base para componentes
   - Animaciones personalizadas
*/
```

**Ver archivo completo**: `/Users/felipe/dev/paddy/frontend/src/app/globals.css` (líneas 1-708)

---

## 📦 LIBRERÍAS Y DEPENDENCIAS

### Dependencias en package.json

```json
{
  "dependencies": {
    "@fontsource/material-symbols-outlined": "^5.2.35",
    "@fontsource/material-symbols-rounded": "^5.2.35",
    "@fontsource/material-symbols-sharp": "^5.2.35",
    "@nivo/line": "^0.99.0",
    "@tanstack/react-query": "^5.90.21",
    "leaflet": "^1.9.4",
    "lucide-react": "^0.575.0",
    "luxon": "^3.7.2",
    "next": "16.1.6",
    "next-auth": "^4.24.13",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-leaflet": "^5.0.0",
    "react-to-print": "^3.3.0",
    "recharts": "^3.8.0"
  },
  "devDependencies": {
    "@types/leaflet": "^1.9.21",
    "@types/luxon": "^3.7.1",
    "tailwindcss": "^3.4.17",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.5.6"
  }
}
```

### Iconos Disponibles

1. **Material Symbols** (ya importados en globals.css)
   - Material Symbols Outlined
   - Material Symbols Rounded
   - Material Symbols Sharp

2. **Lucide React** (librería alternativa)
   ```typescript
   import { ChevronDown, X, AlertCircle } from 'lucide-react';
   ```

3. **Leaflet** (para LocationPicker)
   ```typescript
   import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
   ```

---

## 🗂️ ESTRUCTURA DE CARPETAS

### Estructura Actual (Frontend)

```
frontend/src/shared/components/
├── ui/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── ButtonPill.tsx
│   │   └── README.md
│   ├── TextField/
│   ├── Select/
│   ├── Alert/
│   ├── Dialog/
│   ├── Badge/
│   ├── Switch/
│   ├── IconButton/
│   ├── AutoComplete/
│   ├── RangeSlider/
│   ├── Tabs/
│   ├── NumberStepper/
│   ├── DropdownList/
│   ├── DataGrid/
│   ├── TopBar/
│   ├── SplashScreen/
│   ├── FileUploader/
│   ├── LocationPicker/
│   ├── DOCUMENTATION.md
│   └── COMPONENTS_ANALYSIS.md
│
└── PrintDialog/
    ├── PrintDialog.tsx
    ├── PrintDialog.module.css
    ├── PrintDialog.types.ts
    ├── usePrint.ts
    └── index.ts
```

### Estructura para Paddy TMS

```
paddy-tms/frontend/src/shared/components/
├── ui/
│   ├── Button/
│   ├── TextField/
│   ├── Select/
│   ├── Alert/
│   ├── Dialog/
│   ├── Badge/
│   ├── Switch/
│   ├── IconButton/
│   ├── AutoComplete/
│   ├── RangeSlider/
│   ├── Tabs/
│   ├── NumberStepper/
│   ├── DropdownList/
│   ├── DataGrid/
│   ├── TopBar/
│   ├── SplashScreen/
│   └── index.ts (export unificado)
│
└── PrintDialog/
    └── (opcional)
```

---

## 📄 ARCHIVOS DE CONFIGURACIÓN

### TypeScript - tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "react-jsx",
    "strict": true,
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./src/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/app/*": ["./src/app/*"],
      "@/features/*": ["./src/features/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/providers/*": ["./src/providers/*"]
    }
  }
}
```

### PostCSS - postcss.config.js

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### Next.js - next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;
```

---

## 🚀 PASOS DE IMPLEMENTACIÓN

### Fase 1: Preparar Estructura (30 min)

```bash
# 1. Crear carpetas base
mkdir -p frontend/src/shared/components/ui
mkdir -p frontend/src/shared/components/ui/{Button,TextField,Select,Alert,Dialog}
mkdir -p frontend/src/app

# 2. Copiar archivos de configuración
cp frontend/tailwind.config.js paddy-tms/frontend/
cp frontend/postcss.config.js paddy-tms/frontend/
cp frontend/tsconfig.json paddy-tms/frontend/
```

### Fase 2: Copiar Estilos Globales (15 min)

```bash
# 1. Copiar globals.css
cp frontend/src/app/globals.css paddy-tms/frontend/src/app/

# 2. Verificar que esté en layout.tsx
# Debe tener: import './globals.css'
```

### Fase 3: Copiar Componentes (1-2 horas)

```bash
# Componentes críticos primero
cp -r frontend/src/shared/components/ui/Button paddy-tms/frontend/src/shared/components/ui/
cp -r frontend/src/shared/components/ui/TextField paddy-tms/frontend/src/shared/components/ui/
cp -r frontend/src/shared/components/ui/Select paddy-tms/frontend/src/shared/components/ui/
cp -r frontend/src/shared/components/ui/Alert paddy-tms/frontend/src/shared/components/ui/
cp -r frontend/src/shared/components/ui/Dialog paddy-tms/frontend/src/shared/components/ui/
cp -r frontend/src/shared/components/ui/Badge paddy-tms/frontend/src/shared/components/ui/
cp -r frontend/src/shared/components/ui/Switch paddy-tms/frontend/src/shared/components/ui/
cp -r frontend/src/shared/components/ui/IconButton paddy-tms/frontend/src/shared/components/ui/

# Componentes opcionales después
# cp -r frontend/src/shared/components/ui/DataGrid ...
# cp -r frontend/src/shared/components/ui/TopBar ...
```

### Fase 4: Crear Index de Exports (15 min)

**Archivo**: `paddy-tms/frontend/src/shared/components/ui/index.ts`

```typescript
export * from './Button/Button';
export * from './Button/ButtonPill';
export * from './TextField/TextField';
export * from './Select/Select';
export * from './Alert/Alert';
export * from './Dialog/Dialog';
export * from './Badge/Badge';
export * from './Switch/Switch';
export * from './IconButton/IconButton';
export * from './AutoComplete/AutoComplete';
export * from './RangeSlider/RangeSlider';
export * from './Tabs/Tabs';
export * from './NumberStepper/NumberStepper';
export * from './DropdownList/DropdownList';
export * from './DataGrid/DataGrid';
export * from './TopBar/TopBar';
export * from './SplashScreen/SplashScreen';
```

**Archivo**: `paddy-tms/frontend/src/shared/components/index.ts`

```typescript
export * from './ui';
export { PrintDialog } from './PrintDialog';
```

### Fase 5: Instalar Dependencias (10 min)

```bash
cd paddy-tms/frontend

# Instalar todas las librerías necesarias
npm install \
  @fontsource/material-symbols-outlined@^5.2.35 \
  @fontsource/material-symbols-rounded@^5.2.35 \
  @fontsource/material-symbols-sharp@^5.2.35 \
  @tanstack/react-query@^5.90.21 \
  lucide-react@^0.575.0 \
  luxon@^3.7.2 \
  react-to-print@^3.3.0 \
  recharts@^3.8.0
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

### Antes de Usar los Componentes

- [ ] **Carpeta base creada**: `src/shared/components/ui/`
- [ ] **globals.css copiado**: `src/app/globals.css`
- [ ] **tailwind.config.js configurado**: Variables de colores
- [ ] **tsconfig.json paths actualizados**: `@/shared/*`
- [ ] **Componentes copiados**: Al menos Button, TextField, Select
- [ ] **index.ts creado**: Exports unificados

### Testing Inicial

- [ ] **Compilación sin errores**: `npm run build`
- [ ] **Botón funcionando**: `<Button>Test</Button>`
- [ ] **TextField funcionando**: `<TextField label="Test" />`
- [ ] **Estilos aplicados**: Colores CSS variables
- [ ] **Iconos visibles**: Material Symbols cargados

### Adaptaciones Paddy TMS

- [ ] **Colores personalizados**: Variables CSS para TMS
- [ ] **Componentes TMS específicos**: (Fases posteriores)
- [ ] **Tipografía consistente**: Inter font
- [ ] **Responsive design**: Funciona en móvil/tablet

---

## 📚 DOCUMENTACIÓN Y REFERENCIAS

### Documentos de Componentes

Cada componente tiene un `README.md` con:
- Props disponibles
- Ejemplos de uso
- Variantes
- Accesibilidad

Ubicación: `frontend/src/shared/components/ui/{ComponentName}/README.md`

### Ejemplos de Uso

```typescript
// Button
import { Button } from '@/shared/components/ui/Button';
<Button variant="primary" size="md">Click me</Button>

// TextField
import { TextField } from '@/shared/components/ui/TextField';
<TextField label="Email" type="email" />

// Select
import { Select } from '@/shared/components/ui/Select';
<Select label="Opción" options={options} />

// Alert
import { Alert } from '@/shared/components/ui/Alert';
<Alert variant="success">Éxito!</Alert>
```

---

## 🎨 VARIABLES CSS PADDY TMS

Personalización en `globals.css`:

```css
:root {
  /* Colores principales */
  --color-primary: #1C2046;        /* Azul oscuro */
  --color-secondary: #04C9E7;      /* Cyan/Turquesa */
  --color-accent: #2563a8;         /* Azul accent */
  
  /* Neutros */
  --color-background: #ffffff;
  --color-foreground: #131615;
  --color-border: #c1c1c2;
  --color-muted: #6b7280;
  --color-neutral: #F3F4F6;
  
  /* Estados */
  --color-success: #4CAF50;
  --color-info: #2196F3;
  --color-warning: #FFC107;
  --color-error: #F44336;
}
```

---

## 🔄 INTEGRACIÓN CON PADDY TMS

### En Componentes TMS

```typescript
// ejemplo: WeighingForm.tsx
import { Button, TextField, Select, Alert } from '@/shared/components/ui';

export function WeighingForm() {
  return (
    <div className="space-y-4">
      <TextField 
        label="Patente"
        placeholder="ABC-1234"
      />
      
      <Select 
        label="Productor"
        options={producers}
      />
      
      <Button>Registrar Pesaje</Button>
    </div>
  );
}
```

### En Server Actions

```typescript
// ejemplo: truck.action.ts
'use server'

import { validateTruckInput } from '@/shared/utils/validation';
import { notify } from '@/shared/utils/notifications';

export async function createTruck(data: CreateTruckInput) {
  // Los componentes UI se usan solo en el frontend
  // Las acciones retornan datos que los componentes muestran
}
```

---

## 🐛 TROUBLESHOOTING

### Problema: Estilos no aplican

**Solución**:
1. Verificar que `globals.css` está importado en layout
2. Verificar que `tailwind.config.js` include todas las rutas
3. Reiniciar servidor: `npm run dev`

### Problema: Iconos no cargados

**Solución**:
1. Verificar imports en `globals.css`: `@import '@fontsource/material-symbols-*'`
2. Reinstalar dependencias: `npm install`
3. Limpiar `.next`: `rm -rf .next && npm run dev`

### Problema: TypeScript errors

**Solución**:
1. Verificar `tsconfig.json` paths
2. Reinstalar tipos: `npm install --save-dev @types/react`
3. Limpiar caché: `npm run build`

---

## 📝 PRÓXIMOS PASOS

1. **Copiar componentes base** (Phase 1-3)
2. **Instalar dependencias** (Phase 5)
3. **Crear componentes TMS específicos** (Phase posterior)
   - TruckCard.tsx
   - WeighingForm.tsx
   - MonitorDisplay.tsx
   - etc.
4. **Testear integración** con Socket.io y Server Actions
5. **Ajustar estilos** para branding Paddy TMS

---

## 📞 REFERENCIAS

**Componentes Originales**: `/Users/felipe/dev/paddy/frontend/src/shared/components/`  
**Configuración Actual**: `/Users/felipe/dev/paddy/frontend/`  
**Documentación**: Cada componente tiene README.md

---

**Documento Creado**: 21 de abril de 2026  
**Versión**: 1.0  
**Estado**: ✅ Listo para implementación
