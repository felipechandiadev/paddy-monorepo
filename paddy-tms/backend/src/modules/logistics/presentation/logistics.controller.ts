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
} from '@nestjs/common';
import { LogisticsService } from '../application/logistics.service';
import { CreateTruckDto } from '../dtos/create-truck.dto';
import { RegisterWeighingDto } from '../dtos/register-weighing.dto';
import { TruckReceptionStatus } from '../domain/truck-reception.entity';

@Controller('api/v1/logistics')
export class LogisticsController {
  private readonly logger = new Logger(LogisticsController.name);

  constructor(private readonly logisticsService: LogisticsService) {}

  /**
   * Registrar un nuevo camión
   */
  @Post('truck-receptions')
  @HttpCode(HttpStatus.CREATED)
  async createTruckReception(@Body(ValidationPipe) createTruckDto: CreateTruckDto) {
    this.logger.log(`POST /truck-receptions - Registrando camión: ${createTruckDto.patente}`);
    try {
      const result = await this.logisticsService.createTruckReception(createTruckDto);
      return {
        success: true,
        message: 'Camión registrado exitosamente',
        data: result,
      };
    } catch (error) {
      this.logger.error(`Error al registrar camión: ${error.message}`);
      throw error;
    }
  }

  /**
   * Registrar pesaje
   */
  @Post('weighings')
  @HttpCode(HttpStatus.CREATED)
  async registerWeighing(@Body(ValidationPipe) registerWeighingDto: RegisterWeighingDto) {
    this.logger.log(
      `POST /weighings - Registrando pesaje para camión: ${registerWeighingDto.truck_reception_id}`,
    );
    try {
      const result = await this.logisticsService.registerWeighing(registerWeighingDto);
      return {
        success: true,
        message: 'Pesaje registrado exitosamente',
        data: result,
      };
    } catch (error) {
      this.logger.error(`Error al registrar pesaje: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtener todas las recepciones
   */
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
      return {
        success: true,
        data: result.data,
        total: result.total,
      };
    } catch (error) {
      this.logger.error(`Error al obtener recepciones: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtener recepción por ID
   */
  @Get('truck-receptions/:id')
  async getTruckReceptionById(@Param('id') id: string) {
    this.logger.log(`GET /truck-receptions/:id - ID: ${id}`);
    try {
      const result = await this.logisticsService.getTruckReceptionById(id);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error(`Error al obtener recepción: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtener recepciones por productor
   */
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
        producerId,
        parseInt(limit),
        parseInt(offset),
      );
      return {
        success: true,
        data: result.data,
        total: result.total,
      };
    } catch (error) {
      this.logger.error(
        `Error al obtener recepciones por productor: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Obtener recepciones por estado
   */
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
      return {
        success: true,
        data: result.data,
        total: result.total,
      };
    } catch (error) {
      this.logger.error(`Error al obtener recepciones por estado: ${error.message}`);
      throw error;
    }
  }

  /**
   * Actualizar recepción de camión
   */
  @Put('truck-receptions/:id')
  async updateTruckReception(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateTruckDto>,
  ) {
    this.logger.log(`PUT /truck-receptions/:id - ID: ${id}`);
    try {
      const result = await this.logisticsService.updateTruckReception(id, updateData);
      return {
        success: true,
        message: 'Recepción de camión actualizada',
        data: result,
      };
    } catch (error) {
      this.logger.error(`Error al actualizar recepción: ${error.message}`);
      throw error;
    }
  }

  /**
   * Cancelar recepción de camión
   */
  @Delete('truck-receptions/:id')
  async cancelTruckReception(@Param('id') id: string) {
    this.logger.log(`DELETE /truck-receptions/:id - ID: ${id}`);
    try {
      const result = await this.logisticsService.cancelTruckReception(id);
      return {
        success: true,
        message: 'Recepción de camión cancelada',
        data: result,
      };
    } catch (error) {
      this.logger.error(`Error al cancelar recepción: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtener estadísticas
   */
  @Get('stats/overview')
  async getReceptionStats() {
    this.logger.log(`GET /stats/overview`);
    try {
      const result = await this.logisticsService.getReceptionStats();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error(`Error al obtener estadísticas: ${error.message}`);
      throw error;
    }
  }
}
