import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { TruckReception } from './truck-reception.entity';

@Entity('producers')
@Index(['rut'])
@Index(['nombre'])
export class Producer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, nullable: false, unique: true })
  rut: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  nombre: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  contacto: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  direccion: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @OneToMany(() => TruckReception, (reception) => reception.producer)
  truck_receptions: TruckReception[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date;
}
