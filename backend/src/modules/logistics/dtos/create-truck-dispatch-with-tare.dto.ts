import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Length,
  IsOptional,
  IsPositive,
  IsEnum,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LogisticsProduct } from '../domain/logistics-product.enum';

/** Alta de despacho: solo tara; el bruto se registra después al finalizar. */
export class CreateTruckDispatchWithTareDto {
  @IsNumber({}, { message: 'El ID del productor debe ser un número válido' })
  @IsNotEmpty({ message: 'El ID del productor es requerido' })
  producer_id: number;

  @IsString({ message: 'La patente debe ser texto' })
  @IsNotEmpty({ message: 'La patente es requerida' })
  @Length(3, 50, { message: 'La patente debe tener entre 3 y 50 caracteres' })
  license_plate: string;

  @IsOptional()
  @ValidateIf((_, v) => v != null && String(v).trim() !== '')
  @IsString({ message: 'El nombre del chofer debe ser texto' })
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
  driver_name?: string;

  @IsString({ message: 'La empresa de transporte debe ser texto' })
  @IsOptional()
  @Length(0, 100, { message: 'La empresa debe tener máximo 100 caracteres' })
  carrier_company?: string;

  @IsString({ message: 'La guía de despacho debe ser texto' })
  @IsOptional()
  @Length(0, 100, { message: 'La guía debe tener máximo 100 caracteres' })
  dispatch_guide?: string;

  @IsOptional()
  @ValidateIf((_, v) => v != null && String(v).trim() !== '')
  @IsString({ message: 'Las notas deben ser texto' })
  @Length(0, 2000, { message: 'Las notas deben tener máximo 2000 caracteres' })
  notes?: string;

  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El peso tara debe ser numérico' },
  )
  @IsPositive({ message: 'El peso tara debe ser positivo' })
  @IsNotEmpty({ message: 'El peso tara es requerido' })
  tare_weight: number;

  @IsEnum(LogisticsProduct, { message: 'Producto debe ser ARROZ_PADDY o CASCARILLA' })
  @IsNotEmpty({ message: 'El producto transportado es requerido' })
  product: LogisticsProduct;

  @IsOptional()
  created_by?: string;
}
