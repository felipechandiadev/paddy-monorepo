import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Length,
  IsOptional,
  IsPositive,
  IsEnum,
  ValidateIf,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LogisticsProduct } from '../domain/logistics-product.enum';
import { RECEPTION_TURNO_MAX, RECEPTION_TURNO_MIN } from '../domain/reception-turno.constants';

export class CreateTruckWithGrossWeightDto {
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

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El peso debe ser numérico' })
  @IsPositive({ message: 'El peso debe ser positivo' })
  @IsNotEmpty({ message: 'El peso bruto es requerido' })
  gross_weight: number;

  /**
   * Opcional: si se envía, debe ser menor que el bruto; la recepción queda FINISHED con neto calculado.
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El peso tara debe ser numérico' })
  @IsPositive({ message: 'El peso tara debe ser positivo' })
  tare_weight?: number;

  @IsEnum(LogisticsProduct, { message: 'Producto debe ser ARROZ_PADDY o CASCARILLA' })
  @IsNotEmpty({ message: 'El producto transportado es requerido' })
  product: LogisticsProduct;

  /**
   * Opcional en alta: el turno se asigna después (manual / tablero).
   * Si se envía, debe ser 1–100 y estar libre entre recepciones en ESPERA.
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El número de turno debe ser un entero' })
  @Min(RECEPTION_TURNO_MIN, {
    message: `El turno debe estar entre ${RECEPTION_TURNO_MIN} y ${RECEPTION_TURNO_MAX}`,
  })
  @Max(RECEPTION_TURNO_MAX, {
    message: `El turno debe estar entre ${RECEPTION_TURNO_MIN} y ${RECEPTION_TURNO_MAX}`,
  })
  numero_turno?: number;

  @IsOptional()
  created_by?: string;
}
