import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

/**
 * Decorator para especificar qué permisos son requeridos para acceder a un endpoint.
 * Debe usarse junto con PermissionsGuard.
 *
 * Ejemplo:
 * @Get()
 * @Permissions('receptions.view')
 * findAll() { ... }
 */
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
