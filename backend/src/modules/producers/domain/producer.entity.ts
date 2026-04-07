import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@shared/domain/base.entity';

/**
 * Banco - Interface para describir cuentas bancarias
 */
export interface BankAccount {
  bankCode: number;
  bankName: string;
  accountNumber: string;
  accountTypeCode: number;
  accountTypeName: string;
  holderName?: string;
}

/**
 * Productor (Agricultor)
 * Almacena productores de arroz que venden cosechas a través del sistema
 */
@Entity('producers')
@Index('idx_producer_rut', ['rut'], { unique: true })
export class Producer extends BaseEntity {
  @Column({ type: 'varchar', length: 20 })
  rut: string; // Ej: "12345678-9"

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  contactPerson?: string;

  /**
   * Almacena array de cuentas bancarias en JSON
   * Permite múltiples cuentas por productor
   * Ej: [{ bankCode: 1, bankName: "Banco de Chile", ... }]
   */
  @Column({ type: 'json', nullable: true })
  bankAccounts?: BankAccount[];

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalDebt: number;
}
