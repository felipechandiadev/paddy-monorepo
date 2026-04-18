import {
  BadRequestException,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  Logger,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AnalyticsService } from '../application/analytics.service';
import { JwtAuthGuard } from '../../../shared/guards';
import { AdvanceStatusEnum } from '../../../shared/enums';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  private readonly logger = new Logger(AnalyticsController.name);

  constructor(private analyticsService: AnalyticsService) {}

  private parseOptionalPositiveInt(
    value: string | undefined,
    fieldName: string,
  ): number | undefined {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new BadRequestException(
        `${fieldName} debe ser un número entero positivo`,
      );
    }

    return parsed;
  }

  // ===== DASHBOARD =====
  @Get('dashboard')
  async getDashboard(@Query('seasonId') seasonId?: number) {
    this.logger.log(`[GET] /analytics/dashboard - seasonId: ${seasonId}`);
    return await this.analyticsService.getDashboardStats(seasonId);
  }

  // ===== PRODUCTORES =====
  @Get('producers/top')
  async getTopProducers(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    this.logger.log(`[GET] /analytics/producers/top - limit: ${limit}`);
    return await this.analyticsService.getTopProducers(limit);
  }

  @Get('producers/:id')
  async getProducerStats(@Param('id', ParseIntPipe) producerId: number) {
    this.logger.log(`[GET] /analytics/producers/${producerId}`);
    const stats = await this.analyticsService.getProducerStats(producerId);

    if (!stats) {
      throw new NotFoundException(`Producer with ID ${producerId} not found`);
    }

    return stats;
  }

  // ===== TEMPORADAS =====
  @Get('seasons/:id/report')
  async getSeasonReport(@Param('id', ParseIntPipe) seasonId: number) {
    this.logger.log(`[GET] /analytics/seasons/${seasonId}/report`);
    const report = await this.analyticsService.getSeasonReport(seasonId);

    if (!report) {
      throw new NotFoundException(`Season with ID ${seasonId} has no receptions`);
    }

    return report;
  }

  // ===== CALIDAD =====
  @Get('quality/report')
  async getQualityReport(@Query('seasonId') seasonId?: number) {
    this.logger.log(`[GET] /analytics/quality/report - seasonId: ${seasonId}`);
    const report = await this.analyticsService.getQualityReport(seasonId);

    if (!report) {
      throw new NotFoundException('No quality analysis records found');
    }

    return report;
  }

  // ===== FINANZAS =====
  @Get('finances/report')
  async getFinancialReport(@Query('seasonId') seasonId?: number) {
    this.logger.log(`[GET] /analytics/finances/report - seasonId: ${seasonId}`);
    const report = await this.analyticsService.getFinancialReport(seasonId);

    if (!report) {
      throw new NotFoundException('No settlements found');
    }

    return report;
  }

  // ===== SECADO =====
  @Get('drying/revenue')
  async getDryingRevenueReport(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('seasonId') seasonIdRaw?: string,
    @Query('producerId') producerIdRaw?: string,
    @Query('riceTypeId') riceTypeIdRaw?: string,
    @Query('receptionStatus') receptionStatusRaw?: string,
    @Query('groupBy') groupByRaw?: string,
  ) {
    if (!fechaInicio?.trim()) {
      throw new BadRequestException('fechaInicio es obligatorio (YYYY-MM-DD)');
    }

    if (!fechaFin?.trim()) {
      throw new BadRequestException('fechaFin es obligatorio (YYYY-MM-DD)');
    }

    const seasonId = this.parseOptionalPositiveInt(seasonIdRaw, 'seasonId');
    const producerId = this.parseOptionalPositiveInt(producerIdRaw, 'producerId');
    const riceTypeId = this.parseOptionalPositiveInt(riceTypeIdRaw, 'riceTypeId');

    const normalizedReceptionStatus =
      (receptionStatusRaw ?? 'analyzed_settled').toLowerCase();
    const allowedReceptionStatuses = ['settled', 'analyzed', 'analyzed_settled'];

    if (!allowedReceptionStatuses.includes(normalizedReceptionStatus)) {
      throw new BadRequestException(
        'receptionStatus debe ser settled, analyzed o analyzed_settled',
      );
    }

    const normalizedGroupBy = (groupByRaw ?? 'month').toLowerCase();
    const allowedGroupBy = ['day', 'week', 'month'];

    if (!allowedGroupBy.includes(normalizedGroupBy)) {
      throw new BadRequestException('groupBy debe ser day, week o month');
    }

    this.logger.log(
      `[GET] /analytics/drying/revenue - fechaInicio: ${fechaInicio}, fechaFin: ${fechaFin}, seasonId: ${seasonId ?? 'ALL'}, producerId: ${producerId ?? 'ALL'}, riceTypeId: ${riceTypeId ?? 'ALL'}, receptionStatus: ${normalizedReceptionStatus}, groupBy: ${normalizedGroupBy}`,
    );

    return this.analyticsService.getDryingRevenueReport({
      fechaInicio,
      fechaFin,
      seasonId,
      producerId,
      riceTypeId,
      receptionStatus: normalizedReceptionStatus as
        | 'settled'
        | 'analyzed'
        | 'analyzed_settled',
      groupBy: normalizedGroupBy as 'day' | 'week' | 'month',
    });
  }

  // ===== SERVICIOS FINANCIEROS (INTERESES) =====
  @Get('financial-services/interests')
  async getFinancialServicesInterestReport(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('seasonId') seasonIdRaw?: string,
    @Query('producerId') producerIdRaw?: string,
    @Query('status') statusRaw?: string,
    @Query('calculationMode') calculationModeRaw?: string,
    @Query('groupBy') groupByRaw?: string,
  ) {
    if (!fechaInicio?.trim()) {
      throw new BadRequestException('fechaInicio es obligatorio (YYYY-MM-DD)');
    }

    if (!fechaFin?.trim()) {
      throw new BadRequestException('fechaFin es obligatorio (YYYY-MM-DD)');
    }

    const seasonId = this.parseOptionalPositiveInt(seasonIdRaw, 'seasonId');
    const producerId = this.parseOptionalPositiveInt(producerIdRaw, 'producerId');

    const normalizedCalculationMode =
      (calculationModeRaw ?? 'devengado').toLowerCase();
    const allowedCalculationModes = ['devengado', 'liquidado'];

    if (!allowedCalculationModes.includes(normalizedCalculationMode)) {
      throw new BadRequestException(
        'calculationMode debe ser devengado o liquidado',
      );
    }

    const normalizedGroupBy = (groupByRaw ?? 'month').toLowerCase();
    const allowedGroupBy = ['day', 'week', 'month'];

    if (!allowedGroupBy.includes(normalizedGroupBy)) {
      throw new BadRequestException('groupBy debe ser day, week o month');
    }

    let status: AdvanceStatusEnum | undefined;
    if (statusRaw?.trim()) {
      const normalizedStatus = statusRaw.toLowerCase();
      const allowedStatus = [
        AdvanceStatusEnum.PAID,
        AdvanceStatusEnum.SETTLED,
        AdvanceStatusEnum.CANCELLED,
      ];

      if (!allowedStatus.includes(normalizedStatus as AdvanceStatusEnum)) {
        throw new BadRequestException('status debe ser paid, settled o cancelled');
      }

      status = normalizedStatus as AdvanceStatusEnum;
    }

    this.logger.log(
      `[GET] /analytics/financial-services/interests - fechaInicio: ${fechaInicio}, fechaFin: ${fechaFin}, seasonId: ${seasonId ?? 'ALL'}, producerId: ${producerId ?? 'ALL'}, status: ${status ?? 'ALL'}, calculationMode: ${normalizedCalculationMode}, groupBy: ${normalizedGroupBy}`,
    );

    return this.analyticsService.getFinancialServicesInterestReport({
      fechaInicio,
      fechaFin,
      seasonId,
      producerId,
      status,
      calculationMode: normalizedCalculationMode as 'devengado' | 'liquidado',
      groupBy: normalizedGroupBy as 'day' | 'week' | 'month',
    });
  }

  // ===== REPORTE 3: RENTABILIDAD SERVICIOS FINANCIEROS =====
  @Get('financial-services/profitability')
  async getFinancialProfitabilityReport(
    @Query('seasonId', ParseIntPipe) seasonId: number,
    @Query('cutoffDate') cutoffDate?: string,
    @Query('producerId') producerIdRaw?: string,
    @Query('calculationMode') calculationModeRaw?: string,
  ) {
    const producerId = this.parseOptionalPositiveInt(producerIdRaw, 'producerId');

    const normalizedCalculationMode =
      (calculationModeRaw ?? 'devengado').toLowerCase();
    const allowedCalculationModes = ['devengado', 'liquidado'];

    if (!allowedCalculationModes.includes(normalizedCalculationMode)) {
      throw new BadRequestException(
        'calculationMode debe ser devengado o liquidado',
      );
    }

    this.logger.log(
      `[GET] /analytics/financial-services/profitability - seasonId: ${seasonId}, cutoffDate: ${cutoffDate ?? 'TODAY'}, producerId: ${producerId ?? 'ALL'}, calculationMode: ${normalizedCalculationMode}`,
    );

    return this.analyticsService.getFinancialProfitabilityReport({
      seasonId,
      cutoffDate,
      producerId,
      calculationMode: normalizedCalculationMode as 'devengado' | 'liquidado',
    });
  }

  // ===== REPORTE 4: RETORNO DE PRESUPUESTO =====
  @Get('budget-return')
  async getBudgetReturnReport(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('seasonId') seasonIdRaw?: string,
    @Query('producerId') producerIdRaw?: string,
  ) {
    if (!fechaInicio?.trim()) {
      throw new BadRequestException('fechaInicio es obligatorio (YYYY-MM-DD)');
    }

    if (!fechaFin?.trim()) {
      throw new BadRequestException('fechaFin es obligatorio (YYYY-MM-DD)');
    }

    const seasonId = this.parseOptionalPositiveInt(seasonIdRaw, 'seasonId');
    const producerId = this.parseOptionalPositiveInt(producerIdRaw, 'producerId');

    this.logger.log(
      `[GET] /analytics/budget-return - fechaInicio: ${fechaInicio}, fechaFin: ${fechaFin}, seasonId: ${seasonId ?? 'ALL'}, producerId: ${producerId ?? 'ALL'}`,
    );

    return this.analyticsService.getBudgetReturnReport({
      fechaInicio,
      fechaFin,
      seasonId,
      producerId,
    });
  }

  // ===== REPORTE 5: RENDIMIENTO DE PROCESO =====
  @Get('process-yield')
  async getProcessYieldReport(
    @Query('seasonId', ParseIntPipe) seasonId: number,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('producerId') producerIdRaw?: string,
    @Query('riceTypeId') riceTypeIdRaw?: string,
    @Query('groupBy') groupByRaw?: string,
  ) {
    if (
      (fechaInicio?.trim() && !fechaFin?.trim()) ||
      (fechaFin?.trim() && !fechaInicio?.trim())
    ) {
      throw new BadRequestException(
        'fechaInicio y fechaFin deben enviarse juntos (YYYY-MM-DD)',
      );
    }

    const producerId = this.parseOptionalPositiveInt(producerIdRaw, 'producerId');
    const riceTypeId = this.parseOptionalPositiveInt(riceTypeIdRaw, 'riceTypeId');

    const normalizedGroupBy = (groupByRaw ?? 'month').toLowerCase();
    const allowedGroupBy = ['day', 'week', 'month'];

    if (!allowedGroupBy.includes(normalizedGroupBy)) {
      throw new BadRequestException('groupBy debe ser day, week o month');
    }

    this.logger.log(
      `[GET] /analytics/process-yield - seasonId: ${seasonId}, fechaInicio: ${fechaInicio ?? 'SEASON_START'}, fechaFin: ${fechaFin ?? 'SEASON_END'}, producerId: ${producerId ?? 'ALL'}, riceTypeId: ${riceTypeId ?? 'ALL'}, groupBy: ${normalizedGroupBy}`,
    );

    return this.analyticsService.getProcessYieldReport({
      seasonId,
      fechaInicio,
      fechaFin,
      producerId,
      riceTypeId,
      groupBy: normalizedGroupBy as 'day' | 'week' | 'month',
    });
  }

  // ===== PROYECCIÓN DE CAJA =====
  @Get('cash-projection')
  async getCashProjectionReport(
    @Query('seasonId') seasonIdRaw?: string,
  ) {
    const seasonId = this.parseOptionalPositiveInt(seasonIdRaw, 'seasonId');

    this.logger.log(
      `[GET] /analytics/cash-projection - seasonId: ${seasonId ?? 'ACTIVE'}`,
    );

    return this.analyticsService.getCashProjectionReport(seasonId);
  }

  // ===== VOLUMEN Y PRECIO =====
  @Get('volume-price')
  async getVolumePriceReport(
    @Query('seasonId', ParseIntPipe) seasonId: number,
    @Query('riceTypeId') riceTypeIdRaw?: string,
  ) {
    const riceTypeId = this.parseOptionalPositiveInt(riceTypeIdRaw, 'riceTypeId');

    this.logger.log(
      `[GET] /analytics/volume-price - seasonId: ${seasonId}, riceTypeId: ${riceTypeId ?? 'ALL'}`,
    );

    return this.analyticsService.getVolumePriceReport(seasonId, riceTypeId);
  }

  @Get('volume-price/by-producer')
  async getVolumePriceByProducer(
    @Query('seasonId', ParseIntPipe) seasonId: number,
    @Query('riceTypeId') riceTypeIdRaw?: string,
  ) {
    const riceTypeId = this.parseOptionalPositiveInt(riceTypeIdRaw, 'riceTypeId');

    this.logger.log(
      `[GET] /analytics/volume-price/by-producer - seasonId: ${seasonId}, riceTypeId: ${riceTypeId ?? 'ALL'}`,
    );

    return this.analyticsService.getVolumePriceByProducerReport(
      seasonId,
      riceTypeId,
    );
  }

  @Get('volume-price/producer/:producerId')
  async getVolumePriceProducerDetail(
    @Param('producerId', ParseIntPipe) producerId: number,
    @Query('seasonId', ParseIntPipe) seasonId: number,
    @Query('riceTypeId') riceTypeIdRaw?: string,
  ) {
    const riceTypeId = this.parseOptionalPositiveInt(riceTypeIdRaw, 'riceTypeId');

    this.logger.log(
      `[GET] /analytics/volume-price/producer/${producerId} - seasonId: ${seasonId}, riceTypeId: ${riceTypeId ?? 'ALL'}`,
    );

    return this.analyticsService.getVolumePriceProducerDetailReport(
      producerId,
      seasonId,
      riceTypeId,
    );
  }

  // ===== LIBRO DE EXISTENCIAS VIRTUAL =====
  @Get('inventory-book')
  async getInventoryBook(
    @Query('seasonId', ParseIntPipe) seasonId: number,
    @Query('month') month: string,
  ) {
    if (!month?.trim()) {
      throw new BadRequestException('month es obligatorio con formato YYYY-MM');
    }

    this.logger.log(
      `[GET] /analytics/inventory-book - seasonId: ${seasonId}, month: ${month}`,
    );

    return this.analyticsService.getInventoryBookMonthlyReport(seasonId, month);
  }

  @Get('inventory-book/season-summary')
  async getInventoryBookSeasonSummary(
    @Query('seasonId', ParseIntPipe) seasonId: number,
  ) {
    this.logger.log(
      `[GET] /analytics/inventory-book/season-summary - seasonId: ${seasonId}`,
    );

    return this.analyticsService.getInventoryBookSeasonSummary(seasonId);
  }

  @Get('inventory-book/export/excel')
  async exportInventoryBookExcel(
    @Res() response: Response,
    @Query('seasonId', ParseIntPipe) seasonId: number,
    @Query('month') month: string,
  ): Promise<void> {
    if (!month?.trim()) {
      throw new BadRequestException('month es obligatorio con formato YYYY-MM');
    }

    this.logger.log(
      `[GET] /analytics/inventory-book/export/excel - seasonId: ${seasonId}, month: ${month}`,
    );

    try {
      const { fileName, fileBuffer } = await this.analyticsService.generateInventoryBookExcel(
        seasonId,
        month,
      );

      response.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      response.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      response.setHeader('Content-Length', fileBuffer.length.toString());
      response.send(fileBuffer);
    } catch (error) {
      this.logger.error(`Error exporting inventory book: ${error}`);
      throw error;
    }
  }

  // ===== IVA CREDITO VS DEBITO =====
  @Get('tax/iva')
  async getIvaTaxReport(
    @Query('seasonId', ParseIntPipe) seasonId: number,
    @Query('month') month?: string,
  ) {
    this.logger.log(
      `[GET] /analytics/tax/iva - seasonId: ${seasonId}, month: ${month ?? 'ALL'}`,
    );

    return this.analyticsService.getIvaTaxReport(seasonId, month);
  }

  // ===== PRECIO POR TIPO DE ARROZ =====
  @Get('rice-price')
  async getRicePriceReport(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('riceTypeId') riceTypeIdRaw?: string,
    @Query('groupBy') groupByRaw?: string,
  ) {
    if (!fechaInicio?.trim()) {
      throw new BadRequestException('fechaInicio es obligatorio (YYYY-MM-DD)');
    }

    if (!fechaFin?.trim()) {
      throw new BadRequestException('fechaFin es obligatorio (YYYY-MM-DD)');
    }

    const riceTypeId = this.parseOptionalPositiveInt(riceTypeIdRaw, 'riceTypeId');

    const normalizedGroupBy = (groupByRaw ?? 'month').toLowerCase();
    const allowedGroupBy = ['day', 'week', 'month'];

    if (!allowedGroupBy.includes(normalizedGroupBy)) {
      throw new BadRequestException('groupBy debe ser day, week o month');
    }

    this.logger.log(
      `[GET] /analytics/rice-price - fechaInicio: ${fechaInicio}, fechaFin: ${fechaFin}, riceTypeId: ${riceTypeId ?? 'ALL'}, groupBy: ${normalizedGroupBy}`,
    );

    return this.analyticsService.getRicePriceReport({
      fechaInicio,
      fechaFin,
      riceTypeId,
      groupBy: normalizedGroupBy as 'day' | 'week' | 'month',
    });
  }
}
