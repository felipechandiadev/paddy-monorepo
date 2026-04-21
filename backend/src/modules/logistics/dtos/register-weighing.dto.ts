import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsEnum,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { TruckReceptionStatus } from '../domain/truck-reception.entity';

export class RegisterWeighingDto {
  @IsNumber({}, { message: 'El ID de recepción debe ser un número válido' })
  @IsNotEmpty({ message: 'El ID de recepción es requerido' })
  truck_reception_id: number;

  @IsEnum(TruckReceptionStatus, {
    message: `El estado debe ser uno de: ${Object.values(TruckReceptionStatus).join(', ')}`,
  })
  @IsNotEmpty({ message: 'El estado es requerido' })
  status: TruckReceptionStatus;

  @ValidateIf((o) => o.status === TruckReceptionStatus.WEIGHING_GROSS)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El peso debe ser numérico' })
  @IsPositive({ message: 'El peso debe ser positivo' })
  @IsNotEmpty({ message: 'El peso bruto es requerido para este estado' })
  gross_weight?: number;

  @ValidateIf((o) => o.status === TruckReceptionStatus.WEIGHING_TARE)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El peso debe ser numérico' })
  @IsPositive({ message: 'El peso debe ser positivo' })
  @IsNotEmpty({ message: 'El peso tara es requerido para este estado' })
  tare_weight?: number;

  @IsOptional()
  created_by?: string;
}

