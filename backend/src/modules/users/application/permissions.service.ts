import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionEnum, PermissionOverrideEffectEnum, RoleEnum } from '@shared/enums';
import { User } from '../domain/user.entity';
import { UserPermissionOverride } from '../domain/user-permission-override.entity';
import {
  ALWAYS_GRANTED_PERMISSIONS,
  DEFAULT_ROLE_PERMISSIONS,
} from '../domain/permissions.constants';
import { AuditService } from '@modules/audit/application/audit.service';
import { AuditCategory, AuditAction, AuditStatus, AuditSeverity } from '@modules/audit/domain/audit-event.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(UserPermissionOverride)
    private overridesRepository: Repository<UserPermissionOverride>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private auditService: AuditService,
  ) {}

  /**
   * Resuelve el conjunto efectivo de permisos de un usuario:
   *   defaults del rol  +  GRANTs individuales  +  permisos siempre otorgados (según rol)  -  REVOKEs individuales
   */
  async getEffectivePermissions(userId: number, role: RoleEnum): Promise<string[]> {
    const defaults = new Set<string>(DEFAULT_ROLE_PERMISSIONS[role] ?? []);
    
    // Obtener permisos "siempre otorgados" específicos del rol
    const alwaysGrantedForRole = ALWAYS_GRANTED_PERMISSIONS[role] ?? [];
    const alwaysGranted = new Set<string>(alwaysGrantedForRole as string[]);

    // Agregar permisos obligatorios del rol
    for (const key of alwaysGranted) {
      defaults.add(key);
    }

    const overrides = await this.overridesRepository.find({
      where: { userId },
    });

    for (const override of overrides) {
      // Estos permisos no son configurables ni revocables por usuario.
      if (alwaysGranted.has(override.permissionKey)) {
        continue;
      }

      if (override.effect === PermissionOverrideEffectEnum.GRANT) {
        defaults.add(override.permissionKey);
      } else {
        defaults.delete(override.permissionKey);
      }
    }

    // Doble garantía: re-agregar permisos siempre otorgados por el rol
    for (const key of alwaysGranted) {
      defaults.add(key);
    }

    return Array.from(defaults);
  }

  /**
   * Devuelve los overrides actuales del usuario (para el panel de administración).
   */
  async getUserOverrides(userId: number): Promise<UserPermissionOverride[]> {
    return this.overridesRepository.find({ where: { userId } });
  }

  /**
   * Reemplaza por completo los overrides de un usuario.
   * Recibe listas de permisos a GRANT y a REVOKE para el usuario.
   * Borra los overrides existentes y crea los nuevos.
   */
  async setUserOverrides(
    userId: number,
    grants: string[],
    revokes: string[],
    assignedByUserId: number,
  ): Promise<void> {
    // Obtener el usuario para conocer su rol
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error(`Usuario no encontrado: ${userId}`);
    }

    // Capturar valores previos
    const previousOverrides = await this.overridesRepository.find({ where: { userId } });
    const beforeData = {
      grants: previousOverrides
        .filter((o) => o.effect === PermissionOverrideEffectEnum.GRANT)
        .map((o) => o.permissionKey),
      revokes: previousOverrides
        .filter((o) => o.effect === PermissionOverrideEffectEnum.REVOKE)
        .map((o) => o.permissionKey),
    };

    // Borrar overrides existentes
    await this.overridesRepository.delete({ userId });

    const entities: Partial<UserPermissionOverride>[] = [];

    const allPermissions = new Set(Object.values(PermissionEnum) as string[]);
    
    // Obtener permisos "siempre otorgados" específicos del rol del usuario
    const alwaysGrantedForRole = ALWAYS_GRANTED_PERMISSIONS[user.role] ?? [];
    const alwaysGranted = new Set<string>(alwaysGrantedForRole as string[]);

    for (const key of grants) {
      if (allPermissions.has(key) && !alwaysGranted.has(key)) {
        entities.push({
          userId,
          permissionKey: key,
          effect: PermissionOverrideEffectEnum.GRANT,
          assignedByUserId,
        });
      }
    }

    for (const key of revokes) {
      if (allPermissions.has(key) && !alwaysGranted.has(key)) {
        entities.push({
          userId,
          permissionKey: key,
          effect: PermissionOverrideEffectEnum.REVOKE,
          assignedByUserId,
        });
      }
    }

    if (entities.length > 0) {
      await this.overridesRepository.save(
        entities.map((e) => this.overridesRepository.create(e)),
      );
    }

    // Capturar valores posteriores y loguear auditoría
    const afterData = {
      grants,
      revokes,
    };

    // Log evento de auditoría para UPDATE de permisos
    this.auditService.logEvent({
      eventCode: 'USERS.PERMISSIONS.UPDATE',
      category: AuditCategory.USERS,
      action: AuditAction.UPDATE,
      status: AuditStatus.SUCCESS,
      severity: AuditSeverity.HIGH,
      actorUserId: assignedByUserId,
      entityType: 'User',
      entityId: userId,
      route: '/users/:id/permissions',
      method: 'PUT',
      beforeData,
      afterData,
    });
  }

  /**
   * Verifica que un usuario tenga TODOS los permisos requeridos.
   */
  async userHasPermissions(
    userId: number,
    role: RoleEnum,
    required: string[],
  ): Promise<boolean> {
    if (!required.length) return true;
    const effective = await this.getEffectivePermissions(userId, role);
    const effectiveSet = new Set(effective);
    return required.every((p) => effectiveSet.has(p));
  }
}
