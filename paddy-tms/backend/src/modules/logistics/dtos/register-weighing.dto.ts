import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsPositive,
  IsEnum,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { TruckReceptionStatus } from '../domain/truck-reception.entity';

export class RegisterWeighingDto {
  @IsUUID('4', { message: 'El ID de recepción debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID de recepción es requerido' })
  truck_reception_id: string;

  @IsEnum(TruckReceptionStatus, {
    message: `El estado debe ser uno de: ${Object.values(TruckReceptionStatus).join(', ')}`,
  })
  @IsNotEmpty({ message: 'El estado es requerido' })
  estado: TruckReceptionStatus;

  @ValidateIf((o) => o.estado === TruckReceptionStatus.PESANDO_BRUTO)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El peso debe ser numérico' })
  @IsPositive({ message: 'El peso debe ser positivo' })
  @IsNotEmpty({ message: 'El peso bruto es requerido para este estado' })
  peso_bruto?: number;

  @ValidateIf((o) => o.estado === TruckReceptionStatus.PESANDO_TARA)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El peso debe ser numérico' })
  @IsPositive({ message: 'El peso debe ser positivo' })
  @IsNotEmpty({ message: 'El peso tara es requerido para este estado' })
  peso_tara?: number;

  @IsString({ message: 'El número de ticket debe ser texto' })
  @IsOptional()
  numero_ticket?: string;

  @IsString({ message: 'La URL del PDF debe ser texto' })
  @IsOptional()
  pdf_url?: string;

  @IsOptional()
  created_by?: string;
}
