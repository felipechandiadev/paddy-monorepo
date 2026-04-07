import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '../enums';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { PermissionsService } from '@modules/users/application/permissions.service';

/**
 * Guard que verifica permisos granulares.
 * Requiere que el usuario esté autenticado (JwtAuthGuard previo).
 * Admins conservan acceso total incluso sin overrides.
 *
 * Uso: aplicar @Permissions('settlements.complete') en el handler.
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Sin restricción de permisos → permitir
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('No autenticado');
    }

    const hasAll = await this.permissionsService.userHasPermissions(
      user.userId,
      user.role as RoleEnum,
      requiredPermissions,
    );

    if (!hasAll) {
      throw new ForbiddenException(
        `Permiso insuficiente. Se requiere: ${requiredPermissions.join(', ')}`,
      );
    }

    return true;
  }
}
