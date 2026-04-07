#!/bin/bash

# Script para ejecutar el seed de producción
# Uso: ./seed-production.sh

echo "🚀 Iniciando Seed de Producción..."
echo "=================================="

# Verificar que exista el archivo database_dump.json
if [ ! -f "database_dump.json" ]; then
    echo "❌ Error: Archivo database_dump.json no encontrado en el directorio actual"
    exit 1
fi

echo "✅ Archivo database_dump.json encontrado"

# Cargar variables de entorno desde .env
if [ -f ".env" ]; then
    source .env
    echo "✅ Variables de entorno cargadas desde .env"
else
    echo "⚠️  Archivo .env no encontrado, usando variables por defecto"
fi

# Ejecutar el seed
echo ""
echo "Reseteando base de datos y cargando datos..."
echo ""

npx ts-node -r tsconfig-paths/register src/infrastructure/persistence/seeders/seed-production.ts

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡Seed de Producción completado exitosamente!"
else
    echo ""
    echo "❌ Error durante la ejecución del seed"
    exit 1
fi
