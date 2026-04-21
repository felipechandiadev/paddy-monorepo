import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Length,
  IsOptional,
} from 'class-validator';

export class CreateTruckDto {
  @IsNumber({}, { message: 'El ID del productor debe ser un número válido' })
  @IsNotEmpty({ message: 'El ID del productor es requerido' })
  producer_id: number;

  @IsString({ message: 'La patente debe ser texto' })
  @IsNotEmpty({ message: 'La patente es requerida' })
  @Length(3, 50, { message: 'La patente debe tener entre 3 y 50 caracteres' })
  license_plate: string;

  @IsString({ message: 'El nombre del chofer debe ser texto' })
  @IsNotEmpty({ message: 'El nombre del chofer es requerido' })
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
  driver_name: string;

  @IsString({ message: 'La empresa de transporte debe ser texto' })
  @IsOptional()
  @Length(0, 100, { message: 'La empresa debe tener máximo 100 caracteres' })
  carrier_company?: string;

  @IsString({ message: 'La guía de despacho debe ser texto' })
  @IsOptional()
  @Length(0, 100, { message: 'La guía debe tener máximo 100 caracteres' })
  dispatch_guide?: string;

  @IsOptional()
  created_by?: string;
}

