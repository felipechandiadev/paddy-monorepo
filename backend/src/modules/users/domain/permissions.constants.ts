import { PermissionEnum, RoleEnum } from '@shared/enums';

/**
 * Permisos obligatorios que siempre deben estar habilitados para usuarios ADMIN.
 * Para CONSULTANT, solo se incluyen los permisos de la lista explícita.
 */
export const ALWAYS_GRANTED_PERMISSIONS: Record<RoleEnum, PermissionEnum[]> = {
  [RoleEnum.ADMIN]: [
    PermissionEnum.ANALYSIS_RECORDS_VIEW,
    PermissionEnum.ANALYSIS_RECORDS_CREATE,
    PermissionEnum.ANALYSIS_RECORDS_UPDATE,
    // Servicios de liquidación: siempre habilitados para ADMIN
    PermissionEnum.SETTLEMENT_SERVICES_VIEW,
    PermissionEnum.SETTLEMENT_SERVICES_CREATE,
    PermissionEnum.SETTLEMENT_SERVICES_UPDATE,
    PermissionEnum.SETTLEMENT_SERVICES_DELETE,
  ],
  // CONSULTANT: sin permisos "siempre otorgados" - solo los de la lista explícita
  [RoleEnum.CONSULTANT]: [],
};

/**
 * Permisos por defecto para cada rol.
 * ADMIN tiene todos los permisos.
 * CONSULTANT tiene un subset de solo lectura + operaciones básicas.
 *
 * Los overrides individuales por usuario (user_permission_overrides)
 * se aplican ENCIMA de estos defaults.
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<RoleEnum, PermissionEnum[]> = {
  [RoleEnum.ADMIN]: Object.values(PermissionEnum),

  [RoleEnum.CONSULTANT]: [
    // Usuarios: solo ver
    PermissionEnum.USERS_VIEW,

    // Productores: solo ver
    PermissionEnum.PRODUCERS_VIEW,

    // Configuración: solo ver
    PermissionEnum.RICE_TYPES_VIEW,
    PermissionEnum.SEASONS_VIEW,
    PermissionEnum.TEMPLATES_VIEW,
    PermissionEnum.ANALYSIS_PARAMS_VIEW,

    // Recepciones: solo ver
    PermissionEnum.RECEPTIONS_VIEW,

    // Anticipos: solo ver (sin crear/editar/cancelar ni cambiar tasa)
    PermissionEnum.ADVANCES_VIEW,

    // Transacciones: solo ver
    PermissionEnum.TRANSACTIONS_VIEW,

    // Liquidaciones: ver, crear y guardar (sin completar ni cancelar)
    PermissionEnum.SETTLEMENTS_VIEW,
    PermissionEnum.SETTLEMENTS_CREATE,
    PermissionEnum.SETTLEMENTS_SAVE,

    // Analíticas: ver reportes
    PermissionEnum.ANALYTICS_VIEW,
  ],
};
