import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LogisticsProduct } from '../domain/logistics-product.enum';

/** Actualización de despacho (sin turno). Pesaje: tara primero, bruto después. */
export class UpdateTruckDispatchDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El ID del productor debe ser un entero' })
  @IsPositive({ message: 'El ID del productor debe ser positivo' })
  producer_id?: number;

  @IsOptional()
  @IsString({ message: 'La patente debe ser texto' })
  @Length(3, 50, { message: 'La patente debe tener entre 3 y 50 caracteres' })
  license_plate?: string;

  @IsOptional()
  @ValidateIf((_, v) => v != null && String(v).trim() !== '')
  @IsString({ message: 'El nombre del chofer debe ser texto' })
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
  driver_name?: string | null;

  @IsOptional()
  @IsString({ message: 'La empresa de transporte debe ser texto' })
  @Length(0, 100, { message: 'La empresa debe tener máximo 100 caracteres' })
  carrier_company?: string;

  @IsOptional()
  @IsString({ message: 'La guía de despacho debe ser texto' })
  @Length(0, 100, { message: 'La guía debe tener máximo 100 caracteres' })
  dispatch_guide?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El peso debe ser numérico' })
  @IsPositive({ message: 'El peso debe ser positivo' })
  gross_weight?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El peso tara debe ser numérico' })
  @IsPositive({ message: 'El peso tara debe ser positivo' })
  tare_weight?: number;

  @IsOptional()
  @IsEnum(LogisticsProduct, { message: 'Producto debe ser ARROZ_PADDY o CASCARILLA' })
  product?: LogisticsProduct;

  @IsOptional()
  @ValidateIf((_, v) => v != null && String(v).trim() !== '')
  @IsString({ message: 'Las notas deben ser texto' })
  @Length(0, 2000, { message: 'Las notas deben tener máximo 2000 caracteres' })
  notes?: string | null;
}
