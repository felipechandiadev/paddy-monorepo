import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  OneToOne,
  Relation,
} from 'typeorm';
import { BaseEntity } from '@shared/domain/base.entity';
import { ReceptionStatusEnum } from '@shared/enums';
import { Producer } from '@modules/producers/domain/producer.entity';
import { RiceType, Season, Template } from '@modules/configuration/domain/configuration.entity';

/**
 * Recepción de Arroz
 * Evento de pesaje y despacho - datos iniciales (sin análisis de calidad)
 * Se relaciona 1:1 con AnalysisRecord para mantener normalización
 */
@Entity('receptions')
@Index('idx_reception_producer_season', ['producerId', 'seasonId'])
@Index('idx_reception_status', ['status'])
export class Reception extends BaseEntity {
  @Column({ type: 'int' })
  producerId: number;

  @ManyToOne(() => Producer)
  @JoinColumn({ name: 'producerId' })
  producer?: Producer;

  @Column({ type: 'int' })
  templateId: number;

  @ManyToOne(() => Template)
  @JoinColumn({ name: 'templateId' })
  template?: Template;

  @Column({ type: 'int' })
  seasonId: number;

  @ManyToOne(() => Season)
  @JoinColumn({ name: 'seasonId' })
  season?: Season;

  @Column({ type: 'int' })
  riceTypeId: number;

  @ManyToOne(() => RiceType)
  @JoinColumn({ name: 'riceTypeId' })
  riceType?: RiceType;

  // Datos del despacho
  @Column({ type: 'varchar', length: 50 })
  guideNumber: string; // Número de Guía de Despacho

  @Column({ type: 'varchar', length: 50, nullable: true })
  receptionBookNumber?: string | null; // Correlativo libro recepción

  @Column({ type: 'date', nullable: true })
  receptionDate?: Date | null; // Fecha operativa de recepción

  @Column({ type: 'varchar', length: 50 })
  licensePlate: string; // Patente del camión

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  ricePrice: number; // Precio base por kg

  // Pesos
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  grossWeight: number; // Peso bruto inicial

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  tareWeight: number; // Peso del camión vacío

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  netWeight: number; // Bruto - Tara

  // Descuentos y bonificaciones calculados
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalDiscountKg?: number; // Kilos descontados por baja calidad

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  bonusKg?: number; // Kilos bonus por buena calidad

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  finalNetWeight?: number; // Peso final: netWeight - discountKg + bonusKg

  // Secado
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  dryPercent?: number; // % de humedad excesiva que requiere secado

  @Column({ type: 'boolean', default: false })
  dryFeeApplied: boolean; // Si genera cargo por secado

  // Estado y referencias
  @Column({ type: 'enum', enum: ReceptionStatusEnum, default: ReceptionStatusEnum.CANCELLED })
  status: ReceptionStatusEnum;

  @Column({ type: 'int', nullable: true })
  settlementId?: number; // FK a Settlement (liquidación vinculada)

  @Column({ type: 'int', nullable: true })
  userId?: number; // Usuario que registró la recepción

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @OneToOne(() => AnalysisRecord, (analysisRecord) => analysisRecord.reception)
  analysisRecord?: Relation<AnalysisRecord>;
}

/**
 * Registro de Análisis de Calidad
 * Separa datos de análisis del laboratorio de la recepción
 * Relación 1:1 con Reception pero permite versionamiento e independencia
 */
@Entity('analysis_records')
@Index('idx_analysisrecord_reception', ['receptionId'], { unique: true })
export class AnalysisRecord extends BaseEntity {
  @Column({ type: 'int', unique: true })
  receptionId: number;

  @OneToOne(() => Reception, (reception) => reception.analysisRecord, {
    cascade: true,
  })
  @JoinColumn({ name: 'receptionId' })
  reception?: Relation<Reception>;

  @Column({ type: 'int', nullable: true })
  templateId?: number;

  @ManyToOne(() => Template)
  @JoinColumn({ name: 'templateId' })
  template?: Template;

  // Configuración global de tolerancia (snapshot)
  @Column({ type: 'boolean', default: false })
  useToleranceGroup: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  groupToleranceName?: string | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  groupToleranceValue?: number;

  // Parámetros de análisis (valores ingresados)
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  humedadRange?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  humedadPercent?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  impurezasRange?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  impurezasPercent?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  verdesRange?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  manchadosRange?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  yesososRange?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  peladosRange?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  vanoRange?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  hualcachoRange?: number;

  // Snapshot V2 por parámetro
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  humedadValue?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  humedadTolerance?: number;

  @Column({ type: 'boolean', default: false })
  humedadIsGroup: boolean;

  @Column({ type: 'boolean', default: true })
  humedadTolVisible: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  verdesValue?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  verdesPercent?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  verdesTolerance?: number;

  @Column({ type: 'boolean', default: false })
  verdesIsGroup: boolean;

  @Column({ type: 'boolean', default: true })
  verdesTolVisible: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  impurezasValue?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  impurezasTolerance?: number;

  @Column({ type: 'boolean', default: false })
  impurezasIsGroup: boolean;

  @Column({ type: 'boolean', default: true })
  impurezasTolVisible: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  vanoValue?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  vanoPercent?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  vanoTolerance?: number;

  @Column({ type: 'boolean', default: false })
  vanoIsGroup: boolean;

  @Column({ type: 'boolean', default: true })
  vanoTolVisible: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  hualcachoValue?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  hualcachoPercent?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  hualcachoTolerance?: number;

  @Column({ type: 'boolean', default: false })
  hualcachoIsGroup: boolean;

  @Column({ type: 'boolean', default: true })
  hualcachoTolVisible: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  manchadosValue?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  manchadosPercent?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  manchadosTolerance?: number;

  @Column({ type: 'boolean', default: false })
  manchadosIsGroup: boolean;

  @Column({ type: 'boolean', default: true })
  manchadosTolVisible: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  peladosValue?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  peladosPercent?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  peladosTolerance?: number;

  @Column({ type: 'boolean', default: false })
  peladosIsGroup: boolean;

  @Column({ type: 'boolean', default: true })
  peladosTolVisible: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  yesososValue?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  yesososPercent?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  yesososTolerance?: number;

  @Column({ type: 'boolean', default: false })
  yesososIsGroup: boolean;

  @Column({ type: 'boolean', default: true })
  yesososTolVisible: boolean;

  // Totales calculados
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  totalGroupPercent?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  groupPercent?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  groupTolerance?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  dryPercent?: number;

  @Column({ type: 'decimal', precision: 7, scale: 2, nullable: true })
  summaryPercent?: number;

  @Column({ type: 'decimal', precision: 7, scale: 2, nullable: true })
  summaryTolerance?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  summaryPenaltyKg?: number;

  @Column({ type: 'boolean', default: false })
  bonusEnabled: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  bonusPercent?: number;

  @Column({ type: 'int', nullable: true })
  userId?: number; // Usuario laboratorista que hizo el análisis

  @Column({ type: 'text', nullable: true })
  notes?: string;
}
