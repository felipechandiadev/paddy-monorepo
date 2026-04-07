import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@shared/domain/base.entity';
import { PermissionOverrideEffectEnum } from '@shared/enums';
import { User } from './user.entity';

/**
 * Override de permiso para un usuario específico.
 * Permite conceder (GRANT) o revocar (REVOKE) un permiso por encima de los defaults de su rol.
 */
@Entity('user_permission_overrides')
@Index('idx_upo_user_permission', ['userId', 'permissionKey'], { unique: true })
export class UserPermissionOverride extends BaseEntity {
  @Column({ type: 'int' })
  userId: number;

  /**
   * Clave del permiso (e.g. 'settlements.complete').
   * Almacenado como varchar para no requerir migraciones al agregar nuevos permisos al enum.
   */
  @Column({ type: 'varchar', length: 100 })
  permissionKey: string;

  @Column({ type: 'enum', enum: PermissionOverrideEffectEnum })
  effect: PermissionOverrideEffectEnum;

  /**
   * Usuario administrador que asignó este override.
   */
  @Column({ type: 'int', nullable: true })
  assignedByUserId: number | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assignedByUserId' })
  assignedBy: User | null;
}
