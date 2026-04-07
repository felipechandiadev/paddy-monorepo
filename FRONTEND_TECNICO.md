# Documentacion Tecnica del Frontend

## 1. Objetivo
Este documento describe tecnicamente el frontend del proyecto Paddy para que cualquier desarrollador pueda:

- levantar el proyecto en local,
- entender su arquitectura,
- replicar su estructura en otro entorno,
- y extenderlo sin romper sus convenciones.

Alcance: carpeta `frontend/`.

## 2. Stack Tecnologico

- Framework: Next.js 16 (App Router)
- UI: React 19 + TypeScript estricto
- Estilos: Tailwind CSS + variables CSS globales
- Autenticacion: NextAuth (credenciales)
- Estado de datos remotos: TanStack React Query
- Mapas/geo: Leaflet + React Leaflet
- Impresion: react-to-print
- Linting: ESLint con configuracion Next.js


## 4. Estructura General

```text
frontend/
  src/
    app/          -> enrutamiento y layouts (adaptadores de ruta)
    features/     -> modulos de negocio por dominio funcional
    shared/       -> piezas reutilizables transversales
    lib/          -> infraestructura comun (auth, cliente API, errores)
    providers/    -> providers globales
```

## 5. Arquitectura (Feature-First con enfoque DDD)

El frontend sigue un enfoque por modulos (bounded contexts) y separa responsabilidades por capa.

### 5.1 Capa de Enrutamiento
En `src/app/` viven:

- paginas de ruta (`page.tsx`),
- layouts (`layout.tsx`),
- endpoints internos (`app/api/...`),
- manejo de errores por segmento (`error.tsx`).

La ruta protegida principal es `/admin`, con subrutas para operaciones, gestion, finanzas, reportes y configuracion.

### 5.2 Capa de Aplicacion
En `src/features/*/actions/` viven las acciones de servidor.

Patron comun:

1. obtener sesion con `getServerSession`,
2. extraer `accessToken`,
3. llamar backend con `fetch`,
4. normalizar payload,
5. devolver contratos tipados para UI.

### 5.3 Capa de Dominio
En `src/features/*/types/` se definen contratos de datos por modulo.

En algunos modulos existe carpeta `admain/` para evolucionar reglas de negocio explicitas. El diseño permite crecer hacia una separacion DDD mas estricta sin rehacer rutas.

### 5.4 Capa de Infraestructura
En `src/features/*/services/` y `src/lib/` se centraliza:

- comunicacion HTTP,
- configuracion de autenticacion,
- utilidades de error de conexion,
- detalles tecnicos compartidos.

## 6. Modulos Funcionales del Frontend

Actualmente existen modulos para:

- autenticacion,
- usuarios,


Cada modulo mantiene su propia implementacion de acciones, presentacion y tipos, reduciendo acoplamiento entre dominios.

## 7. Flujo de Autenticacion

### 7.1 Login UI
La ruta `/` renderiza la UI de acceso con:

- formulario de correo y clave,
- estado de carga,
- feedback de error,
- redireccion a `/paddy` al autenticar.

### 7.2 Integracion con NextAuth
NextAuth usa proveedor de credenciales y valida contra backend (`/auth/login`).

Datos inyectados en token/sesion:

- id,
- nombre,
- email,
- rol,
- access token.

La sesion usa estrategia JWT con vigencia de 24 horas.

### 7.3 Refresco de perfil
En callback de sesion se consulta `/auth/me` para refrescar campos mutables del usuario y evitar UI obsoleta despues de editar perfil.

## 8. Proteccion de Rutas y Seguridad

`middleware.ts` protege toda la app excepto recursos estaticos y API interna.

Reglas principales:

- `/` queda publica para login,
- usuario autenticado que entra a `/` se redirige a `/admin`,
- toda ruta privada exige token valido,
- se valida expiracion real del access token leyendo `exp` del JWT.

## 9. Top Bar y Navegacion Principal

En el layout de `/admin` se monta una barra superior fija con:

- identidad visual,
- nombre de usuario logueado,
- boton de menu lateral,
- acceso a cambio de clave,
- cierre de sesion.

El menu lateral se construye por configuracion (items y subitems), lo que permite agregar modulos sin reescribir la estructura base de navegacion.


## 11. Estilo, Tema y Sistema Visual

`globals.css` define tokens visuales globales (colores semanticos, fondo, foreground, estados) y utilidades basadas en esas variables.

Tambien centraliza:

- iconografia,
- reglas de interaccion visual,
- animaciones de mapa,
- clases base de botones/alertas/tipografia.

Resultado: un lenguaje visual consistente entre modulos.

## 12. Gestion de Estado

Estado global:

- sesion/autenticacion via NextAuth,
- cache de datos remotos via React Query (provider global).

Estado local/modular:

- hooks/context por feature,
- estado de UI dentro de cada pantalla.

## 13. Integracion con Backend

Base URL controlada por ``.

Patrones de integracion:

- todas las llamadas autenticadas usan `Authorization: Bearer <token>`,
- `cache: no-store` en lecturas sensibles,
- normalizacion defensiva de payloads,
- manejo homogeneo de errores de conectividad para mostrar mensajes accionables.

## 14. Manejo de Errores

debe Existe un error boundary especifico para `/admin` que:

- distingue errores de backend caido vs error inesperado,
- muestra mensaje tecnico entendible,
- ofrece acciones de reintento o volver a inicio.

Esto mejora resiliencia operativa en fallas de red o backend no disponible.

## 15. PWA, Metadata y SEO Tecnico

El frontend incluye:

- `manifest.json`,
- `robots.txt`,
- `sitemap.ts`,
- metadata global en root layout.

Permite instalacion tipo PWA y configuracion SEO basica.

Nota tecnica: parte del contenido de manifest/sitemap referencia rutas heredadas; al replicar en otro entorno conviene alinear esas rutas con la navegacion real de `/paddy`.

## 16. Variables de Entorno Requeridas

Crear `frontend/.env.local` con:

```env
PORT=3001
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
JWT_TOKEN_STORAGE_KEY= token
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=<definir-valor-seguro>
API_TIMEOUT=30000
```

## 17. Scripts Operativos

Desde `frontend/`:

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
```

## 19. Convenciones para Extender el Frontend

Para agregar un nuevo dominio funcional:

1. crear carpeta en `src/features/<nuevo-modulo>/`,
2. separar acciones, servicios, tipos y presentacion,
3. exponer barriles `index.ts` cuando aplique,
4. crear ruta en `src/app/admin/...` como adaptador,
5. conectar entrada de menu en la configuracion de navegacion,
6. reutilizar la biblioteca UI compartida,
7. mantener tipado estricto y normalizacion de respuestas,
8. preservar manejo de errores de conectividad.

## 20. Checklist de Calidad para Replicar sin Regresiones

- build de produccion exitoso,
- middleware protegiendo rutas privadas,
- login con redireccion correcta,
- top bar y menu lateral operativos,
- cambio de clave y cierre de sesion funcionando,
- tablas/formularios respetando UI compartida,
- llamadas al backend con token y manejo de error uniforme.
