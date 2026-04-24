#!/usr/bin/env bash
# Build de las tres apps y recarga PM2 con deploy/ecosystem.config.cjs
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "[deploy] Falta el comando: $1" >&2
    exit 1
  }
}

require_cmd npm
require_cmd pm2

echo "[deploy] Instalando dependencias y compilando backend..."
(cd "$ROOT/backend" && npm ci && npm run build)

echo "[deploy] Instalando dependencias y compilando frontend..."
(cd "$ROOT/frontend" && npm ci && npm run build)

echo "[deploy] Instalando dependencias y compilando cargo (TMS)..."
(cd "$ROOT/cargo" && npm ci && npm run build)

echo "[deploy] Iniciando o recargando procesos PM2..."
cd "$ROOT/deploy"
pm2 startOrReload ecosystem.config.cjs

echo "[deploy] Listo. Estado:"
pm2 ls
