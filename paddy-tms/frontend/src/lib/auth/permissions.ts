export const ROLES = {
  LOGISTICS_OPERATOR: 'logistics_operator',
  ADMIN: 'admin',
  CONSULTANT: 'consultant',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const PERMISSIONS = {
  // Logistics operations
  VIEW_TRUCKS: 'view_trucks',
  REGISTER_TRUCK: 'register_truck',
  WEIGH_TRUCK: 'weigh_truck',
  EDIT_TRUCK: 'edit_truck',
  DELETE_TRUCK: 'delete_truck',

  // Reception
  VIEW_RECEPTIONS: 'view_receptions',
  CREATE_RECEPTION: 'create_reception',
  EDIT_RECEPTION: 'edit_reception',
  CANCEL_RECEPTION: 'cancel_reception',

  // Monitoring
  VIEW_MONITOR: 'view_monitor',
  VIEW_QUEUE: 'view_queue',
  VIEW_DASHBOARD: 'view_dashboard',

  // Admin operations
  MANAGE_USERS: 'manage_users',
  MANAGE_ROLES: 'manage_roles',
  MANAGE_SETTINGS: 'manage_settings',
  VIEW_AUDIT_LOGS: 'view_audit_logs',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.LOGISTICS_OPERATOR]: [
    PERMISSIONS.VIEW_TRUCKS,
    PERMISSIONS.REGISTER_TRUCK,
    PERMISSIONS.WEIGH_TRUCK,
    PERMISSIONS.VIEW_RECEPTIONS,
    PERMISSIONS.CREATE_RECEPTION,
    PERMISSIONS.VIEW_MONITOR,
    PERMISSIONS.VIEW_QUEUE,
  ],
  [ROLES.ADMIN]: [
    ...Object.values(PERMISSIONS),
  ],
  [ROLES.CONSULTANT]: [
    PERMISSIONS.VIEW_TRUCKS,
    PERMISSIONS.VIEW_RECEPTIONS,
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_MONITOR,
    PERMISSIONS.VIEW_AUDIT_LOGS,
  ],
};

export function hasPermission(
  userRole: Role | undefined,
  requiredPermission: Permission,
): boolean {
  if (!userRole) return false;

  const permissions = ROLE_PERMISSIONS[userRole];
  if (!permissions) return false;

  return permissions.includes(requiredPermission);
}

export function hasAnyPermission(
  userRole: Role | undefined,
  requiredPermissions: Permission[],
): boolean {
  if (!userRole) return false;

  return requiredPermissions.some((permission) =>
    hasPermission(userRole, permission),
  );
}

export function hasAllPermissions(
  userRole: Role | undefined,
  requiredPermissions: Permission[],
): boolean {
  if (!userRole) return false;

  return requiredPermissions.every((permission) =>
    hasPermission(userRole, permission),
  );
}
