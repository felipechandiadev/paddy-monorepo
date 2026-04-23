import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TruckReception, TruckReceptionStatus } from '../domain/truck-reception.entity';
import { TruckDispatch } from '../domain/truck-dispatch.entity';
import { LogisticsProduct } from '../domain/logistics-product.enum';
import { Producer } from '@modules/producers/domain/producer.entity';
import { CreateTruckDto } from '../dtos/create-truck.dto';
import { CreateTruckWithGrossWeightDto } from '../dtos/create-truck-with-gross-weight.dto';
import { RegisterWeighingDto } from '../dtos/register-weighing.dto';
import { RegisterDispatchWeighingDto } from '../dtos/register-dispatch-weighing.dto';
import { LogisticsGateway } from './logistics.gateway';
import {
  RECEPTION_TURNO_MAX,
  RECEPTION_TURNO_MIN,
} from '../domain/reception-turno.constants';

@Injectable()
export class LogisticsService {
  private readonly logger = new Logger(LogisticsService.name);

  constructor(
    @InjectRepository(TruckReception)
    private readonly truckReceptionRepository: Repository<TruckReception>,
    @InjectRepository(TruckDispatch)
    private readonly truckDispatchRepository: Repository<TruckDispatch>,
    @InjectRepository(Producer)
    private readonly producerRepository: Repository<Producer>,
    @Inject(forwardRef(() => LogisticsGateway))
    private readonly logisticsGateway: LogisticsGateway,
  ) {}

  /**
   * Primer cupo libre (1–100) entre recepciones en ESPERA (sin reinicio diario).
   */
  async getNextTurnoForToday(): Promise<number> {
    const free = await this.getFirstFreeReceptionTurno();
    if (free === null) {
      throw new BadRequestException(
        `No hay cupos de turno libres (${RECEPTION_TURNO_MIN}–${RECEPTION_TURNO_MAX})`,
      );
    }
    return free;
  }

  async getNextTurnoForTodayDispatches(): Promise<number> {
    const free = await this.getFirstFreeDispatchTurno();
    if (free === null) {
      throw new BadRequestException(
        `No hay cupos de turno libres para despacho (${RECEPTION_TURNO_MIN}–${RECEPTION_TURNO_MAX})`,
      );
    }
    return free;
  }

  private async getFirstFreeReceptionTurno(): Promise<number | null> {
    const rows = await this.truckReceptionRepository.find({
      where: { status: TruckReceptionStatus.ESPERA },
      select: ['numero_turno'],
    });
    const taken = new Set(
      rows
        .map((r) => r.numero_turno)
        .filter((n) => n != null && n >= RECEPTION_TURNO_MIN && n <= RECEPTION_TURNO_MAX),
    );
    for (let n = RECEPTION_TURNO_MIN; n <= RECEPTION_TURNO_MAX; n++) {
      if (!taken.has(n)) {
        return n;
      }
    }
    return null;
  }

  private async getFirstFreeDispatchTurno(): Promise<number | null> {
    const rows = await this.truckDispatchRepository.find({
      where: { status: TruckReceptionStatus.ESPERA },
      select: ['numero_turno'],
    });
    const taken = new Set(
      rows
        .map((r) => r.numero_turno)
        .filter((n) => n != null && n >= RECEPTION_TURNO_MIN && n <= RECEPTION_TURNO_MAX),
    );
    for (let n = RECEPTION_TURNO_MIN; n <= RECEPTION_TURNO_MAX; n++) {
      if (!taken.has(n)) {
        return n;
      }
    }
    return null;
  }

  private assertTurnoInRange(numero: number): void {
    if (
      !Number.isInteger(numero) ||
      numero < RECEPTION_TURNO_MIN ||
      numero > RECEPTION_TURNO_MAX
    ) {
      throw new BadRequestException(
        `El turno debe ser un entero entre ${RECEPTION_TURNO_MIN} y ${RECEPTION_TURNO_MAX}`,
      );
    }
  }

  private async assertReceptionTurnoAvailable(
    numero: number,
    excludeTruckId?: number,
  ): Promise<void> {
    this.assertTurnoInRange(numero);
    const conflict = await this.truckReceptionRepository.findOne({
      where: {
        status: TruckReceptionStatus.ESPERA,
        numero_turno: numero,
      },
    });
    if (
      conflict &&
      (excludeTruckId == null || Number(conflict.id) !== Number(excludeTruckId))
    ) {
      throw new BadRequestException(
        `El turno ${numero} ya está asignado a otra recepción en espera`,
      );
    }
  }

  private async assertDispatchTurnoAvailable(
    numero: number,
    excludeTruckId?: number,
  ): Promise<void> {
    this.assertTurnoInRange(numero);
    const conflict = await this.truckDispatchRepository.findOne({
      where: {
        status: TruckReceptionStatus.ESPERA,
        numero_turno: numero,
      },
    });
    if (
      conflict &&
      (excludeTruckId == null || Number(conflict.id) !== Number(excludeTruckId))
    ) {
      throw new BadRequestException(
        `El turno ${numero} ya está asignado a otro despacho en espera`,
      );
    }
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

  async getDispatchTurnosByDate(date: Date): Promise<TruckDispatch[]> {
    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);

    return this.truckDispatchRepository.find({
      where: { turno_date: searchDate },
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

      let numeroTurno: number | null = null;
      if (
        createTruckDto.numero_turno !== undefined &&
        createTruckDto.numero_turno !== null
      ) {
        await this.assertReceptionTurnoAvailable(createTruckDto.numero_turno);
        numeroTurno = createTruckDto.numero_turno;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const driverName =
        createTruckDto.driver_name != null &&
        String(createTruckDto.driver_name).trim() !== ''
          ? String(createTruckDto.driver_name).trim()
          : null;

      // Crear nueva recepción de camión
      const truckReception = this.truckReceptionRepository.create({
        producer_id: createTruckDto.producer_id,
        license_plate: createTruckDto.license_plate,
        driver_name: driverName,
        carrier_company: createTruckDto.carrier_company,
        dispatch_guide: createTruckDto.dispatch_guide,
        gross_weight: createTruckDto.gross_weight,
        product: createTruckDto.product ?? LogisticsProduct.ARROZ_PADDY,
        created_by: createTruckDto.created_by,
        status: TruckReceptionStatus.ESPERA,
        numero_turno: numeroTurno,
        turno_date: today,
        entry_at: new Date(),
      });

      const saved = await this.truckReceptionRepository.save(truckReception);
      this.logger.log(
        `Camión registrado: ${saved.id} - Patente: ${saved.license_plate} - Turno: ${saved.numero_turno}`,
      );

      void this.logisticsGateway.broadcastMonitorState();

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

      await this.truckReceptionRepository.save(truckReception);
      this.logger.log(
        `Recepción finalizada: ${truck_reception_id} - Turno: ${truckReception.numero_turno}`,
      );

      this.logisticsGateway.clearWeighingIfMatches(truck_reception_id);
      void this.logisticsGateway.broadcastMonitorState();

      const withProducer = await this.truckReceptionRepository.findOne({
        where: { id: truck_reception_id },
        relations: ['producer'],
      });
      return withProducer ?? truckReception;
    } catch (error) {
      this.logger.error(`Error al registrar peso tara: ${error.message}`);
      throw error;
    }
  }

  async createTruckDispatchWithGrossWeight(
    createTruckDto: CreateTruckWithGrossWeightDto,
  ): Promise<TruckDispatch> {
    try {
      const producer = await this.producerRepository.findOne({
        where: { id: createTruckDto.producer_id },
      });

      if (!producer) {
        throw new NotFoundException(
          `Productor con ID ${createTruckDto.producer_id} no encontrado`,
        );
      }

      let numeroTurno: number | null = null;
      if (
        createTruckDto.numero_turno !== undefined &&
        createTruckDto.numero_turno !== null
      ) {
        await this.assertDispatchTurnoAvailable(createTruckDto.numero_turno);
        numeroTurno = createTruckDto.numero_turno;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const driverName =
        createTruckDto.driver_name != null &&
        String(createTruckDto.driver_name).trim() !== ''
          ? String(createTruckDto.driver_name).trim()
          : null;

      const truckDispatch = this.truckDispatchRepository.create({
        producer_id: createTruckDto.producer_id,
        license_plate: createTruckDto.license_plate,
        driver_name: driverName,
        carrier_company: createTruckDto.carrier_company,
        dispatch_guide: createTruckDto.dispatch_guide,
        gross_weight: createTruckDto.gross_weight,
        product: createTruckDto.product ?? LogisticsProduct.ARROZ_PADDY,
        created_by: createTruckDto.created_by,
        status: TruckReceptionStatus.ESPERA,
        numero_turno: numeroTurno,
        turno_date: today,
        entry_at: new Date(),
      });

      const saved = await this.truckDispatchRepository.save(truckDispatch);
      this.logger.log(
        `Despacho registrado: ${saved.id} - Patente: ${saved.license_plate} - Turno: ${saved.numero_turno}`,
      );

      void this.logisticsGateway.broadcastMonitorState();

      return saved;
    } catch (error) {
      this.logger.error(`Error al registrar despacho: ${error.message}`);
      throw error;
    }
  }

  async registerDispatchTareWeight(
    registerDto: RegisterDispatchWeighingDto,
  ): Promise<TruckDispatch> {
    try {
      const { truck_dispatch_id, tare_weight, status } = registerDto;

      if (status !== TruckReceptionStatus.FINISHED) {
        throw new BadRequestException(
          `Solo se admite finalizar despacho con estado FINISHED (recibido: ${status})`,
        );
      }

      const truckDispatch = await this.truckDispatchRepository.findOne({
        where: { id: truck_dispatch_id },
      });

      if (!truckDispatch) {
        throw new NotFoundException(
          `Despacho de camión con ID ${truck_dispatch_id} no encontrado`,
        );
      }

      if (truckDispatch.status !== TruckReceptionStatus.ESPERA) {
        throw new BadRequestException(
          `Solo se puede registrar tara en estado ESPERA, estado actual: ${truckDispatch.status}`,
        );
      }

      if (!truckDispatch.gross_weight) {
        throw new BadRequestException(`No hay peso bruto registrado para este despacho`);
      }

      if (!tare_weight) {
        throw new BadRequestException(`El peso tara es requerido`);
      }

      truckDispatch.tare_weight = tare_weight;
      truckDispatch.calculateNetWeight();

      if (truckDispatch.net_weight <= 0) {
        throw new BadRequestException(`El peso neto debe ser mayor a 0`);
      }

      truckDispatch.status = TruckReceptionStatus.FINISHED;
      truckDispatch.finished_at = new Date();

      await this.truckDispatchRepository.save(truckDispatch);
      this.logger.log(
        `Despacho finalizado: ${truck_dispatch_id} - Turno: ${truckDispatch.numero_turno}`,
      );

      void this.logisticsGateway.broadcastMonitorState();

      const withProducer = await this.truckDispatchRepository.findOne({
        where: { id: truck_dispatch_id },
        relations: ['producer'],
      });
      return withProducer ?? truckDispatch;
    } catch (error) {
      this.logger.error(`Error al registrar tara despacho: ${error.message}`);
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

  async getTruckDispatchById(id: number): Promise<TruckDispatch> {
    const row = await this.truckDispatchRepository.findOne({
      where: { id },
      relations: ['producer'],
    });

    if (!row) {
      throw new NotFoundException(`Despacho de camión con ID ${id} no encontrado`);
    }

    return row;
  }

  async getAllTruckDispatches(
    limit: number = 100,
    offset: number = 0,
  ): Promise<{ data: TruckDispatch[]; total: number }> {
    const [data, total] = await this.truckDispatchRepository.findAndCount({
      relations: ['producer'],
      take: limit,
      skip: offset,
      order: { entry_at: 'DESC' },
    });

    return { data, total };
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
    updateData: Partial<TruckReception> & { numero_turno?: number },
  ): Promise<TruckReception> {
    const truckReception = await this.getTruckReceptionById(id);

    if (updateData.numero_turno !== undefined) {
      if (updateData.numero_turno === null) {
        throw new BadRequestException(
          'numero_turno no puede ser nulo; envíe un entero entre 1 y 100',
        );
      }
      const n = Number(updateData.numero_turno);
      if (!Number.isInteger(n) || !Number.isFinite(n)) {
        throw new BadRequestException(
          'numero_turno debe ser un número entero',
        );
      }
      if (truckReception.status !== TruckReceptionStatus.ESPERA) {
        throw new BadRequestException(
          'Solo se puede cambiar el turno en recepciones en espera',
        );
      }
      await this.assertReceptionTurnoAvailable(n, id);
      truckReception.numero_turno = n;
    }

    const saved = await this.truckReceptionRepository.save(truckReception);

    this.logger.log(`Recepción de camión actualizada: ${id}`);
    void this.logisticsGateway.broadcastMonitorState();
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
