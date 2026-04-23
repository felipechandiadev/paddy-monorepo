import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { RECEPTION_TURNO_MAX, RECEPTION_TURNO_MIN } from '../domain/reception-turno.constants';

export class UpdateTruckReceptionDto {
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
}
