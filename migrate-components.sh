#!/bin/bash

# ============================================================================
# SCRIPT: Migrar componentes UI del Frontend a Paddy TMS
# ============================================================================
# Propósito: Automatizar la copia de componentes compartidos
# Uso: chmod +x migrate-components.sh && ./migrate-components.sh
# ============================================================================

set -e  # Exit on error

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Rutas
FRONTEND_SRC="/Users/felipe/dev/paddy/frontend/src"
PADDY_TMS_FRONTEND="${PWD}/frontend"
SHARED_COMPONENTS="${FRONTEND_SRC}/shared/components"

# ============================================================================
# FUNCIONES AUXILIARES
# ============================================================================

log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

check_directory() {
    if [ ! -d "$1" ]; then
        log_error "Directorio no encontrado: $1"
        return 1
    fi
    return 0
}

copy_file() {
    local source=$1
    local dest=$2
    
    if [ ! -f "$source" ]; then
        log_warning "Archivo no existe: $source"
        return 1
    fi
    
    mkdir -p "$(dirname "$dest")"
    cp "$source" "$dest"
    log_success "Copiado: $(basename $source)"
}

copy_directory() {
    local source=$1
    local dest=$2
    
    if [ ! -d "$source" ]; then
        log_warning "Directorio no existe: $source"
        return 1
    fi
    
    mkdir -p "$(dirname "$dest")"
    cp -r "$source" "$dest"
    log_success "Copiado directorio: $(basename $source)"
}

# ============================================================================
# INICIO DEL SCRIPT
# ============================================================================

echo -e "${BLUE}═════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  MIGRACIÓN DE COMPONENTES UI A PADDY TMS${NC}"
echo -e "${BLUE}═════════════════════════════════════════════════════════${NC}\n"

# Verificar directorios base
log_info "Verificando directorios..."
check_directory "$FRONTEND_SRC" || exit 1
check_directory "$PADDY_TMS_FRONTEND" || exit 1

# ============================================================================
# FASE 1: Crear estructura de carpetas
# ============================================================================

echo -e "\n${YELLOW}FASE 1: Crear estructura de carpetas${NC}"

log_info "Creando directorios base..."
mkdir -p "${PADDY_TMS_FRONTEND}/src/shared/components/ui"
mkdir -p "${PADDY_TMS_FRONTEND}/src/app"
mkdir -p "${PADDY_TMS_FRONTEND}/src/features/logistics"
log_success "Estructura de carpetas creada"

# ============================================================================
# FASE 2: Copiar archivos de configuración
# ============================================================================

echo -e "\n${YELLOW}FASE 2: Copiar archivos de configuración${NC}"

log_info "Copiando archivos de configuración..."

copy_file "${FRONTEND_SRC}/../tailwind.config.js" "${PADDY_TMS_FRONTEND}/tailwind.config.js"
copy_file "${FRONTEND_SRC}/../tsconfig.json" "${PADDY_TMS_FRONTEND}/tsconfig.json"

# Verificar postcss.config.js
if [ -f "${FRONTEND_SRC}/../postcss.config.js" ]; then
    copy_file "${FRONTEND_SRC}/../postcss.config.js" "${PADDY_TMS_FRONTEND}/postcss.config.js"
else
    log_warning "postcss.config.js no encontrado, crear manualmente"
fi

log_success "Configuración copiada"

# ============================================================================
# FASE 3: Copiar estilos globales
# ============================================================================

echo -e "\n${YELLOW}FASE 3: Copiar estilos globales${NC}"

log_info "Copiando globals.css..."
copy_file "${FRONTEND_SRC}/app/globals.css" "${PADDY_TMS_FRONTEND}/src/app/globals.css"
log_success "Estilos globales copiados"

# ============================================================================
# FASE 4: Copiar componentes UI
# ============================================================================

echo -e "\n${YELLOW}FASE 4: Copiar componentes UI${NC}"

# Array de componentes
COMPONENTS=(
    "Button"
    "TextField"
    "Select"
    "Alert"
    "Dialog"
    "Badge"
    "Switch"
    "IconButton"
    "AutoComplete"
    "RangeSlider"
    "Tabs"
    "NumberStepper"
    "DropdownList"
)

log_info "Copiando ${#COMPONENTS[@]} componentes..."

for component in "${COMPONENTS[@]}"; do
    source_dir="${SHARED_COMPONENTS}/ui/${component}"
    dest_dir="${PADDY_TMS_FRONTEND}/src/shared/components/ui/${component}"
    
    if [ -d "$source_dir" ]; then
        copy_directory "$source_dir" "$dest_dir"
    else
        log_warning "Componente no encontrado: ${component}"
    fi
done

# Copiar componentes complejos (opcionales)
log_info "Copiando componentes complejos (opcionales)..."

OPTIONAL_COMPONENTS=(
    "DataGrid"
    "TopBar"
    "SplashScreen"
)

for component in "${OPTIONAL_COMPONENTS[@]}"; do
    source_dir="${SHARED_COMPONENTS}/ui/${component}"
    dest_dir="${PADDY_TMS_FRONTEND}/src/shared/components/ui/${component}"
    
    if [ -d "$source_dir" ]; then
        copy_directory "$source_dir" "$dest_dir"
        log_success "Componente opcional copiado: ${component}"
    fi
done

# ============================================================================
# FASE 5: Copiar PrintDialog (opcional)
# ============================================================================

echo -e "\n${YELLOW}FASE 5: Copiar componentes adicionales${NC}"

if [ -d "${SHARED_COMPONENTS}/PrintDialog" ]; then
    copy_directory "${SHARED_COMPONENTS}/PrintDialog" "${PADDY_TMS_FRONTEND}/src/shared/components/PrintDialog"
fi

# ============================================================================
# FASE 6: Crear index.ts para exports
# ============================================================================

echo -e "\n${YELLOW}FASE 6: Crear archivos de index.ts${NC}"

log_info "Creando index.ts para componentes UI..."

# Crear index.ts para UI
cat > "${PADDY_TMS_FRONTEND}/src/shared/components/ui/index.ts" << 'EOF'
// ============================================================================
// UI Components Export Index
// ============================================================================
// Auto-generated: Usado para exports centralizados de componentes UI
// ============================================================================

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

// Componentes opcionales (si existen)
try {
  export * from './DataGrid/DataGrid';
  export * from './DataGrid/DataGridWrapper';
} catch (e) {
  // DataGrid no copiado
}

try {
  export * from './TopBar/TopBar';
  export * from './TopBar/SideBar';
} catch (e) {
  // TopBar no copiado
}

try {
  export * from './SplashScreen/SplashScreen';
} catch (e) {
  // SplashScreen no copiado
}
EOF

log_success "index.ts para UI creado"

# Crear index.ts para shared/components
log_info "Creando index.ts para shared/components..."

cat > "${PADDY_TMS_FRONTEND}/src/shared/components/index.ts" << 'EOF'
// ============================================================================
// Shared Components Export Index
// ============================================================================

export * from './ui';

// Export PrintDialog si existe
try {
  export { PrintDialog } from './PrintDialog';
} catch (e) {
  // PrintDialog no copiado
}
EOF

log_success "index.ts para shared/components creado"

# ============================================================================
# FASE 7: Mostrar resumen
# ============================================================================

echo -e "\n${BLUE}═════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ MIGRACIÓN COMPLETADA${NC}"
echo -e "${BLUE}═════════════════════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}RESUMEN:${NC}\n"
echo "  ✓ Estructura de carpetas creada"
echo "  ✓ Archivos de configuración copiados"
echo "  ✓ globals.css copiado"
echo "  ✓ ${#COMPONENTS[@]} componentes UI copiados"
echo "  ✓ Componentes opcionales revisados"
echo "  ✓ index.ts generados\n"

echo -e "${YELLOW}PRÓXIMOS PASOS:${NC}\n"
echo "  1. Instalar dependencias npm:"
echo "     cd ${PADDY_TMS_FRONTEND}"
echo "     npm install"
echo ""
echo "  2. Verificar compilación:"
echo "     npm run build"
echo ""
echo "  3. Testear en desarrollo:"
echo "     npm run dev"
echo ""
echo "  4. Verificar en layout.tsx que globals.css está importado:"
echo "     import './globals.css'"
echo ""

echo -e "${GREEN}¡Listo para usar los componentes en Paddy TMS!${NC}\n"
