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

export enum TruckReceptionStatus {
  ESPERA = 'ESPERA',
  PESANDO_BRUTO = 'PESANDO_BRUTO',
  PESANDO_TARA = 'PESANDO_TARA',
  FINALIZADO = 'FINALIZADO',
}

@Entity('truck_receptions')
@Index(['numero_turno'])
@Index(['producer_id'])
@Index(['estado'])
@Index(['fecha_hora_entrada'])
export class TruckReception {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: false })
  numero_turno: number;

  @Column({ type: 'int', nullable: false })
  producer_id: number;

  @ManyToOne(() => Producer, { eager: true })
  @JoinColumn({ name: 'producer_id' })
  producer: Producer;

  @Column({ type: 'varchar', length: 50, nullable: false })
  patente: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  guia: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  chofer_nombre: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  rut_chofer: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  peso_bruto: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  peso_tara: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, default: null })
  peso_neto: number;

  @Column({
    type: 'enum',
    enum: TruckReceptionStatus,
    default: TruckReceptionStatus.ESPERA,
  })
  estado: TruckReceptionStatus;

  @CreateDateColumn()
  fecha_hora_entrada: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_hora_finalizacion: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  numero_ticket: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  pdf_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  created_by: string;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date;

  calculateNetWeight(): void {
    if (this.peso_bruto && this.peso_tara) {
      this.peso_neto = parseFloat((this.peso_bruto - this.peso_tara).toFixed(2));
    }
  }
}
