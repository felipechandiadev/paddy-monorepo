import {
  IsString,
  IsNotEmpty,
  IsUUID,
  Length,
  Matches,
  IsOptional,
} from 'class-validator';

export class CreateTruckDto {
  @IsNotEmpty({ message: 'El número de turno es requerido' })
  numero_turno: number;

  @IsUUID('4', { message: 'El ID del productor debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del productor es requerido' })
  producer_id: string;

  @IsString({ message: 'La patente debe ser texto' })
  @IsNotEmpty({ message: 'La patente es requerida' })
  @Length(3, 50, { message: 'La patente debe tener entre 3 y 50 caracteres' })
  patente: string;

  @IsString({ message: 'La guía debe ser texto' })
  @IsOptional()
  @Length(0, 100, { message: 'La guía debe tener máximo 100 caracteres' })
  guia?: string;

  @IsString({ message: 'El nombre del chofer debe ser texto' })
  @IsNotEmpty({ message: 'El nombre del chofer es requerido' })
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
  chofer_nombre: string;

  @IsString({ message: 'El RUT debe ser texto' })
  @IsNotEmpty({ message: 'El RUT del chofer es requerido' })
  @Matches(/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/, {
    message: 'El RUT debe tener formato válido (ej: 12.345.678-9)',
  })
  rut_chofer: string;

  @IsOptional()
  created_by?: string;
}
