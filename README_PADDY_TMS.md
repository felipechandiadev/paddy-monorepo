# 📦 PADDY TMS - TRUCK MANAGEMENT SYSTEM

> Sistema de Gestión de Logística para Recepción de Arroz Paddy

## 🎯 Descripción General

**Paddy TMS** es un **Truck Management System** moderno diseñado para gestionar el flujo logístico completo de recepción de arroz paddy. El sistema proporciona una experiencia de usuario optimizada con dos interfaces principales:

1. **📺 Monitor de Turnos** (Público - Sin autenticación)
   - Pantalla para choferes
   - Información clara y en tiempo real
   - Acceso libre, sin login

2. **⚖️ Panel de Pesaje** (Protegido - Con autenticación)
   - Interfaz para operadores logísticos
   - Control completo del flujo de pesaje
   - Generación automática de tickets

---

## 🏗️ Arquitectura

### Stack Tecnológico

```
FRONTEND
├── Next.js 16+
├── React 19
├── TypeScript
├── Tailwind CSS
├── Socket.io (Realtime)
└── NextAuth.js (Autenticación)

BACKEND
├── NestJS
├── MySQL (TypeORM)
├── Socket.io Gateway
└── Redis (Opcional)

EXTRAS
├── PWA (Progressive Web App)
├── Service Workers
├── IndexedDB
└── PDF Generation
```

### Flujo de Datos

```
Frontend (Next.js)
    ↕ Socket.io + Polling
Backend (NestJS)
    ↕
MySQL Database
```

---

## 📂 Estructura del Repositorio

```
paddy-tms/
├── 📚 Documentación
│   ├── PADDY_TMS_EXECUTIVE_SUMMARY.md
│   ├── PADDY_TMS_ROUTING.md
│   ├── TRUCK_MANAGEMENT_ARCHITECTURE.md
│   ├── TRUCK_MANAGEMENT_CHECKLIST.md
│   ├── TRUCK_MANAGEMENT_CODE_EXAMPLES.md
│   ├── TRUCK_MANAGEMENT_INDEX.md
│   └── PADDY_TMS_COMPONENTS_MIGRATION.md
│
├── 🚀 Scripts
│   └── migrate-components.sh
│
├── 📁 Backend (NestJS + MySQL)
│   └── backend/
│       ├── src/
│       │   ├── modules/
│       │   │   └── logistics/     ← NUEVO MÓDULO
│       │   ├── infrastructure/
│       │   └── config/
│       ├── package.json
│       ├── .env
│       └── tsconfig.json
│
└── 📁 Frontend (Next.js + React)
    └── frontend/
        ├── src/
        │   ├── app/
        │   │   ├── paddy/
        │   │   │   ├── auth/login/
        │   │   │   ├── dashboard/
        │   │   │   └── logistics/
        │   │   │       ├── monitor/
        │   │   │       └── weighing/
        │   │   └── globals.css
        │   ├── features/
        │   │   └── logistics/
        │   ├── shared/
        │   │   └── components/ui/
        │   └── lib/
        ├── package.json
        ├── tailwind.config.js
        ├── next.config.js
        └── tsconfig.json
```

---

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 18+ y npm
- MySQL 8+
- Git

### 1. Clonar y Preparar

```bash
# Clonar el repositorio
git clone <repo-url> paddy-tms
cd paddy-tms

# Frontend
cd frontend
npm install

# Backend (en otra terminal)
cd backend
npm install
```

### 2. Configurar Variables de Entorno

**Frontend** (`.env.local`):
```bash
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3333
```

**Backend** (`.env`):
```bash
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your-password
DB_NAME=paddy_tms
JWT_SECRET=your-secret-key
```

### 3. Preparar Base de Datos

```bash
# En backend/
npm run typeorm migration:run
```

### 4. Iniciar en Desarrollo

```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run start:dev
```

**Acceder**:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3333
- Monitor (público): http://localhost:3001/paddy/logistics/monitor
- Login: http://localhost:3001/paddy/auth/login

---

## 🗺️ Rutas del Proyecto

### Públicas (Sin Autenticación)

| Ruta | Descripción |
|------|-------------|
| `/paddy/logistics/monitor` | 📺 Monitor de turnos para choferes |
| `/paddy/auth/login` | 🔐 Formulario de login |

### Protegidas (Con Autenticación)

| Ruta | Descripción |
|------|-------------|
| `/paddy/dashboard` | 📊 Panel principal |
| `/paddy/logistics/weighing` | ⚖️ Panel de pesaje |
| `/paddy/logistics/weighing/[id]` | 📋 Detalles del camión |

---

## 🔐 Autenticación

- **Proveedor**: NextAuth.js
- **Estrategia**: JWT (credenciales)
- **Rol**: LOGISTICS_OPERATOR
- **Duración**: 24 horas

---

## 🔄 Máquina de Estados

```
ESPERA → PESANDO_BRUTO → PESANDO_TARA → FINALIZADO
```

### Estados

1. **ESPERA**: Camión recién registrado
2. **PESANDO_BRUTO**: En balanza (pesaje de entrada)
3. **PESANDO_TARA**: En balanza (pesaje de salida)
4. **FINALIZADO**: Proceso completo, ticket generado

---

## 📊 Entidad Principal: TruckReception

```typescript
interface TruckReception {
  id: UUID;
  numero_turno: number;
  producer_id: UUID;
  patente: string;              // ABC-1234
  guia: string;
  chofer_nombre: string;
  peso_bruto: number | null;
  peso_tara: number | null;
  peso_neto: number;            // Calculado
  estado: 'ESPERA' | 'PESANDO_BRUTO' | 'PESANDO_TARA' | 'FINALIZADO';
  fecha_hora_entrada: Date;
  fecha_hora_peso_bruto?: Date;
  fecha_hora_peso_tara?: Date;
  fecha_hora_finalizacion?: Date;
  numero_ticket?: string;
  pdf_url?: string;
  created_at: Date;
  updated_at: Date;
}
```

---

## 🎨 Componentes UI

Componentes reutilizables disponibles en `src/shared/components/ui/`:

```
✅ Button, ButtonPill        → Botones
✅ TextField, Select         → Inputs
✅ Alert, Dialog             → Notificaciones
✅ Badge, Switch             → Estados
✅ IconButton                → Botones de ícono
✅ DataGrid                  → Tablas
✅ TopBar, SplashScreen      → Layouts
```

**Migrar componentes**:
```bash
chmod +x migrate-components.sh
./migrate-components.sh
```

---

## 📚 Documentación

### Documentos Principales

| Documento | Propósito | Lectura |
|-----------|-----------|---------|
| **PADDY_TMS_EXECUTIVE_SUMMARY.md** | Resumen visual del proyecto | 10 min |
| **TRUCK_MANAGEMENT_ARCHITECTURE.md** | Diseño técnico completo | 30 min |
| **PADDY_TMS_ROUTING.md** | Rutas y autenticación | 25 min |
| **TRUCK_MANAGEMENT_CODE_EXAMPLES.md** | Ejemplos de implementación | 45 min |
| **TRUCK_MANAGEMENT_CHECKLIST.md** | Plan de ejecución | 20 min |
| **PADDY_TMS_COMPONENTS_MIGRATION.md** | Migración de UI | 15 min |

### Lectura Recomendada

1. **Arquitectos/Leads**: EXECUTIVE_SUMMARY + ARCHITECTURE
2. **Developers Frontend**: ROUTING + CODE_EXAMPLES + ARCHITECTURE
3. **Developers Backend**: ARCHITECTURE + CODE_EXAMPLES + ROUTING
4. **Project Managers**: CHECKLIST + EXECUTIVE_SUMMARY

---

## 🛠️ Desarrollo

### Crear Componente TMS

```typescript
// src/features/logistics/components/WeighingForm.tsx
import { Button, TextField, Select, Alert } from '@/shared/components/ui';

export function WeighingForm() {
  return (
    <form className="space-y-4">
      <TextField label="Patente" placeholder="ABC-1234" />
      <Select label="Productor" options={producers} />
      <Button>Registrar Pesaje</Button>
    </form>
  );
}
```

### Crear Server Action

```typescript
// src/features/logistics/actions/truck.action.ts
'use server'

import { getServerSession } from 'next-auth';

export async function registerWeighing(truckId: string, weight: number) {
  const session = await getServerSession();
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  // Llamar a API backend
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trucks/${truckId}/weighing`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.user.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ weight }),
  });
  
  return response.json();
}
```

---

## 🧪 Testing

```bash
# Frontend Tests
cd frontend
npm run test:e2e                # E2E con Playwright
npm run test:e2e:ui            # Con UI
npm run test:e2e:debug         # Modo debug

# Backend Tests
cd backend
npm test                        # Unit tests
npm run test:e2e               # E2E tests
```

---

## 📦 Dependencias Principales

### Frontend

```json
{
  "next": "16.1.6",
  "react": "19.2.3",
  "next-auth": "^4.24.13",
  "tailwindcss": "^3.4.17",
  "@tanstack/react-query": "^5.90.21",
  "lucide-react": "^0.575.0"
}
```

### Backend

```json
{
  "@nestjs/core": "^10.x",
  "@nestjs/typeorm": "^x.x",
  "typeorm": "^0.3.x",
  "mysql2": "^3.x",
  "@nestjs/websockets": "^10.x",
  "socket.io": "^4.x"
}
```

---

## 🚨 Troubleshooting

### Frontend no carga

```bash
# Limpiar caché
rm -rf .next node_modules
npm install
npm run dev
```

### Error de conexión a API

- Verificar `.env.local`: `NEXT_PUBLIC_API_URL`
- Verificar que backend está corriendo en puerto 3333
- Verificar CORS en backend

### Socket.io no conecta

- Verificar WebSocket en backend
- Verificar firewall
- Revisar console del browser

---

## 📞 Soporte y Contacto

Para preguntas sobre:
- **Arquitectura**: Ver `TRUCK_MANAGEMENT_ARCHITECTURE.md`
- **Implementación**: Ver `TRUCK_MANAGEMENT_CODE_EXAMPLES.md`
- **Rutas/Auth**: Ver `PADDY_TMS_ROUTING.md`
- **Componentes**: Ver `PADDY_TMS_COMPONENTS_MIGRATION.md`

---

## 📜 Licencia

Proyecto interno - Derechos reservados

---

## ✅ Status

- ✅ Documentación completa
- ✅ Arquitectura definida
- ✅ Stack confirmado (Next.js + NestJS + MySQL + Socket.io)
- ⏳ Implementación en progreso

---

## 📊 Estadísticas

- **Documentos**: 8
- **Componentes UI**: 15+
- **Archivos de Configuración**: 5
- **Librerías**: 15+
- **Estado**: 4 (máquina de estados)
- **Rutas**: 5 principales

---

**Proyecto**: Paddy TMS  
**Versión**: 2.0  
**Última Actualización**: 21 de abril de 2026  
**Mantenedor**: Equipo de Desarrollo
