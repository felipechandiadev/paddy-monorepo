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
} from '@nestjs/common';
import { LogisticsService } from '../application/logistics.service';
import { CreateTruckDto } from '../dtos/create-truck.dto';
import { CreateTruckWithGrossWeightDto } from '../dtos/create-truck-with-gross-weight.dto';
import { RegisterWeighingDto } from '../dtos/register-weighing.dto';
import { UpdateTruckStatusDto } from '../dtos/update-truck-status.dto';
import { TruckReceptionStatus } from '../domain/truck-reception.entity';

@Controller('logistics')
export class LogisticsController {
  private readonly logger = new Logger(LogisticsController.name);

  constructor(private readonly logisticsService: LogisticsService) {}

  @Post('truck-receptions/with-gross-weight')
  @HttpCode(HttpStatus.CREATED)
  async createTruckWithGrossWeight(@Body(ValidationPipe) createTruckDto: CreateTruckWithGrossWeightDto) {
    this.logger.log(`POST /truck-receptions/with-gross-weight - Registrando camion: ${createTruckDto.license_plate}`);
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
      });
      return result;
    } catch (error) {
      this.logger.error(`Error al registrar camion: ${error.message}`);
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
    @Body() updateData: Partial<CreateTruckDto>,
  ) {
    this.logger.log(`PUT /truck-receptions/:id - ID: ${id}`);
    try {
      const result = await this.logisticsService.updateTruckReception(id, updateData);
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
