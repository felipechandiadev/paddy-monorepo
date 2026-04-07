import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '../enums';

/**
 * Roles Guard - Verifica que el usuario tenga uno de los roles requeridos
 * Se usa en combinación con @Roles() decorator
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<RoleEnum[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true; // No hay restricción de roles
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException('No tienes permisos para acceder a este recurso');
    }

    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(`Se requiere uno de estos roles: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}
