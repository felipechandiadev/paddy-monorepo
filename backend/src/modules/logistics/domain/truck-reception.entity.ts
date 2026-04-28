import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Producer } from '@modules/producers/domain/producer.entity';
import { LogisticsProduct } from './logistics-product.enum';

export enum TruckReceptionStatus {
  ESPERA = 'ESPERA',
  FINISHED = 'FINISHED',
}

@Entity('truck_receptions')
@Index(['producer_id'])
@Index(['status'])
@Index(['entry_at'])
@Index(['turno_date'])
export class TruckReception {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'enum',
    enum: TruckReceptionStatus,
    default: TruckReceptionStatus.ESPERA,
  })
  status: TruckReceptionStatus;

  @Column({ type: 'int', nullable: true })
  numero_turno: number | null;

  @Column({ type: 'date', nullable: true })
  turno_date: Date;

  @Column({ type: 'int', nullable: false })
  producer_id: number;

  @ManyToOne(() => Producer, { eager: true })
  @JoinColumn({ name: 'producer_id' })
  producer: Producer;

  @Column({
    type: 'enum',
    enum: LogisticsProduct,
    default: LogisticsProduct.ARROZ_PADDY,
  })
  product: LogisticsProduct;

  @Column({ type: 'varchar', length: 50, nullable: false })
  license_plate: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  driver_name: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  carrier_company: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  dispatch_guide: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  gross_weight: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  tare_weight: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  net_weight: number;

  @Column({ type: 'timestamp', nullable: false })
  entry_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  finished_at: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  created_by: string;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date;

  calculateNetWeight(): void {
    if (this.gross_weight && this.tare_weight) {
      this.net_weight = parseFloat((this.gross_weight - this.tare_weight).toFixed(2));
    }
  }
}

