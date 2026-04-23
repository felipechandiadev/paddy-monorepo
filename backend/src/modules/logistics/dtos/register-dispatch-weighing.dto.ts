import {
  IsNumber,
  IsNotEmpty,
  IsPositive,
  IsEnum,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { TruckReceptionStatus } from '../domain/truck-reception.entity';

export class RegisterDispatchWeighingDto {
  @IsNumber({}, { message: 'El ID de despacho debe ser un número válido' })
  @IsNotEmpty({ message: 'El ID de despacho es requerido' })
  truck_dispatch_id: number;

  @IsEnum(TruckReceptionStatus, {
    message: `El estado debe ser uno de: ${Object.values(TruckReceptionStatus).join(', ')}`,
  })
  @IsNotEmpty({ message: 'El estado es requerido' })
  status: TruckReceptionStatus;

  @ValidateIf((o) => o.status === TruckReceptionStatus.FINISHED)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El peso debe ser numérico' })
  @IsPositive({ message: 'El peso debe ser positivo' })
  @IsNotEmpty({ message: 'El peso tara es requerido para finalizar' })
  tare_weight?: number;

  @IsOptional()
  created_by?: string;
}
