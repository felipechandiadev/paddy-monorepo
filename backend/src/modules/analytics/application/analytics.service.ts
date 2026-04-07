import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import { DateTime } from 'luxon';
import {
  parseDateInput,
  formatDateString,
  getISOWeek,
  toMonthKey,
  daysBetween,
  buildMonthKeysInRange,
  buildWeekKeysInRange,
  buildDayKeysInRange,
} from '@shared/utils/luxon-utils';
import { Reception } from '@modules/operations/domain/operations.entity';
import {
  Advance,
  Settlement,
  Transaction,
} from '@modules/finances/domain/finances.entity';
import { Producer } from '@modules/producers/domain/producer.entity';
import { Season } from '@modules/configuration/domain/configuration.entity';
import {
  AdvanceStatusEnum,
  ReceptionStatusEnum,
  SettlementStatusEnum,
  TransactionTypeEnum,
} from '@shared/enums';

type DryingGroupBy = 'day' | 'week' | 'month';
type DryingReceptionStatusFilter = 'settled' | 'analyzed' | 'analyzed_settled';

interface DryingRevenueReportFilters {
  fechaInicio: string;
  fechaFin: string;
  seasonId?: number;
  producerId?: number;
  riceTypeId?: number;
  receptionStatus?: DryingReceptionStatusFilter;
  groupBy?: DryingGroupBy;
}

type FinancialServicesGroupBy = 'day' | 'week' | 'month';
type InterestCalculationMode = 'devengado' | 'liquidado';

interface FinancialServicesInterestReportFilters {
  fechaInicio: string;
  fechaFin: string;
  seasonId?: number;
  producerId?: number;
  status?: AdvanceStatusEnum;
  calculationMode?: InterestCalculationMode;
  groupBy?: FinancialServicesGroupBy;
}

interface FinancialProfitabilityReportFilters {
  seasonId: number;
  cutoffDate?: string;
  producerId?: number;
  calculationMode?: InterestCalculationMode;
}

interface BudgetReturnReportFilters {
  fechaInicio: string;
  fechaFin: string;
  seasonId?: number;
  producerId?: number;
}

interface ProcessYieldReportFilters {
  seasonId: number;
  fechaInicio?: string;
  fechaFin?: string;
  producerId?: number;
  riceTypeId?: number;
  groupBy?: DryingGroupBy;
}

interface RicePriceReportFilters {
  fechaInicio: string;
  fechaFin: string;
  riceTypeId?: number;
  groupBy?: DryingGroupBy;
}

interface CompletedSettlementDataset {
  season: Season;
  settlementsMap: Map<number, Settlement>;
  settlementPaymentDateMap: Map<number, Date>;
  receptions: Reception[];
}

interface SettlementPurchaseEntry {
  settlementId: number;
  settlement: Settlement;
  purchaseDate: Date;
  purchasedKg: number;
  totalAmount: number;
  purchaseInvoice: string | null;
}

@Injectable()
export class AnalyticsService {
  private static readonly IVA_RATE = 0.19;

  constructor(
    @InjectRepository(Reception)
    private receptionsRepository: Repository<Reception>,
    @InjectRepository(Advance)
    private advancesRepository: Repository<Advance>,
    @InjectRepository(Settlement)
    private settlementsRepository: Repository<Settlement>,
    @InjectRepository(Producer)
    private producersRepository: Repository<Producer>,
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @InjectRepository(Season)
    private seasonsRepository: Repository<Season>,
  ) {}

  private toNumber(value: unknown): number {
    if (value === null || value === undefined || value === '') {
      return 0;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private round2(value: number): number {
    return Math.round(value * 100) / 100;
  }

  private roundCurrency(value: number): number {
    if (!Number.isFinite(value)) {
      return 0;
    }

    return Math.round(value);
  }

  private parseDateInput(value?: Date | string | null): Date | null {
    if (!value) {
      return null;
    }

    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : value;
    }

    const normalized = /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? `${value}T00:00:00`
      : value;
    const parsed = new Date(normalized);

    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  private calculateAdvanceAccruedInterest(
    advance: Advance,
    referenceDate: Date,
  ): number {
    if (!advance.isInterestCalculationEnabled) {
      return 0;
    }

    const issueDate = this.parseDateInput(advance.issueDate);
    if (!issueDate) {
      return 0;
    }

    const configuredEndDate = this.parseDateInput(advance.interestEndDate ?? null);
    const effectiveEndDate = configuredEndDate && configuredEndDate < referenceDate
      ? configuredEndDate
      : referenceDate;

    const diffInMs = effectiveEndDate.getTime() - issueDate.getTime();
    const daysActive = Math.max(0, diffInMs / (1000 * 60 * 60 * 24));
    const monthsActive = daysActive / 30;
    const amount = this.toNumber(advance.amount);
    const interestRate = this.toNumber(advance.interestRate);

    return this.roundCurrency((amount * interestRate * monthsActive) / 100);
  }

  private calculateAdvanceAccruedDays(
    advance: Advance,
    referenceDate: Date,
  ): number {
    if (!advance.isInterestCalculationEnabled) {
      return 0;
    }

    const issueDate = this.parseDateInput(advance.issueDate);
    if (!issueDate) {
      return 0;
    }

    const configuredEndDate = this.parseDateInput(advance.interestEndDate ?? null);
    const effectiveEndDate = configuredEndDate && configuredEndDate < referenceDate
      ? configuredEndDate
      : referenceDate;

    const diffInMs = effectiveEndDate.getTime() - issueDate.getTime();
    return Math.max(0, Math.floor(diffInMs / (1000 * 60 * 60 * 24)));
  }

  private formatMonthKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  private parseMonthKey(month: string): { start: Date; endExclusive: Date } {
    const normalized = String(month ?? '').trim();

    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(normalized)) {
      throw new BadRequestException('month debe tener formato YYYY-MM');
    }

    const [yearPart, monthPart] = normalized.split('-');
    const year = Number(yearPart);
    const monthIndex = Number(monthPart) - 1;

    const start = new Date(year, monthIndex, 1, 0, 0, 0, 0);
    const endExclusive = new Date(year, monthIndex + 1, 1, 0, 0, 0, 0);

    return { start, endExclusive };
  }

  private toMonthKeyFromDate(value: Date | string | null | undefined): string | null {
    if (!value) {
      return null;
    }

    const parsed = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }

    return this.formatMonthKey(parsed);
  }

  private getPurchaseEventDate(
    settlement: Settlement,
    settlementPaymentDate: Date | string | null,
  ): Date | null {
    return (
      this.parseDateInput(settlementPaymentDate) ??
      this.parseDateInput(settlement.updatedAt) ??
      this.parseDateInput(settlement.issuedAt) ??
      this.parseDateInput(settlement.createdAt)
    );
  }

  private getSettlementPurchaseDate(
    settlement: Settlement,
    settlementPaymentDate: Date | string | null,
  ): Date | null {
    return (
      this.parseDateInput(settlement.settledAt) ??
      this.getPurchaseEventDate(settlement, settlementPaymentDate)
    );
  }

  private getSettlementPurchaseInvoiceNumber(settlement: Settlement): string | null {
    if (typeof settlement.purchaseInvoiceNumber === 'string') {
      const trimmedInvoice = settlement.purchaseInvoiceNumber.trim();
      if (trimmedInvoice.length > 0) {
        return trimmedInvoice;
      }
    }

    const calculationDetails = settlement.calculationDetails;
    if (!calculationDetails || typeof calculationDetails !== 'object') {
      return null;
    }

    const topLevelInvoice = calculationDetails.purchaseInvoiceNumber;
    if (typeof topLevelInvoice === 'string' && topLevelInvoice.trim().length > 0) {
      return topLevelInvoice.trim();
    }

    const purchaseInvoice =
      calculationDetails.purchaseInvoice &&
      typeof calculationDetails.purchaseInvoice === 'object'
        ? (calculationDetails.purchaseInvoice as Record<string, unknown>)
        : null;

    if (
      purchaseInvoice &&
      typeof purchaseInvoice.invoiceNumber === 'string' &&
      purchaseInvoice.invoiceNumber.trim().length > 0
    ) {
      return purchaseInvoice.invoiceNumber.trim();
    }

    return null;
  }

  private buildSeasonMonthKeys(season: Season): string[] {
    const startDate = new Date(season.startDate);
    const endDate = new Date(season.endDate);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return [];
    }

    const cursor = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      1,
      0,
      0,
      0,
      0,
    );
    const endCursor = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      1,
      0,
      0,
      0,
      0,
    );

    const monthKeys: string[] = [];

    while (cursor <= endCursor) {
      monthKeys.push(this.formatMonthKey(cursor));
      cursor.setMonth(cursor.getMonth() + 1);
    }

    return monthKeys;
  }

  private parseDateRange(
    fechaInicio: string,
    fechaFin: string,
  ): { start: Date; endExclusive: Date } {
    const startValue = String(fechaInicio ?? '').trim();
    const endValue = String(fechaFin ?? '').trim();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(startValue)) {
      throw new BadRequestException('fechaInicio debe tener formato YYYY-MM-DD');
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(endValue)) {
      throw new BadRequestException('fechaFin debe tener formato YYYY-MM-DD');
    }

    const start = new Date(`${startValue}T00:00:00`);
    const end = new Date(`${endValue}T00:00:00`);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new BadRequestException('Rango de fechas invalido');
    }

    if (end < start) {
      throw new BadRequestException('fechaFin debe ser mayor o igual a fechaInicio');
    }

    const endExclusive = new Date(end);
    endExclusive.setDate(endExclusive.getDate() + 1);

    return { start, endExclusive };
  }

  private toDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private toIsoWeekKey(date: Date): string {
    const target = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    );
    const dayNr = (target.getUTCDay() + 6) % 7;
    target.setUTCDate(target.getUTCDate() - dayNr + 3);

    const isoYear = target.getUTCFullYear();
    const firstThursday = new Date(Date.UTC(isoYear, 0, 4));
    const firstDayNr = (firstThursday.getUTCDay() + 6) % 7;
    firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNr + 3);

    const week =
      1 + Math.round((target.getTime() - firstThursday.getTime()) / 604800000);

    return `${isoYear}-W${String(week).padStart(2, '0')}`;
  }

  private getDryingPeriodKey(date: Date, groupBy: DryingGroupBy): string {
    if (groupBy === 'day') {
      return this.toDateKey(date);
    }

    if (groupBy === 'week') {
      return this.toIsoWeekKey(date);
    }

    return this.formatMonthKey(date);
  }

  private getFinancialPeriodKey(
    date: Date,
    groupBy: FinancialServicesGroupBy,
  ): string {
    if (groupBy === 'day') {
      return this.toDateKey(date);
    }

    if (groupBy === 'week') {
      return this.toIsoWeekKey(date);
    }

    return this.formatMonthKey(date);
  }

  private buildMonthKeysFromRange(start: Date, endExclusive: Date): string[] {
    const monthKeys: string[] = [];
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1, 0, 0, 0, 0);
    const endInclusive = new Date(endExclusive);
    endInclusive.setDate(endInclusive.getDate() - 1);
    const lastMonth = new Date(
      endInclusive.getFullYear(),
      endInclusive.getMonth(),
      1,
      0,
      0,
      0,
      0,
    );

    while (cursor <= lastMonth) {
      monthKeys.push(this.formatMonthKey(cursor));
      cursor.setMonth(cursor.getMonth() + 1);
    }

    return monthKeys;
  }

  private buildWeekKeysFromRange(start: Date, endExclusive: Date): string[] {
    const weekKeys: string[] = [];
    const cursor = new Date(start);
    const endDate = new Date(endExclusive);
    endDate.setDate(endDate.getDate() - 1);

    while (cursor <= endDate) {
      weekKeys.push(this.toIsoWeekKey(cursor));
      cursor.setDate(cursor.getDate() + 7);
    }

    // Remove duplicates and sort
    return Array.from(new Set(weekKeys)).sort();
  }

  private buildDayKeysFromRange(start: Date, endExclusive: Date): string[] {
    const dayKeys: string[] = [];
    const cursor = new Date(start);
    const endDate = new Date(endExclusive);
    endDate.setDate(endDate.getDate() - 1);

    while (cursor <= endDate) {
      dayKeys.push(this.toDateKey(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }

    return dayKeys;
  }

  private calculateProcessLossBreakdown(
    grossKg: number,
    netKg: number,
    impuritiesPct: number,
    vanoPct: number,
    humidityPct: number,
  ): {
    impuritiesLossKg: number;
    vanoLossKg: number;
    humidityLossKg: number;
    shrinkageKg: number;
    yieldPct: number;
  } {
    const safeGross = Math.max(0, this.round2(grossKg));
    const safeNet = Math.max(0, this.round2(netKg));
    const actualShrinkage = Math.max(0, this.round2(safeGross - safeNet));

    if (safeGross <= 0) {
      return {
        impuritiesLossKg: 0,
        vanoLossKg: 0,
        humidityLossKg: 0,
        shrinkageKg: 0,
        yieldPct: 0,
      };
    }

    const rawImpuritiesLoss = this.round2((safeGross * Math.max(0, impuritiesPct)) / 100);
    const rawVanoLoss = this.round2((safeGross * Math.max(0, vanoPct)) / 100);
    const afterImpuritiesAndVano = Math.max(0, safeGross - rawImpuritiesLoss - rawVanoLoss);
    const rawHumidityLoss = this.round2(
      (afterImpuritiesAndVano * Math.max(0, humidityPct)) / 100,
    );

    const rawTotalLoss = rawImpuritiesLoss + rawVanoLoss + rawHumidityLoss;
    let impuritiesLossKg = rawImpuritiesLoss;
    let vanoLossKg = rawVanoLoss;

    if (rawTotalLoss > 0) {
      const factor = actualShrinkage / rawTotalLoss;
      impuritiesLossKg = this.round2(rawImpuritiesLoss * factor);
      vanoLossKg = this.round2(rawVanoLoss * factor);
    }

    const humidityLossKg = this.round2(
      Math.max(0, actualShrinkage - impuritiesLossKg - vanoLossKg),
    );

    return {
      impuritiesLossKg,
      vanoLossKg,
      humidityLossKg,
      shrinkageKg: actualShrinkage,
      yieldPct: this.round2((safeNet / safeGross) * 100),
    };
  }

  // ===== REPORTES GENERALES =====
  async getDashboardStats(seasonId?: number) {
    const where = { deletedAt: IsNull() };
    if (seasonId) {
      where['seasonId'] = seasonId;
    }

    const [totalReceptions, analyzedReceptions, settledReceptions] =
      await Promise.all([
        this.receptionsRepository.count({ where }),
        this.receptionsRepository.count({
          where: { ...where, status: ReceptionStatusEnum.ANALYZED },
        }),
        this.receptionsRepository.count({
          where: { ...where, status: ReceptionStatusEnum.SETTLED },
        }),
      ]);

    const totalRice = await this.receptionsRepository
      .createQueryBuilder('r')
      .select('SUM(r.finalNetWeight)', 'total')
      .where('r.deletedAt IS NULL')
      .getRawOne();

    return {
      totalReceptions,
      analyzedReceptions,
      settledReceptions,
      pendingReceptions: totalReceptions - analyzedReceptions,
      totalRiceKg: this.toNumber(totalRice?.total),
    };
  }

  // ===== REPORTES POR PRODUCTOR =====
  async getProducerStats(producerId: number) {
    const producer = await this.producersRepository.findOne({
      where: { id: producerId, deletedAt: IsNull() },
    });

    if (!producer) {
      return null;
    }

    const receptions = await this.receptionsRepository.find({
      where: { producerId, deletedAt: IsNull() },
      take: 50000,
    });

    const totalReceptions = receptions.length;
    const totalRiceKg = receptions.reduce(
      (sum, r) => sum + this.toNumber(r.finalNetWeight ?? r.netWeight),
      0,
    );

    const totalRevenue = receptions.reduce((sum, r) => {
      const weight = this.toNumber(r.finalNetWeight ?? r.netWeight);
      return sum + weight * this.toNumber(r.ricePrice);
    }, 0);

    const settlements = await this.settlementsRepository.find({
      where: {
        producerId,
        status: SettlementStatusEnum.COMPLETED,
        deletedAt: IsNull(),
      },
      take: 50000,
    });

    const totalPayments = settlements.reduce(
      (sum, s) => sum + this.toNumber(s.amountDue),
      0,
    );

    return {
      producer: {
        id: producer.id,
        name: producer.name,
        rut: producer.rut,
      },
      receptions: totalReceptions,
      totalRiceKg: Math.round(totalRiceKg * 100) / 100,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalPayments: Math.round(totalPayments * 100) / 100,
      pendingPayment: Math.round((totalRevenue - totalPayments) * 100) / 100,
      debt: this.toNumber(producer.totalDebt),
    };
  }

  // ===== REPORTES DE TEMPORADA =====
  async getSeasonReport(seasonId: number) {
    const receptions = await this.receptionsRepository.find({
      where: { seasonId, deletedAt: IsNull() },
      relations: ['producer', 'riceType'],
      take: 50000,
    });

    if (receptions.length === 0) {
      return null;
    }

    const byProducer = {};
    const byRiceType = {};

    let grandTotalKg = 0;
    let grandTotalRevenue = 0;
    let totalDiscounts = 0;

    receptions.forEach((r) => {
      // Acumulación por productor
      if (!byProducer[r.producerId]) {
        byProducer[r.producerId] = {
          producerName: r.producer?.name,
          count: 0,
          totalKg: 0,
          totalRevenue: 0,
        };
      }

      byProducer[r.producerId].count++;
      const weight = this.toNumber(r.finalNetWeight ?? r.netWeight);
      byProducer[r.producerId].totalKg += weight;
      byProducer[r.producerId].totalRevenue += weight * this.toNumber(r.ricePrice);

      // Acumulación por tipo de arroz
      if (!byRiceType[r.riceTypeId]) {
        byRiceType[r.riceTypeId] = {
          riceTypeName: r.riceType?.name,
          count: 0,
          totalKg: 0,
        };
      }

      byRiceType[r.riceTypeId].count++;
      byRiceType[r.riceTypeId].totalKg += weight;

      // Totales globales
      grandTotalKg += weight;
      grandTotalRevenue += weight * this.toNumber(r.ricePrice);
      totalDiscounts += this.toNumber(r.totalDiscountKg);
    });

    return {
      seasonId,
      summary: {
        totalReceptions: receptions.length,
        totalKg: Math.round(grandTotalKg * 100) / 100,
        totalRevenue: Math.round(grandTotalRevenue * 100) / 100,
        totalDiscounts: Math.round(totalDiscounts * 100) / 100,
      },
      byProducer: Object.values(byProducer),
      byRiceType: Object.values(byRiceType),
    };
  }

  // ===== ANÁLISIS DE CALIDAD =====
  async getQualityReport(seasonId?: number) {
    const where = { status: ReceptionStatusEnum.ANALYZED, deletedAt: IsNull() };
    if (seasonId) {
      where['seasonId'] = seasonId;
    }

    const receptions = await this.receptionsRepository.find({
      where,
      relations: ['analysisRecord'],
      take: 50000,
    });

    if (receptions.length === 0) {
      return null;
    }

    let averageHumedad = 0;
    let averageImpurezas = 0;
    let humedadRecordsWithData = 0;
    let impurezasRecordsWithData = 0;

    receptions.forEach((r) => {
      if (r.analysisRecord) {
        const analysis = r.analysisRecord;
        const humedadValue = Number(
          analysis.humedadValue ?? analysis.humedadRange ?? 0,
        );
        const impurezasValue = Number(
          analysis.impurezasValue ?? analysis.impurezasRange ?? 0,
        );

        if (humedadValue > 0) {
          averageHumedad += humedadValue;
          humedadRecordsWithData++;
        }

        if (impurezasValue > 0) {
          averageImpurezas += impurezasValue;
          impurezasRecordsWithData++;
        }
      }
    });

    return {
      totalAnalyzed: receptions.length,
      averageHumedad:
        humedadRecordsWithData > 0
          ? Math.round((averageHumedad / humedadRecordsWithData) * 100) / 100
          : 0,
      averageImpurezas:
        impurezasRecordsWithData > 0
          ? Math.round((averageImpurezas / impurezasRecordsWithData) * 100) / 100
          : 0,
      totalDiscountedKg: receptions.reduce(
        (sum, r) => sum + this.toNumber(r.totalDiscountKg),
        0,
      ),
    };
  }

  // ===== ANÁLISIS FINANCIERO =====
  async getFinancialReport(seasonId?: number) {
    const where = { status: SettlementStatusEnum.COMPLETED, deletedAt: IsNull() };
    if (seasonId) {
      where['seasonId'] = seasonId;
    }

    const settlements = await this.settlementsRepository.find({
      where,
      take: 50000,
    });

    if (settlements.length === 0) {
      return null;
    }

    const totalSettled = settlements.reduce(
      (sum, s) => sum + this.toNumber(s.amountDue),
      0,
    );

    const totalIVA = settlements.reduce(
      (sum, s) =>
        sum +
        this.toNumber(s.ivaRice) +
        this.toNumber(s.ivaServices) +
        this.round2(this.toNumber(s.totalInterest) * AnalyticsService.IVA_RATE),
      0,
    );

    const totalAdvances = settlements.reduce(
      (sum, s) => sum + this.toNumber(s.totalAdvances),
      0,
    );

    return {
      totalSettles: settlements.length,
      totalSettledAmount: Math.round(totalSettled * 100) / 100,
      totalIVA: Math.round(totalIVA * 100) / 100,
      totalAdvances: Math.round(totalAdvances * 100) / 100,
      averagePerSettlement:
        Math.round((totalSettled / settlements.length) * 100) / 100,
    };
  }

  // ===== REPORTE 1: SECADO =====
  async getDryingRevenueReport(filters: DryingRevenueReportFilters) {
    const { start, endExclusive } = this.parseDateRange(
      filters.fechaInicio,
      filters.fechaFin,
    );
    const groupBy: DryingGroupBy = filters.groupBy ?? 'month';
    const receptionStatus: DryingReceptionStatusFilter =
      filters.receptionStatus ?? 'analyzed_settled';
    const includeSettled =
      receptionStatus === 'settled' || receptionStatus === 'analyzed_settled';
    const includeAnalyzed =
      receptionStatus === 'analyzed' || receptionStatus === 'analyzed_settled';

    const season = filters.seasonId
      ? await this.getSeasonOrFail(filters.seasonId)
      : null;

    const assumptions = {
      universe: includeSettled && includeAnalyzed
        ? 'recepciones analizadas y liquidadas (excluye anuladas)'
        : includeSettled
          ? 'recepciones liquidadas en liquidaciones completadas'
          : 'recepciones analizadas',
      fechaCorte: includeSettled && includeAnalyzed
        ? 'liquidadas: fecha de liquidacion/pago; analizadas: fecha de recepcion'
        : includeSettled
          ? 'fecha de liquidacion/pago'
          : 'fecha de recepcion',
      ivaMode: 'IVA secado estimado',
      formula: 'round((netWeight * ricePrice) * (dryPercent / 100))',
    };

    const emptyResponse = {
      reportName: 'Informe Consolidado de Servicios de Secado',
      period: {
        fechaInicio: filters.fechaInicio,
        fechaFin: filters.fechaFin,
        groupBy,
        receptionStatus,
        seasonId: filters.seasonId ?? null,
        producerId: filters.producerId ?? null,
        riceTypeId: filters.riceTypeId ?? null,
      },
      season: season
        ? {
            id: season.id,
            code: season.code,
            name: season.name,
            year: season.year,
          }
        : null,
      summary: {
        receptionsWithDryingCount: 0,
        affectedPaddyKg: 0,
        averageDryPercent: 0,
        netDryingRevenue: 0,
        estimatedDryingVat: 0,
        totalDryingRevenue: 0,
        topProducerByDrying: null,
        topRiceTypeByDrying: null,
      },
      trend: [],
      byProducer: [],
      byRiceType: [],
      detail: [],
      assumptions,
    };

    const settlementsMap = new Map<number, Settlement>();
    const settlementPaymentDateMap = new Map<number, Date>();

    if (includeSettled) {
      const settlementsWhere: Record<string, unknown> = {
        status: SettlementStatusEnum.COMPLETED,
        deletedAt: IsNull(),
      };

      if (filters.seasonId) {
        settlementsWhere.seasonId = filters.seasonId;
      }

      if (filters.producerId) {
        settlementsWhere.producerId = filters.producerId;
      }

      const settlements = await this.settlementsRepository.find({
        where: settlementsWhere,
        relations: ['producer'],
        order: { updatedAt: 'ASC' },
        take: 50000,
      });

      if (settlements.length === 0 && !includeAnalyzed) {
        return emptyResponse;
      }

      for (const settlement of settlements) {
        settlementsMap.set(settlement.id, settlement);
      }

      const settlementIds = settlements.map((settlement) => settlement.id);
      if (settlementIds.length > 0) {
        const settlementTransactions = await this.transactionsRepository.find({
          where: {
            settlementId: In(settlementIds),
            type: TransactionTypeEnum.SETTLEMENT,
            deletedAt: IsNull(),
          },
          order: { createdAt: 'DESC' },
          take: 50000,
        });

        for (const transaction of settlementTransactions) {
          if (
            !transaction.settlementId ||
            settlementPaymentDateMap.has(transaction.settlementId)
          ) {
            continue;
          }

          const paymentDate = this.parseDateInput(
            transaction.transactionDate ?? transaction.createdAt,
          );

          if (!paymentDate) {
            continue;
          }

          settlementPaymentDateMap.set(transaction.settlementId, paymentDate);
        }
      }
    }

    const receptionsQuery = this.receptionsRepository
      .createQueryBuilder('reception')
      .leftJoinAndSelect('reception.producer', 'producer')
      .leftJoinAndSelect('reception.riceType', 'riceType')
      .leftJoinAndSelect('reception.analysisRecord', 'analysisRecord')
      .where('reception.deletedAt IS NULL');

    if (filters.seasonId) {
      receptionsQuery.andWhere('reception.seasonId = :seasonId', {
        seasonId: filters.seasonId,
      });
    }

    if (filters.producerId) {
      receptionsQuery.andWhere('reception.producerId = :producerId', {
        producerId: filters.producerId,
      });
    }

    if (filters.riceTypeId) {
      receptionsQuery.andWhere('reception.riceTypeId = :riceTypeId', {
        riceTypeId: filters.riceTypeId,
      });
    }

    if (receptionStatus === 'settled') {
      receptionsQuery.andWhere('reception.status = :settledStatus', {
        settledStatus: ReceptionStatusEnum.SETTLED,
      });
    } else if (receptionStatus === 'analyzed') {
      receptionsQuery.andWhere('reception.status = :analyzedStatus', {
        analyzedStatus: ReceptionStatusEnum.ANALYZED,
      });
    } else {
      receptionsQuery.andWhere('reception.status IN (:...allowedStatuses)', {
        allowedStatuses: [ReceptionStatusEnum.ANALYZED, ReceptionStatusEnum.SETTLED],
      });
    }

    const receptions = await receptionsQuery.getMany();

    const trendMap = new Map<
      string,
      {
        period: string;
        receptionsWithDryingCount: number;
        netDryingRevenue: number;
        estimatedDryingVat: number;
        totalDryingRevenue: number;
      }
    >();

    const producerMap = new Map<
      number,
      {
        producerId: number;
        producerName: string;
        producerRut: string | null;
        receptionsWithDryingCount: number;
        affectedPaddyKg: number;
        dryPercentSum: number;
        netDryingRevenue: number;
        estimatedDryingVat: number;
        totalDryingRevenue: number;
      }
    >();

    const riceTypeMap = new Map<
      number,
      {
        riceTypeId: number;
        riceTypeName: string;
        receptionsWithDryingCount: number;
        affectedPaddyKg: number;
        netDryingRevenue: number;
        estimatedDryingVat: number;
        totalDryingRevenue: number;
      }
    >();

    let receptionsWithDryingCount = 0;
    let affectedPaddyKg = 0;
    let dryPercentSum = 0;
    let netDryingRevenue = 0;
    let estimatedDryingVat = 0;
    let totalDryingRevenue = 0;

    const detail = [];

    for (const reception of receptions) {
      let settlement: Settlement | undefined;
      let cutDate: Date | null = null;

      if (reception.status === ReceptionStatusEnum.SETTLED) {
        if (!includeSettled || !reception.settlementId) {
          continue;
        }

        settlement = settlementsMap.get(reception.settlementId);
        if (!settlement) {
          continue;
        }

        cutDate = this.getPurchaseEventDate(
          settlement,
          settlementPaymentDateMap.get(reception.settlementId) ?? null,
        );
      } else if (reception.status === ReceptionStatusEnum.ANALYZED) {
        if (!includeAnalyzed) {
          continue;
        }

        cutDate = this.parseDateInput(reception.receptionDate ?? reception.createdAt);
      } else {
        continue;
      }

      if (!cutDate || cutDate < start || cutDate >= endExclusive) {
        continue;
      }

      const dryPercent = this.round2(
        this.toNumber(reception.analysisRecord?.dryPercent ?? reception.dryPercent),
      );

      if (dryPercent <= 0) {
        continue;
      }

      const paddyKg = this.round2(this.toNumber(reception.netWeight));
      const ricePrice = this.round2(this.toNumber(reception.ricePrice));
      const netPaddy = this.round2(paddyKg * ricePrice);
      const dryingNet = this.round2(netPaddy * (dryPercent / 100));
      const dryingVat = this.round2(dryingNet * AnalyticsService.IVA_RATE);
      const dryingTotal = this.round2(dryingNet + dryingVat);

      receptionsWithDryingCount += 1;
      affectedPaddyKg += paddyKg;
      dryPercentSum += dryPercent;
      netDryingRevenue += dryingNet;
      estimatedDryingVat += dryingVat;
      totalDryingRevenue += dryingTotal;

      const trendKey = this.getDryingPeriodKey(cutDate, groupBy);
      const trendBucket =
        trendMap.get(trendKey) ??
        {
          period: trendKey,
          receptionsWithDryingCount: 0,
          netDryingRevenue: 0,
          estimatedDryingVat: 0,
          totalDryingRevenue: 0,
        };

      trendBucket.receptionsWithDryingCount += 1;
      trendBucket.netDryingRevenue += dryingNet;
      trendBucket.estimatedDryingVat += dryingVat;
      trendBucket.totalDryingRevenue += dryingTotal;
      trendMap.set(trendKey, trendBucket);

      const producerBucket =
        producerMap.get(reception.producerId) ??
        {
          producerId: reception.producerId,
          producerName:
            reception.producer?.name ??
              settlement?.producer?.name ??
            `Productor ${reception.producerId}`,
            producerRut: reception.producer?.rut ?? settlement?.producer?.rut ?? null,
          receptionsWithDryingCount: 0,
          affectedPaddyKg: 0,
          dryPercentSum: 0,
          netDryingRevenue: 0,
          estimatedDryingVat: 0,
          totalDryingRevenue: 0,
        };

      producerBucket.receptionsWithDryingCount += 1;
      producerBucket.affectedPaddyKg += paddyKg;
      producerBucket.dryPercentSum += dryPercent;
      producerBucket.netDryingRevenue += dryingNet;
      producerBucket.estimatedDryingVat += dryingVat;
      producerBucket.totalDryingRevenue += dryingTotal;
      producerMap.set(reception.producerId, producerBucket);

      const riceTypeId = reception.riceTypeId ?? 0;
      const riceTypeBucket =
        riceTypeMap.get(riceTypeId) ??
        {
          riceTypeId,
          riceTypeName: reception.riceType?.name ?? 'Sin tipo',
          receptionsWithDryingCount: 0,
          affectedPaddyKg: 0,
          netDryingRevenue: 0,
          estimatedDryingVat: 0,
          totalDryingRevenue: 0,
        };

      riceTypeBucket.receptionsWithDryingCount += 1;
      riceTypeBucket.affectedPaddyKg += paddyKg;
      riceTypeBucket.netDryingRevenue += dryingNet;
      riceTypeBucket.estimatedDryingVat += dryingVat;
      riceTypeBucket.totalDryingRevenue += dryingTotal;
      riceTypeMap.set(riceTypeId, riceTypeBucket);

      detail.push({
        receptionId: reception.id,
        cutDate,
        receptionDate: reception.receptionDate ?? reception.createdAt,
        guideNumber: reception.guideNumber,
        producerName: producerBucket.producerName,
        producerRut: producerBucket.producerRut,
        riceTypeName: reception.riceType?.name ?? 'Sin tipo',
        paddyKg,
        ricePrice,
        dryPercent,
        netPaddy,
        netDryingRevenue: dryingNet,
        estimatedDryingVat: dryingVat,
        totalDryingRevenue: dryingTotal,
        receptionStatus: reception.status,
        settlementId: settlement?.id ?? null,
        settlementStatus: settlement?.status ?? null,
      });
    }

    if (receptionsWithDryingCount === 0) {
      return emptyResponse;
    }

    const byProducer = Array.from(producerMap.values())
      .map((item) => ({
        producerId: item.producerId,
        producerName: item.producerName,
        producerRut: item.producerRut,
        receptionsWithDryingCount: item.receptionsWithDryingCount,
        affectedPaddyKg: this.round2(item.affectedPaddyKg),
        averageDryPercent: this.round2(
          item.dryPercentSum / item.receptionsWithDryingCount,
        ),
        netDryingRevenue: this.round2(item.netDryingRevenue),
        estimatedDryingVat: this.round2(item.estimatedDryingVat),
        totalDryingRevenue: this.round2(item.totalDryingRevenue),
      }))
      .sort((a, b) => b.netDryingRevenue - a.netDryingRevenue);

    const byRiceType = Array.from(riceTypeMap.values())
      .map((item) => ({
        riceTypeId: item.riceTypeId,
        riceTypeName: item.riceTypeName,
        receptionsWithDryingCount: item.receptionsWithDryingCount,
        affectedPaddyKg: this.round2(item.affectedPaddyKg),
        netDryingRevenue: this.round2(item.netDryingRevenue),
        estimatedDryingVat: this.round2(item.estimatedDryingVat),
        totalDryingRevenue: this.round2(item.totalDryingRevenue),
      }))
      .sort((a, b) => b.netDryingRevenue - a.netDryingRevenue);

    const trend = Array.from(trendMap.values())
      .map((item) => ({
        period: item.period,
        receptionsWithDryingCount: item.receptionsWithDryingCount,
        netDryingRevenue: this.round2(item.netDryingRevenue),
        estimatedDryingVat: this.round2(item.estimatedDryingVat),
        totalDryingRevenue: this.round2(item.totalDryingRevenue),
      }))
      .sort((a, b) => a.period.localeCompare(b.period));

    const sortedDetail = detail.sort((a, b) => {
      const aTime = new Date(a.cutDate).getTime();
      const bTime = new Date(b.cutDate).getTime();
      return bTime - aTime;
    });

    return {
      reportName: 'Informe Consolidado de Servicios de Secado',
      period: {
        fechaInicio: filters.fechaInicio,
        fechaFin: filters.fechaFin,
        groupBy,
        receptionStatus,
        seasonId: filters.seasonId ?? null,
        producerId: filters.producerId ?? null,
        riceTypeId: filters.riceTypeId ?? null,
      },
      season: season
        ? {
            id: season.id,
            code: season.code,
            name: season.name,
            year: season.year,
          }
        : null,
      summary: {
        receptionsWithDryingCount,
        affectedPaddyKg: this.round2(affectedPaddyKg),
        averageDryPercent: this.round2(dryPercentSum / receptionsWithDryingCount),
        netDryingRevenue: this.round2(netDryingRevenue),
        estimatedDryingVat: this.round2(estimatedDryingVat),
        totalDryingRevenue: this.round2(totalDryingRevenue),
        topProducerByDrying: byProducer[0]
          ? {
              producerId: byProducer[0].producerId,
              producerName: byProducer[0].producerName,
              netDryingRevenue: byProducer[0].netDryingRevenue,
            }
          : null,
        topRiceTypeByDrying: byRiceType[0]
          ? {
              riceTypeId: byRiceType[0].riceTypeId,
              riceTypeName: byRiceType[0].riceTypeName,
              netDryingRevenue: byRiceType[0].netDryingRevenue,
            }
          : null,
      },
      trend,
      byProducer,
      byRiceType,
      detail: sortedDetail,
      assumptions,
    };
  }

  // ===== REPORTE 2: SERVICIOS FINANCIEROS (INTERESES) =====
  async getFinancialServicesInterestReport(
    filters: FinancialServicesInterestReportFilters,
  ) {
    const { start, endExclusive } = this.parseDateRange(
      filters.fechaInicio,
      filters.fechaFin,
    );

    const calculationMode: InterestCalculationMode =
      filters.calculationMode ?? 'devengado';
    const groupBy: FinancialServicesGroupBy = filters.groupBy ?? 'month';

    const season = filters.seasonId
      ? await this.getSeasonOrFail(filters.seasonId)
      : null;

    const emptyResponse = {
      reportName: 'Informe Consolidado de Ingresos Financieros por Intereses',
      period: {
        fechaInicio: filters.fechaInicio,
        fechaFin: filters.fechaFin,
        calculationMode,
        groupBy,
        seasonId: filters.seasonId ?? null,
        producerId: filters.producerId ?? null,
        status: filters.status ?? null,
      },
      season: season
        ? {
            id: season.id,
            code: season.code,
            name: season.name,
            year: season.year,
          }
        : null,
      summary: {
        advancesCount: 0,
        capitalPlaced: 0,
        averageInterestRate: 0,
        accruedInterestNet: 0,
        estimatedInterestVat: 0,
        totalFinancialRevenue: 0,
        settledInterestAmount: 0,
        topProducerByInterest: null,
      },
      trend: [],
      byProducer: [],
      byStatus: [],
      detail: [],
      assumptions: {
        universe: 'anticipos con interes habilitado',
        ivaMode: 'IVA interes estimado',
        formula: 'round((amount * interestRate * (daysActive / 30)) / 100)',
      },
    };

    const advancesQuery = this.advancesRepository
      .createQueryBuilder('advance')
      .leftJoinAndSelect('advance.producer', 'producer')
      .leftJoinAndSelect('advance.season', 'season')
      .where('advance.deletedAt IS NULL')
      .andWhere('advance.isInterestCalculationEnabled = :isInterestEnabled', {
        isInterestEnabled: true,
      });

    if (filters.seasonId) {
      advancesQuery.andWhere('advance.seasonId = :seasonId', {
        seasonId: filters.seasonId,
      });
    }

    if (filters.producerId) {
      advancesQuery.andWhere('advance.producerId = :producerId', {
        producerId: filters.producerId,
      });
    }

    if (filters.status) {
      advancesQuery.andWhere('advance.status = :status', {
        status: filters.status,
      });
    }

    if (calculationMode === 'devengado') {
      advancesQuery
        .andWhere('advance.issueDate >= :startDate', {
          startDate: filters.fechaInicio,
        })
        .andWhere('advance.issueDate <= :endDate', {
          endDate: filters.fechaFin,
        });
    }

    const advances = await advancesQuery
      .orderBy('advance.issueDate', 'ASC')
      .addOrderBy('advance.id', 'ASC')
      .getMany();

    if (advances.length === 0) {
      return emptyResponse;
    }

    const settlementIds = Array.from(
      new Set(
        advances
          .map((advance) => advance.settlementId)
          .filter((settlementId): settlementId is number =>
            Number.isInteger(settlementId) && settlementId > 0,
          ),
      ),
    );

    const settlements = settlementIds.length
      ? await this.settlementsRepository.find({
          where: {
            id: In(settlementIds),
            deletedAt: IsNull(),
          },
          relations: ['producer'],
          take: 50000,
        })
      : [];

    const settlementsMap = new Map<number, Settlement>(
      settlements.map((settlement) => [settlement.id, settlement]),
    );

    const settlementTransactions = settlementIds.length
      ? await this.transactionsRepository.find({
          where: {
            settlementId: In(settlementIds),
            type: TransactionTypeEnum.SETTLEMENT,
            deletedAt: IsNull(),
          },
          order: { createdAt: 'DESC' },
        })
      : [];

    const settlementPaymentDateMap = new Map<number, Date>();
    for (const transaction of settlementTransactions) {
      if (!transaction.settlementId || settlementPaymentDateMap.has(transaction.settlementId)) {
        continue;
      }

      const paymentDate = this.parseDateInput(
        transaction.transactionDate ?? transaction.createdAt,
      );

      if (!paymentDate) {
        continue;
      }

      settlementPaymentDateMap.set(transaction.settlementId, paymentDate);
    }

    const accrualReferenceDate = new Date(endExclusive);
    accrualReferenceDate.setMilliseconds(accrualReferenceDate.getMilliseconds() - 1);

    const trendMap = new Map<
      string,
      {
        period: string;
        advancesCount: number;
        capitalPlaced: number;
        accruedInterestNet: number;
        estimatedInterestVat: number;
        totalFinancialRevenue: number;
      }
    >();

    const producerMap = new Map<
      number,
      {
        producerId: number;
        producerName: string;
        producerRut: string | null;
        advancesCount: number;
        capitalPlaced: number;
        interestRateSum: number;
        accruedInterestNet: number;
        estimatedInterestVat: number;
        totalFinancialRevenue: number;
      }
    >();

    const statusMap = new Map<
      string,
      {
        status: string;
        advancesCount: number;
        capitalPlaced: number;
        accruedInterestNet: number;
        estimatedInterestVat: number;
        totalFinancialRevenue: number;
      }
    >();

    const detail: Array<{
      advanceId: number;
      periodDate: Date;
      issueDate: Date | null;
      producerId: number;
      producerName: string;
      producerRut: string | null;
      seasonId: number;
      seasonName: string | null;
      seasonYear: number | null;
      amount: number;
      interestRate: number;
      interestEndDate: Date | null;
      accruedDays: number;
      accruedInterestNet: number;
      estimatedInterestVat: number;
      totalFinancialRevenue: number;
      advanceStatus: string;
      settlementId: number | null;
      settlementStatus: string | null;
      referenceCutDate: Date;
      calculationMode: InterestCalculationMode;
    }> = [];

    let advancesCount = 0;
    let capitalPlaced = 0;
    let interestRateSum = 0;
    let accruedInterestNet = 0;
    let estimatedInterestVat = 0;
    let totalFinancialRevenue = 0;
    let settledInterestAmount = 0;

    for (const advance of advances) {
      const issueDate = this.parseDateInput(advance.issueDate);
      if (!issueDate) {
        continue;
      }

      const settlement = advance.settlementId
        ? settlementsMap.get(advance.settlementId) ?? null
        : null;

      const settlementCutDate = settlement
        ? this.getPurchaseEventDate(
            settlement,
            settlementPaymentDateMap.get(settlement.id) ?? null,
          )
        : null;

      let periodDate: Date;
      let referenceCutDate: Date;

      if (calculationMode === 'liquidado') {
        if (!settlementCutDate || !settlement || settlement.status !== SettlementStatusEnum.COMPLETED) {
          continue;
        }

        if (settlementCutDate < start || settlementCutDate >= endExclusive) {
          continue;
        }

        periodDate = settlementCutDate;
        referenceCutDate = settlementCutDate;
      } else {
        if (issueDate < start || issueDate >= endExclusive) {
          continue;
        }

        periodDate = issueDate;
        referenceCutDate = accrualReferenceDate;
      }

      const amount = this.round2(this.toNumber(advance.amount));
      const interestRate = this.round2(this.toNumber(advance.interestRate));
      const accruedDays = this.calculateAdvanceAccruedDays(advance, referenceCutDate);
      const interestNet = this.round2(
        this.calculateAdvanceAccruedInterest(advance, referenceCutDate),
      );
      const interestVat = this.round2(interestNet * AnalyticsService.IVA_RATE);
      const totalFinancial = this.round2(interestNet + interestVat);

      advancesCount += 1;
      capitalPlaced += amount;
      interestRateSum += interestRate;
      accruedInterestNet += interestNet;
      estimatedInterestVat += interestVat;
      totalFinancialRevenue += totalFinancial;

      if (
        settlement &&
        settlementCutDate &&
        settlement.status === SettlementStatusEnum.COMPLETED &&
        settlementCutDate >= start &&
        settlementCutDate < endExclusive
      ) {
        settledInterestAmount += this.calculateAdvanceAccruedInterest(
          advance,
          settlementCutDate,
        );
      }

      const trendKey = this.getFinancialPeriodKey(periodDate, groupBy);
      const trendBucket =
        trendMap.get(trendKey) ??
        {
          period: trendKey,
          advancesCount: 0,
          capitalPlaced: 0,
          accruedInterestNet: 0,
          estimatedInterestVat: 0,
          totalFinancialRevenue: 0,
        };

      trendBucket.advancesCount += 1;
      trendBucket.capitalPlaced += amount;
      trendBucket.accruedInterestNet += interestNet;
      trendBucket.estimatedInterestVat += interestVat;
      trendBucket.totalFinancialRevenue += totalFinancial;
      trendMap.set(trendKey, trendBucket);

      const producerBucket =
        producerMap.get(advance.producerId) ??
        {
          producerId: advance.producerId,
          producerName: advance.producer?.name ?? `Productor ${advance.producerId}`,
          producerRut: advance.producer?.rut ?? null,
          advancesCount: 0,
          capitalPlaced: 0,
          interestRateSum: 0,
          accruedInterestNet: 0,
          estimatedInterestVat: 0,
          totalFinancialRevenue: 0,
        };

      producerBucket.advancesCount += 1;
      producerBucket.capitalPlaced += amount;
      producerBucket.interestRateSum += interestRate;
      producerBucket.accruedInterestNet += interestNet;
      producerBucket.estimatedInterestVat += interestVat;
      producerBucket.totalFinancialRevenue += totalFinancial;
      producerMap.set(advance.producerId, producerBucket);

      const statusKey =
        calculationMode === 'liquidado'
          ? settlement?.status ?? advance.status
          : advance.status;

      const statusBucket =
        statusMap.get(statusKey) ??
        {
          status: statusKey,
          advancesCount: 0,
          capitalPlaced: 0,
          accruedInterestNet: 0,
          estimatedInterestVat: 0,
          totalFinancialRevenue: 0,
        };

      statusBucket.advancesCount += 1;
      statusBucket.capitalPlaced += amount;
      statusBucket.accruedInterestNet += interestNet;
      statusBucket.estimatedInterestVat += interestVat;
      statusBucket.totalFinancialRevenue += totalFinancial;
      statusMap.set(statusKey, statusBucket);

      detail.push({
        advanceId: advance.id,
        periodDate,
        issueDate,
        producerId: advance.producerId,
        producerName: advance.producer?.name ?? `Productor ${advance.producerId}`,
        producerRut: advance.producer?.rut ?? null,
        seasonId: advance.seasonId,
        seasonName: advance.season?.name ?? null,
        seasonYear: advance.season?.year ?? null,
        amount,
        interestRate,
        interestEndDate: this.parseDateInput(advance.interestEndDate ?? null),
        accruedDays,
        accruedInterestNet: interestNet,
        estimatedInterestVat: interestVat,
        totalFinancialRevenue: totalFinancial,
        advanceStatus: advance.status,
        settlementId: advance.settlementId ?? null,
        settlementStatus: settlement?.status ?? null,
        referenceCutDate,
        calculationMode,
      });
    }

    if (advancesCount === 0) {
      return emptyResponse;
    }

    const trend = Array.from(trendMap.values())
      .map((item) => ({
        period: item.period,
        advancesCount: item.advancesCount,
        capitalPlaced: this.round2(item.capitalPlaced),
        accruedInterestNet: this.round2(item.accruedInterestNet),
        estimatedInterestVat: this.round2(item.estimatedInterestVat),
        totalFinancialRevenue: this.round2(item.totalFinancialRevenue),
      }))
      .sort((a, b) => a.period.localeCompare(b.period));

    const byProducer = Array.from(producerMap.values())
      .map((item) => ({
        producerId: item.producerId,
        producerName: item.producerName,
        producerRut: item.producerRut,
        advancesCount: item.advancesCount,
        capitalPlaced: this.round2(item.capitalPlaced),
        averageInterestRate: this.round2(item.interestRateSum / item.advancesCount),
        accruedInterestNet: this.round2(item.accruedInterestNet),
        estimatedInterestVat: this.round2(item.estimatedInterestVat),
        totalFinancialRevenue: this.round2(item.totalFinancialRevenue),
      }))
      .sort((a, b) => b.accruedInterestNet - a.accruedInterestNet);

    const byStatus = Array.from(statusMap.values())
      .map((item) => ({
        status: item.status,
        advancesCount: item.advancesCount,
        capitalPlaced: this.round2(item.capitalPlaced),
        accruedInterestNet: this.round2(item.accruedInterestNet),
        estimatedInterestVat: this.round2(item.estimatedInterestVat),
        totalFinancialRevenue: this.round2(item.totalFinancialRevenue),
      }))
      .sort((a, b) => b.accruedInterestNet - a.accruedInterestNet);

    const sortedDetail = detail.sort((a, b) => {
      const aTime = new Date(a.periodDate).getTime();
      const bTime = new Date(b.periodDate).getTime();
      if (aTime !== bTime) {
        return bTime - aTime;
      }

      return b.advanceId - a.advanceId;
    });

    return {
      reportName: 'Informe Consolidado de Ingresos Financieros por Intereses',
      period: {
        fechaInicio: filters.fechaInicio,
        fechaFin: filters.fechaFin,
        calculationMode,
        groupBy,
        seasonId: filters.seasonId ?? null,
        producerId: filters.producerId ?? null,
        status: filters.status ?? null,
      },
      season: season
        ? {
            id: season.id,
            code: season.code,
            name: season.name,
            year: season.year,
          }
        : null,
      summary: {
        advancesCount,
        capitalPlaced: this.round2(capitalPlaced),
        averageInterestRate: this.round2(interestRateSum / advancesCount),
        accruedInterestNet: this.round2(accruedInterestNet),
        estimatedInterestVat: this.round2(estimatedInterestVat),
        totalFinancialRevenue: this.round2(totalFinancialRevenue),
        settledInterestAmount: this.round2(settledInterestAmount),
        topProducerByInterest: byProducer[0]
          ? {
              producerId: byProducer[0].producerId,
              producerName: byProducer[0].producerName,
              accruedInterestNet: byProducer[0].accruedInterestNet,
            }
          : null,
      },
      trend,
      byProducer,
      byStatus,
      detail: sortedDetail,
      assumptions: {
        universe: 'anticipos con interes habilitado',
        ivaMode: 'IVA interes estimado',
        formula: 'round((amount * interestRate * (daysActive / 30)) / 100)',
      },
    };
  }

  // ===== REPORTE 3: RENTABILIDAD POR SERVICIOS FINANCIEROS =====
  async getFinancialProfitabilityReport(
    filters: FinancialProfitabilityReportFilters,
  ) {
    const season = await this.getSeasonOrFail(filters.seasonId);
    const seasonEndDate =
      this.parseDateInput(season.endDate) ?? this.parseDateInput(new Date()) ?? new Date();

    const requestedCutoffDate = filters.cutoffDate
      ? this.parseDateInput(filters.cutoffDate)
      : this.parseDateInput(new Date());

    if (!requestedCutoffDate) {
      throw new BadRequestException('cutoffDate debe tener formato YYYY-MM-DD');
    }

    const cutoffDate =
      requestedCutoffDate > seasonEndDate ? new Date(seasonEndDate) : requestedCutoffDate;

    const calculationMode: InterestCalculationMode =
      filters.calculationMode ?? 'devengado';

    const emptyResponse = {
      reportName: 'Estado de Rendimiento de Capital y Devengo de Intereses',
      period: {
        seasonId: season.id,
        producerId: filters.producerId ?? null,
        cutoffDate: this.toDateKey(cutoffDate),
        seasonEndDate: this.toDateKey(seasonEndDate),
        calculationMode,
      },
      season: {
        id: season.id,
        code: season.code,
        name: season.name,
        year: season.year,
      },
      summary: {
        advancesCount: 0,
        capitalPlaced: 0,
        interestAtCutoff: 0,
        projectedSeasonInterest: 0,
        progressPct: 0,
        capitalYieldPct: 0,
        estimatedInterestVat: 0,
        totalFinancialRevenue: 0,
      },
      gauge: {
        current: 0,
        target: 0,
        percent: 0,
        status: 'critical',
      },
      byProducer: [],
      assumptions: {
        universe: 'anticipos con interes habilitado y no anulados de la temporada',
        fechaCorte: this.toDateKey(cutoffDate),
        ivaMode: 'IVA interes estimado',
        formula: 'round((amount * interestRate * (daysActive / 30)) / 100)',
      },
    };

    const advancesQuery = this.advancesRepository
      .createQueryBuilder('advance')
      .leftJoinAndSelect('advance.producer', 'producer')
      .where('advance.deletedAt IS NULL')
      .andWhere('advance.seasonId = :seasonId', { seasonId: filters.seasonId })
      .andWhere('advance.isInterestCalculationEnabled = :isInterestEnabled', {
        isInterestEnabled: true,
      })
      .andWhere('advance.status != :cancelledStatus', {
        cancelledStatus: AdvanceStatusEnum.CANCELLED,
      });

    if (filters.producerId) {
      advancesQuery.andWhere('advance.producerId = :producerId', {
        producerId: filters.producerId,
      });
    }

    const advances = await advancesQuery
      .orderBy('advance.issueDate', 'ASC')
      .addOrderBy('advance.id', 'ASC')
      .getMany();

    if (advances.length === 0) {
      return emptyResponse;
    }

    const settlementIds = Array.from(
      new Set(
        advances
          .map((advance) => advance.settlementId)
          .filter((settlementId): settlementId is number =>
            Number.isInteger(settlementId) && settlementId > 0,
          ),
      ),
    );

    const settlementsMap = new Map<number, Settlement>();
    const settlementPaymentDateMap = new Map<number, Date>();

    if (settlementIds.length > 0) {
      const settlements = await this.settlementsRepository.find({
        where: {
          id: In(settlementIds),
          status: SettlementStatusEnum.COMPLETED,
          deletedAt: IsNull(),
        },
        relations: ['producer'],
      });

      for (const settlement of settlements) {
        settlementsMap.set(settlement.id, settlement);
      }

      const settlementTransactions = await this.transactionsRepository.find({
        where: {
          settlementId: In(settlementIds),
          type: TransactionTypeEnum.SETTLEMENT,
          deletedAt: IsNull(),
        },
        order: { createdAt: 'DESC' },
      });

      for (const transaction of settlementTransactions) {
        if (!transaction.settlementId || settlementPaymentDateMap.has(transaction.settlementId)) {
          continue;
        }

        const paymentDate = this.parseDateInput(
          transaction.transactionDate ?? transaction.createdAt,
        );

        if (!paymentDate) {
          continue;
        }

        settlementPaymentDateMap.set(transaction.settlementId, paymentDate);
      }
    }

    const producerMap = new Map<
      number,
      {
        producerId: number;
        producerName: string;
        producerRut: string | null;
        advancesCount: number;
        capitalPlaced: number;
        interestAtCutoff: number;
        projectedInterest: number;
      }
    >();

    let capitalPlaced = 0;
    let interestAtCutoff = 0;
    let projectedSeasonInterest = 0;
    let advancesCount = 0;

    for (const advance of advances) {
      const amount = this.round2(this.toNumber(advance.amount));
      const projectedInterest = this.round2(
        this.calculateAdvanceAccruedInterest(advance, seasonEndDate),
      );

      let currentInterest = 0;

      if (calculationMode === 'liquidado') {
        if (advance.settlementId) {
          const settlement = settlementsMap.get(advance.settlementId);

          if (settlement && settlement.status === SettlementStatusEnum.COMPLETED) {
            const paymentDate = this.getPurchaseEventDate(
              settlement,
              settlementPaymentDateMap.get(settlement.id) ?? null,
            );

            if (paymentDate && paymentDate <= cutoffDate) {
              currentInterest = this.round2(
                this.calculateAdvanceAccruedInterest(advance, paymentDate),
              );
            }
          }
        }
      } else {
        currentInterest = this.round2(
          this.calculateAdvanceAccruedInterest(advance, cutoffDate),
        );
      }

      advancesCount += 1;
      capitalPlaced += amount;
      interestAtCutoff += currentInterest;
      projectedSeasonInterest += projectedInterest;

      const producerBucket =
        producerMap.get(advance.producerId) ??
        {
          producerId: advance.producerId,
          producerName: advance.producer?.name ?? `Productor ${advance.producerId}`,
          producerRut: advance.producer?.rut ?? null,
          advancesCount: 0,
          capitalPlaced: 0,
          interestAtCutoff: 0,
          projectedInterest: 0,
        };

      producerBucket.advancesCount += 1;
      producerBucket.capitalPlaced += amount;
      producerBucket.interestAtCutoff += currentInterest;
      producerBucket.projectedInterest += projectedInterest;
      producerMap.set(advance.producerId, producerBucket);
    }

    if (advancesCount === 0) {
      return emptyResponse;
    }

    const estimatedInterestVat = this.round2(
      interestAtCutoff * AnalyticsService.IVA_RATE,
    );
    const totalFinancialRevenue = this.round2(interestAtCutoff + estimatedInterestVat);
    const progressPct =
      projectedSeasonInterest > 0
        ? this.round2((interestAtCutoff / projectedSeasonInterest) * 100)
        : 0;
    const capitalYieldPct =
      capitalPlaced > 0 ? this.round2((interestAtCutoff / capitalPlaced) * 100) : 0;

    const gaugeStatus =
      progressPct >= 100
        ? 'excellent'
        : progressPct >= 85
          ? 'good'
          : progressPct >= 60
            ? 'warning'
            : 'critical';

    const byProducer = Array.from(producerMap.values())
      .map((item) => ({
        producerId: item.producerId,
        producerName: item.producerName,
        producerRut: item.producerRut,
        advancesCount: item.advancesCount,
        capitalPlaced: this.round2(item.capitalPlaced),
        interestAtCutoff: this.round2(item.interestAtCutoff),
        projectedInterest: this.round2(item.projectedInterest),
        progressPct:
          item.projectedInterest > 0
            ? this.round2((item.interestAtCutoff / item.projectedInterest) * 100)
            : 0,
        participationPct:
          interestAtCutoff > 0
            ? this.round2((item.interestAtCutoff / interestAtCutoff) * 100)
            : 0,
      }))
      .sort((a, b) => b.interestAtCutoff - a.interestAtCutoff);

    return {
      reportName: 'Estado de Rendimiento de Capital y Devengo de Intereses',
      period: {
        seasonId: season.id,
        producerId: filters.producerId ?? null,
        cutoffDate: this.toDateKey(cutoffDate),
        seasonEndDate: this.toDateKey(seasonEndDate),
        calculationMode,
      },
      season: {
        id: season.id,
        code: season.code,
        name: season.name,
        year: season.year,
      },
      summary: {
        advancesCount,
        capitalPlaced: this.round2(capitalPlaced),
        interestAtCutoff: this.round2(interestAtCutoff),
        projectedSeasonInterest: this.round2(projectedSeasonInterest),
        progressPct,
        capitalYieldPct,
        estimatedInterestVat,
        totalFinancialRevenue,
      },
      gauge: {
        current: this.round2(interestAtCutoff),
        target: this.round2(projectedSeasonInterest),
        percent: progressPct,
        status: gaugeStatus,
      },
      byProducer,
      assumptions: {
        universe: 'anticipos con interes habilitado y no anulados de la temporada',
        fechaCorte: this.toDateKey(cutoffDate),
        ivaMode: 'IVA interes estimado',
        formula: 'round((amount * interestRate * (daysActive / 30)) / 100)',
      },
    };
  }

  // ===== REPORTE 4: RETORNO DE PRESUPUESTO =====
  async getBudgetReturnReport(filters: BudgetReturnReportFilters) {
    const { start, endExclusive } = this.parseDateRange(
      filters.fechaInicio,
      filters.fechaFin,
    );

    const season = filters.seasonId
      ? await this.getSeasonOrFail(filters.seasonId)
      : null;

    const monthKeys = this.buildMonthKeysFromRange(start, endExclusive);
    const monthlyMap = new Map<
      string,
      {
        month: string;
        advancesCount: number;
        disbursedAmount: number;
        recoveriesCount: number;
        recoveredAmount: number;
      }
    >();

    for (const monthKey of monthKeys) {
      monthlyMap.set(monthKey, {
        month: monthKey,
        advancesCount: 0,
        disbursedAmount: 0,
        recoveriesCount: 0,
        recoveredAmount: 0,
      });
    }

    const detail: Array<{
      date: string;
      month: string;
      movementType: 'advance' | 'recovery';
      referenceId: number;
      producerId: number | null;
      producerName: string;
      producerRut: string | null;
      amount: number;
      settlementStatus: string | null;
    }> = [];

    const advancesQuery = this.advancesRepository
      .createQueryBuilder('advance')
      .leftJoinAndSelect('advance.producer', 'producer')
      .where('advance.deletedAt IS NULL')
      .andWhere('advance.status != :cancelledStatus', {
        cancelledStatus: AdvanceStatusEnum.CANCELLED,
      })
      .andWhere('advance.issueDate >= :startDate', { startDate: filters.fechaInicio })
      .andWhere('advance.issueDate <= :endDate', { endDate: filters.fechaFin });

    if (filters.seasonId) {
      advancesQuery.andWhere('advance.seasonId = :seasonId', {
        seasonId: filters.seasonId,
      });
    }

    if (filters.producerId) {
      advancesQuery.andWhere('advance.producerId = :producerId', {
        producerId: filters.producerId,
      });
    }

    const advances = await advancesQuery
      .orderBy('advance.issueDate', 'ASC')
      .addOrderBy('advance.id', 'ASC')
      .getMany();

    let capitalDisbursed = 0;
    for (const advance of advances) {
      const issueDate = this.parseDateInput(advance.issueDate);
      if (!issueDate || issueDate < start || issueDate >= endExclusive) {
        continue;
      }

      const amount = this.round2(this.toNumber(advance.amount));
      const monthKey = this.formatMonthKey(issueDate);

      const bucket =
        monthlyMap.get(monthKey) ??
        {
          month: monthKey,
          advancesCount: 0,
          disbursedAmount: 0,
          recoveriesCount: 0,
          recoveredAmount: 0,
        };

      bucket.advancesCount += 1;
      bucket.disbursedAmount += amount;
      monthlyMap.set(monthKey, bucket);

      capitalDisbursed += amount;

      detail.push({
        date: this.toDateKey(issueDate),
        month: monthKey,
        movementType: 'advance',
        referenceId: advance.id,
        producerId: advance.producerId,
        producerName: advance.producer?.name ?? `Productor ${advance.producerId}`,
        producerRut: advance.producer?.rut ?? null,
        amount,
        settlementStatus: null,
      });
    }

    const settlementsWhere: Record<string, unknown> = {
      status: SettlementStatusEnum.COMPLETED,
      deletedAt: IsNull(),
    };

    if (filters.seasonId) {
      settlementsWhere.seasonId = filters.seasonId;
    }

    if (filters.producerId) {
      settlementsWhere.producerId = filters.producerId;
    }

    const settlements = await this.settlementsRepository.find({
      where: settlementsWhere,
      relations: ['producer'],
      order: { updatedAt: 'ASC' },
    });

    const settlementIds = settlements.map((settlement) => settlement.id);
    const settlementPaymentDateMap = new Map<number, Date>();

    if (settlementIds.length > 0) {
      const settlementTransactions = await this.transactionsRepository.find({
        where: {
          settlementId: In(settlementIds),
          type: TransactionTypeEnum.SETTLEMENT,
          deletedAt: IsNull(),
        },
        order: { createdAt: 'DESC' },
      });

      for (const transaction of settlementTransactions) {
        if (!transaction.settlementId || settlementPaymentDateMap.has(transaction.settlementId)) {
          continue;
        }

        const paymentDate = this.parseDateInput(
          transaction.transactionDate ?? transaction.createdAt,
        );

        if (!paymentDate) {
          continue;
        }

        settlementPaymentDateMap.set(transaction.settlementId, paymentDate);
      }
    }

    let capitalRecovered = 0;
    for (const settlement of settlements) {
      const paymentDate = this.getPurchaseEventDate(
        settlement,
        settlementPaymentDateMap.get(settlement.id) ?? null,
      );

      if (!paymentDate || paymentDate < start || paymentDate >= endExclusive) {
        continue;
      }

      const recoveredAmount = this.round2(this.toNumber(settlement.totalAdvances));
      if (recoveredAmount <= 0) {
        continue;
      }

      const monthKey = this.formatMonthKey(paymentDate);
      const bucket =
        monthlyMap.get(monthKey) ??
        {
          month: monthKey,
          advancesCount: 0,
          disbursedAmount: 0,
          recoveriesCount: 0,
          recoveredAmount: 0,
        };

      bucket.recoveriesCount += 1;
      bucket.recoveredAmount += recoveredAmount;
      monthlyMap.set(monthKey, bucket);

      capitalRecovered += recoveredAmount;

      detail.push({
        date: this.toDateKey(paymentDate),
        month: monthKey,
        movementType: 'recovery',
        referenceId: settlement.id,
        producerId: settlement.producerId,
        producerName:
          settlement.producer?.name ?? `Productor ${settlement.producerId}`,
        producerRut: settlement.producer?.rut ?? null,
        amount: recoveredAmount,
        settlementStatus: settlement.status,
      });
    }

    const monthly = monthKeys.map((monthKey) => {
      const bucket =
        monthlyMap.get(monthKey) ??
        {
          month: monthKey,
          advancesCount: 0,
          disbursedAmount: 0,
          recoveriesCount: 0,
          recoveredAmount: 0,
        };

      return {
        month: bucket.month,
        advancesCount: bucket.advancesCount,
        disbursedAmount: this.round2(bucket.disbursedAmount),
        recoveriesCount: bucket.recoveriesCount,
        recoveredAmount: this.round2(bucket.recoveredAmount),
      };
    });

    let cumulativeDisbursed = 0;
    let cumulativeRecovered = 0;
    const monthlyWithBalance = monthly.map((item) => {
      cumulativeDisbursed += item.disbursedAmount;
      cumulativeRecovered += item.recoveredAmount;
      const pendingBalance = this.round2(cumulativeDisbursed - cumulativeRecovered);
      const recoveryRatePct =
        cumulativeDisbursed > 0
          ? this.round2((cumulativeRecovered / cumulativeDisbursed) * 100)
          : 0;

      return {
        ...item,
        cumulativeDisbursed: this.round2(cumulativeDisbursed),
        cumulativeRecovered: this.round2(cumulativeRecovered),
        pendingBalance,
        recoveryRatePct,
      };
    });

    const pendingCapital = this.round2(capitalDisbursed - capitalRecovered);
    const recoveryRatePct =
      capitalDisbursed > 0
        ? this.round2((capitalRecovered / capitalDisbursed) * 100)
        : 0;

    const waterfall = [
      {
        step: 'Desembolso de capital',
        type: 'start',
        amount: this.round2(capitalDisbursed),
        cumulative: this.round2(capitalDisbursed),
      },
      ...monthlyWithBalance
        .filter((item) => item.recoveredAmount > 0)
        .map((item) => ({
          step: item.month,
          type: 'recovery',
          amount: this.round2(item.recoveredAmount * -1),
          cumulative: item.pendingBalance,
        })),
      {
        step: 'Saldo pendiente',
        type: 'end',
        amount: pendingCapital,
        cumulative: pendingCapital,
      },
    ];

    const sortedDetail = detail.sort((a, b) => {
      const aDate = this.parseDateInput(a.date);
      const bDate = this.parseDateInput(b.date);
      const aTime = aDate ? aDate.getTime() : 0;
      const bTime = bDate ? bDate.getTime() : 0;

      if (aTime !== bTime) {
        return aTime - bTime;
      }

      return a.movementType.localeCompare(b.movementType);
    });

    return {
      reportName: 'Balance de Flujos de Capital y Recuperacion de Egresos',
      period: {
        fechaInicio: filters.fechaInicio,
        fechaFin: filters.fechaFin,
        seasonId: filters.seasonId ?? null,
        producerId: filters.producerId ?? null,
      },
      season: season
        ? {
            id: season.id,
            code: season.code,
            name: season.name,
            year: season.year,
          }
        : null,
      summary: {
        capitalDisbursed: this.round2(capitalDisbursed),
        capitalRecovered: this.round2(capitalRecovered),
        pendingCapital,
        recoveryRatePct,
        netExposure: pendingCapital,
        movementsCount: sortedDetail.length,
      },
      waterfall,
      monthly: monthlyWithBalance,
      detail: sortedDetail,
      assumptions: {
        universe: 'anticipos pagados y liquidaciones completadas',
        fechaCorte: `${filters.fechaInicio} a ${filters.fechaFin}`,
        ivaMode: 'No aplica para flujo de capital base',
        formula: 'pendiente = desembolsado acumulado - recuperado acumulado',
      },
    };
  }

  // ===== REPORTE 5: RENDIMIENTO DE PROCESO =====
  async getProcessYieldReport(filters: ProcessYieldReportFilters) {
    const season = await this.getSeasonOrFail(filters.seasonId);
    const groupBy: DryingGroupBy = filters.groupBy ?? 'month';

    if (
      (filters.fechaInicio && !filters.fechaFin) ||
      (!filters.fechaInicio && filters.fechaFin)
    ) {
      throw new BadRequestException(
        'fechaInicio y fechaFin deben enviarse juntos para filtrar por periodo',
      );
    }

    const dateRange =
      filters.fechaInicio && filters.fechaFin
        ? this.parseDateRange(filters.fechaInicio, filters.fechaFin)
        : null;

    const receptionsQuery = this.receptionsRepository
      .createQueryBuilder('reception')
      .leftJoinAndSelect('reception.producer', 'producer')
      .leftJoinAndSelect('reception.riceType', 'riceType')
      .leftJoinAndSelect('reception.analysisRecord', 'analysisRecord')
      .where('reception.deletedAt IS NULL')
      .andWhere('reception.seasonId = :seasonId', { seasonId: filters.seasonId })
      .andWhere('reception.status IN (:...allowedStatuses)', {
        allowedStatuses: [ReceptionStatusEnum.ANALYZED, ReceptionStatusEnum.SETTLED],
      });

    if (filters.producerId) {
      receptionsQuery.andWhere('reception.producerId = :producerId', {
        producerId: filters.producerId,
      });
    }

    if (filters.riceTypeId) {
      receptionsQuery.andWhere('reception.riceTypeId = :riceTypeId', {
        riceTypeId: filters.riceTypeId,
      });
    }

    if (dateRange) {
      receptionsQuery
        .andWhere('reception.receptionDate >= :startDate', {
          startDate: dateRange.start,
        })
        .andWhere('reception.receptionDate < :endDate', {
          endDate: dateRange.endExclusive,
        });
    }

    const receptions = await receptionsQuery
      .orderBy('reception.receptionDate', 'ASC')
      .addOrderBy('reception.id', 'ASC')
      .getMany();

    const emptyResponse = {
      reportName: 'Balance de Mermas y Rendimiento Industrial',
      period: {
        seasonId: filters.seasonId,
        fechaInicio: filters.fechaInicio ?? null,
        fechaFin: filters.fechaFin ?? null,
        producerId: filters.producerId ?? null,
        riceTypeId: filters.riceTypeId ?? null,
        groupBy,
      },
      season: {
        id: season.id,
        code: season.code,
        name: season.name,
        year: season.year,
      },
      summary: {
        receptionsCount: 0,
        totalGrossKg: 0,
        totalNetKg: 0,
        totalShrinkageKg: 0,
        processYieldPct: 0,
        impuritiesLossKg: 0,
        vanoLossKg: 0,
        humidityLossKg: 0,
        impuritiesLossPct: 0,
        vanoLossPct: 0,
        humidityLossPct: 0,
      },
      sankey: {
        nodes: [],
        links: [],
      },
      monthly: [],
      byProducer: [],
      detail: [],
      assumptions: {
        universe: 'recepciones analizadas y liquidadas de la temporada',
        fechaCorte: dateRange
          ? `${filters.fechaInicio} a ${filters.fechaFin}`
          : `${season.startDate} a ${season.endDate}`,
        ivaMode: 'No aplica (indicador fisico de proceso)',
        formula:
          'rendimiento = (peso neto final / peso bruto) * 100; mermas por parametro ponderadas al total real',
      },
    };

    if (receptions.length === 0) {
      return emptyResponse;
    }

    const trendMap = new Map<
      string,
      {
        period: string;
        receptions: number;
        grossKg: number;
        netKg: number;
        shrinkageKg: number;
        impuritiesLossKg: number;
        vanoLossKg: number;
        humidityLossKg: number;
      }
    >();

    const producerMap = new Map<
      number,
      {
        producerId: number;
        producerName: string;
        producerRut: string | null;
        receptions: number;
        grossKg: number;
        netKg: number;
        shrinkageKg: number;
        impuritiesLossKg: number;
        vanoLossKg: number;
        humidityLossKg: number;
      }
    >();

    const detail: Array<{
      receptionId: number;
      receptionDate: string;
      guideNumber: string;
      producerId: number;
      producerName: string;
      producerRut: string | null;
      riceTypeName: string | null;
      grossKg: number;
      netKg: number;
      shrinkageKg: number;
      processYieldPct: number;
      impuritiesPct: number;
      vanoPct: number;
      humidityPct: number;
      impuritiesLossKg: number;
      vanoLossKg: number;
      humidityLossKg: number;
      receptionStatus: string;
    }> = [];

    let totalGrossKg = 0;
    let totalNetKg = 0;
    let totalShrinkageKg = 0;
    let totalImpuritiesLossKg = 0;
    let totalVanoLossKg = 0;
    let totalHumidityLossKg = 0;

    for (const reception of receptions) {
      const receptionDate = this.parseDateInput(reception.receptionDate ?? reception.createdAt);
      if (!receptionDate) {
        continue;
      }

      const grossKg = this.round2(this.toNumber(reception.grossWeight));
      const netKg = this.round2(
        this.toNumber(reception.finalNetWeight ?? reception.netWeight),
      );

      if (grossKg <= 0) {
        continue;
      }

      const impuritiesPct = this.round2(
        this.toNumber(
          reception.analysisRecord?.impurezasValue ??
            reception.analysisRecord?.impurezasRange ??
            0,
        ),
      );
      const vanoPct = this.round2(
        this.toNumber(
          reception.analysisRecord?.vanoValue ??
            reception.analysisRecord?.vanoRange ??
            0,
        ),
      );
      const humidityPct = this.round2(
        this.toNumber(
          reception.analysisRecord?.humedadValue ??
            reception.analysisRecord?.humedadRange ??
            0,
        ),
      );

      const breakdown = this.calculateProcessLossBreakdown(
        grossKg,
        netKg,
        impuritiesPct,
        vanoPct,
        humidityPct,
      );

      const periodKey = this.getDryingPeriodKey(receptionDate, groupBy);
      const trendBucket =
        trendMap.get(periodKey) ??
        {
          period: periodKey,
          receptions: 0,
          grossKg: 0,
          netKg: 0,
          shrinkageKg: 0,
          impuritiesLossKg: 0,
          vanoLossKg: 0,
          humidityLossKg: 0,
        };

      trendBucket.receptions += 1;
      trendBucket.grossKg += grossKg;
      trendBucket.netKg += netKg;
      trendBucket.shrinkageKg += breakdown.shrinkageKg;
      trendBucket.impuritiesLossKg += breakdown.impuritiesLossKg;
      trendBucket.vanoLossKg += breakdown.vanoLossKg;
      trendBucket.humidityLossKg += breakdown.humidityLossKg;
      trendMap.set(periodKey, trendBucket);

      const producerBucket =
        producerMap.get(reception.producerId) ??
        {
          producerId: reception.producerId,
          producerName: reception.producer?.name ?? `Productor ${reception.producerId}`,
          producerRut: reception.producer?.rut ?? null,
          receptions: 0,
          grossKg: 0,
          netKg: 0,
          shrinkageKg: 0,
          impuritiesLossKg: 0,
          vanoLossKg: 0,
          humidityLossKg: 0,
        };

      producerBucket.receptions += 1;
      producerBucket.grossKg += grossKg;
      producerBucket.netKg += netKg;
      producerBucket.shrinkageKg += breakdown.shrinkageKg;
      producerBucket.impuritiesLossKg += breakdown.impuritiesLossKg;
      producerBucket.vanoLossKg += breakdown.vanoLossKg;
      producerBucket.humidityLossKg += breakdown.humidityLossKg;
      producerMap.set(reception.producerId, producerBucket);

      totalGrossKg += grossKg;
      totalNetKg += netKg;
      totalShrinkageKg += breakdown.shrinkageKg;
      totalImpuritiesLossKg += breakdown.impuritiesLossKg;
      totalVanoLossKg += breakdown.vanoLossKg;
      totalHumidityLossKg += breakdown.humidityLossKg;

      detail.push({
        receptionId: reception.id,
        receptionDate: this.toDateKey(receptionDate),
        guideNumber: reception.guideNumber,
        producerId: reception.producerId,
        producerName: reception.producer?.name ?? `Productor ${reception.producerId}`,
        producerRut: reception.producer?.rut ?? null,
        riceTypeName: reception.riceType?.name ?? null,
        grossKg,
        netKg,
        shrinkageKg: breakdown.shrinkageKg,
        processYieldPct: breakdown.yieldPct,
        impuritiesPct,
        vanoPct,
        humidityPct,
        impuritiesLossKg: breakdown.impuritiesLossKg,
        vanoLossKg: breakdown.vanoLossKg,
        humidityLossKg: breakdown.humidityLossKg,
        receptionStatus: reception.status,
      });
    }

    if (detail.length === 0) {
      return emptyResponse;
    }

    const monthly = Array.from(trendMap.values())
      .map((item) => ({
        period: item.period,
        receptions: item.receptions,
        grossKg: this.round2(item.grossKg),
        netKg: this.round2(item.netKg),
        shrinkageKg: this.round2(item.shrinkageKg),
        processYieldPct:
          item.grossKg > 0 ? this.round2((item.netKg / item.grossKg) * 100) : 0,
        impuritiesLossKg: this.round2(item.impuritiesLossKg),
        vanoLossKg: this.round2(item.vanoLossKg),
        humidityLossKg: this.round2(item.humidityLossKg),
      }))
      .sort((a, b) => a.period.localeCompare(b.period));

    const byProducer = Array.from(producerMap.values())
      .map((item) => ({
        producerId: item.producerId,
        producerName: item.producerName,
        producerRut: item.producerRut,
        receptions: item.receptions,
        grossKg: this.round2(item.grossKg),
        netKg: this.round2(item.netKg),
        shrinkageKg: this.round2(item.shrinkageKg),
        processYieldPct:
          item.grossKg > 0 ? this.round2((item.netKg / item.grossKg) * 100) : 0,
        impuritiesLossKg: this.round2(item.impuritiesLossKg),
        vanoLossKg: this.round2(item.vanoLossKg),
        humidityLossKg: this.round2(item.humidityLossKg),
      }))
      .sort((a, b) => b.grossKg - a.grossKg);

    const roundedTotalGrossKg = this.round2(totalGrossKg);
    const roundedTotalNetKg = this.round2(totalNetKg);
    const roundedTotalShrinkageKg = this.round2(totalShrinkageKg);
    const roundedTotalImpuritiesLossKg = this.round2(totalImpuritiesLossKg);
    const roundedTotalVanoLossKg = this.round2(totalVanoLossKg);
    const roundedTotalHumidityLossKg = this.round2(totalHumidityLossKg);

    const processYieldPct =
      roundedTotalGrossKg > 0
        ? this.round2((roundedTotalNetKg / roundedTotalGrossKg) * 100)
        : 0;

    const summaryImpuritiesLossPct =
      roundedTotalGrossKg > 0
        ? this.round2((roundedTotalImpuritiesLossKg / roundedTotalGrossKg) * 100)
        : 0;
    const summaryVanoLossPct =
      roundedTotalGrossKg > 0
        ? this.round2((roundedTotalVanoLossKg / roundedTotalGrossKg) * 100)
        : 0;
    const summaryHumidityLossPct =
      roundedTotalGrossKg > 0
        ? this.round2((roundedTotalHumidityLossKg / roundedTotalGrossKg) * 100)
        : 0;

    const postImpuritiesKg = this.round2(
      Math.max(0, roundedTotalGrossKg - roundedTotalImpuritiesLossKg),
    );
    const postVanoKg = this.round2(
      Math.max(0, postImpuritiesKg - roundedTotalVanoLossKg),
    );

    const sankeyNodes = [
      { id: 'gross', name: 'Ingreso Bruto' },
      { id: 'impurities-loss', name: 'Merma Impurezas' },
      { id: 'after-impurities', name: 'Post Impurezas' },
      { id: 'vano-loss', name: 'Merma Vano' },
      { id: 'after-vano', name: 'Post Vano' },
      { id: 'humidity-loss', name: 'Merma Humedad' },
      { id: 'net', name: 'Paddy Neto' },
    ];

    const sankeyLinks = [
      {
        source: 'gross',
        target: 'impurities-loss',
        value: roundedTotalImpuritiesLossKg,
      },
      {
        source: 'gross',
        target: 'after-impurities',
        value: postImpuritiesKg,
      },
      {
        source: 'after-impurities',
        target: 'vano-loss',
        value: roundedTotalVanoLossKg,
      },
      {
        source: 'after-impurities',
        target: 'after-vano',
        value: postVanoKg,
      },
      {
        source: 'after-vano',
        target: 'humidity-loss',
        value: roundedTotalHumidityLossKg,
      },
      {
        source: 'after-vano',
        target: 'net',
        value: roundedTotalNetKg,
      },
    ].filter((link) => link.value > 0);

    const sortedDetail = detail.sort((a, b) => {
      const aDate = this.parseDateInput(a.receptionDate);
      const bDate = this.parseDateInput(b.receptionDate);
      const aTime = aDate ? aDate.getTime() : 0;
      const bTime = bDate ? bDate.getTime() : 0;

      if (aTime !== bTime) {
        return bTime - aTime;
      }

      return b.receptionId - a.receptionId;
    });

    return {
      reportName: 'Balance de Mermas y Rendimiento Industrial',
      period: {
        seasonId: filters.seasonId,
        fechaInicio: filters.fechaInicio ?? null,
        fechaFin: filters.fechaFin ?? null,
        producerId: filters.producerId ?? null,
        riceTypeId: filters.riceTypeId ?? null,
        groupBy,
      },
      season: {
        id: season.id,
        code: season.code,
        name: season.name,
        year: season.year,
      },
      summary: {
        receptionsCount: sortedDetail.length,
        totalGrossKg: roundedTotalGrossKg,
        totalNetKg: roundedTotalNetKg,
        totalShrinkageKg: roundedTotalShrinkageKg,
        processYieldPct,
        impuritiesLossKg: roundedTotalImpuritiesLossKg,
        vanoLossKg: roundedTotalVanoLossKg,
        humidityLossKg: roundedTotalHumidityLossKg,
        impuritiesLossPct: summaryImpuritiesLossPct,
        vanoLossPct: summaryVanoLossPct,
        humidityLossPct: summaryHumidityLossPct,
      },
      sankey: {
        nodes: sankeyNodes,
        links: sankeyLinks,
      },
      monthly,
      byProducer,
      detail: sortedDetail,
      assumptions: {
        universe: 'recepciones analizadas y liquidadas de la temporada',
        fechaCorte: dateRange
          ? `${filters.fechaInicio} a ${filters.fechaFin}`
          : `${season.startDate} a ${season.endDate}`,
        ivaMode: 'No aplica (indicador fisico de proceso)',
        formula:
          'rendimiento = (peso neto final / peso bruto) * 100; mermas por parametro ponderadas al total real',
      },
    };
  }

  // ===== TOP PRODUCTORES =====
  async getTopProducers(limit: number = 10) {
    const receptions = await this.receptionsRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['producer'],
    });

    const byProducer: { [key: number]: any } = {};

    receptions.forEach((r) => {
      if (!byProducer[r.producerId]) {
        byProducer[r.producerId] = {
          producerId: r.producerId,
          producerName: r.producer?.name,
          count: 0,
          totalKg: 0,
          totalRevenue: 0,
        };
      }

      byProducer[r.producerId].count++;
      const weight = this.toNumber(r.finalNetWeight ?? r.netWeight);
      byProducer[r.producerId].totalKg += weight;
      byProducer[r.producerId].totalRevenue += weight * this.toNumber(r.ricePrice);
    });

    return Object.values(byProducer)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, limit);
  }

  private async getSeasonOrFail(seasonId: number): Promise<Season> {
    const season = await this.seasonsRepository.findOne({
      where: { id: seasonId, deletedAt: IsNull() },
    });

    if (!season) {
      throw new BadRequestException(`Temporada con ID ${seasonId} no encontrada`);
    }

    return season;
  }

  private async getCompletedSettlementDataset(
    seasonId: number,
    riceTypeId?: number,
  ): Promise<CompletedSettlementDataset> {
    const season = await this.getSeasonOrFail(seasonId);

    const settlements = await this.settlementsRepository.find({
      where: {
        seasonId,
        status: SettlementStatusEnum.COMPLETED,
        deletedAt: IsNull(),
      },
      relations: ['producer'],
      order: { updatedAt: 'ASC' },
    });

    const settlementsMap = new Map<number, Settlement>(
      settlements.map((settlement) => [settlement.id, settlement]),
    );

    if (settlements.length === 0) {
      return {
        season,
        settlementsMap,
        settlementPaymentDateMap: new Map<number, Date>(),
        receptions: [],
      };
    }

    const settlementIds = settlements.map((settlement) => settlement.id);

    const settlementTransactions = await this.transactionsRepository.find({
      where: {
        settlementId: In(settlementIds),
        type: TransactionTypeEnum.SETTLEMENT,
        deletedAt: IsNull(),
      },
      order: { createdAt: 'DESC' },
    });

    const settlementPaymentDateMap = new Map<number, Date>();
    for (const transaction of settlementTransactions) {
      if (!transaction.settlementId || settlementPaymentDateMap.has(transaction.settlementId)) {
        continue;
      }

      const paymentDate = this.parseDateInput(
        transaction.transactionDate ?? transaction.createdAt,
      );

      if (!paymentDate) {
        continue;
      }

      settlementPaymentDateMap.set(transaction.settlementId, paymentDate);
    }

    const receptionsQuery = this.receptionsRepository
      .createQueryBuilder('reception')
      .leftJoinAndSelect('reception.producer', 'producer')
      .leftJoinAndSelect('reception.riceType', 'riceType')
      .where('reception.deletedAt IS NULL')
      .andWhere('reception.seasonId = :seasonId', { seasonId })
      .andWhere('reception.settlementId IN (:...settlementIds)', { settlementIds });

    if (riceTypeId) {
      receptionsQuery.andWhere('reception.riceTypeId = :riceTypeId', {
        riceTypeId,
      });
    }

    const receptions = await receptionsQuery.getMany();

    return {
      season,
      settlementsMap,
      settlementPaymentDateMap,
      receptions,
    };
  }

  private buildSettlementPurchaseEntries(
    dataset: CompletedSettlementDataset,
  ): SettlementPurchaseEntry[] {
    const receptionsBySettlement = new Map<number, Reception[]>();

    for (const reception of dataset.receptions) {
      if (!reception.settlementId) {
        continue;
      }

      const existingReceptions = receptionsBySettlement.get(reception.settlementId) ?? [];
      existingReceptions.push(reception);
      receptionsBySettlement.set(reception.settlementId, existingReceptions);
    }

    const entries: SettlementPurchaseEntry[] = [];

    for (const [settlementId, receptions] of receptionsBySettlement.entries()) {
      const settlement = dataset.settlementsMap.get(settlementId);
      if (!settlement) {
        continue;
      }

      const purchaseDate = this.getSettlementPurchaseDate(
        settlement,
        dataset.settlementPaymentDateMap.get(settlementId) ?? null,
      );

      if (!purchaseDate) {
        continue;
      }

      const purchasedKg = this.round2(
        receptions.reduce(
          (sum, reception) =>
            sum + this.toNumber(reception.finalNetWeight ?? reception.netWeight),
          0,
        ),
      );

      const fallbackTotalNet = this.roundCurrency(
        receptions.reduce(
          (sum, reception) =>
            sum +
            this.toNumber(reception.netWeight) * this.toNumber(reception.ricePrice),
          0,
        ),
      );
      const fallbackTotalAmount = this.roundCurrency(
        fallbackTotalNet + fallbackTotalNet * AnalyticsService.IVA_RATE,
      );

      const settlementTotalAmount = this.roundCurrency(
        this.toNumber(settlement.totalPrice) + this.toNumber(settlement.ivaRice),
      );

      entries.push({
        settlementId,
        settlement,
        purchaseDate,
        purchasedKg,
        totalAmount:
          settlementTotalAmount > 0 ? settlementTotalAmount : fallbackTotalAmount,
        purchaseInvoice: this.getSettlementPurchaseInvoiceNumber(settlement),
      });
    }

    return entries;
  }

  // ===== VOLUMEN Y PRECIO (COMPRA) =====
  async getVolumePriceReport(seasonId: number, riceTypeId?: number) {
    const dataset = await this.getCompletedSettlementDataset(seasonId, riceTypeId);

    const totals = {
      grossKg: 0,
      netKg: 0,
      paidNet: 0,
      paidWithVat: 0,
    };

    const producerIds = new Set<number>();
    const monthlyMap = new Map<
      string,
      {
        month: string;
        receptions: number;
        grossKg: number;
        netKg: number;
        totalPaidNet: number;
      }
    >();

    for (const reception of dataset.receptions) {
      if (!reception.settlementId) {
        continue;
      }

      const settlement = dataset.settlementsMap.get(reception.settlementId);
      if (!settlement) {
        continue;
      }

      const purchaseDate = this.getPurchaseEventDate(
        settlement,
        dataset.settlementPaymentDateMap.get(reception.settlementId) ?? null,
      );
      const month = this.toMonthKeyFromDate(purchaseDate);

      if (!month) {
        continue;
      }

      const grossKg = this.toNumber(reception.grossWeight);
      const paidKg = this.toNumber(reception.finalNetWeight ?? reception.netWeight);
      const paidNet = this.round2(
        this.toNumber(reception.netWeight) * this.toNumber(reception.ricePrice),
      );
      const paidWithVat = this.round2(
        paidNet + paidNet * AnalyticsService.IVA_RATE,
      );

      totals.grossKg += grossKg;
      totals.netKg += paidKg;
      totals.paidNet += paidNet;
      totals.paidWithVat += paidWithVat;

      producerIds.add(reception.producerId);

      const monthBucket =
        monthlyMap.get(month) ??
        {
          month,
          receptions: 0,
          grossKg: 0,
          netKg: 0,
          totalPaidNet: 0,
        };

      monthBucket.receptions += 1;
      monthBucket.grossKg += grossKg;
      monthBucket.netKg += paidKg;
      monthBucket.totalPaidNet += paidNet;
      monthlyMap.set(month, monthBucket);
    }

    const mermaPct =
      totals.grossKg > 0
        ? this.round2((1 - totals.netKg / totals.grossKg) * 100)
        : 0;

    const weightedAvgPricePerKg =
      totals.netKg > 0 ? this.round2(totals.paidNet / totals.netKg) : 0;

    const monthly = Array.from(monthlyMap.values())
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((item) => {
        const monthMermaPct =
          item.grossKg > 0
            ? this.round2((1 - item.netKg / item.grossKg) * 100)
            : 0;
        const monthAvgPricePerKg =
          item.netKg > 0 ? this.round2(item.totalPaidNet / item.netKg) : 0;

        return {
          month: item.month,
          receptions: item.receptions,
          grossKg: this.round2(item.grossKg),
          netKg: this.round2(item.netKg),
          mermaPct: monthMermaPct,
          avgPricePerKg: monthAvgPricePerKg,
          totalPaidNet: this.round2(item.totalPaidNet),
        };
      });

    return {
      season: {
        id: dataset.season.id,
        code: dataset.season.code,
        name: dataset.season.name,
        year: dataset.season.year,
        startDate: dataset.season.startDate,
        endDate: dataset.season.endDate,
      },
      summary: {
        totalGrossKg: this.round2(totals.grossKg),
        totalNetKg: this.round2(totals.netKg),
        mermaPct,
        weightedAvgPricePerKg,
        totalPaidNet: this.round2(totals.paidNet),
        totalPaidWithVat: this.round2(totals.paidWithVat),
        totalReceptions: dataset.receptions.length,
        totalProducers: producerIds.size,
      },
      monthly,
    };
  }

  async getVolumePriceByProducerReport(seasonId: number, riceTypeId?: number) {
    const dataset = await this.getCompletedSettlementDataset(seasonId, riceTypeId);

    const producersMap = new Map<
      number,
      {
        producerId: number;
        producerName: string;
        producerRut: string | null;
        receptions: number;
        grossKg: number;
        netKg: number;
        totalPaidNet: number;
      }
    >();

    let seasonNetKg = 0;
    let seasonPaidNet = 0;

    for (const reception of dataset.receptions) {
      const grossKg = this.toNumber(reception.grossWeight);
      const paidKg = this.toNumber(reception.finalNetWeight ?? reception.netWeight);
      const paidNet = this.round2(
        this.toNumber(reception.netWeight) * this.toNumber(reception.ricePrice),
      );

      seasonNetKg += paidKg;
      seasonPaidNet += paidNet;

      const existing =
        producersMap.get(reception.producerId) ??
        {
          producerId: reception.producerId,
          producerName: reception.producer?.name ?? `Productor ${reception.producerId}`,
          producerRut: reception.producer?.rut ?? null,
          receptions: 0,
          grossKg: 0,
          netKg: 0,
          totalPaidNet: 0,
        };

      existing.receptions += 1;
      existing.grossKg += grossKg;
      existing.netKg += paidKg;
      existing.totalPaidNet += paidNet;
      producersMap.set(reception.producerId, existing);
    }

    const seasonAvgPricePerKg =
      seasonNetKg > 0 ? this.round2(seasonPaidNet / seasonNetKg) : 0;

    const producers = Array.from(producersMap.values())
      .map((producer) => {
        const avgPricePerKg =
          producer.netKg > 0 ? this.round2(producer.totalPaidNet / producer.netKg) : 0;
        const mermaPct =
          producer.grossKg > 0
            ? this.round2((1 - producer.netKg / producer.grossKg) * 100)
            : 0;
        const participationPct =
          seasonNetKg > 0 ? this.round2((producer.netKg / seasonNetKg) * 100) : 0;

        return {
          producerId: producer.producerId,
          producerName: producer.producerName,
          producerRut: producer.producerRut,
          receptions: producer.receptions,
          grossKg: this.round2(producer.grossKg),
          netKg: this.round2(producer.netKg),
          mermaPct,
          avgPricePerKg,
          deltaVsSeasonAvg: this.round2(avgPricePerKg - seasonAvgPricePerKg),
          totalPaidNet: this.round2(producer.totalPaidNet),
          participationPct,
        };
      })
      .sort((a, b) => b.netKg - a.netKg);

    return {
      season: {
        id: dataset.season.id,
        code: dataset.season.code,
        name: dataset.season.name,
        year: dataset.season.year,
      },
      seasonAvgPricePerKg,
      totalPurchasedKg: this.round2(seasonNetKg),
      producers,
    };
  }

  async getVolumePriceProducerDetailReport(
    producerId: number,
    seasonId: number,
    riceTypeId?: number,
  ) {
    const producer = await this.producersRepository.findOne({
      where: { id: producerId, deletedAt: IsNull() },
    });

    if (!producer) {
      throw new BadRequestException(`Productor con ID ${producerId} no encontrado`);
    }

    const dataset = await this.getCompletedSettlementDataset(seasonId, riceTypeId);

    const receptions = dataset.receptions
      .filter((reception) => reception.producerId === producerId)
      .map((reception) => {
        const settlement =
          reception.settlementId !== undefined && reception.settlementId !== null
            ? dataset.settlementsMap.get(reception.settlementId)
            : undefined;

        const purchaseDate = settlement
          ? this.getPurchaseEventDate(
              settlement,
              dataset.settlementPaymentDateMap.get(settlement.id) ?? null,
            )
          : null;

        const grossKg = this.toNumber(reception.grossWeight);
        const paidKg = this.toNumber(reception.finalNetWeight ?? reception.netWeight);
        const pricePerKg = this.toNumber(reception.ricePrice);
        const totalPaidNet = this.round2(this.toNumber(reception.netWeight) * pricePerKg);
        const mermaPct =
          grossKg > 0 ? this.round2((1 - paidKg / grossKg) * 100) : 0;

        return {
          receptionId: reception.id,
          receptionDate: reception.receptionDate ?? reception.createdAt,
          purchaseDate,
          guideNumber: reception.guideNumber,
          riceTypeName: reception.riceType?.name ?? null,
          grossKg: this.round2(grossKg),
          netKg: this.round2(paidKg),
          mermaPct,
          pricePerKg: this.round2(pricePerKg),
          totalPaidNet,
        };
      })
      .sort((a, b) => {
        const aTime = new Date(a.receptionDate).getTime();
        const bTime = new Date(b.receptionDate).getTime();
        return bTime - aTime;
      });

    const totals = receptions.reduce(
      (acc, row) => {
        acc.grossKg += row.grossKg;
        acc.netKg += row.netKg;
        acc.totalPaidNet += row.totalPaidNet;
        return acc;
      },
      { grossKg: 0, netKg: 0, totalPaidNet: 0 },
    );

    const avgPricePerKg =
      totals.netKg > 0 ? this.round2(totals.totalPaidNet / totals.netKg) : 0;
    const mermaPct =
      totals.grossKg > 0 ? this.round2((1 - totals.netKg / totals.grossKg) * 100) : 0;

    return {
      season: {
        id: dataset.season.id,
        code: dataset.season.code,
        name: dataset.season.name,
        year: dataset.season.year,
      },
      producer: {
        id: producer.id,
        name: producer.name,
        rut: producer.rut,
      },
      summary: {
        receptions: receptions.length,
        grossKg: this.round2(totals.grossKg),
        netKg: this.round2(totals.netKg),
        mermaPct,
        avgPricePerKg,
        totalPaidNet: this.round2(totals.totalPaidNet),
      },
      receptions,
    };
  }

  // ===== PROYECCIÓN DE CAJA =====
  async getCashProjectionReport(seasonId?: number) {
    const today = new Date();

    let season: Season | null = null;

    if (seasonId) {
      season = await this.seasonsRepository.findOne({
        where: { id: seasonId, deletedAt: IsNull() },
      });
    } else {
      season =
        (await this.seasonsRepository.findOne({
          where: { isActive: true, deletedAt: IsNull() },
          order: { year: 'DESC' },
        })) ??
        (await this.seasonsRepository.findOne({
          where: { deletedAt: IsNull() },
          order: { year: 'DESC', id: 'DESC' },
        }));
    }

    const emptyResult = {
      reportName: 'Proyección de Caja',
      season: season
        ? { id: season.id, code: season.code, name: season.name, year: season.year }
        : null,
      generatedAt: today.toISOString(),
      summary: {
        totalReceptions: 0,
        totalKg: 0,
        valorBruto: 0,
        cargoSecado: 0,
        subtotalAntesAnticipos: 0,
        totalAnticipos: 0,
        interesAcumulado: 0,
        saldoEstimado: 0,
        productoresConSaldoNegativo: 0,
        productoresCount: 0,
      },
      byProducer: [] as Array<{
        producerId: number;
        producerName: string;
        producerRut: string | null;
        receptionsCount: number;
        totalKg: number;
        valorBruto: number;
        cargoSecado: number;
        subtotal: number;
        totalAnticipos: number;
        anticiposCount: number;
        interesAcumulado: number;
        saldoEstimado: number;
      }>,
      detail: [] as Array<{
        receptionId: number;
        guideNumber: string;
        receptionDate: string;
        producerId: number;
        producerName: string;
        producerRut: string | null;
        riceTypeName: string | null;
        kg: number;
        ricePrice: number;
        valorBruto: number;
        dryPercent: number;
        dryFeeApplied: boolean;
        cargoSecado: number;
        subtotal: number;
      }>,
      assumptions: {
        cutDate: this.toDateKey(today),
        receptionStatus: 'analyzed',
        interestMode: 'devengado al dia de corte',
        ivaNote:
          'Los montos no incluyen IVA. Cálculo bruto de compra de arroz basado en peso neto final × precio por kg.',
      },
    };

    if (!season) {
      return emptyResult;
    }

    const receptions = await this.receptionsRepository.find({
      where: {
        seasonId: season.id,
        status: ReceptionStatusEnum.ANALYZED,
        deletedAt: IsNull(),
      },
      relations: ['producer', 'riceType'],
      order: { createdAt: 'ASC' },
    });

    if (receptions.length === 0) {
      return emptyResult;
    }

    const receptionsByProducer = new Map<number, typeof receptions>();
    for (const reception of receptions) {
      const existing = receptionsByProducer.get(reception.producerId) ?? [];
      existing.push(reception);
      receptionsByProducer.set(reception.producerId, existing);
    }

    const producerIds = Array.from(receptionsByProducer.keys());

    const advances = await this.advancesRepository.find({
      where: {
        producerId: In(producerIds),
        seasonId: season.id,
        status: AdvanceStatusEnum.PAID,
        isActive: true,
        deletedAt: IsNull(),
      },
    });

    const advancesByProducer = new Map<number, Advance[]>();
    for (const advance of advances) {
      const existing = advancesByProducer.get(advance.producerId) ?? [];
      existing.push(advance);
      advancesByProducer.set(advance.producerId, existing);
    }

    const byProducer: typeof emptyResult.byProducer = [];
    const detail: typeof emptyResult.detail = [];

    let summaryValorBruto = 0;
    let summaryCargoSecado = 0;
    let summaryTotalAnticipos = 0;
    let summaryInteresAcumulado = 0;
    let summaryTotalKg = 0;
    let productoresConSaldoNegativo = 0;

    for (const [producerId, prodReceptions] of receptionsByProducer) {
      const producer = prodReceptions[0].producer!;
      const prodAdvances = advancesByProducer.get(producerId) ?? [];
      let prodValorBruto = 0;
      let prodCargoSecado = 0;
      let prodTotalKg = 0;

      for (const reception of prodReceptions) {
        const kg = this.toNumber(reception.finalNetWeight ?? reception.netWeight);
        const price = this.toNumber(reception.ricePrice);
        const grossValue = this.roundCurrency(kg * price);
        const dryCharge = reception.dryFeeApplied
          ? this.roundCurrency(
              (grossValue * this.toNumber(reception.dryPercent)) / 100,
            )
          : 0;

        prodTotalKg += kg;
        prodValorBruto += grossValue;
        prodCargoSecado += dryCharge;

        const receptionDate = this.parseDateInput(reception.receptionDate ?? reception.createdAt);

        detail.push({
          receptionId: reception.id,
          guideNumber: reception.guideNumber,
          receptionDate: receptionDate ? this.toDateKey(receptionDate) : '-',
          producerId: reception.producerId,
          producerName: producer.name,
          producerRut: producer.rut ?? null,
          riceTypeName: reception.riceType?.name ?? null,
          kg,
          ricePrice: this.toNumber(reception.ricePrice),
          valorBruto: grossValue,
          dryPercent: this.toNumber(reception.dryPercent),
          dryFeeApplied: reception.dryFeeApplied,
          cargoSecado: dryCharge,
          subtotal: this.roundCurrency(grossValue - dryCharge),
        });
      }

      const prodTotalAnticipos = prodAdvances.reduce(
        (sum, a) => sum + this.toNumber(a.amount),
        0,
      );

      const prodInteresAcumulado = prodAdvances.reduce(
        (sum, a) => sum + this.calculateAdvanceAccruedInterest(a, today),
        0,
      );

      const subtotal = this.roundCurrency(prodValorBruto - prodCargoSecado);
      const saldoEstimado = this.roundCurrency(
        subtotal - prodTotalAnticipos - prodInteresAcumulado,
      );

      if (saldoEstimado < 0) {
        productoresConSaldoNegativo++;
      }

      byProducer.push({
        producerId,
        producerName: producer.name,
        producerRut: producer.rut ?? null,
        receptionsCount: prodReceptions.length,
        totalKg: this.round2(prodTotalKg),
        valorBruto: this.roundCurrency(prodValorBruto),
        cargoSecado: this.roundCurrency(prodCargoSecado),
        subtotal,
        totalAnticipos: this.roundCurrency(prodTotalAnticipos),
        anticiposCount: prodAdvances.length,
        interesAcumulado: this.roundCurrency(prodInteresAcumulado),
        saldoEstimado,
      });

      summaryValorBruto += prodValorBruto;
      summaryCargoSecado += prodCargoSecado;
      summaryTotalAnticipos += prodTotalAnticipos;
      summaryInteresAcumulado += prodInteresAcumulado;
      summaryTotalKg += prodTotalKg;
    }

    byProducer.sort((a, b) => a.producerName.localeCompare(b.producerName));
    detail.sort(
      (a, b) =>
        a.producerName.localeCompare(b.producerName) ||
        a.receptionDate.localeCompare(b.receptionDate),
    );

    const summarySubtotal = this.roundCurrency(summaryValorBruto - summaryCargoSecado);
    const summarySaldoEstimado = this.roundCurrency(
      summarySubtotal - summaryTotalAnticipos - summaryInteresAcumulado,
    );

    return {
      reportName: 'Proyección de Caja',
      season: {
        id: season.id,
        code: season.code,
        name: season.name,
        year: season.year,
      },
      generatedAt: today.toISOString(),
      summary: {
        totalReceptions: receptions.length,
        totalKg: this.round2(summaryTotalKg),
        valorBruto: this.roundCurrency(summaryValorBruto),
        cargoSecado: this.roundCurrency(summaryCargoSecado),
        subtotalAntesAnticipos: summarySubtotal,
        totalAnticipos: this.roundCurrency(summaryTotalAnticipos),
        interesAcumulado: this.roundCurrency(summaryInteresAcumulado),
        saldoEstimado: summarySaldoEstimado,
        productoresConSaldoNegativo,
        productoresCount: byProducer.length,
      },
      byProducer,
      detail,
      assumptions: {
        cutDate: this.toDateKey(today),
        receptionStatus: 'analyzed',
        interestMode: 'devengado al dia de corte',
        ivaNote:
          'Los montos no incluyen IVA. Cálculo bruto de compra de arroz basado en peso neto final × precio por kg.',
      },
    };
  }

  // ===== LIBRO DE EXISTENCIAS (DEPOSITO / PROPIO) =====
  async getInventoryBookMonthlyReport(seasonId: number, month: string) {
    const season = await this.getSeasonOrFail(seasonId);
    const { start, endExclusive } = this.parseMonthKey(month);
    const monthKey = this.formatMonthKey(start);

    const allReceptions = await this.receptionsRepository.find({
      where: { seasonId, deletedAt: IsNull() },
      relations: ['producer'],
      order: { receptionDate: 'ASC', createdAt: 'ASC' },
    });

    const completedDataset = await this.getCompletedSettlementDataset(seasonId);
    const settlementPurchases = this.buildSettlementPurchaseEntries(completedDataset);

    const getReceptionDate = (reception: Reception): Date | null =>
      this.parseDateInput(reception.receptionDate) ?? this.parseDateInput(reception.createdAt);

    const previousReceivedKg = allReceptions.reduce((sum, reception) => {
      const receptionDate = getReceptionDate(reception);
      if (receptionDate && receptionDate < start) {
        return sum + this.toNumber(reception.netWeight);
      }

      return sum;
    }, 0);

    const previousPurchasedKg = settlementPurchases.reduce((sum, entry) => {
      if (entry.purchaseDate < start) {
        return sum + this.toNumber(entry.purchasedKg);
      }

      return sum;
    }, 0);

    const monthReceivedKg = allReceptions.reduce((sum, reception) => {
      const receptionDate = getReceptionDate(reception);
      if (receptionDate && receptionDate >= start && receptionDate < endExclusive) {
        return sum + this.toNumber(reception.netWeight);
      }

      return sum;
    }, 0);

    const monthPurchasedKg = settlementPurchases.reduce((sum, entry) => {
      if (entry.purchaseDate >= start && entry.purchaseDate < endExclusive) {
        return sum + this.toNumber(entry.purchasedKg);
      }

      return sum;
    }, 0);

    const previousBalance = {
      deposito: this.round2(previousReceivedKg - previousPurchasedKg),
      propio: this.round2(previousPurchasedKg),
      total: this.round2(previousReceivedKg),
    };

    const closingBalance = {
      deposito: this.round2(previousBalance.deposito + monthReceivedKg - monthPurchasedKg),
      propio: this.round2(previousBalance.propio + monthPurchasedKg),
      total: this.round2(previousBalance.total + monthReceivedKg),
    };

    const receptionMovements = allReceptions
      .filter((reception) => {
        const receptionDate = getReceptionDate(reception);
        return Boolean(
          receptionDate && receptionDate >= start && receptionDate < endExclusive,
        );
      })
      .map((reception) => {
        const receptionDate = getReceptionDate(reception) ?? reception.createdAt;
        const receivedKg = this.round2(this.toNumber(reception.netWeight));

        return {
          date: receptionDate,
          movementType: 'RECEPTION',
          receptionId: reception.id,
          receptionBookNumber:
            typeof reception.receptionBookNumber === 'string' &&
            reception.receptionBookNumber.trim().length > 0
              ? reception.receptionBookNumber.trim()
              : String(reception.id),
          rut: reception.producer?.rut ?? null,
          producerName: reception.producer?.name ?? null,
          dispatchGuide: reception.guideNumber ?? null,
          receivedKg,
          purchaseInvoice: null,
          purchasedKg: null,
          pricePerKg: null,
          totalAmount: null,
          grossKg: this.round2(this.toNumber(reception.grossWeight)),
          depositoDelta: receivedKg,
          propioDelta: 0,
        };
      });

    const purchaseMovements = settlementPurchases
      .filter(
        (entry) =>
          entry.purchaseDate >= start && entry.purchaseDate < endExclusive,
      )
      .map((entry) => ({
        date: entry.purchaseDate,
        movementType: 'PURCHASE',
        receptionId: null,
        receptionBookNumber: null,
        rut: entry.settlement.producer?.rut ?? null,
        producerName: entry.settlement.producer?.name ?? null,
        dispatchGuide: null,
        receivedKg: null,
        purchaseInvoice: entry.purchaseInvoice,
        purchasedKg: entry.purchasedKg,
        pricePerKg: null,
        totalAmount: entry.totalAmount,
        grossKg: null,
        depositoDelta: -entry.purchasedKg,
        propioDelta: entry.purchasedKg,
      }));

    const movements = [...receptionMovements, ...purchaseMovements].sort((a, b) => {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();

      if (aTime !== bTime) {
        return aTime - bTime;
      }

      return a.movementType.localeCompare(b.movementType);
    });

    return {
      month: monthKey,
      season: {
        id: season.id,
        name: season.name,
        year: season.year,
      },
      summary: {
        previousBalance,
        receivedKg: this.round2(monthReceivedKg),
        purchasedKg: this.round2(monthPurchasedKg),
        closingBalance,
      },
      movements,
    };
  }

  async getInventoryBookSeasonSummary(seasonId: number) {
    const season = await this.getSeasonOrFail(seasonId);

    const monthKeys = this.buildSeasonMonthKeys(season);

    const allReceptions = await this.receptionsRepository.find({
      where: { seasonId, deletedAt: IsNull() },
      order: { createdAt: 'ASC' },
      take: 50000,
    });

    const completedDataset = await this.getCompletedSettlementDataset(seasonId);
    const settlementPurchases = this.buildSettlementPurchaseEntries(completedDataset);

    const getReceptionDate = (reception: Reception): Date | null =>
      this.parseDateInput(reception.receptionDate) ?? this.parseDateInput(reception.createdAt);

    const receivedByMonth = new Map<string, number>();
    for (const reception of allReceptions) {
      const monthKey = this.toMonthKeyFromDate(getReceptionDate(reception));
      if (!monthKey) {
        continue;
      }

      receivedByMonth.set(
        monthKey,
        this.toNumber(receivedByMonth.get(monthKey)) + this.toNumber(reception.netWeight),
      );
    }

    const purchasedByMonth = new Map<string, number>();
    for (const entry of settlementPurchases) {
      const monthKey = this.toMonthKeyFromDate(entry.purchaseDate);

      if (!monthKey) {
        continue;
      }

      purchasedByMonth.set(
        monthKey,
        this.toNumber(purchasedByMonth.get(monthKey)) + this.toNumber(entry.purchasedKg),
      );
    }

    const monthly = [];
    let runningDeposito = 0;
    let runningPropio = 0;
    let runningTotal = 0;

    for (const monthKey of monthKeys) {
      const previousBalance = {
        total: this.round2(runningTotal),
        propio: this.round2(runningPropio),
        deposito: this.round2(runningDeposito),
      };

      const receivedKg = this.toNumber(receivedByMonth.get(monthKey));
      const purchasedKg = this.toNumber(purchasedByMonth.get(monthKey));

      runningDeposito = runningDeposito + receivedKg - purchasedKg;
      runningPropio = runningPropio + purchasedKg;
      runningTotal = runningTotal + receivedKg;

      monthly.push({
        month: monthKey,
        previousBalance,
        receivedKg: this.round2(receivedKg),
        purchasedKg: this.round2(purchasedKg),
        closingBalance: {
          total: this.round2(runningTotal),
          propio: this.round2(runningPropio),
          deposito: this.round2(runningDeposito),
        },
      });
    }

    return {
      season: {
        id: season.id,
        name: season.name,
        year: season.year,
        startDate: season.startDate,
        endDate: season.endDate,
      },
      monthly,
      totals: {
        receivedKg: this.round2(
          monthly.reduce((sum, row) => sum + this.toNumber(row.receivedKg), 0),
        ),
        purchasedKg: this.round2(
          monthly.reduce((sum, row) => sum + this.toNumber(row.purchasedKg), 0),
        ),
        closingBalance: monthly.length
          ? monthly[monthly.length - 1].closingBalance
          : {
              total: 0,
              propio: 0,
              deposito: 0,
            },
      },
    };
  }

  // ===== IVA CREDITO VS DEBITO =====
  async getIvaTaxReport(seasonId: number, month?: string) {
    const season = await this.getSeasonOrFail(seasonId);
    const selectedMonth = month?.trim() ? this.formatMonthKey(this.parseMonthKey(month).start) : null;

    const settlements = await this.settlementsRepository.find({
      where: {
        seasonId,
        status: SettlementStatusEnum.COMPLETED,
        deletedAt: IsNull(),
      },
      order: { updatedAt: 'ASC' },
      take: 50000,
    });

    const settlementIds = settlements.map((settlement) => settlement.id);
    const transactions = settlementIds.length
      ? await this.transactionsRepository.find({
          where: {
            settlementId: In(settlementIds),
            type: TransactionTypeEnum.SETTLEMENT,
            deletedAt: IsNull(),
          },
          order: { createdAt: 'DESC' },
        })
      : [];

    const paymentDateMap = new Map<number, Date>();
    for (const transaction of transactions) {
      if (!transaction.settlementId || paymentDateMap.has(transaction.settlementId)) {
        continue;
      }

      paymentDateMap.set(
        transaction.settlementId,
        transaction.transactionDate ?? transaction.createdAt,
      );
    }

    const monthKeys = this.buildSeasonMonthKeys(season);
    const monthlyMap = new Map<
      string,
      {
        month: string;
        settlements: number;
        ivaCredit: number;
        ivaDebitServices: number;
        ivaDebitInterests: number;
      }
    >();

    for (const monthKey of monthKeys) {
      monthlyMap.set(monthKey, {
        month: monthKey,
        settlements: 0,
        ivaCredit: 0,
        ivaDebitServices: 0,
        ivaDebitInterests: 0,
      });
    }

    for (const settlement of settlements) {
      const purchaseDate = this.getPurchaseEventDate(
        settlement,
        paymentDateMap.get(settlement.id) ?? null,
      );
      const monthKey = this.toMonthKeyFromDate(purchaseDate);

      if (!monthKey) {
        continue;
      }

      const bucket =
        monthlyMap.get(monthKey) ??
        {
          month: monthKey,
          settlements: 0,
          ivaCredit: 0,
          ivaDebitServices: 0,
          ivaDebitInterests: 0,
        };

      bucket.settlements += 1;
      bucket.ivaCredit += this.toNumber(settlement.ivaRice);
      bucket.ivaDebitServices += this.toNumber(settlement.ivaServices);
      bucket.ivaDebitInterests += this.round2(
        this.toNumber(settlement.totalInterest) * AnalyticsService.IVA_RATE,
      );

      monthlyMap.set(monthKey, bucket);
    }

    const monthly = Array.from(monthlyMap.values())
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((item) => {
        const ivaDebitTotal = this.round2(
          item.ivaDebitServices + item.ivaDebitInterests,
        );
        const saldo = this.round2(ivaDebitTotal - item.ivaCredit);

        return {
          month: item.month,
          settlements: item.settlements,
          ivaCredit: this.round2(item.ivaCredit),
          ivaDebitServices: this.round2(item.ivaDebitServices),
          ivaDebitInterests: this.round2(item.ivaDebitInterests),
          ivaDebitTotal,
          saldo,
          ivaAPagar: saldo > 0 ? saldo : 0,
          remanente: saldo < 0 ? this.round2(Math.abs(saldo)) : 0,
        };
      });

    const seasonTotals = monthly.reduce(
      (acc, item) => {
        acc.ivaCredit += item.ivaCredit;
        acc.ivaDebitServices += item.ivaDebitServices;
        acc.ivaDebitInterests += item.ivaDebitInterests;
        return acc;
      },
      {
        ivaCredit: 0,
        ivaDebitServices: 0,
        ivaDebitInterests: 0,
      },
    );

    const ivaDebitTotal = this.round2(
      seasonTotals.ivaDebitServices + seasonTotals.ivaDebitInterests,
    );
    const saldo = this.round2(ivaDebitTotal - seasonTotals.ivaCredit);

    const selectedMonthSummary = selectedMonth
      ? monthly.find((item) => item.month === selectedMonth) ?? {
          month: selectedMonth,
          settlements: 0,
          ivaCredit: 0,
          ivaDebitServices: 0,
          ivaDebitInterests: 0,
          ivaDebitTotal: 0,
          saldo: 0,
          ivaAPagar: 0,
          remanente: 0,
        }
      : null;

    return {
      season: {
        id: season.id,
        name: season.name,
        year: season.year,
      },
      seasonTotals: {
        ivaCredit: this.round2(seasonTotals.ivaCredit),
        ivaDebitServices: this.round2(seasonTotals.ivaDebitServices),
        ivaDebitInterests: this.round2(seasonTotals.ivaDebitInterests),
        ivaDebitTotal,
        saldo,
        ivaAPagar: saldo > 0 ? saldo : 0,
        remanente: saldo < 0 ? this.round2(Math.abs(saldo)) : 0,
      },
      monthly,
      selectedMonth: selectedMonthSummary,
      assumptions: {
        ivaCreditSource: 'Settlement.ivaRice',
        ivaDebitServicesSource: 'Settlement.ivaServices',
        ivaDebitInterestsFormula: 'Settlement.totalInterest * 0.19',
      },
    };
  }

  // ===== PRECIO POR TIPO DE ARROZ =====
  async getRicePriceReport(filters: RicePriceReportFilters) {
    const { start, endExclusive } = this.parseDateRange(
      filters.fechaInicio,
      filters.fechaFin,
    );
    const groupBy: DryingGroupBy = filters.groupBy ?? 'month';

    const query = this.receptionsRepository
      .createQueryBuilder('reception')
      .leftJoinAndSelect('reception.riceType', 'riceType')
      .where('reception.deletedAt IS NULL')
      .andWhere('reception.status = :status', {
        status: ReceptionStatusEnum.SETTLED,
      })
      .andWhere('reception.receptionDate >= :start', {
        start: this.toDateKey(start),
      })
      .andWhere('reception.receptionDate < :end', {
        end: this.toDateKey(endExclusive),
      });

    if (filters.riceTypeId) {
      query.andWhere('reception.riceTypeId = :riceTypeId', {
        riceTypeId: filters.riceTypeId,
      });
    }

    const receptions = await query.getMany();

    // Map: riceTypeId → Map<periodKey, bucket>
    const riceTypeSeriesMap = new Map<
      number,
      {
        riceTypeId: number;
        riceTypeCode: string;
        riceTypeName: string;
        periodBuckets: Map<
          string,
          {
            totalWeightedPrice: number;
            totalKg: number;
            receptionCount: number;
          }
        >;
      }
    >();

    let totalReceptions = 0;
    let totalKg = 0;
    const allPeriodKeys = new Set<string>();

    for (const reception of receptions) {
      if (!reception.riceType) {
        continue;
      }

      const receptionDate = this.parseDateInput(reception.receptionDate);
      if (!receptionDate) {
        continue;
      }

      const paddyKg = this.round2(
        this.toNumber(reception.finalNetWeight ?? reception.netWeight),
      );
      const price = this.round2(this.toNumber(reception.ricePrice));

      if (paddyKg <= 0 || price <= 0) {
        continue;
      }

      const periodKey = this.getDryingPeriodKey(receptionDate, groupBy);
      allPeriodKeys.add(periodKey);

      const riceTypeId = reception.riceType.id;

      if (!riceTypeSeriesMap.has(riceTypeId)) {
        riceTypeSeriesMap.set(riceTypeId, {
          riceTypeId,
          riceTypeCode: reception.riceType.code,
          riceTypeName: reception.riceType.name,
          periodBuckets: new Map(),
        });
      }

      const series = riceTypeSeriesMap.get(riceTypeId)!;

      if (!series.periodBuckets.has(periodKey)) {
        series.periodBuckets.set(periodKey, {
          totalWeightedPrice: 0,
          totalKg: 0,
          receptionCount: 0,
        });
      }

      const bucket = series.periodBuckets.get(periodKey)!;
      bucket.totalWeightedPrice += paddyKg * price;
      bucket.totalKg += paddyKg;
      bucket.receptionCount += 1;

      totalReceptions += 1;
      totalKg += paddyKg;
    }

    const sortedPeriodKeys = groupBy === 'month'
      ? this.buildMonthKeysFromRange(start, endExclusive)
      : groupBy === 'week'
      ? this.buildWeekKeysFromRange(start, endExclusive)
      : this.buildDayKeysFromRange(start, endExclusive);

    const series = Array.from(riceTypeSeriesMap.values())
      .sort((a, b) => a.riceTypeName.localeCompare(b.riceTypeName))
      .map((rt) => ({
        riceTypeId: rt.riceTypeId,
        riceTypeCode: rt.riceTypeCode,
        riceTypeName: rt.riceTypeName,
        data: sortedPeriodKeys.map((periodKey) => {
          const bucket = rt.periodBuckets.get(periodKey);

          if (!bucket || bucket.totalKg <= 0) {
            return {
              periodKey,
              weightedAvgPrice: null,
              totalKg: 0,
              receptionCount: 0,
            };
          }

          return {
            periodKey,
            weightedAvgPrice: this.round2(
              bucket.totalWeightedPrice / bucket.totalKg,
            ),
            totalKg: this.round2(bucket.totalKg),
            receptionCount: bucket.receptionCount,
          };
        }),
      }));

    return {
      reportName: 'Informe de Evolución de Precios por Tipo de Arroz',
      period: {
        fechaInicio: filters.fechaInicio,
        fechaFin: filters.fechaFin,
        groupBy,
        riceTypeId: filters.riceTypeId ?? null,
      },
      summary: {
        totalReceptions,
        totalKg: this.round2(totalKg),
        riceTypesCount: riceTypeSeriesMap.size,
        periodLabels: sortedPeriodKeys,
      },
      series,
      assumptions: {
        universe: 'recepciones liquidadas (status = SETTLED)',
        fechaCorte: 'fecha de recepción del camión (receptionDate)',
        formula: 'precio_ponderado = SUM(finalNetWeight * ricePrice) / SUM(finalNetWeight)',
      },
    };
  }
}
