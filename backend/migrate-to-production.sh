#!/bin/bash

################################################################################
# MIGRATION SCRIPT - PRODUCCIÓN AIVEN
# IMPORTANTE: Este script NUNCA elimina datos
# Solo ejecuta migrations pendientes ("up" direction)
################################################################################

set -e  # Exit si hay error

echo "=========================================="
echo "MIGRACIÓN A PRODUCCIÓN AIVEN"
echo "=========================================="
echo ""
echo "⚠️  ADVERTENCIA: Este script ejecutará migraciones."
echo "   Se preservarán todos los datos existentes."
echo "   Solo se agregarán nuevas tablas/columnas."
echo ""
echo "Presiona ENTER para continuar o Ctrl+C para cancelar..."
read

cd /Users/felipe/dev/paddy/backend

echo ""
echo "📋 Paso 1: Compilar backend..."
npm run build

echo ""
echo "🔄 Paso 2: Ejecutar migraciones pendientes (NUNCA REVIERTE DATOS)..."
npm run migration:run

echo ""
echo "✅ Paso 3: Verificar estado de migraciones..."
npm run migration:show

echo ""
echo "✨ Migraciones completadas exitosamente."
echo ""
echo "=========================================="
echo "SIGUIENTE: Executar seed si necesario para permisos:"
echo "npm run seed"
echo "=========================================="
