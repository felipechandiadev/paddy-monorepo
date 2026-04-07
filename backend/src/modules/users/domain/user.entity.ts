import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@shared/domain/base.entity';
import { RoleEnum } from '@shared/enums';

/**
 * Usuario del sistema (Admin, Laboratorista, Pesaje)
 * Representa a los empleados de la Municipalidad que operan el sistema
 */
@Entity('users')
@Index('idx_user_email', ['email'], { unique: true })
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  firstName?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName?: string;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.ADMIN })
  role: RoleEnum;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'text', nullable: true })
  lastLogin?: Date;
}
