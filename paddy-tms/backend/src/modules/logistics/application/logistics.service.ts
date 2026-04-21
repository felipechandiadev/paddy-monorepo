import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TruckReception, TruckReceptionStatus } from '../domain/truck-reception.entity';
import { Producer } from '../domain/producer.entity';
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
        estado: TruckReceptionStatus.ESPERA,
      });

      const saved = await this.truckReceptionRepository.save(truckReception);
      this.logger.log(
        `Camión registrado: ${saved.id} - Patente: ${saved.patente}`,
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
      const { truck_reception_id, estado, peso_bruto, peso_tara } =
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
      if (estado === TruckReceptionStatus.PESANDO_BRUTO && peso_bruto) {
        truckReception.peso_bruto = peso_bruto;
        truckReception.fecha_hora_peso_bruto = new Date();
        truckReception.estado = TruckReceptionStatus.PESANDO_BRUTO;
      } else if (estado === TruckReceptionStatus.PESANDO_TARA && peso_tara) {
        truckReception.peso_tara = peso_tara;
        truckReception.fecha_hora_peso_tara = new Date();
        truckReception.estado = TruckReceptionStatus.PESANDO_TARA;

        // Calcular peso neto
        truckReception.calculateNetWeight();

        // Si ambos pesos están disponibles, cambiar a finalizado
        if (
          truckReception.peso_bruto &&
          truckReception.peso_tara &&
          truckReception.peso_neto > 0
        ) {
          truckReception.estado = TruckReceptionStatus.FINALIZADO;
          truckReception.fecha_hora_finalizacion = new Date();
        }
      }

      // Agregar ticket y URL si están disponibles
      if (registerWeighingDto.numero_ticket) {
        truckReception.numero_ticket = registerWeighingDto.numero_ticket;
      }
      if (registerWeighingDto.pdf_url) {
        truckReception.pdf_url = registerWeighingDto.pdf_url;
      }

      const saved = await this.truckReceptionRepository.save(truckReception);
      this.logger.log(
        `Pesaje registrado para camión: ${truck_reception_id} - Estado: ${estado}`,
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
  async getTruckReceptionById(id: string): Promise<TruckReception> {
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
      order: { fecha_hora_entrada: 'DESC' },
    });

    return { data, total };
  }

  /**
   * Obtener recepciones de camiones por productor
   */
  async getTruckReceptionsByProducerId(
    producerId: string,
    limit: number = 100,
    offset: number = 0,
  ): Promise<{ data: TruckReception[]; total: number }> {
    const [data, total] = await this.truckReceptionRepository.findAndCount({
      where: { producer_id: producerId },
      relations: ['producer'],
      take: limit,
      skip: offset,
      order: { fecha_hora_entrada: 'DESC' },
    });

    return { data, total };
  }

  /**
   * Obtener recepciones por estado
   */
  async getTruckReceptionsByStatus(
    estado: TruckReceptionStatus,
    limit: number = 100,
    offset: number = 0,
  ): Promise<{ data: TruckReception[]; total: number }> {
    const [data, total] = await this.truckReceptionRepository.findAndCount({
      where: { estado },
      relations: ['producer'],
      take: limit,
      skip: offset,
      order: { fecha_hora_entrada: 'DESC' },
    });

    return { data, total };
  }

  /**
   * Actualizar recepción de camión
   */
  async updateTruckReception(
    id: string,
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
  async cancelTruckReception(id: string): Promise<TruckReception> {
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
    const finalizadas = await this.truckReceptionRepository.count({
      where: { estado: TruckReceptionStatus.FINALIZADO },
    });
    const enEspera = await this.truckReceptionRepository.count({
      where: { estado: TruckReceptionStatus.ESPERA },
    });
    const pesando = await this.truckReceptionRepository.count({
      where: { estado: TruckReceptionStatus.PESANDO_BRUTO },
    });

    return {
      total,
      finalizadas,
      enEspera,
      pesando,
    };
  }
}
