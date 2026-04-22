import { IsEnum, IsNotEmpty } from 'class-validator';
import { TruckReceptionStatus } from '../domain/truck-reception.entity';

export class UpdateTruckStatusDto {
  @IsEnum(TruckReceptionStatus)
  @IsNotEmpty({ message: 'El estado es requerido' })
  status: TruckReceptionStatus;
}
