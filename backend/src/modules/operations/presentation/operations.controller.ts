import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Res,
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { OperationsService } from '../application/operations.service';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
import { Roles } from '@shared/decorators/roles.decorator';
import { GetUser } from '@shared/decorators/get-user.decorator';
import { RoleEnum, ReceptionStatusEnum } from '@shared/enums';
import {
  CreateReceptionDto,
  UpdateReceptionDto,
  CreateReceptionWithAnalysisDto,
  CreateAnalysisRecordDto,
  UpdateAnalysisRecordDto,
  UpdateAnalysisDryPercentDto,
  UpdateReceptionRicePriceDto,
} from '../dto/operations.dto';

/**
 * Operations Controller
 * Endpoints para gestión del flujo de receptions:
 * - Recepciones (pesaje inicial)
 * - Análisis de calidad
 * - Cálculo de descuentos
 */
@Controller('operations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OperationsController {
  private logger = new Logger('OperationsController');

  constructor(private operationsService: OperationsService) {}

  // ===== RECEPTIONS =====
  @Get('receptions')
  async getAllReceptions(
    @Query('status') status?: ReceptionStatusEnum,
    @Query('includeDeleted') includeDeleted?: string,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('sortField') sortField?: string,
    @Query('filters') filters?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(25), ParseIntPipe) limit?: number,
  ) {
    const shouldIncludeDeleted =
      includeDeleted === 'true' || includeDeleted === '1';

    this.logger.log(
      `Fetching all receptions${shouldIncludeDeleted ? ' (including deleted)' : ''}${search ? ` (search: ${search})` : ''}${sort && sortField ? ` (sort: ${sortField} ${sort})` : ''}${filters ? ` (filters: ${filters})` : ''}`,
    );
    return this.operationsService.getAllReceptions(
      status,
      shouldIncludeDeleted,
      search,
      sort,
      sortField,
      filters,
      page,
      limit,
    );
  }

    @Get('receptions/last')
    async getLastReception() {
      this.logger.log('Fetching last reception');
      return this.operationsService.getLastReception();
    }

  @Get('receptions/export/excel')
  async exportReceptionsExcel(
    @Res() response: Response,
    @Query('status') status?: ReceptionStatusEnum,
    @Query('includeDeleted') includeDeleted?: string,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('sortField') sortField?: string,
    @Query('filters') filters?: string,
  ): Promise<void> {
    const shouldIncludeDeleted =
      includeDeleted === 'true' || includeDeleted === '1';

    this.logger.log(
      `Exporting receptions to excel${shouldIncludeDeleted ? ' (including deleted)' : ''}${search ? ` (search: ${search})` : ''}${sort && sortField ? ` (sort: ${sortField} ${sort})` : ''}${filters ? ` (filters: ${filters})` : ''}`,
    );

    const { fileName, fileBuffer } =
      await this.operationsService.generateReceptionsExcel(
        status,
        shouldIncludeDeleted,
        search,
        sort,
        sortField,
        filters,
      );

    response.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    response.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    response.setHeader('Content-Length', fileBuffer.length.toString());
    response.send(fileBuffer);
  }

  @Get('receptions/:id')
  async getReceptionById(@Param('id') id: number) {
    this.logger.log(`Fetching reception: ${id}`);
    return this.operationsService.getReceptionById(id);
  }

  @Get('producers/:producerId/receptions')
  async getReceptionsByProducer(
    @Param('producerId') producerId: number,
    @Query('status') status?: ReceptionStatusEnum,
  ) {
    this.logger.log(
      `Fetching receptions for producer: ${producerId}${status ? ` (status: ${status})` : ''}`,
    );
    return this.operationsService.getReceptionsByProducer(producerId, status);
  }

  @Post('receptions/with-analysis')
  @Roles(RoleEnum.ADMIN)
  async createReceptionWithAnalysis(
    @Body() createDto: CreateReceptionWithAnalysisDto,
    @GetUser('userId') userId: number,
  ) {
    this.logger.log(
      `Creating reception with analysis for producer: ${createDto.reception.producerId}`,
    );
    return this.operationsService.createReceptionWithAnalysis(createDto, userId);
  }

  @Post('receptions')
  @Roles(RoleEnum.ADMIN)
  async createReception(
    @Body() createDto: CreateReceptionDto,
    @GetUser('userId') userId: number,
  ) {
    this.logger.log(
      `Creating reception for producer: ${createDto.producerId}`,
    );
    return this.operationsService.createReception(createDto, userId);
  }

  @Put('receptions/:id')
  @Roles(RoleEnum.ADMIN)
  async updateReception(
    @Param('id') id: number,
    @Body() updateDto: UpdateReceptionDto,
    @GetUser('userId') userId: number,
  ) {
    this.logger.log(`Updating reception: ${id}`);
    return this.operationsService.updateReception(id, updateDto, userId);
  }

  @Patch('receptions/:receptionId/rice-price')
  @Roles(RoleEnum.ADMIN)
  async updateReceptionRicePrice(
    @Param('receptionId') receptionId: number,
    @Body() updateDto: UpdateReceptionRicePriceDto,
    @GetUser('userId') userId: number,
  ) {
    this.logger.log(`Updating rice price for reception: ${receptionId}`);
    return this.operationsService.updateReceptionRicePrice(
      receptionId,
      updateDto.ricePrice,
      userId,
    );
  }

  @Delete('receptions/:id')
  @Roles(RoleEnum.ADMIN)
  async deleteReception(@Param('id') id: number) {
    this.logger.log(`Cancelling reception: ${id}`);
    return this.operationsService.deleteReception(id);
  }

  // ===== ANALYSIS RECORDS =====
  @Get('receptions/:receptionId/analysis')
  async getAnalysisRecord(@Param('receptionId') receptionId: number) {
    this.logger.log(`Fetching analysis for reception: ${receptionId}`);
    return this.operationsService.getAnalysisRecord(receptionId);
  }

  @Post('receptions/:receptionId/analysis')
  @Roles(RoleEnum.ADMIN)
  async createAnalysisRecord(
    @Param('receptionId') receptionId: number,
    @Body() createDto: CreateAnalysisRecordDto,
    @GetUser('userId') userId: number,
  ) {
    this.logger.log(`Creating analysis for reception: ${receptionId}`);
    return this.operationsService.createAnalysisRecord(
      { ...createDto, receptionId },
      userId,
    );
  }

  @Put('receptions/:receptionId/analysis')
  @Roles(RoleEnum.ADMIN)
  async updateAnalysisRecord(
    @Param('receptionId') receptionId: number,
    @Body() updateDto: UpdateAnalysisRecordDto,
    @GetUser('userId') userId: number,
  ) {
    this.logger.log(`Updating analysis for reception: ${receptionId}`);
    return this.operationsService.updateAnalysisRecord(
      receptionId,
      updateDto,
      userId,
    );
  }

  @Patch('receptions/:receptionId/analysis/dry-percent')
  @Roles(RoleEnum.ADMIN)
  async updateAnalysisDryPercent(
    @Param('receptionId') receptionId: number,
    @Body() updateDto: UpdateAnalysisDryPercentDto,
    @GetUser('userId') userId: number,
  ) {
    this.logger.log(
      `Updating dry percent for analysis in reception: ${receptionId}`,
    );
    return this.operationsService.updateAnalysisDryPercent(
      receptionId,
      updateDto.dryPercent,
      userId,
    );
  }

  @Delete('receptions/:receptionId/analysis')
  @Roles(RoleEnum.ADMIN)
  async deleteAnalysisRecord(@Param('receptionId') receptionId: number) {
    this.logger.log(`Deleting analysis for reception: ${receptionId}`);
    return this.operationsService.deleteAnalysisRecord(receptionId);
  }

  // ===== CÁLCULOS =====
  @Post('receptions/:receptionId/calculate-discounts')
  @Roles(RoleEnum.ADMIN)
  async calculateDiscounts(@Param('receptionId') receptionId: number) {
    this.logger.log(`Calculating discounts for reception: ${receptionId}`);
    return this.operationsService.calculateDiscounts(receptionId);
  }

  @Post('receptions/:receptionId/settle')
  @Roles(RoleEnum.ADMIN)
  async applySettlement(
    @Param('receptionId') receptionId: number,
    @Body() body: { settlementId: number },
  ) {
    this.logger.log(`Settling reception: ${receptionId}`);
    return this.operationsService.applySettlement(receptionId, body.settlementId);
  }
}
