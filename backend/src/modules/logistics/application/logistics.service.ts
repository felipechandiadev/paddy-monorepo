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
import { CreateTruckDispatchWithTareDto } from '../dtos/create-truck-dispatch-with-tare.dto';
import { RegisterDispatchGrossWeightDto } from '../dtos/register-dispatch-gross-weight.dto';
import { UpdateTruckReceptionDto } from '../dtos/update-truck-reception.dto';
import { UpdateTruckDispatchDto } from '../dtos/update-truck-dispatch.dto';
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

  /**
   * Cola de pesaje despacho: hoy, ESPERA, con tara y sin bruto (orden de llegada).
   */
  async getDispatchTurnosByDate(date: Date): Promise<TruckDispatch[]> {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return this.truckDispatchRepository
      .createQueryBuilder('td')
      .leftJoinAndSelect('td.producer', 'producer')
      .where('td.status = :st', { st: TruckReceptionStatus.ESPERA })
      .andWhere('td.tare_weight IS NOT NULL')
      .andWhere('td.gross_weight IS NULL')
      .andWhere('td.entry_at >= :start AND td.entry_at < :end', { start, end })
      .orderBy('td.entry_at', 'ASC')
      .getMany();
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

      if (createTruckDto.tare_weight != null) {
        const tw = Number(createTruckDto.tare_weight);
        if (!Number.isFinite(tw) || tw <= 0) {
          throw new BadRequestException('Peso tara inválido');
        }
        if (tw >= createTruckDto.gross_weight) {
          throw new BadRequestException(
            'El peso tara debe ser menor al peso bruto',
          );
        }
        truckReception.tare_weight = tw;
        truckReception.calculateNetWeight();
        if (
          truckReception.net_weight == null ||
          Number(truckReception.net_weight) <= 0
        ) {
          throw new BadRequestException('El peso neto debe ser mayor a 0');
        }
        truckReception.status = TruckReceptionStatus.FINISHED;
        truckReception.finished_at = new Date();
      }

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

  async createTruckDispatchWithTare(
    dto: CreateTruckDispatchWithTareDto,
  ): Promise<TruckDispatch> {
    try {
      const producer = await this.producerRepository.findOne({
        where: { id: dto.producer_id },
      });

      if (!producer) {
        throw new NotFoundException(
          `Productor con ID ${dto.producer_id} no encontrado`,
        );
      }

      const tw = Number(dto.tare_weight);
      if (!Number.isFinite(tw) || tw <= 0) {
        throw new BadRequestException('Peso tara inválido');
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const driverName =
        dto.driver_name != null && String(dto.driver_name).trim() !== ''
          ? String(dto.driver_name).trim()
          : null;

      const truckDispatch = this.truckDispatchRepository.create({
        producer_id: dto.producer_id,
        license_plate: dto.license_plate,
        driver_name: driverName,
        carrier_company: dto.carrier_company ?? undefined,
        dispatch_guide: dto.dispatch_guide ?? undefined,
        tare_weight: tw,
        product: dto.product ?? LogisticsProduct.ARROZ_PADDY,
        created_by: dto.created_by,
        status: TruckReceptionStatus.ESPERA,
        numero_turno: null,
        turno_date: today,
        entry_at: new Date(),
      });

      const saved = await this.truckDispatchRepository.save(truckDispatch);
      this.logger.log(
        `Despacho (tara): ${saved.id} - Patente: ${saved.license_plate}`,
      );

      void this.logisticsGateway.broadcastMonitorState();

      return saved;
    } catch (error) {
      this.logger.error(`Error al registrar despacho con tara: ${error.message}`);
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
   * Paso 2 despacho (tara primero): registrar bruto y finalizar. net = bruto - tara.
   */
  async registerDispatchGrossWeight(
    registerDto: RegisterDispatchGrossWeightDto,
  ): Promise<TruckDispatch> {
    try {
      const { truck_dispatch_id, gross_weight, status } = registerDto;

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
          `Solo se puede registrar bruto en estado ESPERA, estado actual: ${truckDispatch.status}`,
        );
      }

      if (
        truckDispatch.tare_weight == null ||
        Number(truckDispatch.tare_weight) <= 0
      ) {
        throw new BadRequestException(
          'No hay peso tara registrado para este despacho',
        );
      }

      const existingGross =
        truckDispatch.gross_weight != null
          ? Number(truckDispatch.gross_weight)
          : NaN;
      if (Number.isFinite(existingGross) && existingGross > 0) {
        throw new BadRequestException(
          'Este despacho ya tiene peso bruto registrado',
        );
      }

      if (gross_weight == null) {
        throw new BadRequestException('El peso bruto es requerido');
      }

      const gw = Number(gross_weight);
      const tw = Number(truckDispatch.tare_weight);
      if (!Number.isFinite(gw) || gw <= tw) {
        throw new BadRequestException(
          'El peso bruto debe ser mayor que la tara',
        );
      }

      truckDispatch.gross_weight = gw;
      truckDispatch.calculateNetWeight();

      if (
        truckDispatch.net_weight == null ||
        Number(truckDispatch.net_weight) <= 0
      ) {
        throw new BadRequestException('El peso neto debe ser mayor a 0');
      }

      truckDispatch.status = TruckReceptionStatus.FINISHED;
      truckDispatch.finished_at = new Date();

      await this.truckDispatchRepository.save(truckDispatch);
      this.logger.log(`Despacho finalizado (bruto): ${truck_dispatch_id}`);

      void this.logisticsGateway.broadcastMonitorState();

      const withProducer = await this.truckDispatchRepository.findOne({
        where: { id: truck_dispatch_id },
        relations: ['producer'],
      });
      return withProducer ?? truckDispatch;
    } catch (error) {
      this.logger.error(`Error al registrar bruto despacho: ${error.message}`);
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

  private parseGridFiltersParam(filtersParam: string | undefined): Record<string, string> {
    if (!filtersParam?.trim()) {
      return {};
    }
    const out: Record<string, string> = {};
    for (const pair of filtersParam.split(',')) {
      const i = pair.indexOf('-');
      if (i <= 0) {
        continue;
      }
      const column = pair.slice(0, i).trim();
      const raw = pair.slice(i + 1);
      if (!column) {
        continue;
      }
      try {
        out[column] = decodeURIComponent(raw);
      } catch {
        out[column] = raw;
      }
    }
    return out;
  }

  private escapeIlikePattern(value: string): string {
    return value
      .replace(/\\/g, '\\\\')
      .replace(/%/g, '\\%')
      .replace(/_/g, '\\_');
  }

  /** PG vs MySQL/MariaDB (el proyecto usa mysql en app.module). */
  private isPostgresDriver(): boolean {
    const t = this.truckReceptionRepository.manager.connection.options
      .type as string;
    return t === 'postgres' || t === 'aurora-postgres';
  }

  private sqlCastText(expr: string): string {
    return this.isPostgresDriver()
      ? `CAST(${expr} AS TEXT)`
      : `CAST(${expr} AS CHAR)`;
  }

  /** Insensible a mayúsculas: ILIKE en Postgres; LOWER/LIKE en MySQL (válido con cualquier collation). */
  private sqlLikeInsensitive(columnExpr: string, paramRef: string): string {
    const esc = "ESCAPE '\\\\'";
    if (this.isPostgresDriver()) {
      return `${columnExpr} ILIKE ${paramRef} ${esc}`;
    }
    return `LOWER(${columnExpr}) LIKE LOWER(${paramRef}) ${esc}`;
  }

  private sqlCaseStatusSpanish(): string {
    if (this.isPostgresDriver()) {
      return `CASE tr.status::text WHEN 'FINISHED' THEN 'Finalizado' WHEN 'ESPERA' THEN 'En espera' ELSE tr.status::text END`;
    }
    return `CASE CAST(tr.status AS CHAR) WHEN 'FINISHED' THEN 'Finalizado' WHEN 'ESPERA' THEN 'En espera' ELSE CAST(tr.status AS CHAR) END`;
  }

  private sqlCaseProductSpanish(): string {
    if (this.isPostgresDriver()) {
      return `CASE tr.product::text WHEN 'ARROZ_PADDY' THEN 'Arroz paddy' WHEN 'CASCARILLA' THEN 'Cascarilla' ELSE tr.product::text END`;
    }
    return `CASE CAST(tr.product AS CHAR) WHEN 'ARROZ_PADDY' THEN 'Arroz paddy' WHEN 'CASCARILLA' THEN 'Cascarilla' ELSE CAST(tr.product AS CHAR) END`;
  }

  private sqlCaseStatusSpanishTd(): string {
    if (this.isPostgresDriver()) {
      return `CASE td.status::text WHEN 'FINISHED' THEN 'Finalizado' WHEN 'ESPERA' THEN 'En espera' ELSE td.status::text END`;
    }
    return `CASE CAST(td.status AS CHAR) WHEN 'FINISHED' THEN 'Finalizado' WHEN 'ESPERA' THEN 'En espera' ELSE CAST(td.status AS CHAR) END`;
  }

  private sqlCaseProductSpanishTd(): string {
    if (this.isPostgresDriver()) {
      return `CASE td.product::text WHEN 'ARROZ_PADDY' THEN 'Arroz paddy' WHEN 'CASCARILLA' THEN 'Cascarilla' ELSE td.product::text END`;
    }
    return `CASE CAST(td.product AS CHAR) WHEN 'ARROZ_PADDY' THEN 'Arroz paddy' WHEN 'CASCARILLA' THEN 'Cascarilla' ELSE CAST(td.product AS CHAR) END`;
  }

  /**
   * Listado recepciones para DataGrid TMS: paginación, búsqueda global, filtros por columna (misma
   * convención que la URL del TMS: filters=field-value,field2-val2) y ordenación por campo permitido.
   */
  async getTruckReceptionsGrid(
    limit: number,
    offset: number,
    opts?: {
      search?: string;
      filters?: string;
      sort?: string;
      sortField?: string;
    },
  ): Promise<{ data: TruckReception[]; total: number }> {
    const SORT_WHITELIST: Record<string, string> = {
      id: 'tr.id',
      status: 'tr.status',
      product: 'tr.product',
      license_plate: 'tr.license_plate',
      dispatch_guide: 'tr.dispatch_guide',
      producer_name: 'producer.name',
      producer_rut: 'producer.rut',
      gross_weight: 'tr.gross_weight',
      tare_weight: 'tr.tare_weight',
      net_weight: 'tr.net_weight',
      entry_at: 'tr.entry_at',
      finished_at: 'tr.finished_at',
      numero_turno: 'tr.numero_turno',
    };

    const qb = this.truckReceptionRepository
      .createQueryBuilder('tr')
      .leftJoinAndSelect('tr.producer', 'producer');

    const search = opts?.search?.trim();
    if (search) {
      const searchPat = `%${this.escapeIlikePattern(search)}%`;
      const rutDigits = search.replace(/[^0-9kK]/g, '');
      const rutPat =
        rutDigits.length > 0
          ? `%${this.escapeIlikePattern(rutDigits)}%`
          : null;

      const rutExpr =
        `REPLACE(REPLACE(COALESCE(producer.rut, ''), '.', ''), '-', '')`;
      const rutOr =
        rutPat != null
          ? `OR ${this.sqlLikeInsensitive(rutExpr, ':rutDigits')}`
          : '';

      const statusLabel = this.sqlCaseStatusSpanish();
      const productLabel = this.sqlCaseProductSpanish();

      qb.andWhere(
        `(
          ${this.sqlLikeInsensitive(this.sqlCastText('tr.id'), ':searchPat')}
          OR ${this.sqlLikeInsensitive('tr.license_plate', ':searchPat')}
          OR ${this.sqlLikeInsensitive(`COALESCE(tr.dispatch_guide, '')`, ':searchPat')}
          OR ${this.sqlLikeInsensitive(`COALESCE(tr.driver_name, '')`, ':searchPat')}
          OR ${this.sqlLikeInsensitive(`COALESCE(producer.name, '')`, ':searchPat')}
          OR ${this.sqlLikeInsensitive(`COALESCE(producer.rut, '')`, ':searchPat')}
          ${rutOr}
          OR ${this.sqlLikeInsensitive(this.sqlCastText('tr.status'), ':searchPat')}
          OR ${this.sqlLikeInsensitive(`(${statusLabel})`, ':searchPat')}
          OR ${this.sqlLikeInsensitive(this.sqlCastText('tr.product'), ':searchPat')}
          OR ${this.sqlLikeInsensitive(`(${productLabel})`, ':searchPat')}
          OR ${this.sqlLikeInsensitive(this.sqlCastText('tr.gross_weight'), ':searchPat')}
          OR ${this.sqlLikeInsensitive(this.sqlCastText('tr.tare_weight'), ':searchPat')}
          OR ${this.sqlLikeInsensitive(this.sqlCastText('tr.net_weight'), ':searchPat')}
          OR ${this.sqlLikeInsensitive(this.sqlCastText('tr.numero_turno'), ':searchPat')}
          OR ${this.sqlLikeInsensitive(this.sqlCastText('tr.entry_at'), ':searchPat')}
          OR ${this.sqlLikeInsensitive(this.sqlCastText('tr.finished_at'), ':searchPat')}
        )`,
        rutPat != null
          ? { searchPat, rutDigits: rutPat }
          : { searchPat },
      );
    }

    const filtersMap = this.parseGridFiltersParam(opts?.filters);
    let fIdx = 0;
    for (const [field, rawVal] of Object.entries(filtersMap)) {
      const val = rawVal?.trim();
      if (!val) {
        continue;
      }
      const param = `gf${fIdx++}`;
      const pat = `%${this.escapeIlikePattern(val)}%`;

      const pRef = `:${param}`;
      switch (field) {
        case 'id':
          qb.andWhere(this.sqlLikeInsensitive(this.sqlCastText('tr.id'), pRef), {
            [param]: pat,
          });
          break;
        case 'status':
          qb.andWhere(
            this.sqlLikeInsensitive(this.sqlCastText('tr.status'), pRef),
            { [param]: pat },
          );
          break;
        case 'product':
          qb.andWhere(
            this.sqlLikeInsensitive(this.sqlCastText('tr.product'), pRef),
            { [param]: pat },
          );
          break;
        case 'license_plate':
          qb.andWhere(
            this.sqlLikeInsensitive('tr.license_plate', pRef),
            { [param]: pat },
          );
          break;
        case 'dispatch_guide':
          qb.andWhere(
            this.sqlLikeInsensitive(`COALESCE(tr.dispatch_guide, '')`, pRef),
            { [param]: pat },
          );
          break;
        case 'producer_name':
          qb.andWhere(
            this.sqlLikeInsensitive(`COALESCE(producer.name, '')`, pRef),
            { [param]: pat },
          );
          break;
        case 'producer_rut':
          qb.andWhere(
            this.sqlLikeInsensitive(`COALESCE(producer.rut, '')`, pRef),
            { [param]: pat },
          );
          break;
        case 'gross_weight':
          qb.andWhere(
            this.sqlLikeInsensitive(this.sqlCastText('tr.gross_weight'), pRef),
            { [param]: pat },
          );
          break;
        case 'tare_weight':
          qb.andWhere(
            this.sqlLikeInsensitive(this.sqlCastText('tr.tare_weight'), pRef),
            { [param]: pat },
          );
          break;
        case 'net_weight':
          qb.andWhere(
            this.sqlLikeInsensitive(this.sqlCastText('tr.net_weight'), pRef),
            { [param]: pat },
          );
          break;
        case 'entry_at':
          qb.andWhere(
            this.sqlLikeInsensitive(this.sqlCastText('tr.entry_at'), pRef),
            { [param]: pat },
          );
          break;
        case 'finished_at':
          qb.andWhere(
            this.sqlLikeInsensitive(this.sqlCastText('tr.finished_at'), pRef),
            { [param]: pat },
          );
          break;
        case 'numero_turno':
          qb.andWhere(
            this.sqlLikeInsensitive(this.sqlCastText('tr.numero_turno'), pRef),
            { [param]: pat },
          );
          break;
        default:
          break;
      }
    }

    const sortFieldKey = opts?.sortField?.trim() ?? '';
    const sortCol = SORT_WHITELIST[sortFieldKey] ?? 'tr.entry_at';
    let dir: 'ASC' | 'DESC' = 'DESC';
    if (sortFieldKey && SORT_WHITELIST[sortFieldKey]) {
      dir = opts?.sort?.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    }

    qb.orderBy(sortCol, dir).addOrderBy('tr.id', 'ASC');

    qb.skip(offset).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  /**
   * Listado despachos para DataGrid TMS (misma convención que recepciones).
   */
  async getTruckDispatchesGrid(
    limit: number,
    offset: number,
    opts?: {
      search?: string;
      filters?: string;
      sort?: string;
      sortField?: string;
    },
  ): Promise<{ data: TruckDispatch[]; total: number }> {
    const SORT_WHITELIST: Record<string, string> = {
      id: 'td.id',
      status: 'td.status',
      product: 'td.product',
      license_plate: 'td.license_plate',
      dispatch_guide: 'td.dispatch_guide',
      producer_name: 'producer.name',
      producer_rut: 'producer.rut',
      gross_weight: 'td.gross_weight',
      tare_weight: 'td.tare_weight',
      net_weight: 'td.net_weight',
      entry_at: 'td.entry_at',
      finished_at: 'td.finished_at',
      numero_turno: 'td.numero_turno',
    };

    const qb = this.truckDispatchRepository
      .createQueryBuilder('td')
      .leftJoinAndSelect('td.producer', 'producer');

    const search = opts?.search?.trim();
    if (search) {
      const searchPat = `%${this.escapeIlikePattern(search)}%`;
      const rutDigits = search.replace(/[^0-9kK]/g, '');
      const rutPat =
        rutDigits.length > 0
          ? `%${this.escapeIlikePattern(rutDigits)}%`
          : null;

      const rutExpr =
        `REPLACE(REPLACE(COALESCE(producer.rut, ''), '.', ''), '-', '')`;
      const rutOr =
        rutPat != null
          ? `OR ${this.sqlLikeInsensitive(rutExpr, ':rutDigits')}`
          : '';

      const statusLabel = this.sqlCaseStatusSpanishTd();
      const productLabel = this.sqlCaseProductSpanishTd();

      qb.andWhere(
        `(
          ${this.sqlLikeInsensitive(this.sqlCastText('td.id'), ':searchPat')}
          OR ${this.sqlLikeInsensitive('td.license_plate', ':searchPat')}
          OR ${this.sqlLikeInsensitive(`COALESCE(td.dispatch_guide, '')`, ':searchPat')}
          OR ${this.sqlLikeInsensitive(`COALESCE(td.driver_name, '')`, ':searchPat')}
          OR ${this.sqlLikeInsensitive(`COALESCE(producer.name, '')`, ':searchPat')}
          OR ${this.sqlLikeInsensitive(`COALESCE(producer.rut, '')`, ':searchPat')}
          ${rutOr}
          OR ${this.sqlLikeInsensitive(this.sqlCastText('td.status'), ':searchPat')}
          OR ${this.sqlLikeInsensitive(`(${statusLabel})`, ':searchPat')}
          OR ${this.sqlLikeInsensitive(this.sqlCastText('td.product'), ':searchPat')}
          OR ${this.sqlLikeInsensitive(`(${productLabel})`, ':searchPat')}
          OR ${this.sqlLikeInsensitive(this.sqlCastText('td.gross_weight'), ':searchPat')}
          OR ${this.sqlLikeInsensitive(this.sqlCastText('td.tare_weight'), ':searchPat')}
          OR ${this.sqlLikeInsensitive(this.sqlCastText('td.net_weight'), ':searchPat')}
          OR ${this.sqlLikeInsensitive(this.sqlCastText('td.numero_turno'), ':searchPat')}
          OR ${this.sqlLikeInsensitive(this.sqlCastText('td.entry_at'), ':searchPat')}
          OR ${this.sqlLikeInsensitive(this.sqlCastText('td.finished_at'), ':searchPat')}
        )`,
        rutPat != null
          ? { searchPat, rutDigits: rutPat }
          : { searchPat },
      );
    }

    const filtersMap = this.parseGridFiltersParam(opts?.filters);
    let fIdx = 0;
    for (const [field, rawVal] of Object.entries(filtersMap)) {
      const val = rawVal?.trim();
      if (!val) {
        continue;
      }
      const param = `dgf${fIdx++}`;
      const pat = `%${this.escapeIlikePattern(val)}%`;

      const pRef = `:${param}`;
      switch (field) {
        case 'id':
          qb.andWhere(this.sqlLikeInsensitive(this.sqlCastText('td.id'), pRef), {
            [param]: pat,
          });
          break;
        case 'status':
          qb.andWhere(
            this.sqlLikeInsensitive(this.sqlCastText('td.status'), pRef),
            { [param]: pat },
          );
          break;
        case 'product':
          qb.andWhere(
            this.sqlLikeInsensitive(this.sqlCastText('td.product'), pRef),
            { [param]: pat },
          );
          break;
        case 'license_plate':
          qb.andWhere(
            this.sqlLikeInsensitive('td.license_plate', pRef),
            { [param]: pat },
          );
          break;
        case 'dispatch_guide':
          qb.andWhere(
            this.sqlLikeInsensitive(`COALESCE(td.dispatch_guide, '')`, pRef),
            { [param]: pat },
          );
          break;
        case 'producer_name':
          qb.andWhere(
            this.sqlLikeInsensitive(`COALESCE(producer.name, '')`, pRef),
            { [param]: pat },
          );
          break;
        case 'producer_rut':
          qb.andWhere(
            this.sqlLikeInsensitive(`COALESCE(producer.rut, '')`, pRef),
            { [param]: pat },
          );
          break;
        case 'gross_weight':
          qb.andWhere(
            this.sqlLikeInsensitive(this.sqlCastText('td.gross_weight'), pRef),
            { [param]: pat },
          );
          break;
        case 'tare_weight':
          qb.andWhere(
            this.sqlLikeInsensitive(this.sqlCastText('td.tare_weight'), pRef),
            { [param]: pat },
          );
          break;
        case 'net_weight':
          qb.andWhere(
            this.sqlLikeInsensitive(this.sqlCastText('td.net_weight'), pRef),
            { [param]: pat },
          );
          break;
        case 'entry_at':
          qb.andWhere(
            this.sqlLikeInsensitive(this.sqlCastText('td.entry_at'), pRef),
            { [param]: pat },
          );
          break;
        case 'finished_at':
          qb.andWhere(
            this.sqlLikeInsensitive(this.sqlCastText('td.finished_at'), pRef),
            { [param]: pat },
          );
          break;
        case 'numero_turno':
          qb.andWhere(
            this.sqlLikeInsensitive(this.sqlCastText('td.numero_turno'), pRef),
            { [param]: pat },
          );
          break;
        default:
          break;
      }
    }

    const sortFieldKey = opts?.sortField?.trim() ?? '';
    const sortCol = SORT_WHITELIST[sortFieldKey] ?? 'td.entry_at';
    let dir: 'ASC' | 'DESC' = 'DESC';
    if (sortFieldKey && SORT_WHITELIST[sortFieldKey]) {
      dir = opts?.sort?.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    }

    qb.orderBy(sortCol, dir).addOrderBy('td.id', 'ASC');

    qb.skip(offset).take(limit);

    const [data, total] = await qb.getManyAndCount();
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
    updateData: UpdateTruckReceptionDto,
  ): Promise<TruckReception> {
    const truckReception = await this.getTruckReceptionById(id);

    if (
      updateData.numero_turno !== undefined &&
      truckReception.status === TruckReceptionStatus.ESPERA
    ) {
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
      await this.assertReceptionTurnoAvailable(n, id);
      truckReception.numero_turno = n;
    }

    const hasDetailUpdate =
      updateData.producer_id !== undefined ||
      updateData.license_plate !== undefined ||
      updateData.driver_name !== undefined ||
      updateData.carrier_company !== undefined ||
      updateData.dispatch_guide !== undefined ||
      updateData.gross_weight !== undefined ||
      updateData.tare_weight !== undefined ||
      updateData.product !== undefined;

    if (hasDetailUpdate) {
      if (updateData.producer_id !== undefined) {
        const producer = await this.producerRepository.findOne({
          where: { id: updateData.producer_id },
        });
        if (!producer) {
          throw new BadRequestException('Productor no encontrado');
        }
        truckReception.producer_id = updateData.producer_id;
      }

      if (updateData.license_plate !== undefined) {
        truckReception.license_plate = updateData.license_plate.trim();
      }

      if (updateData.driver_name !== undefined) {
        const d =
          updateData.driver_name == null
            ? ''
            : String(updateData.driver_name).trim();
        truckReception.driver_name = d === '' ? null : d;
      }

      if (updateData.carrier_company !== undefined) {
        truckReception.carrier_company =
          updateData.carrier_company?.trim() ?? '';
      }

      if (updateData.dispatch_guide !== undefined) {
        truckReception.dispatch_guide =
          updateData.dispatch_guide?.trim() ?? '';
      }

      if (updateData.gross_weight !== undefined) {
        truckReception.gross_weight = Number(updateData.gross_weight);
      }

      if (updateData.tare_weight !== undefined) {
        truckReception.tare_weight = Number(updateData.tare_weight);
      }

      if (
        updateData.gross_weight !== undefined ||
        updateData.tare_weight !== undefined
      ) {
        truckReception.calculateNetWeight();
        const g = Number(truckReception.gross_weight);
        const t =
          truckReception.tare_weight != null
            ? Number(truckReception.tare_weight)
            : NaN;

        if (Number.isFinite(t) && t > 0) {
          if (!Number.isFinite(g) || g <= 0) {
            throw new BadRequestException(
              'Debe existir peso bruto válido para registrar la tara',
            );
          }
          if (t >= g) {
            throw new BadRequestException(
              'El peso tara debe ser menor al peso bruto',
            );
          }
          if (
            truckReception.net_weight == null ||
            Number(truckReception.net_weight) <= 0
          ) {
            throw new BadRequestException('El peso neto debe ser mayor a 0');
          }
          if (truckReception.status === TruckReceptionStatus.ESPERA) {
            truckReception.status = TruckReceptionStatus.FINISHED;
            truckReception.finished_at = new Date();
          }
        }
      }

      if (updateData.product !== undefined) {
        truckReception.product = updateData.product;
      }
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

  async updateTruckDispatch(
    id: number,
    updateData: UpdateTruckDispatchDto,
  ): Promise<TruckDispatch> {
    const td = await this.getTruckDispatchById(id);

    const hasDetailUpdate =
      updateData.producer_id !== undefined ||
      updateData.license_plate !== undefined ||
      updateData.driver_name !== undefined ||
      updateData.carrier_company !== undefined ||
      updateData.dispatch_guide !== undefined ||
      updateData.gross_weight !== undefined ||
      updateData.tare_weight !== undefined ||
      updateData.product !== undefined;

    if (hasDetailUpdate) {
      if (updateData.producer_id !== undefined) {
        const producer = await this.producerRepository.findOne({
          where: { id: updateData.producer_id },
        });
        if (!producer) {
          throw new BadRequestException('Productor no encontrado');
        }
        td.producer_id = updateData.producer_id;
      }

      if (updateData.license_plate !== undefined) {
        td.license_plate = updateData.license_plate.trim();
      }

      if (updateData.driver_name !== undefined) {
        const d =
          updateData.driver_name == null
            ? ''
            : String(updateData.driver_name).trim();
        td.driver_name = d === '' ? null : d;
      }

      if (updateData.carrier_company !== undefined) {
        td.carrier_company = updateData.carrier_company?.trim() ?? '';
      }

      if (updateData.dispatch_guide !== undefined) {
        td.dispatch_guide = updateData.dispatch_guide?.trim() ?? '';
      }

      if (updateData.gross_weight !== undefined) {
        td.gross_weight = Number(updateData.gross_weight);
      }

      if (updateData.tare_weight !== undefined) {
        td.tare_weight = Number(updateData.tare_weight);
      }

      if (updateData.product !== undefined) {
        td.product = updateData.product;
      }

      if (
        updateData.gross_weight !== undefined ||
        updateData.tare_weight !== undefined
      ) {
        const g = td.gross_weight != null ? Number(td.gross_weight) : NaN;
        const t = td.tare_weight != null ? Number(td.tare_weight) : NaN;
        const hasG = Number.isFinite(g) && g > 0;
        const hasT = Number.isFinite(t) && t > 0;

        if (hasG && !hasT) {
          throw new BadRequestException(
            'En despacho debe existir peso tara antes que el bruto',
          );
        }

        if (hasG && hasT) {
          if (g <= t) {
            throw new BadRequestException(
              'El peso bruto debe ser mayor que la tara',
            );
          }
          td.calculateNetWeight();
          if (
            td.net_weight == null ||
            Number(td.net_weight) <= 0
          ) {
            throw new BadRequestException('El peso neto debe ser mayor a 0');
          }
          if (td.status === TruckReceptionStatus.ESPERA) {
            td.status = TruckReceptionStatus.FINISHED;
            td.finished_at = new Date();
          }
        } else {
          td.net_weight = null;
          if (td.status === TruckReceptionStatus.FINISHED) {
            throw new BadRequestException(
              'Un despacho finalizado debe mantener bruto y tara válidos',
            );
          }
        }
      }
    }

    const saved = await this.truckDispatchRepository.save(td);
    this.logger.log(`Despacho de camión actualizado: ${id}`);
    void this.logisticsGateway.broadcastMonitorState();
    return saved;
  }

  async cancelTruckDispatch(id: number): Promise<TruckDispatch> {
    const row = await this.getTruckDispatchById(id);
    await this.truckDispatchRepository.softDelete(id);
    this.logger.log(`Despacho de camión cancelado: ${id}`);
    return row;
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
