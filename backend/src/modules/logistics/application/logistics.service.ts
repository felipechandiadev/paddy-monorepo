import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TruckReception, TruckReceptionStatus } from '../domain/truck-reception.entity';
import { Producer } from '@modules/producers/domain/producer.entity';
import { CreateTruckDto } from '../dtos/create-truck.dto';
import { CreateTruckWithGrossWeightDto } from '../dtos/create-truck-with-gross-weight.dto';
import { RegisterWeighingDto } from '../dtos/register-weighing.dto';

@Injectable()
export class LogisticsService {
  private readonly logger = new Logger(LogisticsService.name);

  constructor(
    @InjectRepository(TruckReception)
    private readonly truckReceptionRepository: Repository<TruckReception>,
    @InjectRepository(Producer)
    private readonly producerRepository: Repository<Producer>,
  ) {}

  /**
   * Obtener el próximo número de turno para hoy
   */
  async getNextTurnoForToday(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastTurno = await this.truckReceptionRepository.findOne({
      where: {
        turno_date: today,
      },
      order: { numero_turno: 'DESC' },
    });

    return (lastTurno?.numero_turno || 0) + 1;
  }

  /**
   * Obtener todos los turnos de un día específico
   */
  async getTurnosByDate(date: Date): Promise<TruckReception[]> {
    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);

    return this.truckReceptionRepository.find({
      where: {
        turno_date: searchDate,
      },
      relations: ['producer'],
      order: { numero_turno: 'ASC' },
    });
  }

  /**
   * Crear recepción con peso bruto + asignar turno + pasar a ESPERA
   */
  async createTruckWithGrossWeight(
    createTruckDto: CreateTruckWithGrossWeightDto,
  ): Promise<TruckReception> {
    try {
      // Validar que el productor exista
      const producer = await this.producerRepository.findOne({
        where: { id: createTruckDto.producer_id },
      });

      if (!producer) {
        throw new NotFoundException(
          `Productor con ID ${createTruckDto.producer_id} no encontrado`,
        );
      }

      // Obtener siguiente turno
      const nextTurno = await this.getNextTurnoForToday();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Crear nueva recepción de camión
      const truckReception = this.truckReceptionRepository.create({
        ...createTruckDto,
        status: TruckReceptionStatus.ESPERA,
        numero_turno: nextTurno,
        turno_date: today,
        entry_at: new Date(),
        gross_weight: createTruckDto.gross_weight,
      });

      const saved = await this.truckReceptionRepository.save(truckReception);
      this.logger.log(
        `Camión registrado: ${saved.id} - Patente: ${saved.license_plate} - Turno: ${saved.numero_turno}`,
      );

      return saved;
    } catch (error) {
      this.logger.error(`Error al registrar camión: ${error.message}`);
      throw error;
    }
  }

  /**
   * Registrar peso tara y finalizar recepción
   */
  async registerTareWeight(
    registerWeighingDto: RegisterWeighingDto,
  ): Promise<TruckReception> {
    try {
      const { truck_reception_id, tare_weight } = registerWeighingDto;

      // Buscar la recepción del camión
      const truckReception = await this.truckReceptionRepository.findOne({
        where: { id: truck_reception_id },
      });

      if (!truckReception) {
        throw new NotFoundException(
          `Recepción de camión con ID ${truck_reception_id} no encontrada`,
        );
      }

      if (truckReception.status !== TruckReceptionStatus.ESPERA) {
        throw new BadRequestException(
          `Solo se puede registrar tara en estado ESPERA, estado actual: ${truckReception.status}`,
        );
      }

      if (!truckReception.gross_weight) {
        throw new BadRequestException(
          `No hay peso bruto registrado para este camión`,
        );
      }

      if (!tare_weight) {
        throw new BadRequestException(`El peso tara es requerido`);
      }

      // Registrar peso tara
      truckReception.tare_weight = tare_weight;

      // Calcular peso neto
      truckReception.calculateNetWeight();

      if (truckReception.net_weight <= 0) {
        throw new BadRequestException(`El peso neto debe ser mayor a 0`);
      }

      // Cambiar a FINISHED
      truckReception.status = TruckReceptionStatus.FINISHED;
      truckReception.finished_at = new Date();

      const saved = await this.truckReceptionRepository.save(truckReception);
      this.logger.log(
        `Recepción finalizada: ${truck_reception_id} - Turno: ${saved.numero_turno}`,
      );

      return saved;
    } catch (error) {
      this.logger.error(`Error al registrar peso tara: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtener recepción de camión por ID
   */
  async getTruckReceptionById(id: number): Promise<TruckReception> {
    const truckReception = await this.truckReceptionRepository.findOne({
      where: { id },
      relations: ['producer'],
    });

    if (!truckReception) {
      throw new NotFoundException(`Recepción de camión con ID ${id} no encontrada`);
    }

    return truckReception;
  }

  /**
   * Actualizar estado de camión
   */
  async updateTruckStatus(
    id: number,
    status: TruckReceptionStatus,
  ): Promise<TruckReception> {
    const truckReception = await this.getTruckReceptionById(id);
    
    truckReception.status = status;
    
    if (status === TruckReceptionStatus.FINISHED) {
      truckReception.finished_at = new Date();
    }

    const saved = await this.truckReceptionRepository.save(truckReception);
    this.logger.log(`Estado actualizado: ${id} - Nuevo estado: ${status}`);
    
    return saved;
  }

  /**
   * Obtener todas las recepciones de camiones
   */
  async getAllTruckReceptions(
    limit: number = 100,
    offset: number = 0,
  ): Promise<{ data: TruckReception[]; total: number }> {
    const [data, total] = await this.truckReceptionRepository.findAndCount({
      relations: ['producer'],
      take: limit,
      skip: offset,
      order: { entry_at: 'DESC' },
    });

    return { data, total };
  }

  /**
   * Obtener recepciones de camiones por productor
   */
  async getTruckReceptionsByProducerId(
    producerId: number,
    limit: number = 100,
    offset: number = 0,
  ): Promise<{ data: TruckReception[]; total: number }> {
    const [data, total] = await this.truckReceptionRepository.findAndCount({
      where: { producer_id: producerId },
      relations: ['producer'],
      take: limit,
      skip: offset,
      order: { entry_at: 'DESC' },
    });

    return { data, total };
  }

  /**
   * Obtener recepciones por estado
   */
  async getTruckReceptionsByStatus(
    status: TruckReceptionStatus,
    limit: number = 100,
    offset: number = 0,
  ): Promise<{ data: TruckReception[]; total: number }> {
    const [data, total] = await this.truckReceptionRepository.findAndCount({
      where: { status },
      relations: ['producer'],
      take: limit,
      skip: offset,
      order: { numero_turno: 'ASC' },
    });

    return { data, total };
  }

  /**
   * Actualizar recepción de camión
   */
  async updateTruckReception(
    id: number,
    updateData: Partial<TruckReception>,
  ): Promise<TruckReception> {
    const truckReception = await this.getTruckReceptionById(id);

    Object.assign(truckReception, updateData);
    const saved = await this.truckReceptionRepository.save(truckReception);

    this.logger.log(`Recepción de camión actualizada: ${id}`);
    return saved;
  }

  /**
   * Cancelar/eliminar recepción de camión
   */
  async cancelTruckReception(id: number): Promise<TruckReception> {
    const truckReception = await this.getTruckReceptionById(id);

    // Usar soft delete
    await this.truckReceptionRepository.softDelete(id);
    this.logger.log(`Recepción de camión cancelada: ${id}`);

    return truckReception;
  }

  /**
   * Obtener estadísticas de recepciones
   */
  async getReceptionStats(): Promise<any> {
    const total = await this.truckReceptionRepository.count();
    const finished = await this.truckReceptionRepository.count({
      where: { status: TruckReceptionStatus.FINISHED },
    });
    const espera = await this.truckReceptionRepository.count({
      where: { status: TruckReceptionStatus.ESPERA },
    });

    return {
      total,
      finished,
      espera,
    };
  }
}
