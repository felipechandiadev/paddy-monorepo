# 🔐 PADDY TMS - RUTAS Y CONTROL DE ACCESO

**Documento**: Especificación de rutas y autenticación  
**Fecha**: 21 de abril de 2026  
**Estado**: ✅ Definido

---

## 📋 ÍNDICE

1. [Visión de Rutas](#visión-de-rutas)
2. [Rutas Públicas](#rutas-públicas)
3. [Rutas Protegidas](#rutas-protegidas)
4. [Estructura de Autenticación](#estructura-de-autenticación)
5. [Middleware de Protección](#middleware-de-protección)
6. [Configuración NextAuth.js](#configuración-nextauthjs)
7. [Base de Datos - Roles y Permisos](#base-de-datos---roles-y-permisos)

---

## 🗺️ VISIÓN DE RUTAS

### Diagrama de Navegación

```
                           ┌─────────────────────────────┐
                           │   PADDY TMS - INICIO        │
                           │  /paddy                     │
                           └──────────┬──────────────────┘
                                      │
                ┌─────────────────────┴──────────────────────┐
                │                                            │
                ↓ (Público)                          ↓ (Requiere Login)
       ┌──────────────────────┐              ┌─────────────────────┐
       │  /paddy/logistics/   │              │  /paddy/auth/login  │
       │  monitor             │              │                     │
       │                      │              │  (NextAuth)         │
       │  📺 PANTALLA PÚBLICA │              │  ✅ Autentica       │
       │  (SIN LOGIN)         │              │                     │
       │                      │              └────────┬────────────┘
       │  - Turno actual      │                       │
       │  - Próximos turnos   │                       ↓
       │  - Información clara │            ┌─────────────────────┐
       │  - Sin distracciones │            │ DASHBOARD PRINCIPAL │
       │  - Actualización RT  │            │  /paddy/dashboard   │
       └──────────────────────┘            │                     │
                                           │  📊 Panel de Control│
                                           │  - Estadísticas     │
                                           │  - Histórico        │
                                           │  - Reportes         │
                                           └────────┬────────────┘
                                                    │
                                 ┌──────────────────┴──────────────────┐
                                 │                                     │
                                 ↓                                     ↓
                        ┌──────────────────┐           ┌──────────────────┐
                        │  WEIGHING PANEL  │           │  OTROS MÓDULOS   │
                        │ /paddy/logistics/│           │  (Futuros)       │
                        │  weighing        │           │                  │
                        │                  │           │  - Reportes      │
                        │  ⚖️ Pesajes     │           │  - Productores   │
                        │  - Registro      │           │  - Usuarios      │
                        │  - Pesaje bruto  │           │  - Auditoría     │
                        │  - Pesaje tara   │           └──────────────────┘
                        │  - Tickets       │
                        └──────────────────┘
```

---

## 🌐 RUTAS PÚBLICAS

### 1. Monitor de Turnos (SIN LOGIN)

```
Ruta: /paddy/logistics/monitor
Método: GET
Autenticación: ❌ NO REQUERIDA
Descripción: Pantalla grande para choferes
Características:
  ✅ Acceso libre (sin login)
  ✅ Información clara y grande
  ✅ Actualización en tiempo real (Socket.io)
  ✅ Alto contraste (optimizado para visibilidad)
  ✅ Muestra:
     - Turno actual (patente, chofer, estado)
     - Próximos 5 turnos en cola
     - Tiempo transcurrido
     - Alertas visuales y sonoras

Componentes:
  - MonitorDisplay.tsx
  - CurrentTruckDisplay.tsx
  - QueueList.tsx
  - TimerDisplay.tsx
```

---

## 🔐 RUTAS PROTEGIDAS

### 1. Login

```
Ruta: /paddy/auth/login
Método: GET/POST
Autenticación: ❌ NO REQUERIDA (es el punto de entrada)
Descripción: Formulario de autenticación
Características:
  ✅ Única puerta de entrada al sistema
  ✅ Usa NextAuth.js (OAuth/JWT)
  ✅ Valida credenciales contra backend
  ✅ Genera sesión JWT
  ✅ Redirige a /paddy/dashboard tras login exitoso

Componentes:
  - LoginForm.tsx
  - AuthService.ts

Flujo:
  1. Usuario accede a /paddy/auth/login
  2. Ingresa credenciales
  3. Se valida contra backend (NestJS)
  4. Se genera JWT y sesión
  5. Se redirige a /paddy/dashboard
```

### 2. Dashboard Principal

```
Ruta: /paddy/dashboard
Método: GET
Autenticación: ✅ REQUERIDA (Middleware)
Rol Requerido: LOGISTICS_OPERATOR
Descripción: Panel de control principal
Características:
  ✅ Vista general del sistema
  ✅ Estadísticas del día
  ✅ Histórico de recepciones
  ✅ Enlaces a módulos específicos

Componentes:
  - DashboardLayout.tsx
  - StatisticsPanel.tsx
  - HistoryTable.tsx
```

### 3. Panel de Pesaje

```
Ruta: /paddy/logistics/weighing
Método: GET/POST
Autenticación: ✅ REQUERIDA (Middleware)
Rol Requerido: LOGISTICS_OPERATOR
Descripción: Centro de operaciones para pesajes
Características:
  ✅ Registro de nuevos camiones
  ✅ Control de pesaje bruto
  ✅ Control de pesaje tara
  ✅ Generación de tickets
  ✅ Validaciones en tiempo real

Sub-rutas:
  - /paddy/logistics/weighing        → Listado y entrada
  - /paddy/logistics/weighing/[id]   → Detalles y control

Componentes:
  - AdminDashboard.tsx
  - TruckInputForm.tsx
  - WeighingForm.tsx
  - TruckCard.tsx

Server Actions:
  - registerTruck()
  - registerWeighing()
  - finalizeTruck()
```

---

## 🔑 ESTRUCTURA DE AUTENTICACIÓN

### NextAuth.js Configuration

```typescript
// lib/auth/nextauth.ts

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Invalid credentials');
        }

        const user = await response.json();
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role, // 'LOGISTICS_OPERATOR'
          accessToken: user.accessToken,
        };
      },
    }),
  ],

  pages: {
    signIn: '/paddy/auth/login',
    error: '/paddy/auth/error',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.role = token.role;
      session.user.accessToken = token.accessToken;
      return session;
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 horas
  },

  secret: process.env.NEXTAUTH_SECRET,
};
```

### Roles y Permisos

```typescript
// lib/auth/permissions.ts

export const ROLES = {
  LOGISTICS_OPERATOR: 'LOGISTICS_OPERATOR',
};

export const PERMISSIONS = {
  LOGISTICS_OPERATOR: {
    // Dashboard
    viewDashboard: true,
    viewStatistics: true,
    viewHistory: true,

    // Truck Management
    viewTrucks: true,
    createTruck: true,
    editTruck: true,
    deleteTruck: false, // Solo soft delete

    // Weighing
    registerWeighing: true,
    editWeighing: false, // No editar pesos registrados
    viewWeighings: true,

    // Producers
    viewProducers: true,
    createProducer: true,
    editProducer: false, // Solo admin
    deleteProducer: false,

    // Tickets
    generateTickets: true,
    viewTickets: true,
    downloadPDF: true,

    // Real-time
    receiveRealTimeUpdates: true,
    broadcastUpdates: false,
  },
};

export function hasPermission(role: string, permission: string): boolean {
  const rolePerms = PERMISSIONS[role as keyof typeof PERMISSIONS];
  return rolePerms?.[permission as keyof typeof rolePerms] ?? false;
}
```

---

## 🛡️ MIDDLEWARE DE PROTECCIÓN

### Middleware Principal

```typescript
// middleware.ts

import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas públicas (sin login)
  const publicRoutes = [
    '/paddy/logistics/monitor',
    '/paddy/auth/login',
  ];

  // Rutas protegidas (con login)
  const protectedRoutes = [
    '/paddy/dashboard',
    '/paddy/logistics/weighing',
  ];

  // Si es ruta pública, permitir
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Si es ruta protegida, validar token
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      // No hay sesión, redirigir a login
      return NextResponse.redirect(new URL('/paddy/auth/login', request.url));
    }

    // Validar rol
    if (token.role !== 'LOGISTICS_OPERATOR') {
      return NextResponse.redirect(new URL('/paddy/auth/unauthorized', request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/paddy/:path*'],
};
```

---

## ⚙️ CONFIGURACIÓN NEXTAUTH.JS

### Environment Variables

```bash
# .env.local

NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3333
```

### Session Storage

```typescript
// Session se almacena en JWT (sin DB)
// El token contiene:
// {
//   id: string,
//   email: string,
//   name: string,
//   role: 'LOGISTICS_OPERATOR',
//   accessToken: string,
//   iat: number,
//   exp: number,
//   iss: string,
// }
```

---

## 🗄️ BASE DE DATOS - ROLES Y PERMISOS

### Tabla de Roles (Backend)

```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_name (name)
);

-- Insertar roles iniciales
INSERT INTO roles (name, description) VALUES
('ADMIN', 'Administrador del sistema'),
('LOGISTICS_OPERATOR', 'Operador de logística (TMS)'),
('USER', 'Usuario standard');
```

### Tabla de Permisos (Backend)

```sql
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  resource VARCHAR(50),       -- 'trucks', 'weighing', 'producers', etc.
  action VARCHAR(20),         -- 'create', 'read', 'update', 'delete'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE (resource, action),
  INDEX idx_resource (resource)
);

-- Insertar permisos para LOGISTICS_OPERATOR
INSERT INTO permissions (name, description, resource, action) VALUES
-- Dashboard
('view_dashboard', 'Ver dashboard principal', 'dashboard', 'read'),
('view_statistics', 'Ver estadísticas', 'dashboard', 'read'),
-- Trucks
('create_truck', 'Crear registro de camión', 'trucks', 'create'),
('read_truck', 'Ver camiones', 'trucks', 'read'),
('update_truck', 'Editar camión', 'trucks', 'update'),
-- Weighing
('register_weighing', 'Registrar pesaje', 'weighing', 'create'),
('read_weighing', 'Ver pesajes', 'weighing', 'read'),
-- Producers
('create_producer', 'Crear productor', 'producers', 'create'),
('read_producer', 'Ver productores', 'producers', 'read'),
-- Tickets
('generate_ticket', 'Generar ticket', 'tickets', 'create'),
('download_pdf', 'Descargar PDF', 'tickets', 'read');
```

### Tabla de Role-Permission (Backend)

```sql
CREATE TABLE role_permissions (
  role_id UUID NOT NULL REFERENCES roles(id),
  permission_id UUID NOT NULL REFERENCES permissions(id),
  PRIMARY KEY (role_id, permission_id),

  INDEX idx_role (role_id),
  INDEX idx_permission (permission_id)
);

-- Asignar permisos a LOGISTICS_OPERATOR
-- (Se hace mediante script de seed después de insertar roles y permisos)
```

### Consulta de Permisos en Backend (NestJS)

```typescript
// guards/permissions.guard.ts

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Inyectado por JWT strategy

    if (!user || user.role !== 'LOGISTICS_OPERATOR') {
      throw new ForbiddenException('Acceso denegado');
    }

    return true;
  }
}

// En los controladores:
// @UseGuards(JwtGuard, PermissionsGuard)
// @Post('trucks')
// async createTruck(@Body() dto: CreateTruckDto) { ... }
```

---

## 🔄 FLUJO COMPLETO DE ACCESO

### Escenario 1: Chofer (Monitor Público)

```
1. Chofer llega a la planta
2. Ve pantalla en /paddy/logistics/monitor
   - SIN necesidad de login
   - Información clara (patente, turno actual)
   - Actualización RT cada 2-3 segundos
3. Espera su turno
4. Ve su patente = "LLAMADO A BALANZA"
5. Se dirige a la balanza
```

### Escenario 2: Operador (Panel Protegido)

```
1. Operador accede a /paddy/auth/login
2. Ingresa credenciales (email + password)
3. Backend valida en DB (tabla users + roles)
4. NextAuth genera JWT con role='LOGISTICS_OPERATOR'
5. Se redirige a /paddy/dashboard
6. Puede acceder a:
   - /paddy/dashboard (estadísticas)
   - /paddy/logistics/weighing (control de pesajes)
7. Todos los datos están protegidos por middleware
8. Socket.io mantiene sincronización RT
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

- [ ] Crear tabla `roles` en backend (MySQL)
- [ ] Crear tabla `permissions` en backend
- [ ] Crear tabla `role_permissions` en backend
- [ ] Crear tabla `users` con campo `role_id`
- [ ] Configurar NextAuth.js en frontend
- [ ] Crear middleware de protección de rutas
- [ ] Crear LoginForm.tsx
- [ ] Crear servicios de autenticación en backend (NestJS)
- [ ] Crear JWT strategy en NestJS
- [ ] Crear PermissionsGuard en NestJS
- [ ] Crear rutas públicas (monitor sin login)
- [ ] Crear rutas protegidas (dashboard, weighing con login)
- [ ] Configurar environment variables (.env.local, .env backend)
- [ ] Testear flujos de login/logout
- [ ] Testear acceso a rutas protegidas sin login
- [ ] Testear acceso a rutas públicas sin login

---

## 🎯 RESUMEN

| Ruta | Autenticación | Rol | Descripción |
|------|---------------|-----|-------------|
| `/paddy/logistics/monitor` | ❌ No | - | Pantalla pública para choferes |
| `/paddy/auth/login` | ❌ No | - | Formulario de login |
| `/paddy/dashboard` | ✅ Sí | LOGISTICS_OPERATOR | Dashboard principal |
| `/paddy/logistics/weighing` | ✅ Sí | LOGISTICS_OPERATOR | Panel de pesajes |
| `/paddy/logistics/weighing/[id]` | ✅ Sí | LOGISTICS_OPERATOR | Detalles del camión |

