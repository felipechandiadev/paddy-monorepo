import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@shared/domain/base.entity';

/**
 * Variedad de Arroz
 * Catálogo de tipos de arroz que se pueden recibir
 * Ej: Diamante, Zafiro, Pantera, etc.
 */
@Entity('rice_types')
@Index('idx_ricetype_code', ['code'], { unique: true })
export class RiceType extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  code: string; // Ej: "DIAMANTE"

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'int', nullable: true })
  referencePrice?: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}

/**
 * Temporada de Cosecha
 * Agrupa receptions por período (ej: Verano 2026, Invierno 2026)
 */
@Entity('seasons')
@Index('idx_season_year_code', ['year', 'code'], { unique: true })
export class Season extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  code: string; // Ej: "SUMMER", "WINTER"

  @Column({ type: 'varchar', length: 100 })
  name: string; // Ej: "Verano 2026"

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string;
}

/**
 * Parámetro de Análisis (Descuentos)
 * Define los rangos y porcentajes de descuento para calidad
 * 8 tipos: Humedad, Granos Verdes, Impurezas, Vano, Hualcacho, Granos Manchados, Granos Pelados, Granos Yesosos
 */
@Entity('analysis_params')
@Index('idx_analysisparam_code_range', ['discountCode', 'rangeStart', 'rangeEnd'], { unique: true })
export class AnalysisParam extends BaseEntity {
  @Column({ type: 'int' })
  discountCode: number; // 1-8 para los 8 tipos de descuento

  @Column({ type: 'varchar', length: 100 })
  discountName: string; // Ej: "Humedad", "Granos Verdes"

  @Column({ type: 'varchar', length: 255 })
  unit: string; // Ej: "%", "°C"

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  rangeStart: number; // Ej: 14.0

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  rangeEnd: number; // Ej: 15.0

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  discountPercent: number; // % de descuento a aplicar

  @Column({ type: 'int', default: 0 })
  priority: number; // Orden de aplicación

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}

/**
 * Template/Plantilla de Análisis
 * Define qué parámetros se aplican a una recepción y sus configuraciones
 * Puede ser global (para todos) o específica de productor
 */
@Entity('templates')
export class Template extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string; // Ej: "Convenio Parral 2026"

  @Column({ type: 'int', nullable: true })
  producerId?: number; // FK a Producer (si es específica)

  @Column({ type: 'boolean', default: false })
  isDefault: boolean; // Es la plantilla por defecto

  @Column({ type: 'boolean', default: false })
  useToleranceGroup: boolean; // Activa grupo de tolerancia

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 5.0 })
  groupToleranceValue: number; // Máximo % de tolerancia grupal

  @Column({ type: 'varchar', length: 255, nullable: true })
  groupToleranceName?: string | null; // Nombre del grupo de tolerancia

  // ===== HUMEDAD (1) =====
  @Column({ type: 'boolean', default: true })
  availableHumedad: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  percentHumedad: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 2.0 })
  toleranceHumedad: number;

  @Column({ type: 'boolean', default: true })
  showToleranceHumedad: boolean;

  @Column({ type: 'boolean', default: false })
  groupToleranceHumedad: boolean;

  // ===== GRANOS VERDES (2) =====
  @Column({ type: 'boolean', default: true })
  availableGranosVerdes: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  percentGranosVerdes: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 2.0 })
  toleranceGranosVerdes: number;

  @Column({ type: 'boolean', default: true })
  showToleranceGranosVerdes: boolean;

  @Column({ type: 'boolean', default: false })
  groupToleranceGranosVerdes: boolean;

  // ===== IMPUREZAS (3) =====
  @Column({ type: 'boolean', default: true })
  availableImpurezas: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  percentImpurezas: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 2.0 })
  toleranceImpurezas: number;

  @Column({ type: 'boolean', default: true })
  showToleranceImpurezas: boolean;

  @Column({ type: 'boolean', default: false })
  groupToleranceImpurezas: boolean;

  // ===== VANO (9) =====
  @Column({ type: 'boolean', default: true })
  availableVano: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  percentVano: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 2.0 })
  toleranceVano: number;

  @Column({ type: 'boolean', default: true })
  showToleranceVano: boolean;

  @Column({ type: 'boolean', default: false })
  groupToleranceVano: boolean;

  // ===== HUALCACHO (10) =====
  @Column({ type: 'boolean', default: true })
  availableHualcacho: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  percentHualcacho: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 2.0 })
  toleranceHualcacho: number;

  @Column({ type: 'boolean', default: true })
  showToleranceHualcacho: boolean;

  @Column({ type: 'boolean', default: false })
  groupToleranceHualcacho: boolean;

  // ===== GRANOS MANCHADOS (11) =====
  @Column({ type: 'boolean', default: true })
  availableGranosManchados: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  percentGranosManchados: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 2.0 })
  toleranceGranosManchados: number;

  @Column({ type: 'boolean', default: true })
  showToleranceGranosManchados: boolean;

  @Column({ type: 'boolean', default: false })
  groupToleranceGranosManchados: boolean;

  // ===== GRANOS PELADOS (12) =====
  @Column({ type: 'boolean', default: true })
  availableGranosPelados: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  percentGranosPelados: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 2.0 })
  toleranceGranosPelados: number;

  @Column({ type: 'boolean', default: true })
  showToleranceGranosPelados: boolean;

  @Column({ type: 'boolean', default: false })
  groupToleranceGranosPelados: boolean;

  // ===== GRANOS YESOSOS (13) =====
  @Column({ type: 'boolean', default: true })
  availableGranosYesosos: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  percentGranosYesosos: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 2.0 })
  toleranceGranosYesosos: number;

  @Column({ type: 'boolean', default: true })
  showToleranceGranosYesosos: boolean;

  @Column({ type: 'boolean', default: false })
  groupToleranceGranosYesosos: boolean;

  // ===== BONIFICACIÓN & SECADO =====
  @Column({ type: 'boolean', default: true })
  availableBonus: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 3.0 })
  toleranceBonus: number;

  @Column({ type: 'boolean', default: false })
  availableDry: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 8.0 })
  percentDry: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
