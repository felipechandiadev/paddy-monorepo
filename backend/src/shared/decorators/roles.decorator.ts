import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../enums';

/**
 * Decorator @Roles() para especificar qué roles pueden acceder a un endpoint
 * Debe usarse con RolesGuard
 * 
 * Ejemplo:
 * @Get()
 * @Roles(RoleEnum.ADMIN, RoleEnum.LABORATORISTA)
 * findAll() { ... }
 */
export const Roles = (...roles: RoleEnum[]) => SetMetadata('roles', roles);
