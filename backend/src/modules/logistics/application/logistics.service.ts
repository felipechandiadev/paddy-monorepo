import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TruckReception, TruckReceptionStatus } from '../domain/truck-reception.entity';
import { Producer } from '@modules/producers/domain/producer.entity';
import { CreateTruckDto } from '../dtos/create-truck.dto';
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
   * Registrar un nuevo camión
   */
  async createTruckReception(
    createTruckDto: CreateTruckDto,
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

      // Crear nueva recepción de camión
      const truckReception = this.truckReceptionRepository.create({
        ...createTruckDto,
        status: TruckReceptionStatus.WEIGHING_GROSS,
        entry_at: new Date(),
      });

      const saved = await this.truckReceptionRepository.save(truckReception);
      this.logger.log(
        `Camión registrado: ${saved.id} - Patente: ${saved.license_plate}`,
      );

      return saved;
    } catch (error) {
      this.logger.error(`Error al registrar camión: ${error.message}`);
      throw error;
    }
  }

  /**
   * Registrar pesaje (bruto o tara)
   */
  async registerWeighing(
    registerWeighingDto: RegisterWeighingDto,
  ): Promise<TruckReception> {
    try {
      const { truck_reception_id, status, gross_weight, tare_weight } =
        registerWeighingDto;

      // Buscar la recepción del camión
      const truckReception = await this.truckReceptionRepository.findOne({
        where: { id: truck_reception_id },
      });

      if (!truckReception) {
        throw new NotFoundException(
          `Recepción de camión con ID ${truck_reception_id} no encontrada`,
        );
      }

      // Actualizar estado y pesos según corresponda
      if (status === TruckReceptionStatus.WEIGHING_GROSS && gross_weight) {
        truckReception.gross_weight = gross_weight;
        truckReception.status = TruckReceptionStatus.WEIGHING_GROSS;
      } else if (status === TruckReceptionStatus.WEIGHING_TARE && tare_weight) {
        truckReception.tare_weight = tare_weight;
        truckReception.status = TruckReceptionStatus.WEIGHING_TARE;

        // Calcular peso neto
        truckReception.calculateNetWeight();

        // Si ambos pesos están disponibles, cambiar a finalizado
        if (
          truckReception.gross_weight &&
          truckReception.tare_weight &&
          truckReception.net_weight > 0
        ) {
          truckReception.status = TruckReceptionStatus.FINISHED;
          truckReception.finished_at = new Date();
        }
      }

      const saved = await this.truckReceptionRepository.save(truckReception);
      this.logger.log(
        `Pesaje registrado para camión: ${truck_reception_id} - Estado: ${status}`,
      );

      return saved;
    } catch (error) {
      this.logger.error(`Error al registrar pesaje: ${error.message}`);
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
      order: { entry_at: 'DESC' },
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
    const weighingGross = await this.truckReceptionRepository.count({
      where: { status: TruckReceptionStatus.WEIGHING_GROSS },
    });
    const weighingTare = await this.truckReceptionRepository.count({
      where: { status: TruckReceptionStatus.WEIGHING_TARE },
    });

    return {
      total,
      finished,
      weighingGross,
      weighingTare,
    };
  }
}
