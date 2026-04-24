# Deploy con PM2

Orquestación de **backend** (Nest), **frontend** (Next, puerto 3001) y **cargo** (TMS Next, puerto 3002). Las variables de entorno **no** se leen de `backend/.env`, `frontend/.env.local` ni `cargo/.env.local` (no van al repositorio). En su lugar, PM2 carga archivos en **`deploy/secrets/`**, que debes crear en el servidor a partir de las plantillas en **`deploy/env/*.example`**.

## Requisitos

- Node.js y npm (misma major que en desarrollo).
- PM2 instalado globalmente: `npm install -g pm2`.
- En el servidor, copiar o clonar el monorepo y crear los tres archivos de secretos (ver abajo).

## Puertos por defecto

| Proceso PM2   | App        | Puerto |
|---------------|------------|--------|
| `paddy-api`   | backend    | 3000   |
| `paddy-web`   | frontend   | 3001   |
| `paddy-cargo` | cargo      | 3002   |

Ajusta `PORT` en `deploy/secrets/frontend.env` y `deploy/secrets/cargo.env` si cambias los puertos; el backend usa `PORT` en `backend.env`.

## Configurar secretos (primera vez)

Desde la raíz del repo:

```bash
mkdir -p deploy/secrets
cp deploy/env/backend.env.example   deploy/secrets/backend.env
cp deploy/env/frontend.env.example deploy/secrets/frontend.env
cp deploy/env/cargo.env.example    deploy/secrets/cargo.env
```

Edita los tres archivos en `deploy/secrets/` y rellena contraseñas, URLs públicas, `JWT_SECRET`, `NEXTAUTH_SECRET`, etc. Las plantillas están alineadas con:

- [backend/.env.example](../backend/.env.example)
- [frontend/.env.example](../frontend/.env.example)
- [cargo/.env.local.example](../cargo/.env.local.example)

**Importante:** en producción suele hacer falta `NEXTAUTH_URL` y `NEXT_PUBLIC_API_URL` apuntando a los hostnames reales (HTTPS) del frontend y del API.

Los archivos `deploy/secrets/*.env` están en `.gitignore` y no deben subirse al repositorio.

## Desplegar (build + PM2)

```bash
./deploy/deploy.sh
```

El script ejecuta `npm ci` y `npm run build` en `backend/`, `frontend/` y `cargo/`, luego `pm2 startOrReload deploy/ecosystem.config.cjs`.

Si falta algún archivo en `deploy/secrets/`, la carga del ecosystem fallará con un mensaje que indica copiar desde `deploy/env/*.example`.

## Comandos PM2 útiles

```bash
pm2 ls
pm2 logs paddy-api
pm2 restart paddy-api
```

### Arranque al reiniciar el servidor (opcional)

Tras tener los procesos como quieres:

```bash
pm2 save
pm2 startup
```

Ejecuta el comando que PM2 imprima (normalmente involucra `systemd`) con privilegios de administrador.

## Cambiar solo configuración PM2 sin rebuild

Tras editar `deploy/secrets/*.env` o `ecosystem.config.cjs`:

```bash
cd deploy && pm2 startOrReload ecosystem.config.cjs
```

Si cambias código, vuelve a ejecutar `./deploy/deploy.sh` para recompilar.
