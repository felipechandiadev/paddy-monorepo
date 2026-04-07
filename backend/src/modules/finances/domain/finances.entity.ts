import { Entity, Column, Index, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '@shared/domain/base.entity';
import { Producer } from '@modules/producers/domain/producer.entity';
import { Season } from '@modules/configuration/domain/configuration.entity';
import { TransactionTypeEnum, SettlementStatusEnum, AdvanceStatusEnum } from '@shared/enums';

/**
 * Anticipo
 * Dinero adelantado a productores antes de la cosecha
 */
@Entity('advances')
@Index('idx_advance_producer_season', ['producerId', 'seasonId'])
@Index('idx_advance_settlement', ['settlementId'])
export class Advance extends BaseEntity {
  @Column({ type: 'int' })
  producerId: number;

  @ManyToOne(() => Producer)
  @JoinColumn({ name: 'producerId' })
  producer?: Producer;

  @Column({ type: 'int' })
  seasonId: number;

  @ManyToOne(() => Season)
  @JoinColumn({ name: 'seasonId' })
  season?: Season;

  @Column({ type: 'bigint' })
  amount: number; // Monto del anticipo en CLP (entero, sin centavos)

  @Column({ type: 'date' })
  issueDate: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  interestRate: number; // % de interés mensual

  @Column({ type: 'date', nullable: true })
  interestEndDate?: Date; // Fecha de término del interés (si es NULL, se usa hoy)

  @Column({ type: 'boolean', default: true })
  isInterestCalculationEnabled: boolean; // Habilitar/Deshabilitar cálculo de interés

  @Column({ type: 'varchar', length: 20, default: AdvanceStatusEnum.PAID })
  status: AdvanceStatusEnum; // paid, settled, cancelled

  @Column({ type: 'int', nullable: true })
  settlementId?: number;

  @ManyToOne('Settlement', { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'settlementId' })
  settlement?: any;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // Array property: emitDecoratorMetadata emits Array (not Transaction), so forward-ref is safe.
  @OneToMany(() => Transaction, (t) => t.advance)
  transactions?: Transaction[];
}

/**
 * Liquidación (Settlement)
 * Declared BEFORE Transaction so that Transaction.settlement?: Settlement
 * does not trigger a ReferenceError via emitDecoratorMetadata at module load.
 */
@Entity('settlements')
@Index('idx_settlement_producer_season', ['producerId', 'seasonId'])
@Index('idx_settlement_producer', ['producerId'])
@Index('idx_settlement_season', ['seasonId'])
@Index('idx_settlement_status', ['status'])
export class Settlement extends BaseEntity {
  @Column({ type: 'int' })
  producerId: number;

  @ManyToOne(() => Producer)
  @JoinColumn({ name: 'producerId' })
  producer?: Producer;

  @Column({ type: 'int' })
  seasonId: number;

  @ManyToOne(() => Season)
  @JoinColumn({ name: 'seasonId' })
  season?: Season;

  @Column({ type: 'enum', enum: SettlementStatusEnum, default: SettlementStatusEnum.DRAFT })
  status: SettlementStatusEnum;

  @Column({ type: 'json', nullable: true })
  receptionIds?: number[];

  @Column({ type: 'json', nullable: true })
  advanceIds?: number[];

  @Column({ type: 'bigint', default: 0 })
  totalReceptions: number;

  @Column({ type: 'bigint', default: 0 })
  totalPrice: number;

  @Column({ type: 'bigint', default: 0 })
  totalDiscounts: number;

  @Column({ type: 'bigint', default: 0 })
  totalBonuses: number;

  @Column({ type: 'bigint', default: 0 })
  finalAmount: number;

  @Column({ type: 'bigint', default: 0 })
  totalAdvances: number;

  @Column({ type: 'bigint', default: 0 })
  totalInterest: number;

  @Column({ type: 'bigint', default: 0 })
  ivaRice: number;

  @Column({ type: 'bigint', default: 0 })
  ivaServices: number;

  @Column({ type: 'bigint', default: 0 })
  amountDue: number;

  @Column({ type: 'json', nullable: true })
  calculationDetails?: Record<string, any>;

  @Column({ type: 'date', nullable: true })
  issuedAt?: Date;

  @Column({ type: 'date', nullable: true })
  settledAt?: Date | null;

  @Column({ type: 'varchar', length: 80, nullable: true })
  purchaseInvoiceNumber?: string | null;

  @Column({ type: 'int', nullable: true })
  userId?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @OneToMany(
    () => SettlementReceptionSnapshot,
    (snapshot) => snapshot.settlement,
  )
  receptionSnapshots?: SettlementReceptionSnapshot[];
}

/**
 * Snapshot persistido por recepción dentro de una liquidación.
 * Permite respaldo histórico de neto/iva/total por línea.
 */
@Entity('settlement_reception_snapshots')
@Index('idx_settlement_reception_snapshot_settlement', ['settlementId'])
@Index('idx_settlement_reception_snapshot_reception', ['receptionId'])
@Index('idx_settlement_reception_snapshot_order', ['settlementId', 'lineOrder'])
@Index('uq_settlement_reception_snapshot_settlement_reception', ['settlementId', 'receptionId'], {
  unique: true,
})
export class SettlementReceptionSnapshot extends BaseEntity {
  @Column({ type: 'int' })
  settlementId: number;

  @ManyToOne(() => Settlement, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'settlementId' })
  settlement?: Settlement;

  @Column({ type: 'int' })
  receptionId: number;

  @ManyToOne('Reception', { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'receptionId' })
  reception?: any;

  @Column({ type: 'int', default: 0 })
  lineOrder: number;

  @Column({ type: 'datetime', nullable: true })
  receptionDate?: Date | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  guideNumber?: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  riceTypeName?: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  paddyKg: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  ricePrice: number;

  @Column({ type: 'bigint', default: 0 })
  paddySubTotal: number;

  @Column({ type: 'bigint', default: 0 })
  paddyVat: number;

  @Column({ type: 'bigint', default: 0 })
  paddyTotal: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  dryPercent: number;

  @Column({ type: 'bigint', default: 0 })
  dryingSubTotal: number;

  @Column({ type: 'bigint', default: 0 })
  dryingVat: number;

  @Column({ type: 'bigint', default: 0 })
  dryingTotal: number;
}

/**
 * Transacción (Movimiento de dinero)
 * Declared AFTER Advance and Settlement so property types advance?: Advance
 * and settlement?: Settlement resolve correctly via emitDecoratorMetadata.
 */
@Entity('transactions')
@Index('idx_transaction_producer', ['producerId'])
@Index('idx_transaction_type', ['type'])
export class Transaction extends BaseEntity {
  @Column({ type: 'int' })
  producerId: number;

  @ManyToOne(() => Producer)
  @JoinColumn({ name: 'producerId' })
  producer?: Producer;

  @Column({ type: 'int', nullable: true })
  receptionId?: number;

  @ManyToOne('Reception', { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'receptionId' })
  reception?: any;

  @Column({ type: 'int', nullable: true })
  advanceId?: number;

  @ManyToOne(() => Advance, (a) => a.transactions, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'advanceId' })
  advance?: Advance;

  @Column({ type: 'int', nullable: true })
  settlementId?: number;

  @ManyToOne(() => Settlement, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'settlementId' })
  settlement?: Settlement;

  @Column({ type: 'enum', enum: TransactionTypeEnum })
  type: TransactionTypeEnum;

  @Column({ type: 'bigint' })
  amount: number;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  @Column({ type: 'varchar', length: 255, nullable: true })
  referenceNumber?: string;

  @Column({ type: 'date' })
  transactionDate: Date;

  @Column({ type: 'int', nullable: true })
  userId?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;
}
