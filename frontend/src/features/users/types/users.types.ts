export type UserRole = 'ADMIN' | 'CONSULTANT' | 'TRUCK_RECEPTION';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  success: boolean;
  data: User[];
  timestamp: string;
}

export interface PermissionOverride {
  permissionKey: string;
  effect: 'GRANT' | 'REVOKE';
}

export interface UserPermissionsData {
  effective: string[];
  overrides: PermissionOverride[];
}
