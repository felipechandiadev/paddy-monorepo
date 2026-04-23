import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { LogisticsService } from '../application/logistics.service';
import { CreateTruckDto } from '../dtos/create-truck.dto';
import { CreateTruckWithGrossWeightDto } from '../dtos/create-truck-with-gross-weight.dto';
import { RegisterWeighingDto } from '../dtos/register-weighing.dto';
import { RegisterDispatchWeighingDto } from '../dtos/register-dispatch-weighing.dto';
import { CreateTruckDispatchWithTareDto } from '../dtos/create-truck-dispatch-with-tare.dto';
import { RegisterDispatchGrossWeightDto } from '../dtos/register-dispatch-gross-weight.dto';
import { UpdateTruckStatusDto } from '../dtos/update-truck-status.dto';
import { UpdateTruckReceptionDto } from '../dtos/update-truck-reception.dto';
import { UpdateTruckDispatchDto } from '../dtos/update-truck-dispatch.dto';
import { TruckReceptionStatus } from '../domain/truck-reception.entity';
import { LogisticsProduct } from '../domain/logistics-product.enum';

@Controller('logistics')
export class LogisticsController {
  private readonly logger = new Logger(LogisticsController.name);

  constructor(private readonly logisticsService: LogisticsService) {}

  @Post('truck-receptions/with-gross-weight')
  @HttpCode(HttpStatus.CREATED)
  async createTruckWithGrossWeight(@Body(ValidationPipe) createTruckDto: CreateTruckWithGrossWeightDto) {
    this.logger.log(
      `POST /truck-receptions/with-gross-weight - Patente: ${createTruckDto.license_plate}, producto: ${createTruckDto.product}`,
    );
    try {
      const result = await this.logisticsService.createTruckWithGrossWeight(createTruckDto);
      return result;
    } catch (error) {
      this.logger.error(`Error al registrar camion: ${error.message}`);
      throw error;
    }
  }

  @Post('truck-receptions')
  @HttpCode(HttpStatus.CREATED)
  async createTruckReception(@Body(ValidationPipe) createTruckDto: CreateTruckDto) {
    this.logger.log(`POST /truck-receptions - Registrando camion: ${createTruckDto.license_plate}`);
    try {
      const result = await this.logisticsService.createTruckWithGrossWeight({
        ...createTruckDto,
        gross_weight: 0,
        product: createTruckDto.product ?? LogisticsProduct.ARROZ_PADDY,
      });
      return result;
    } catch (error) {
      this.logger.error(`Error al registrar camion: ${error.message}`);
      throw error;
    }
  }

  @Post('truck-dispatches/with-gross-weight')
  @HttpCode(HttpStatus.CREATED)
  async createTruckDispatchWithGrossWeight(
    @Body(ValidationPipe) createTruckDto: CreateTruckWithGrossWeightDto,
  ) {
    this.logger.log(
      `POST /truck-dispatches/with-gross-weight - Despacho patente: ${createTruckDto.license_plate}`,
    );
    try {
      return await this.logisticsService.createTruckDispatchWithGrossWeight(createTruckDto);
    } catch (error) {
      this.logger.error(`Error al registrar despacho: ${error.message}`);
      throw error;
    }
  }

  @Post('truck-dispatches/with-tare')
  @HttpCode(HttpStatus.CREATED)
  async createTruckDispatchWithTare(
    @Body(ValidationPipe) createTruckDto: CreateTruckDispatchWithTareDto,
  ) {
    this.logger.log(
      `POST /truck-dispatches/with-tare - Despacho patente: ${createTruckDto.license_plate}`,
    );
    try {
      return await this.logisticsService.createTruckDispatchWithTare(createTruckDto);
    } catch (error) {
      this.logger.error(`Error al registrar despacho con tara: ${error.message}`);
      throw error;
    }
  }

  @Post('truck-dispatches')
  @HttpCode(HttpStatus.CREATED)
  async createTruckDispatch(@Body(ValidationPipe) createTruckDto: CreateTruckDto) {
    this.logger.log(`POST /truck-dispatches - Despacho patente: ${createTruckDto.license_plate}`);
    try {
      return await this.logisticsService.createTruckDispatchWithGrossWeight({
        ...createTruckDto,
        gross_weight: 0,
        product: createTruckDto.product ?? LogisticsProduct.ARROZ_PADDY,
      });
    } catch (error) {
      this.logger.error(`Error al registrar despacho: ${error.message}`);
      throw error;
    }
  }

  /** @deprecated Flujo legacy bruto→tara. Preferir with-tare + weighings/dispatch-gross. */
  @Post('weighings/dispatch-tare')
  @HttpCode(HttpStatus.OK)
  async registerDispatchTareWeight(
    @Body(ValidationPipe) registerDto: RegisterDispatchWeighingDto,
  ) {
    this.logger.log(
      `POST /weighings/dispatch-tare - Tara despacho: ${registerDto.truck_dispatch_id}`,
    );
    try {
      return await this.logisticsService.registerDispatchTareWeight(registerDto);
    } catch (error) {
      this.logger.error(`Error al registrar tara despacho: ${error.message}`);
      throw error;
    }
  }

  @Post('weighings/dispatch-gross')
  @HttpCode(HttpStatus.OK)
  async registerDispatchGrossWeight(
    @Body(ValidationPipe) registerDto: RegisterDispatchGrossWeightDto,
  ) {
    this.logger.log(
      `POST /weighings/dispatch-gross - Bruto despacho: ${registerDto.truck_dispatch_id}`,
    );
    try {
      return await this.logisticsService.registerDispatchGrossWeight(registerDto);
    } catch (error) {
      this.logger.error(`Error al registrar bruto despacho: ${error.message}`);
      throw error;
    }
  }

  @Get('turnos/dispatches/today')
  async getDispatchTurnosToday() {
    this.logger.log(`GET /turnos/dispatches/today`);
    try {
      const today = new Date();
      return await this.logisticsService.getDispatchTurnosByDate(today);
    } catch (error) {
      this.logger.error(`Error al obtener turnos despacho: ${error.message}`);
      throw error;
    }
  }

  @Get('truck-dispatches/grid')
  @UseGuards(JwtAuthGuard)
  async getTruckDispatchesForGrid(
    @Query('limit') limit: string = '100',
    @Query('offset') offset: string = '0',
    @Query('search') search?: string,
    @Query('filters') filters?: string,
    @Query('sort') sort?: string,
    @Query('sortField') sortField?: string,
  ) {
    const lim = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 500);
    const off = Math.max(parseInt(offset, 10) || 0, 0);
    this.logger.log(
      `GET /truck-dispatches/grid - Limit: ${lim}, Offset: ${off}, search: ${search ?? ''}`,
    );
    try {
      return await this.logisticsService.getTruckDispatchesGrid(lim, off, {
        search: search?.trim() || undefined,
        filters: filters?.trim() || undefined,
        sort: sort?.trim() || undefined,
        sortField: sortField?.trim() || undefined,
      });
    } catch (error) {
      this.logger.error(`Error al obtener despachos (grid): ${error.message}`);
      throw error;
    }
  }

  @Get('truck-dispatches/:id')
  async getTruckDispatchById(@Param('id', new ParseIntPipe()) id: number) {
    this.logger.log(`GET /truck-dispatches/:id - ID: ${id}`);
    try {
      return await this.logisticsService.getTruckDispatchById(id);
    } catch (error) {
      this.logger.error(`Error al obtener despacho: ${error.message}`);
      throw error;
    }
  }

  @Put('truck-dispatches/:id')
  async updateTruckDispatch(
    @Param('id', new ParseIntPipe()) id: number,
    @Body(ValidationPipe) updateDto: UpdateTruckDispatchDto,
  ) {
    this.logger.log(`PUT /truck-dispatches/:id - ID: ${id}`);
    try {
      return await this.logisticsService.updateTruckDispatch(id, updateDto);
    } catch (error) {
      this.logger.error(`Error al actualizar despacho: ${error.message}`);
      throw error;
    }
  }

  @Delete('truck-dispatches/:id')
  async cancelTruckDispatch(@Param('id', new ParseIntPipe()) id: number) {
    this.logger.log(`DELETE /truck-dispatches/:id - ID: ${id}`);
    try {
      return await this.logisticsService.cancelTruckDispatch(id);
    } catch (error) {
      this.logger.error(`Error al cancelar despacho: ${error.message}`);
      throw error;
    }
  }

  @Post('weighings/tare')
  @HttpCode(HttpStatus.OK)
  async registerTareWeight(@Body(ValidationPipe) registerWeighingDto: RegisterWeighingDto) {
    this.logger.log(
      `POST /weighings/tare - Registrando tara para camion: ${registerWeighingDto.truck_reception_id}`,
    );
    try {
      const result = await this.logisticsService.registerTareWeight(registerWeighingDto);
      return result;
    } catch (error) {
      this.logger.error(`Error al registrar peso tara: ${error.message}`);
      throw error;
    }
  }

  @Put('truck-receptions/:id/status')
  @HttpCode(HttpStatus.OK)
  async updateTruckStatus(
    @Param('id', new ParseIntPipe()) id: number,
    @Body(ValidationPipe) updateStatusDto: UpdateTruckStatusDto,
  ) {
    this.logger.log(`PUT /truck-receptions/:id/status - ID: ${id}, Status: ${updateStatusDto.status}`);
    try {
      const result = await this.logisticsService.updateTruckStatus(id, updateStatusDto.status);
      return result;
    } catch (error) {
      this.logger.error(`Error al actualizar estado: ${error.message}`);
      throw error;
    }
  }

  @Get('turnos/next-today')
  async getNextTurnoForToday() {
    this.logger.log(`GET /turnos/next-today`);
    try {
      const nextTurno = await this.logisticsService.getNextTurnoForToday();
      return {
        numero_turno: nextTurno,
      };
    } catch (error) {
      this.logger.error(`Error al obtener proximo turno: ${error.message}`);
      throw error;
    }
  }

  @Get('turnos/today')
  async getTurnosToday() {
    this.logger.log(`GET /turnos/today`);
    try {
      const today = new Date();
      const turnos = await this.logisticsService.getTurnosByDate(today);
      return turnos;
    } catch (error) {
      this.logger.error(`Error al obtener turnos de hoy: ${error.message}`);
      throw error;
    }
  }

  @Get('truck-receptions')
  async getAllTruckReceptions(
    @Query('limit') limit: string = '100',
    @Query('offset') offset: string = '0',
  ) {
    this.logger.log(`GET /truck-receptions - Limit: ${limit}, Offset: ${offset}`);
    try {
      const result = await this.logisticsService.getAllTruckReceptions(
        parseInt(limit),
        parseInt(offset),
      );
      return result;
    } catch (error) {
      this.logger.error(`Error al obtener recepciones: ${error.message}`);
      throw error;
    }
  }

  /**
   * Listado paginado para TMS (requiere JWT). Debe declararse antes de truck-receptions/:id
   */
  @Get('truck-receptions/grid')
  @UseGuards(JwtAuthGuard)
  async getTruckReceptionsForGrid(
    @Query('limit') limit: string = '100',
    @Query('offset') offset: string = '0',
    @Query('search') search?: string,
    @Query('filters') filters?: string,
    @Query('sort') sort?: string,
    @Query('sortField') sortField?: string,
  ) {
    const lim = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 500);
    const off = Math.max(parseInt(offset, 10) || 0, 0);
    this.logger.log(
      `GET /truck-receptions/grid - Limit: ${lim}, Offset: ${off}, search: ${search ?? ''}, sort: ${sort ?? ''}/${sortField ?? ''}`,
    );
    try {
      return await this.logisticsService.getTruckReceptionsGrid(lim, off, {
        search: search?.trim() || undefined,
        filters: filters?.trim() || undefined,
        sort: sort?.trim() || undefined,
        sortField: sortField?.trim() || undefined,
      });
    } catch (error) {
      this.logger.error(`Error al obtener recepciones (grid): ${error.message}`);
      throw error;
    }
  }

  @Get('truck-receptions/:id')
  async getTruckReceptionById(@Param('id', new ParseIntPipe()) id: number) {
    this.logger.log(`GET /truck-receptions/:id - ID: ${id}`);
    try {
      const result = await this.logisticsService.getTruckReceptionById(id);
      return result;
    } catch (error) {
      this.logger.error(`Error al obtener recepcion: ${error.message}`);
      throw error;
    }
  }

  @Get('producers/:producerId/truck-receptions')
  async getTruckReceptionsByProducerId(
    @Param('producerId') producerId: string,
    @Query('limit') limit: string = '100',
    @Query('offset') offset: string = '0',
  ) {
    this.logger.log(
      `GET /producers/:producerId/truck-receptions - Producer: ${producerId}`,
    );
    try {
      const result = await this.logisticsService.getTruckReceptionsByProducerId(
        parseInt(producerId),
        parseInt(limit),
        parseInt(offset),
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Error al obtener recepciones por productor: ${error.message}`,
      );
      throw error;
    }
  }

  @Get('truck-receptions/status/:status')
  async getTruckReceptionsByStatus(
    @Param('status') status: string,
    @Query('limit') limit: string = '100',
    @Query('offset') offset: string = '0',
  ) {
    this.logger.log(
      `GET /truck-receptions/status/:status - Status: ${status}`,
    );
    try {
      const result = await this.logisticsService.getTruckReceptionsByStatus(
        status as TruckReceptionStatus,
        parseInt(limit),
        parseInt(offset),
      );
      return result;
    } catch (error) {
      this.logger.error(`Error al obtener recepciones por estado: ${error.message}`);
      throw error;
    }
  }

  @Put('truck-receptions/:id')
  async updateTruckReception(
    @Param('id', new ParseIntPipe()) id: number,
    @Body(ValidationPipe) updateDto: UpdateTruckReceptionDto,
  ) {
    this.logger.log(`PUT /truck-receptions/:id - ID: ${id}`);
    try {
      const result = await this.logisticsService.updateTruckReception(id, updateDto);
      return result;
    } catch (error) {
      this.logger.error(`Error al actualizar recepcion: ${error.message}`);
      throw error;
    }
  }

  @Delete('truck-receptions/:id')
  async cancelTruckReception(@Param('id', new ParseIntPipe()) id: number) {
    this.logger.log(`DELETE /truck-receptions/:id - ID: ${id}`);
    try {
      const result = await this.logisticsService.cancelTruckReception(id);
      return result;
    } catch (error) {
      this.logger.error(`Error al cancelar recepcion: ${error.message}`);
      throw error;
    }
  }

  @Get('stats/overview')
  async getReceptionStats() {
    this.logger.log(`GET /stats/overview`);
    try {
      const result = await this.logisticsService.getReceptionStats();
      return result;
    } catch (error) {
      this.logger.error(`Error al obtener estadisticas: ${error.message}`);
      throw error;
    }
  }
}
