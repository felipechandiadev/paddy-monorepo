import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, In, EntityManager } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { DateTime } from 'luxon';
import {
  parseDateInput,
  formatDateString,
  daysBetween,
  toJSDate,
  parseDateInputLocal,
} from '@shared/utils/luxon-utils';
import {
  Advance,
  Transaction,
  Settlement,
  SettlementReceptionSnapshot,
} from '../domain/finances.entity';
import { AnalysisRecord, Reception } from '@modules/operations/domain/operations.entity';
import {
  AdvanceStatusEnum,
  PaymentMethodEnum,
  TransactionTypeEnum,
  SettlementStatusEnum,
  ReceptionStatusEnum,
} from '@shared/enums';
import { Producer } from '@modules/producers/domain/producer.entity';
import { AuditService } from '@modules/audit/application/audit.service';
import { AuditCategory, AuditAction, AuditStatus, AuditSeverity } from '@modules/audit/domain/audit-event.entity';
import {
  CompleteSettlementDto,
  CreateAdvanceDto,
  CreateSettlementDto,
  UpdateAdvanceDto,
  UpdateSettlementDto,
} from '../dto/finances.dto';

export interface SettlementReceptionPrintLine {
  id: number;
  receptionDate: Date | null;
  guideNumber: string;
  riceTypeName: string | null;
  paddyKg: number;
  ricePrice: number;
  paddySubTotal: number;
  paddyVat: number;
  paddyTotal: number;
  dryPercent: number;
  dryingSubTotal: number;
  dryingVat: number;
  dryingTotal: number;
}

export interface SettlementAdvancePrintLine {
  id: number;
  issueDate: Date | null;
  amount: number;
  interestRate: number;
  totalDays: number;
  accumulatedInterest: number;
  paymentMethod: PaymentMethodEnum | null;
  bank: string | null;
  reference: string | null;
  transferAccount: string | null;
}

interface SettlementServiceTotals {
  totalServicesWithVat: number;
  ivaServices: number;
  ivaInterests: number;
  source: 'none' | 'summary' | 'serviceInvoices';
}

interface SettlementFinancialBreakdown {
  interestNet: number;
  interestVat: number;
  interestTotal: number;
  servicesNet: number;
  servicesVat: number;
  servicesTotal: number;
  liquidationNet: number;
  liquidationVat: number;
  liquidationTotal: number;
}

@Injectable()
export class FinancesService {
  private static readonly RICE_VAT_RATE = 0.19;

  constructor(
    @InjectRepository(Advance)
    private advancesRepository: Repository<Advance>,
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @InjectRepository(Settlement)
    private settlementsRepository: Repository<Settlement>,
    @InjectRepository(SettlementReceptionSnapshot)
    private settlementReceptionSnapshotsRepository: Repository<SettlementReceptionSnapshot>,
    @InjectRepository(Reception)
    private receptionsRepository: Repository<Reception>,
    @InjectRepository(AnalysisRecord)
    private analysisRecordsRepository: Repository<AnalysisRecord>,
    @InjectRepository(Producer)
    private producersRepository: Repository<Producer>,
    private auditService: AuditService,
  ) {}

  private parseDateOnly(value?: string | null): Date | null {
    if (!value) {
      return null;
    }

    const dt = parseDateInputLocal(value);
    return dt ? toJSDate(dt) : null;
  }

  private formatDateOnly(value?: Date | string | null): string | null {
    if (!value) {
      return null;
    }

    if (value instanceof Date) {
      const dt = DateTime.fromJSDate(value, { zone: 'utc' });
      return formatDateString(dt);
    }

    return formatDateString(parseDateInput(value));
  }

  private parseDateInput(value?: Date | string | null): Date | null {
    if (!value) {
      return null;
    }

    const dt = this.parseDateInputLuxon(value);
    return dt ? toJSDate(dt) : null;
  }

  private parseDateInputLuxon(value?: Date | string | null): DateTime | null {
    if (!value) {
      return null;
    }

    if (value instanceof Date) {
      const dt = DateTime.fromJSDate(value, { zone: 'utc' });
      return dt.isValid ? dt : null;
    }

    return parseDateInput(value);
  }

  private extractPurchaseInvoiceNumber(
    primaryDetails?: Record<string, unknown> | null,
    fallbackDetails?: Record<string, unknown> | null,
  ): string | null {
    const normalizeValue = (value: unknown): string | null => {
      if (typeof value !== 'string') {
        return null;
      }

      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    };

    const readFromDetails = (
      details?: Record<string, unknown> | null,
    ): string | null => {
      if (!details || typeof details !== 'object') {
        return null;
      }

      const topLevelInvoice = normalizeValue(details.purchaseInvoiceNumber);
      if (topLevelInvoice) {
        return topLevelInvoice;
      }

      const purchaseInvoice =
        details.purchaseInvoice && typeof details.purchaseInvoice === 'object'
          ? (details.purchaseInvoice as Record<string, unknown>)
          : null;

      return normalizeValue(purchaseInvoice?.invoiceNumber);
    };

    return (
      readFromDetails(primaryDetails) ?? readFromDetails(fallbackDetails) ?? null
    );
  }

  private roundCurrency(value: number): number {
    if (!Number.isFinite(value)) {
      return 0;
    }

    return Math.round(value);
  }

  private toNumber(value: unknown): number {
    if (value === null || value === undefined || value === '') {
      return 0;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private getSettlementServiceTotals(
    calculationDetails?: Record<string, unknown> | null,
  ): SettlementServiceTotals {
    const defaultTotals: SettlementServiceTotals = {
      totalServicesWithVat: 0,
      ivaServices: 0,
      ivaInterests: 0,
      source: 'none',
    };

    if (!calculationDetails || typeof calculationDetails !== 'object') {
      return defaultTotals;
    }

    const summary =
      calculationDetails.summary && typeof calculationDetails.summary === 'object'
        ? (calculationDetails.summary as Record<string, unknown>)
        : null;
    const summaryTotalServicesWithVat = this.roundCurrency(
      this.toNumber(summary?.totalServicesWithVat),
    );

    const serviceInvoices =
      calculationDetails.serviceInvoices &&
      typeof calculationDetails.serviceInvoices === 'object'
        ? (calculationDetails.serviceInvoices as Record<string, unknown>)
        : null;

    if (!serviceInvoices) {
      return summaryTotalServicesWithVat > 0
        ? {
            ...defaultTotals,
            totalServicesWithVat: summaryTotalServicesWithVat,
            source: 'summary',
          }
        : defaultTotals;
    }

    let totalServicesWithVat = 0;
    let ivaServices = 0;
    let ivaInterests = 0;
    let validInvoices = 0;

    for (const [serviceKey, rawInvoice] of Object.entries(serviceInvoices)) {
      if (!rawInvoice || typeof rawInvoice !== 'object') {
        continue;
      }

      const invoice = rawInvoice as Record<string, unknown>;
      const netAmount = this.roundCurrency(this.toNumber(invoice.invoiceNetAmount));
      const vatAmount = this.roundCurrency(this.toNumber(invoice.vatAmount));
      const invoiceTotalValue = this.toNumber(invoice.totalAmount);
      const totalAmount =
        invoiceTotalValue > 0
          ? this.roundCurrency(invoiceTotalValue)
          : this.roundCurrency(netAmount + vatAmount);

      if (netAmount <= 0 && vatAmount <= 0 && totalAmount <= 0) {
        continue;
      }

      validInvoices += 1;
      totalServicesWithVat += totalAmount;

      const normalizedKey = serviceKey.toLowerCase();
      const isInterestService =
        normalizedKey.includes('interest') || normalizedKey.includes('interes');

      if (isInterestService) {
        ivaInterests += vatAmount;
      } else {
        ivaServices += vatAmount;
      }
    }

    if (validInvoices === 0) {
      return summaryTotalServicesWithVat > 0
        ? {
            ...defaultTotals,
            totalServicesWithVat: summaryTotalServicesWithVat,
            source: 'summary',
          }
        : defaultTotals;
    }

    return {
      totalServicesWithVat: this.roundCurrency(totalServicesWithVat),
      ivaServices: this.roundCurrency(ivaServices),
      ivaInterests: this.roundCurrency(ivaInterests),
      source: 'serviceInvoices',
    };
  }

  private buildSettlementFinancialBreakdown(
    settlement: Settlement,
  ): SettlementFinancialBreakdown {
    const calculationDetails =
      settlement.calculationDetails &&
      typeof settlement.calculationDetails === 'object'
        ? (settlement.calculationDetails as Record<string, unknown>)
        : null;

    const summary =
      calculationDetails?.summary &&
      typeof calculationDetails.summary === 'object'
        ? (calculationDetails.summary as Record<string, unknown>)
        : null;

    const backendCalculation =
      calculationDetails?.backendCalculation &&
      typeof calculationDetails.backendCalculation === 'object'
        ? (calculationDetails.backendCalculation as Record<string, unknown>)
        : null;

    const serviceInvoices =
      calculationDetails?.serviceInvoices &&
      typeof calculationDetails.serviceInvoices === 'object'
        ? (calculationDetails.serviceInvoices as Record<string, unknown>)
        : null;

    let interestNet = 0;
    let interestVat = 0;
    let interestTotal = 0;
    let servicesNet = 0;
    let servicesVat = 0;
    let servicesTotal = 0;
    let hasServiceInvoiceValues = false;

    if (serviceInvoices) {
      for (const [serviceKey, rawInvoice] of Object.entries(serviceInvoices)) {
        if (!rawInvoice || typeof rawInvoice !== 'object') {
          continue;
        }

        const invoice = rawInvoice as Record<string, unknown>;
        const netAmount = this.roundCurrency(
          this.toNumber(invoice.invoiceNetAmount),
        );
        const vatAmount = this.roundCurrency(this.toNumber(invoice.vatAmount));
        const totalRawValue = this.toNumber(invoice.totalAmount);
        const totalAmount =
          totalRawValue > 0
            ? this.roundCurrency(totalRawValue)
            : this.roundCurrency(netAmount + vatAmount);

        if (netAmount <= 0 && vatAmount <= 0 && totalAmount <= 0) {
          continue;
        }

        hasServiceInvoiceValues = true;
        servicesNet += netAmount;
        servicesVat += vatAmount;
        servicesTotal += totalAmount;

        const normalizedKey = serviceKey.toLowerCase();
        const isInterestService =
          normalizedKey.includes('interest') || normalizedKey.includes('interes');

        if (isInterestService) {
          interestNet += netAmount;
          interestVat += vatAmount;
          interestTotal += totalAmount;
        }
      }
    }

    if (!hasServiceInvoiceValues) {
      const settlementInterestNet = this.roundCurrency(
        this.toNumber(settlement.totalInterest),
      );
      const summaryInterestNet = this.roundCurrency(
        this.toNumber(summary?.estimatedInterest),
      );
      const backendInterestVat = this.roundCurrency(
        this.toNumber(backendCalculation?.ivaInterestServices),
      );

      interestNet = settlementInterestNet !== 0 ? settlementInterestNet : summaryInterestNet;
      interestVat = backendInterestVat;
      interestTotal = this.roundCurrency(interestNet + interestVat);

      const summaryServicesTotal = this.roundCurrency(
        this.toNumber(summary?.totalServicesWithVat),
      );
      const backendServicesTotal = this.roundCurrency(
        this.toNumber(backendCalculation?.totalServicesWithVat),
      );
      const derivedServicesTotal = this.roundCurrency(
        this.toNumber(settlement.totalPrice) +
          this.toNumber(settlement.ivaRice) -
          this.toNumber(settlement.totalAdvances) -
          this.toNumber(settlement.amountDue),
      );

      const backendServicesVat = this.roundCurrency(
        this.toNumber(backendCalculation?.ivaServices),
      );
      const backendTotalServicesVat = this.roundCurrency(
        backendServicesVat + backendInterestVat,
      );
      const settlementServicesVat = this.roundCurrency(
        this.toNumber(settlement.ivaServices),
      );
      const fallbackServicesVat =
        backendTotalServicesVat !== 0
          ? backendTotalServicesVat
          : settlementServicesVat;

      servicesTotal =
        summaryServicesTotal !== 0
          ? summaryServicesTotal
          : backendServicesTotal !== 0
            ? backendServicesTotal
            : derivedServicesTotal;

      if (servicesTotal > 0) {
        const normalizedServicesVat = Math.min(
          Math.max(fallbackServicesVat, 0),
          servicesTotal,
        );
        servicesVat = normalizedServicesVat;
        servicesNet = this.roundCurrency(servicesTotal - normalizedServicesVat);
      }

      if (
        interestVat === 0 &&
        interestNet > 0 &&
        servicesTotal > 0 &&
        servicesTotal === interestTotal &&
        servicesVat > 0
      ) {
        interestVat = servicesVat;
        interestTotal = this.roundCurrency(interestNet + interestVat);
      }
    }

    interestNet = this.roundCurrency(interestNet);
    interestVat = this.roundCurrency(interestVat);
    interestTotal =
      interestTotal !== 0
        ? this.roundCurrency(interestTotal)
        : this.roundCurrency(interestNet + interestVat);

    servicesNet = this.roundCurrency(servicesNet);
    servicesVat = this.roundCurrency(servicesVat);
    servicesTotal =
      servicesTotal !== 0
        ? this.roundCurrency(servicesTotal)
        : this.roundCurrency(servicesNet + servicesVat);

    const settlementLiquidationTotal = this.roundCurrency(
      this.toNumber(settlement.amountDue),
    );
    const summaryLiquidationTotal = this.roundCurrency(
      this.toNumber(summary?.finalBalance),
    );
    const liquidationTotal =
      settlementLiquidationTotal !== 0
        ? settlementLiquidationTotal
        : summaryLiquidationTotal;

    const settlementRiceVat = this.roundCurrency(this.toNumber(settlement.ivaRice));
    const summaryRiceVat = this.roundCurrency(this.toNumber(summary?.riceVatAmount));
    const riceVat = settlementRiceVat !== 0 ? settlementRiceVat : summaryRiceVat;

    const liquidationVat = this.roundCurrency(riceVat - servicesVat);
    const liquidationNet = this.roundCurrency(liquidationTotal - liquidationVat);

    return {
      interestNet,
      interestVat,
      interestTotal,
      servicesNet,
      servicesVat,
      servicesTotal,
      liquidationNet,
      liquidationVat,
      liquidationTotal,
    };
  }

  private withSettlementFinancialBreakdown(settlement: Settlement) {
    return {
      ...settlement,
      ...this.buildSettlementFinancialBreakdown(settlement),
    };
  }

  private calculateAdvanceAccruedInterest(
    advance: Advance,
    referenceDate: Date = new Date(),
  ): number {
    if (!advance.isInterestCalculationEnabled) {
      return 0;
    }

    const issueDt = this.parseDateInputLuxon(advance.issueDate);
    if (!issueDt || !issueDt.isValid) {
      return 0;
    }

    const configuredEndDt = this.parseDateInputLuxon(
      advance.interestEndDate ?? null,
    );
    const referenceDt = DateTime.fromJSDate(referenceDate, { zone: 'utc' });
    const isSettledAdvance = advance.status === AdvanceStatusEnum.SETTLED;

    let effectiveEndDt = referenceDt;

    if (configuredEndDt && configuredEndDt.isValid) {
      effectiveEndDt =
        isSettledAdvance || configuredEndDt < referenceDt
          ? configuredEndDt
          : referenceDt;
    }

    // Use Luxon's daysBetween for consistent date math
    const daysActive = Math.max(0, daysBetween(issueDt, effectiveEndDt));
    const monthsActive = daysActive / 30;
    const amount = Number(advance.amount ?? 0);
    const interestRate = Number(advance.interestRate ?? 0);

    return this.roundCurrency((amount * interestRate * monthsActive) / 100);
  }

  private calculateAdvanceAccruedDays(
    advance: Advance,
    referenceDate: Date = new Date(),
  ): number {
    if (!advance.isInterestCalculationEnabled) {
      return 0;
    }

    const issueDt = this.parseDateInputLuxon(advance.issueDate);
    if (!issueDt || !issueDt.isValid) {
      return 0;
    }

    const configuredEndDt = this.parseDateInputLuxon(
      advance.interestEndDate ?? null,
    );
    const referenceDt = DateTime.fromJSDate(referenceDate, { zone: 'utc' });
    const isSettledAdvance = advance.status === AdvanceStatusEnum.SETTLED;

    let effectiveEndDt = referenceDt;

    if (configuredEndDt && configuredEndDt.isValid) {
      effectiveEndDt =
        isSettledAdvance || configuredEndDt < referenceDt
          ? configuredEndDt
          : referenceDt;
    }

    // Use Luxon's daysBetween for consistent date math
    // Issue day counts as day 1
    return Math.max(1, daysBetween(issueDt, effectiveEndDt) + 1);
  }

  private normalizeEntityIds(rawIds?: number[]): number[] {
    if (!Array.isArray(rawIds)) {
      return [];
    }

    return Array.from(
      new Set(
        rawIds
          .map((value) => Number(value))
          .filter((value) => Number.isInteger(value) && value > 0),
      ),
    ).sort((a, b) => a - b);
  }

  private getSettlementComposition(settlement: Settlement) {
    const rawReceptionIds = Array.isArray(settlement.receptionIds)
      ? settlement.receptionIds
      : [];
    const rawAdvanceIds = Array.isArray(settlement.advanceIds)
      ? settlement.advanceIds
      : [];

    return {
      receptionIds: this.normalizeEntityIds(rawReceptionIds as number[]),
      advanceIds: this.normalizeEntityIds(rawAdvanceIds as number[]),
    };
  }

  private async getSettlementForUpdate(
    manager: EntityManager,
    settlementId: number,
  ): Promise<Settlement> {
    const settlement = await manager
      .getRepository(Settlement)
      .createQueryBuilder('settlement')
      .where('settlement.id = :settlementId', { settlementId })
      .andWhere('settlement.deletedAt IS NULL')
      .setLock('pessimistic_write')
      .getOne();

    if (!settlement) {
      throw new NotFoundException(`Liquidación con ID ${settlementId} no encontrada`);
    }

    return settlement;
  }

  private async validateReceptionsForSettlement(
    manager: EntityManager,
    producerId: number,
    seasonId: number,
    receptionIds: number[],
    settlementId?: number,
  ) {
    if (receptionIds.length === 0) {
      return [];
    }

    const receptions = await manager.getRepository(Reception).find({
      where: {
        id: In(receptionIds),
        deletedAt: IsNull(),
      },
    });

    if (receptions.length !== receptionIds.length) {
      const foundIds = new Set(receptions.map((reception) => reception.id));
      const missingIds = receptionIds.filter((id) => !foundIds.has(id));
      throw new BadRequestException(
        `Recepciones no encontradas: ${missingIds.join(', ')}`,
      );
    }

    for (const reception of receptions) {
      if (reception.producerId !== producerId) {
        throw new BadRequestException(
          `La recepción ${reception.id} no pertenece al productor seleccionado`,
        );
      }

      if (reception.seasonId !== seasonId) {
        throw new BadRequestException(
          `La recepción ${reception.id} no pertenece a la temporada seleccionada`,
        );
      }

      if (reception.settlementId && reception.settlementId !== settlementId) {
        throw new BadRequestException(
          `La recepción ${reception.id} ya está asociada a otra liquidación`,
        );
      }

      if (
        reception.status !== ReceptionStatusEnum.ANALYZED &&
        reception.status !== ReceptionStatusEnum.SETTLED
      ) {
        throw new BadRequestException(
          `La recepción ${reception.id} debe estar analizada para asociarse a una liquidación`,
        );
      }
    }

    return receptions;
  }

  private async validateAdvancesForSettlement(
    manager: EntityManager,
    producerId: number,
    seasonId: number,
    advanceIds: number[],
    settlementId?: number,
  ) {
    if (advanceIds.length === 0) {
      return [];
    }

    const advances = await manager.getRepository(Advance).find({
      where: {
        id: In(advanceIds),
        deletedAt: IsNull(),
      },
    });

    if (advances.length !== advanceIds.length) {
      const foundIds = new Set(advances.map((advance) => advance.id));
      const missingIds = advanceIds.filter((id) => !foundIds.has(id));
      throw new BadRequestException(
        `Anticipos no encontrados: ${missingIds.join(', ')}`,
      );
    }

    for (const advance of advances) {
      if (advance.producerId !== producerId) {
        throw new BadRequestException(
          `El anticipo ${advance.id} no pertenece al productor seleccionado`,
        );
      }

      if (advance.seasonId !== seasonId) {
        throw new BadRequestException(
          `El anticipo ${advance.id} no pertenece a la temporada seleccionada`,
        );
      }

      if (advance.settlementId && advance.settlementId !== settlementId) {
        throw new BadRequestException(
          `El anticipo ${advance.id} ya está asociado a otra liquidación`,
        );
      }

      if (
        advance.status !== AdvanceStatusEnum.PAID &&
        advance.status !== AdvanceStatusEnum.SETTLED
      ) {
        throw new BadRequestException(
          `El anticipo ${advance.id} no está disponible para asociarse a una liquidación`,
        );
      }
    }

    return advances;
  }

  private async reconcileSettlementLinks(
    manager: EntityManager,
    settlementId: number,
    targetReceptionIds: number[],
    targetAdvanceIds: number[],
  ) {
    const normalizedReceptionIds = this.normalizeEntityIds(targetReceptionIds);
    const normalizedAdvanceIds = this.normalizeEntityIds(targetAdvanceIds);
    const now = new Date();

    const receptionsRepository = manager.getRepository(Reception);
    const advancesRepository = manager.getRepository(Advance);

    const currentReceptions = await receptionsRepository.find({
      where: { settlementId, deletedAt: IsNull() },
      select: ['id'],
    });
    const currentAdvances = await advancesRepository.find({
      where: { settlementId, deletedAt: IsNull() },
      select: ['id'],
    });

    const currentReceptionSet = new Set(currentReceptions.map((item) => item.id));
    const currentAdvanceSet = new Set(currentAdvances.map((item) => item.id));
    const targetReceptionSet = new Set(normalizedReceptionIds);
    const targetAdvanceSet = new Set(normalizedAdvanceIds);

    const receptionsToAttach = normalizedReceptionIds.filter(
      (id) => !currentReceptionSet.has(id),
    );
    const receptionsToDetach = currentReceptions
      .map((item) => item.id)
      .filter((id) => !targetReceptionSet.has(id));

    const advancesToAttach = normalizedAdvanceIds.filter(
      (id) => !currentAdvanceSet.has(id),
    );
    const advancesToDetach = currentAdvances
      .map((item) => item.id)
      .filter((id) => !targetAdvanceSet.has(id));

    if (receptionsToAttach.length > 0) {
      const attachResult = await receptionsRepository
        .createQueryBuilder()
        .update(Reception)
        .set({
          settlementId,
          status: ReceptionStatusEnum.SETTLED,
          updatedAt: now,
        })
        .where('id IN (:...ids)', { ids: receptionsToAttach })
        .andWhere('deletedAt IS NULL')
        .andWhere('(settlementId IS NULL OR settlementId = :settlementId)', {
          settlementId,
        })
        .execute();

      if (attachResult.affected !== receptionsToAttach.length) {
        throw new BadRequestException(
          'No fue posible asociar todas las recepciones a la liquidación',
        );
      }
    }

    if (receptionsToDetach.length > 0) {
      await receptionsRepository
        .createQueryBuilder()
        .update(Reception)
        .set({
          settlementId: null,
          status: ReceptionStatusEnum.ANALYZED,
          updatedAt: now,
        })
        .where('id IN (:...ids)', { ids: receptionsToDetach })
        .andWhere('deletedAt IS NULL')
        .andWhere('settlementId = :settlementId', { settlementId })
        .execute();
    }

    if (advancesToAttach.length > 0) {
      const attachResult = await advancesRepository
        .createQueryBuilder()
        .update(Advance)
        .set({
          settlementId,
          status: AdvanceStatusEnum.SETTLED,
          updatedAt: now,
        })
        .where('id IN (:...ids)', { ids: advancesToAttach })
        .andWhere('deletedAt IS NULL')
        .andWhere('(settlementId IS NULL OR settlementId = :settlementId)', {
          settlementId,
        })
        .execute();

      if (attachResult.affected !== advancesToAttach.length) {
        throw new BadRequestException(
          'No fue posible asociar todos los anticipos a la liquidación',
        );
      }
    }

    if (advancesToDetach.length > 0) {
      await advancesRepository
        .createQueryBuilder()
        .update(Advance)
        .set({
          settlementId: null,
          status: AdvanceStatusEnum.PAID,
          updatedAt: now,
        })
        .where('id IN (:...ids)', { ids: advancesToDetach })
        .andWhere('deletedAt IS NULL')
        .andWhere('settlementId = :settlementId', { settlementId })
        .execute();
    }

    return {
      receptionIds: normalizedReceptionIds,
      advanceIds: normalizedAdvanceIds,
    };
  }

  private async closeAdvanceInterestAtSettlementDate(
    manager: EntityManager,
    settlementId: number,
    advanceIds: number[],
  ) {
    const normalizedAdvanceIds = this.normalizeEntityIds(advanceIds);

    if (normalizedAdvanceIds.length === 0) {
      return;
    }

    const today = this.parseDateOnly(this.formatDateOnly(new Date()));

    if (!today) {
      return;
    }

    await manager
      .getRepository(Advance)
      .createQueryBuilder()
      .update(Advance)
      .set({
        interestEndDate: today,
        updatedAt: new Date(),
      })
      .where('id IN (:...ids)', { ids: normalizedAdvanceIds })
      .andWhere('deletedAt IS NULL')
      .andWhere('settlementId = :settlementId', { settlementId })
      .andWhere('interestEndDate IS NULL')
      .execute();
  }

  private async calculateSettlementFromComposition(
    manager: EntityManager,
    producerId: number,
    seasonId: number,
    receptionIds: number[],
    advanceIds: number[],
    calculationDetails?: Record<string, unknown> | null,
  ) {
    const normalizedReceptionIds = this.normalizeEntityIds(receptionIds);
    const normalizedAdvanceIds = this.normalizeEntityIds(advanceIds);

    let receptions: Reception[] = [];
    if (normalizedReceptionIds.length > 0) {
      receptions = await manager.getRepository(Reception).find({
        where: {
          id: In(normalizedReceptionIds),
          deletedAt: IsNull(),
        },
      });
    }

    let advances: Advance[] = [];
    if (normalizedAdvanceIds.length > 0) {
      advances = await manager.getRepository(Advance).find({
        where: {
          id: In(normalizedAdvanceIds),
          deletedAt: IsNull(),
        },
      });
    }

    const totalReceptions = this.roundCurrency(
      receptions.reduce(
        (sum, reception) =>
          sum + Number(reception.finalNetWeight ?? reception.netWeight ?? 0),
        0,
      ),
    );

    const totalPrice = this.roundCurrency(
      receptions.reduce(
        (sum, reception) =>
          sum +
          Number(reception.netWeight ?? 0) * Number(reception.ricePrice ?? 0),
        0,
      ),
    );

    const totalAdvances = this.roundCurrency(
      advances.reduce((sum, advance) => sum + Number(advance.amount ?? 0), 0),
    );
    const totalInterest = this.roundCurrency(
      advances.reduce(
        (sum, advance) => sum + this.calculateAdvanceAccruedInterest(advance),
        0,
      ),
    );
    const ivaRice = this.roundCurrency(
      totalPrice * FinancesService.RICE_VAT_RATE,
    );
    const servicesTotals = this.getSettlementServiceTotals(calculationDetails);
    const ivaServices = servicesTotals.ivaServices;
    const amountDue = this.roundCurrency(
      totalPrice + ivaRice - totalAdvances - servicesTotals.totalServicesWithVat,
    );

    for (const reception of receptions) {
      if (reception.producerId !== producerId || reception.seasonId !== seasonId) {
        throw new BadRequestException(
          `La recepción ${reception.id} no corresponde al productor/temporada de la liquidación`,
        );
      }
    }

    for (const advance of advances) {
      if (advance.producerId !== producerId || advance.seasonId !== seasonId) {
        throw new BadRequestException(
          `El anticipo ${advance.id} no corresponde al productor/temporada de la liquidación`,
        );
      }
    }

    return {
      receptionIds: normalizedReceptionIds,
      advanceIds: normalizedAdvanceIds,
      totalReceptions,
      totalPrice,
      totalAdvances,
      totalInterest,
      ivaRice,
      ivaServices,
      totalServicesWithVat: servicesTotals.totalServicesWithVat,
      ivaInterestServices: servicesTotals.ivaInterests,
      serviceTotalsSource: servicesTotals.source,
      finalAmount: amountDue,
      amountDue,
    };
  }

  private hasPaymentUpdateFields(updateDto: UpdateAdvanceDto): boolean {
    return [
      updateDto.paymentMethod,
      updateDto.referenceNumber,
      updateDto.paymentNotes,
      updateDto.bankAccountIndex,
      updateDto.checkBankName,
      updateDto.checkIssueDate,
      updateDto.checkDueDate,
      updateDto.checkPayeeName,
      updateDto.checkPayeeRut,
    ].some((value) => value !== undefined);
  }

  private async getAdvanceTransaction(advanceId: number): Promise<Transaction | null> {
    return this.transactionsRepository.findOne({
      where: {
        advanceId,
        type: TransactionTypeEnum.ADVANCE,
        deletedAt: IsNull(),
      },
      order: { createdAt: 'DESC' },
    });
  }

  private buildAdvanceDetails(advance: Advance, transaction: Transaction | null) {
    const metadata = (transaction?.metadata ?? {}) as Record<string, any>;
    const checkDetails = (metadata.checkDetails ?? {}) as Record<string, any>;

    const rawPaymentMethod = metadata.paymentMethod;
    const paymentMethod: PaymentMethodEnum | null =
      rawPaymentMethod === PaymentMethodEnum.TRANSFER ||
      rawPaymentMethod === PaymentMethodEnum.CHECK ||
      rawPaymentMethod === PaymentMethodEnum.CASH
        ? rawPaymentMethod
        : null;

    const rawBankAccountIndex = metadata?.bankAccount?.accountIndex;
    const bankAccountIndex =
      rawBankAccountIndex === null || rawBankAccountIndex === undefined
        ? null
        : Number(rawBankAccountIndex);
    const bankAccount =
      metadata.bankAccount && typeof metadata.bankAccount === 'object'
        ? (metadata.bankAccount as Record<string, unknown>)
        : null;

    return {
      ...advance,
      transactionId: transaction?.id ?? null,
      paymentMethod,
      referenceNumber: transaction?.referenceNumber ?? null,
      paymentNotes: transaction?.notes ?? null,
      bankAccountIndex: Number.isNaN(bankAccountIndex) ? null : bankAccountIndex,
      bankAccount,
      checkBankName: checkDetails.bankName ?? null,
      checkIssueDate: checkDetails.issueDate ?? null,
      checkDueDate: checkDetails.dueDate ?? null,
      checkPayeeName: checkDetails.payeeName ?? null,
      checkPayeeRut: checkDetails.payeeRut ?? null,
    };
  }

  private normalizeText(value: unknown): string {
    return String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  private getAdvanceStatusLabel(advance: Advance): string {
    if (advance.deletedAt || advance.status === AdvanceStatusEnum.CANCELLED) {
      return 'Anulado';
    }

    if (advance.status === AdvanceStatusEnum.SETTLED) {
      return 'Liquidado';
    }

    return 'Pagado';
  }

  private getAdvanceStatusRank(advance: Advance): number {
    if (advance.deletedAt || advance.status === AdvanceStatusEnum.CANCELLED) {
      return 3;
    }

    if (advance.status === AdvanceStatusEnum.SETTLED) {
      return 2;
    }

    return 1;
  }

  private getAdvancePaymentMethodLabel(paymentMethod?: PaymentMethodEnum | null): string {
    if (paymentMethod === PaymentMethodEnum.TRANSFER) {
      return 'Transferencia';
    }

    if (paymentMethod === PaymentMethodEnum.CHECK) {
      return 'Cheque';
    }

    if (paymentMethod === PaymentMethodEnum.CASH) {
      return 'Efectivo';
    }

    return '';
  }

  private formatDateTimeValue(value?: Date | string | null): string {
    if (!value) {
      return '';
    }

    const parsedDate = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
      return '';
    }

    return new Intl.DateTimeFormat('es-CL', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(parsedDate);
  }

  private formatDateOnlyValue(value?: Date | string | null): string {
    const formatted = this.formatDateOnly(value ?? null);
    return formatted ?? '';
  }

  private buildAdvancesExportFileName(): string {
    const now = new Date();
    const padded = (value: number) => value.toString().padStart(2, '0');

    const timestamp = `${now.getFullYear()}${padded(now.getMonth() + 1)}${padded(now.getDate())}_${padded(now.getHours())}${padded(now.getMinutes())}${padded(now.getSeconds())}`;
    return `anticipos_${timestamp}.xlsx`;
  }

  private getAdvanceDateSearchValue(value?: Date | string | null): string {
    const parsed = this.parseDateInput(value ?? null);

    if (!parsed) {
      return '';
    }

    const isoDate = this.formatDateOnly(parsed) ?? '';
    const localDate = new Intl.DateTimeFormat('es-CL').format(parsed);

    return `${isoDate} ${localDate}`.trim();
  }

  private getAdvanceFieldSearchValue(advance: any, field: string): string {
    switch (field) {
      case 'id':
        return String(advance.id ?? '');
      case 'producer':
        return `${advance.producer?.name ?? ''} ${advance.producer?.rut ?? ''}`.trim();
      case 'amount':
        return String(advance.amount ?? '');
      case 'paymentMethod': {
        const paymentMethod = String(advance.paymentMethod ?? '').toLowerCase();
        const paymentMethodLabel =
          paymentMethod === PaymentMethodEnum.TRANSFER
            ? 'transferencia'
            : paymentMethod === PaymentMethodEnum.CHECK
              ? 'cheque'
              : paymentMethod === PaymentMethodEnum.CASH
                ? 'efectivo'
                : '';

        return `${paymentMethod} ${paymentMethodLabel}`.trim();
      }
      case 'bank':
        return String(advance.bank ?? '');
      case 'referenceNumber':
        return String(advance.referenceNumber ?? '');
      case 'interestRate':
        return String(advance.interestRate ?? '');
      case 'issueDate':
        return this.getAdvanceDateSearchValue(advance.issueDate);
      case 'interestEndDate':
        return this.getAdvanceDateSearchValue(advance.interestEndDate);
      case 'totalDays':
        return String(advance.totalDays ?? '');
      case 'accruedInterest':
        return String(advance.accruedInterest ?? '');
      case 'status':
        return `${advance.status ?? ''} ${this.getAdvanceStatusLabel(advance)}`.trim();
      case 'description':
        return String(advance.description ?? '');
      case 'createdAt':
        return this.getAdvanceDateSearchValue(advance.createdAt);
      default:
        return '';
    }
  }

  private getAdvanceSortableValue(advance: any, field: string): number | string {
    switch (field) {
      case 'id':
        return Number(advance.id ?? 0);
      case 'producer':
        return this.normalizeText(advance.producer?.name ?? '');
      case 'amount':
        return Number(advance.amount ?? 0);
      case 'paymentMethod':
        return this.normalizeText(advance.paymentMethod ?? '');
      case 'bank':
        return this.normalizeText(advance.bank ?? '');
      case 'referenceNumber':
        return this.normalizeText(advance.referenceNumber ?? '');
      case 'interestRate':
        return Number(advance.interestRate ?? 0);
      case 'issueDate': {
        const parsedIssueDate = this.parseDateInput(advance.issueDate);
        return parsedIssueDate ? parsedIssueDate.getTime() : 0;
      }
      case 'interestEndDate': {
        const parsedInterestEndDate = this.parseDateInput(advance.interestEndDate);
        return parsedInterestEndDate ? parsedInterestEndDate.getTime() : 0;
      }
      case 'totalDays':
        return Number(advance.totalDays ?? 0);
      case 'accruedInterest':
        return Number(advance.accruedInterest ?? 0);
      case 'status':
        return this.getAdvanceStatusRank(advance);
      case 'description':
        return this.normalizeText(advance.description ?? '');
      case 'createdAt': {
        const parsedCreatedAt = this.parseDateInput(advance.createdAt);
        return parsedCreatedAt ? parsedCreatedAt.getTime() : 0;
      }
      default: {
        const parsedFallbackDate = this.parseDateInput(advance.issueDate ?? advance.createdAt);
        return parsedFallbackDate ? parsedFallbackDate.getTime() : 0;
      }
    }
  }

  private parseGridFilters(filters?: string): Array<{ field: string; value: string }> {
    const normalizedFilters = filters?.trim();

    if (!normalizedFilters) {
      return [];
    }

    return normalizedFilters
      .split(',')
      .map((filterPair) => {
        const separatorIndex = filterPair.indexOf('-');

        if (separatorIndex <= 0) {
          return null;
        }

        const field = filterPair.slice(0, separatorIndex).trim();
        const rawValue = filterPair.slice(separatorIndex + 1).trim();

        if (!field || !rawValue) {
          return null;
        }

        let decodedValue = rawValue;
        try {
          decodedValue = decodeURIComponent(rawValue);
        } catch {
          decodedValue = rawValue;
        }

        const value = decodedValue.trim();

        if (!value) {
          return null;
        }

        return { field, value };
      })
      .filter((item): item is { field: string; value: string } => item !== null);
  }

  async getAllAdvancesWithQuery(
    producerId?: number,
    includeDeleted = false,
    search?: string,
    sort?: string,
    sortField?: string,
    filters?: string,
    page?: number,
    limit?: number,
  ) {
    const advances = await this.getAllAdvances(producerId, includeDeleted);
    const normalizedSearch = this.normalizeText(search ?? '');
    const parsedFilters = this.parseGridFilters(filters);
    const normalizedSortDirection = sort?.toLowerCase() === 'asc' ? 'asc' : 'desc';
    const normalizedSortField = sortField?.trim() || 'issueDate';

    let filteredAdvances = advances;

    if (normalizedSearch) {
      filteredAdvances = filteredAdvances.filter((advance) => {
        const searchFields = [
          this.getAdvanceFieldSearchValue(advance, 'id'),
          this.getAdvanceFieldSearchValue(advance, 'producer'),
          this.getAdvanceFieldSearchValue(advance, 'amount'),
          this.getAdvanceFieldSearchValue(advance, 'paymentMethod'),
          this.getAdvanceFieldSearchValue(advance, 'bank'),
          this.getAdvanceFieldSearchValue(advance, 'referenceNumber'),
          this.getAdvanceFieldSearchValue(advance, 'interestRate'),
          this.getAdvanceFieldSearchValue(advance, 'issueDate'),
          this.getAdvanceFieldSearchValue(advance, 'interestEndDate'),
          this.getAdvanceFieldSearchValue(advance, 'totalDays'),
          this.getAdvanceFieldSearchValue(advance, 'accruedInterest'),
          this.getAdvanceFieldSearchValue(advance, 'status'),
          this.getAdvanceFieldSearchValue(advance, 'description'),
          String(advance.season?.name ?? ''),
          String(advance.season?.code ?? ''),
        ];

        return searchFields.some((fieldValue) =>
          this.normalizeText(fieldValue).includes(normalizedSearch),
        );
      });
    }

    if (parsedFilters.length > 0) {
      parsedFilters.forEach(({ field, value }) => {
        const normalizedFilterValue = this.normalizeText(value);

        filteredAdvances = filteredAdvances.filter((advance) => {
          const fieldValue = this.getAdvanceFieldSearchValue(advance, field);
          return this.normalizeText(fieldValue).includes(normalizedFilterValue);
        });
      });
    }

    const sortedAdvances = [...filteredAdvances].sort((left, right) => {
      const leftValue = this.getAdvanceSortableValue(left, normalizedSortField);
      const rightValue = this.getAdvanceSortableValue(right, normalizedSortField);

      let comparison = 0;

      if (typeof leftValue === 'number' && typeof rightValue === 'number') {
        comparison = leftValue - rightValue;
      } else {
        comparison = String(leftValue).localeCompare(String(rightValue), 'es', {
          sensitivity: 'base',
          numeric: true,
        });
      }

      if (comparison === 0) {
        comparison = Number(right.id ?? 0) - Number(left.id ?? 0);
      }

      return normalizedSortDirection === 'asc' ? comparison : -comparison;
    });

    const shouldPaginate = page !== undefined || limit !== undefined;

    if (!shouldPaginate) {
      return sortedAdvances;
    }

    const safePage =
      Number.isFinite(page) && Number(page) > 0
        ? Math.floor(Number(page))
        : 1;
    const safeLimit =
      Number.isFinite(limit) && Number(limit) > 0
        ? Math.min(Math.floor(Number(limit)), 500)
        : 25;
    const startIndex = (safePage - 1) * safeLimit;

    return {
      data: sortedAdvances.slice(startIndex, startIndex + safeLimit),
      total: sortedAdvances.length,
      page: safePage,
      limit: safeLimit,
    };
  }

  async generateAdvancesExcel(
    producerId?: number,
    includeDeleted = false,
    search?: string,
    sort?: string,
    sortField?: string,
    filters?: string,
  ): Promise<{ fileName: string; fileBuffer: Buffer }> {
    const advancesResult = await this.getAllAdvancesWithQuery(
      producerId,
      includeDeleted,
      search,
      sort,
      sortField,
      filters,
    );

    const advances = Array.isArray(advancesResult)
      ? advancesResult
      : advancesResult.data;

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Paddy';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Anticipos');
    worksheet.views = [{ state: 'frozen', ySplit: 1 }];

    worksheet.columns = [
      { header: 'Folio', key: 'id' },
      { header: 'Productor', key: 'producerName' },
      { header: 'RUT Productor', key: 'producerRut' },
      { header: 'Monto (CLP)', key: 'amount' },
      { header: 'Medio de Pago', key: 'paymentMethod' },
      { header: 'Banco', key: 'bank' },
      { header: 'Referencia', key: 'referenceNumber' },
      { header: 'Tasa (% mensual)', key: 'interestRate' },
      { header: 'Fecha Entrega', key: 'issueDate' },
      { header: 'Fecha Finalizacion', key: 'interestEndDate' },
      { header: 'Dias Totales', key: 'totalDays' },
      { header: 'Interes Acumulado (CLP)', key: 'accruedInterest' },
      { header: 'Estado', key: 'statusLabel' },
      { header: 'Descripcion', key: 'description' },
      { header: 'Temporada', key: 'seasonName' },
      { header: 'Creado', key: 'createdAt' },
    ];

    advances.forEach((advance) => {
      const paymentMethod =
        advance.paymentMethod === PaymentMethodEnum.TRANSFER ||
        advance.paymentMethod === PaymentMethodEnum.CHECK ||
        advance.paymentMethod === PaymentMethodEnum.CASH
          ? advance.paymentMethod
          : null;

      worksheet.addRow({
        id: Number(advance.id ?? 0),
        producerName: String(advance.producer?.name ?? ''),
        producerRut: String(advance.producer?.rut ?? ''),
        amount: Number(advance.amount ?? 0),
        paymentMethod: this.getAdvancePaymentMethodLabel(paymentMethod),
        bank: String(advance.bank ?? ''),
        referenceNumber: String(advance.referenceNumber ?? ''),
        interestRate: Number(advance.interestRate ?? 0),
        issueDate: this.formatDateOnlyValue(advance.issueDate),
        interestEndDate: this.formatDateOnlyValue(advance.interestEndDate),
        totalDays: Number(advance.totalDays ?? 0),
        accruedInterest: Number(advance.accruedInterest ?? 0),
        statusLabel: this.getAdvanceStatusLabel(advance),
        description: String(advance.description ?? ''),
        seasonName: String(advance.season?.name ?? ''),
        createdAt: this.formatDateTimeValue(advance.createdAt),
      });
    });

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.autoFilter = {
      from: 'A1',
      to: 'P1',
    };

    worksheet.getColumn('D').numFmt = '$#,##0';
    worksheet.getColumn('H').numFmt = '0.00';
    worksheet.getColumn('K').numFmt = '0';
    worksheet.getColumn('L').numFmt = '$#,##0';

    worksheet.columns.forEach((column) => {
      let maxLength = 12;

      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellValue =
          cell.value === null || cell.value === undefined
            ? ''
            : String(cell.value);

        maxLength = Math.max(maxLength, cellValue.length + 2);
      });

      column.width = Math.min(maxLength, 45);
    });

    const rawBuffer = await workbook.xlsx.writeBuffer();
    const fileBuffer = Buffer.isBuffer(rawBuffer)
      ? rawBuffer
      : Buffer.from(rawBuffer as ArrayBuffer);

    return {
      fileName: this.buildAdvancesExportFileName(),
      fileBuffer,
    };
  }

  // ===== ADVANCES (ANTICIPOS) =====
  async getAllAdvances(producerId?: number, includeDeleted = false) {
    const where: Record<string, unknown> = {};

    if (producerId) {
      where.producerId = producerId;
    }

    if (!includeDeleted) {
      where.deletedAt = IsNull();
    }

    const advances = await this.advancesRepository.find({
      where,
      relations: ['producer', 'season'],
      order: { issueDate: 'DESC' },
      withDeleted: includeDeleted,
    });

    if (advances.length === 0) {
      return [];
    }

    const advanceIds = advances.map((advance) => advance.id);
    const transactions = await this.transactionsRepository.find({
      where: {
        advanceId: In(advanceIds),
        type: TransactionTypeEnum.ADVANCE,
        deletedAt: IsNull(),
      },
      order: { createdAt: 'DESC' },
    });

    const transactionByAdvanceId = new Map<number, Transaction>();

    for (const transaction of transactions) {
      if (
        transaction.advanceId &&
        !transactionByAdvanceId.has(transaction.advanceId)
      ) {
        transactionByAdvanceId.set(transaction.advanceId, transaction);
      }
    }

    return advances.map((advance) => ({
      ...advance,
      totalDays: this.calculateAdvanceAccruedDays(advance),
      accruedInterest: this.calculateAdvanceAccruedInterest(advance),
      ...(() => {
        const transaction = transactionByAdvanceId.get(advance.id);
        const metadata = (transaction?.metadata ?? {}) as Record<string, any>;
        const rawPaymentMethod = metadata.paymentMethod;
        const paymentMethod: PaymentMethodEnum | null =
          rawPaymentMethod === PaymentMethodEnum.TRANSFER ||
          rawPaymentMethod === PaymentMethodEnum.CHECK ||
          rawPaymentMethod === PaymentMethodEnum.CASH
            ? rawPaymentMethod
            : null;

        const checkDetails =
          metadata.checkDetails && typeof metadata.checkDetails === 'object'
            ? (metadata.checkDetails as Record<string, unknown>)
            : null;

        const bankAccount =
          metadata.bankAccount && typeof metadata.bankAccount === 'object'
            ? (metadata.bankAccount as Record<string, unknown>)
            : null;

        const transferBank = bankAccount
          ? String(bankAccount.bankName ?? '').trim()
          : '';
        const transferAccountNumber = bankAccount
          ? String(bankAccount.accountNumber ?? '').trim()
          : '';

        const transferBankAndAccount =
          paymentMethod === PaymentMethodEnum.TRANSFER
            ? [transferBank, transferAccountNumber]
                .filter((value) => value.length > 0)
                .join(' - ') || null
            : null;

        const checkBankName =
          paymentMethod === PaymentMethodEnum.CHECK && checkDetails
            ? String(checkDetails.bankName ?? '').trim() || null
            : null;

        const bank =
          paymentMethod === PaymentMethodEnum.TRANSFER
            ? transferBankAndAccount
            : paymentMethod === PaymentMethodEnum.CHECK
              ? checkBankName
              : null;

        return {
          paymentMethod,
          bank,
          referenceNumber: transaction?.referenceNumber?.trim() || null,
        };
      })(),
    }));
  }

  async getAdvanceById(id: number) {
    const advance = await this.advancesRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['producer', 'season'],
    });

    if (!advance) {
      throw new NotFoundException(`Anticipo con ID ${id} no encontrado`);
    }

    return advance;
  }

  async getAdvanceDetails(id: number) {
    const advance = await this.getAdvanceById(id);
    const transaction = await this.getAdvanceTransaction(id);

    return this.buildAdvanceDetails(advance, transaction);
  }

  async createAdvance(createDto: CreateAdvanceDto, userId?: number) {
    const producer = await this.producersRepository.findOne({
      where: { id: createDto.producerId, deletedAt: IsNull(), isActive: true },
    });

    if (!producer) {
      throw new NotFoundException(
        `Productor con ID ${createDto.producerId} no encontrado`,
      );
    }

    let selectedBankAccount: Producer['bankAccounts'][number] | null = null;

    if (createDto.paymentMethod === PaymentMethodEnum.TRANSFER) {
      if (createDto.bankAccountIndex === undefined || createDto.bankAccountIndex === null) {
        throw new BadRequestException(
          'Debes seleccionar una cuenta bancaria del productor para la transferencia',
        );
      }

      selectedBankAccount = producer.bankAccounts?.[createDto.bankAccountIndex] ?? null;

      if (!selectedBankAccount) {
        throw new BadRequestException(
          'La cuenta bancaria seleccionada no existe para el productor',
        );
      }

      if (!createDto.referenceNumber?.trim()) {
        throw new BadRequestException(
          'Debes indicar el numero de referencia de la transferencia',
        );
      }
    }

    if (createDto.paymentMethod === PaymentMethodEnum.CHECK) {
      if (!createDto.referenceNumber?.trim()) {
        throw new BadRequestException('Debes indicar el numero de cheque');
      }

      if (!createDto.checkBankName?.trim()) {
        throw new BadRequestException('Debes indicar el banco emisor del cheque');
      }
    }

    const createdAdvance = await this.advancesRepository.manager.transaction(
      async (manager) => {
        const advance = manager.create(Advance, {
          producerId: createDto.producerId,
          seasonId: createDto.seasonId,
          amount: createDto.amount,
          issueDate: this.parseDateOnly(createDto.issueDate),
          interestRate: createDto.interestRate,
          description: createDto.description?.trim() || null,
          isActive: true,
          isInterestCalculationEnabled: true,
          status: AdvanceStatusEnum.PAID,
          interestEndDate: null,
        });

        const savedAdvance = await manager.save(Advance, advance);

        const transactionMetadata: Record<string, unknown> = {
          paymentMethod: createDto.paymentMethod,
          advanceDescription: createDto.description?.trim() || null,
          bankAccount:
            createDto.paymentMethod === PaymentMethodEnum.TRANSFER && selectedBankAccount
              ? {
                  ...selectedBankAccount,
                  accountIndex: createDto.bankAccountIndex,
                }
              : null,
          checkDetails:
            createDto.paymentMethod === PaymentMethodEnum.CHECK
              ? {
                  bankName: createDto.checkBankName?.trim() || null,
                  issueDate: createDto.checkIssueDate || null,
                  dueDate: createDto.checkDueDate || null,
                  payeeName: createDto.checkPayeeName?.trim() || producer.name,
                  payeeRut: createDto.checkPayeeRut?.trim() || producer.rut,
                }
              : null,
        };

        const transaction = manager.create(Transaction, {
          producerId: createDto.producerId,
          advanceId: savedAdvance.id,
          type: TransactionTypeEnum.ADVANCE,
          amount: createDto.amount,
          transactionDate: this.parseDateOnly(createDto.issueDate),
          userId,
          referenceNumber: createDto.referenceNumber?.trim() || null,
          notes:
            createDto.paymentNotes?.trim() || createDto.description?.trim() || null,
          metadata: transactionMetadata,
        });

        await manager.save(Transaction, transaction);

        return manager.findOne(Advance, {
          where: { id: savedAdvance.id, deletedAt: IsNull() },
          relations: ['producer', 'season'],
        });
      },
    );

    if (!createdAdvance) {
      throw new BadRequestException('No fue posible crear el anticipo');
    }

    return createdAdvance;
  }

  async updateAdvance(id: number, updateDto: UpdateAdvanceDto, userId?: number) {
    // Capturar valores previos
    const beforeAdvance = await this.getAdvanceById(id);
    const beforeData = {
      seasonId: beforeAdvance.seasonId,
      amount: beforeAdvance.amount,
      issueDate: beforeAdvance.issueDate,
      interestRate: beforeAdvance.interestRate,
      description: beforeAdvance.description,
      interestEndDate: beforeAdvance.interestEndDate,
      isInterestCalculationEnabled: beforeAdvance.isInterestCalculationEnabled,
      status: beforeAdvance.status,
    };

    const normalizedUpdate: Partial<Advance> = {
      seasonId: updateDto.seasonId,
      amount: updateDto.amount,
      issueDate: updateDto.issueDate
        ? this.parseDateOnly(updateDto.issueDate)
        : undefined,
      interestRate: updateDto.interestRate,
      description: updateDto.description,
      interestEndDate:
        updateDto.interestEndDate === undefined
          ? undefined
          : updateDto.interestEndDate === null
            ? null
            : this.parseDateOnly(updateDto.interestEndDate),
      isInterestCalculationEnabled: updateDto.isInterestCalculationEnabled,
      status: updateDto.status,
    };

      // Strip undefined values — TypeORM iterates Object.keys() and may throw
      // EntityPropertyNotFoundError if it encounters keys not mapped on the entity.
      const filteredUpdate = Object.fromEntries(
        Object.entries(normalizedUpdate).filter(([, v]) => v !== undefined),
      ) as Partial<Advance>;

      await this.advancesRepository.update(id, filteredUpdate);

      // Capturar valores posteriores y loguear auditoría
      const afterAdvance = await this.getAdvanceById(id);
      const afterData = {
        seasonId: afterAdvance.seasonId,
        amount: afterAdvance.amount,
        issueDate: afterAdvance.issueDate,
        interestRate: afterAdvance.interestRate,
        description: afterAdvance.description,
        interestEndDate: afterAdvance.interestEndDate,
        isInterestCalculationEnabled: afterAdvance.isInterestCalculationEnabled,
        status: afterAdvance.status,
      };

      // Log evento de auditoría para UPDATE de anticipo
      this.auditService.logEvent({
        eventCode: 'FINANCE.ADVANCES.UPDATE',
        category: AuditCategory.FINANCE,
        action: AuditAction.UPDATE,
        status: AuditStatus.SUCCESS,
        severity: AuditSeverity.WARN,
        actorUserId: userId || null,
        entityType: 'Advance',
        entityId: id,
        route: '/finances/advances/:id',
        method: 'PUT',
        beforeData,
        afterData,
      });

    const hasPaymentUpdates = this.hasPaymentUpdateFields(updateDto);
    const shouldSyncAmountOrDate =
      updateDto.amount !== undefined || updateDto.issueDate !== undefined;

    if (hasPaymentUpdates || shouldSyncAmountOrDate) {
      const updatedAdvance = await this.getAdvanceById(id);
      const producer = await this.producersRepository.findOne({
        where: {
          id: updatedAdvance.producerId,
          deletedAt: IsNull(),
          isActive: true,
        },
      });

      if (!producer) {
        throw new NotFoundException(
          `Productor con ID ${updatedAdvance.producerId} no encontrado`,
        );
      }

      const existingTransaction = await this.getAdvanceTransaction(id);
      const existingMetadata = (existingTransaction?.metadata ?? {}) as Record<string, any>;
      const existingCheckDetails =
        (existingMetadata.checkDetails ?? {}) as Record<string, any>;
      const rawExistingBankIndex = existingMetadata?.bankAccount?.accountIndex;
      const existingBankAccountIndex =
        rawExistingBankIndex === null || rawExistingBankIndex === undefined
          ? undefined
          : Number(rawExistingBankIndex);

      const paymentMethod: PaymentMethodEnum =
        updateDto.paymentMethod ??
        (existingMetadata.paymentMethod as PaymentMethodEnum) ??
        PaymentMethodEnum.CASH;

      let selectedBankAccount: Producer['bankAccounts'][number] | null = null;
      let resolvedBankAccountIndex: number | undefined;

      if (paymentMethod === PaymentMethodEnum.TRANSFER) {
        resolvedBankAccountIndex =
          updateDto.bankAccountIndex !== undefined
            ? updateDto.bankAccountIndex
            : Number.isNaN(existingBankAccountIndex as number)
              ? undefined
              : existingBankAccountIndex;

        if (resolvedBankAccountIndex === undefined || resolvedBankAccountIndex === null) {
          throw new BadRequestException(
            'Debes seleccionar una cuenta bancaria del productor para la transferencia',
          );
        }

        selectedBankAccount =
          producer.bankAccounts?.[resolvedBankAccountIndex] ?? null;

        if (!selectedBankAccount) {
          throw new BadRequestException(
            'La cuenta bancaria seleccionada no existe para el productor',
          );
        }

        const effectiveReference =
          updateDto.referenceNumber?.trim() ||
          existingTransaction?.referenceNumber?.trim();

        if (!effectiveReference) {
          throw new BadRequestException(
            'Debes indicar el numero de referencia de la transferencia',
          );
        }
      }

      if (paymentMethod === PaymentMethodEnum.CHECK) {
        const effectiveReference =
          updateDto.referenceNumber?.trim() ||
          existingTransaction?.referenceNumber?.trim();

        if (!effectiveReference) {
          throw new BadRequestException('Debes indicar el numero de cheque');
        }

        const effectiveBankName =
          updateDto.checkBankName?.trim() ||
          (existingCheckDetails.bankName as string | undefined);

        if (!effectiveBankName) {
          throw new BadRequestException('Debes indicar el banco emisor del cheque');
        }
      }

      const transactionMetadata: Record<string, unknown> = {
        ...existingMetadata,
        paymentMethod,
        advanceDescription: updatedAdvance.description ?? null,
        bankAccount:
          paymentMethod === PaymentMethodEnum.TRANSFER && selectedBankAccount
            ? {
                ...selectedBankAccount,
                accountIndex: resolvedBankAccountIndex,
              }
            : null,
        checkDetails:
          paymentMethod === PaymentMethodEnum.CHECK
            ? {
                bankName:
                  updateDto.checkBankName?.trim() ||
                  existingCheckDetails.bankName ||
                  null,
                issueDate:
                  updateDto.checkIssueDate ||
                  existingCheckDetails.issueDate ||
                  null,
                dueDate:
                  updateDto.checkDueDate ||
                  existingCheckDetails.dueDate ||
                  null,
                payeeName:
                  updateDto.checkPayeeName?.trim() ||
                  existingCheckDetails.payeeName ||
                  producer.name,
                payeeRut:
                  updateDto.checkPayeeRut?.trim() ||
                  existingCheckDetails.payeeRut ||
                  producer.rut,
              }
            : null,
      };

      const transactionDateValue =
        updateDto.issueDate || this.formatDateOnly(updatedAdvance.issueDate);

      const transactionPayload: Partial<Transaction> = {
        producerId: updatedAdvance.producerId,
        advanceId: updatedAdvance.id,
        type: TransactionTypeEnum.ADVANCE,
        amount: updatedAdvance.amount,
        transactionDate: this.parseDateOnly(transactionDateValue),
        userId,
        referenceNumber:
          updateDto.referenceNumber?.trim() || existingTransaction?.referenceNumber || null,
        notes:
          updateDto.paymentNotes?.trim() ||
          existingTransaction?.notes ||
          updatedAdvance.description ||
          null,
        metadata: transactionMetadata,
      };

      if (existingTransaction) {
        await this.transactionsRepository.update(existingTransaction.id, transactionPayload);
      } else {
        const transaction = this.transactionsRepository.create(transactionPayload);
        await this.transactionsRepository.save(transaction);
      }
    }

    return this.getAdvanceDetails(id);
  }

  async deleteAdvance(id: number) {
    await this.getAdvanceById(id);

    await this.advancesRepository.manager.transaction(async (manager) => {
      const transactionsRepository = manager.getRepository(Transaction);
      const advancesRepository = manager.getRepository(Advance);

      const linkedTransaction = await transactionsRepository.findOne({
        where: {
          advanceId: id,
          type: TransactionTypeEnum.ADVANCE,
          deletedAt: IsNull(),
        },
        order: { createdAt: 'DESC' },
      });

      if (linkedTransaction) {
        await transactionsRepository.softDelete(linkedTransaction.id);
      }

      await advancesRepository.update(id, {
        status: AdvanceStatusEnum.CANCELLED,
        isActive: false,
      });

      await advancesRepository.softDelete(id);
    });

    const deletedAdvance = await this.advancesRepository.findOne({
      where: { id },
      relations: ['producer', 'season'],
      withDeleted: true,
    });

    if (!deletedAdvance) {
      throw new NotFoundException(`Anticipo con ID ${id} no encontrado`);
    }

    return deletedAdvance;
  }

  // ===== TRANSACTIONS =====
  async getAllTransactions(producerId?: number, type?: TransactionTypeEnum) {
    const where = { deletedAt: IsNull() };
    if (producerId) {
      where['producerId'] = producerId;
    }
    if (type) {
      where['type'] = type;
    }

    return this.transactionsRepository.find({
      where,
      relations: ['producer'],
      order: { transactionDate: 'DESC' },
    });
  }

  async getTransactionById(id: number) {
    const transaction = await this.transactionsRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['producer'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transacción con ID ${id} no encontrada`);
    }

    return transaction;
  }

  async createTransaction(createDto: Partial<Transaction>, userId?: number) {
    const transaction = this.transactionsRepository.create({
      ...createDto,
      transactionDate: new Date(),
      userId,
    });

    return this.transactionsRepository.save(transaction);
  }

  async updateTransaction(id: number, updateDto: Partial<Transaction>, userId?: number) {
    // Capturar valores previos
    const beforeTransaction = await this.getTransactionById(id);
    const beforeData = {
      amount: beforeTransaction.amount,
      type: beforeTransaction.type,
      transactionDate: beforeTransaction.transactionDate,
      referenceNumber: beforeTransaction.referenceNumber,
      notes: beforeTransaction.notes,
      metadata: beforeTransaction.metadata,
    };

    await this.transactionsRepository.update(id, updateDto);

    // Capturar valores posteriores y loguear auditoría
    const afterTransaction = await this.getTransactionById(id);
    const afterData = {
      amount: afterTransaction.amount,
      type: afterTransaction.type,
      transactionDate: afterTransaction.transactionDate,
      referenceNumber: afterTransaction.referenceNumber,
      notes: afterTransaction.notes,
      metadata: afterTransaction.metadata,
    };

    // Log evento de auditoría para UPDATE de transacción
    this.auditService.logEvent({
      eventCode: 'FINANCE.TRANSACTIONS.UPDATE',
      category: AuditCategory.FINANCE,
      action: AuditAction.UPDATE,
      status: AuditStatus.SUCCESS,
      severity: AuditSeverity.WARN,
      actorUserId: userId || null,
      entityType: 'Transaction',
      entityId: id,
      route: '/finances/transactions/:id',
      method: 'PUT',
      beforeData,
      afterData,
    });

    return afterTransaction;
  }

  async deleteTransaction(id: number) {
    await this.getTransactionById(id);
    await this.transactionsRepository.softDelete(id);
    return { message: 'Transacción eliminada' };
  }

  private getSettlementSummary(
    settlement: Settlement,
  ): Record<string, unknown> {
    if (
      !settlement.calculationDetails ||
      typeof settlement.calculationDetails !== 'object'
    ) {
      return {};
    }

    const summary = (settlement.calculationDetails as Record<string, unknown>)
      .summary;

    if (!summary || typeof summary !== 'object') {
      return {};
    }

    return summary as Record<string, unknown>;
  }

  private getSettlementNetRiceAmount(settlement: any): number {
    const entityAmount = this.toNumber(settlement.totalPrice);
    if (entityAmount !== 0) {
      return entityAmount;
    }

    const summary = this.getSettlementSummary(settlement as Settlement);
    return this.toNumber(summary.netRiceAmount);
  }

  private getSettlementRiceVatAmount(settlement: any): number {
    const entityAmount = this.toNumber(settlement.ivaRice);
    if (entityAmount !== 0) {
      return entityAmount;
    }

    const summary = this.getSettlementSummary(settlement as Settlement);
    return this.toNumber(summary.riceVatAmount);
  }

  private getSettlementTotalRiceAmount(settlement: any): number {
    const summary = this.getSettlementSummary(settlement as Settlement);
    const summaryAmount = this.toNumber(summary.totalRiceAmount);

    if (summaryAmount !== 0) {
      return summaryAmount;
    }

    return (
      this.getSettlementNetRiceAmount(settlement) +
      this.getSettlementRiceVatAmount(settlement)
    );
  }

  private getSettlementAdvancesAmount(settlement: any): number {
    const entityAmount = this.toNumber(settlement.totalAdvances);
    if (entityAmount !== 0) {
      return entityAmount;
    }

    const summary = this.getSettlementSummary(settlement as Settlement);
    return this.toNumber(summary.totalAdvances);
  }

  private getSettlementDisplayStatus(settlement: Settlement):
    | SettlementStatusEnum
    | 'annulled' {
    if (settlement.deletedAt) {
      return 'annulled';
    }

    return settlement.status;
  }

  private getSettlementStatusLabel(settlement: Settlement): string {
    const status = this.getSettlementDisplayStatus(settlement);

    if (status === 'annulled') {
      return 'Anulada';
    }

    if (status === SettlementStatusEnum.COMPLETED) {
      return 'Liquidada';
    }

    if (status === SettlementStatusEnum.DRAFT) {
      return 'Pre-liquidacion';
    }

    return 'Cancelada';
  }

  private getSettlementStatusRank(settlement: Settlement): number {
    const status = this.getSettlementDisplayStatus(settlement);

    if (status === SettlementStatusEnum.DRAFT) {
      return 1;
    }

    if (status === SettlementStatusEnum.COMPLETED) {
      return 2;
    }

    if (status === SettlementStatusEnum.CANCELLED) {
      return 3;
    }

    return 4;
  }

  private getSettlementDateSearchValue(value?: Date | string | null): string {
    const parsed = this.parseDateInput(value ?? null);

    if (!parsed) {
      return '';
    }

    const isoDate = this.formatDateOnly(parsed) ?? '';
    const localDate = new Intl.DateTimeFormat('es-CL').format(parsed);

    return `${isoDate} ${localDate}`.trim();
  }

  private getSettlementFieldSearchValue(settlement: any, field: string): string {
    switch (field) {
      case 'id':
        return String(settlement.id ?? '');
      case 'producer':
        return `${settlement.producer?.name ?? ''} ${settlement.producer?.rut ?? ''}`.trim();
      case 'season':
        return `${settlement.season?.code ?? ''} ${settlement.season?.name ?? ''}`.trim();
      case 'netRiceAmount':
        return String(this.getSettlementNetRiceAmount(settlement));
      case 'riceVatAmount':
        return String(this.getSettlementRiceVatAmount(settlement));
      case 'totalRiceAmount':
        return String(this.getSettlementTotalRiceAmount(settlement));
      case 'totalAdvances':
        return String(this.getSettlementAdvancesAmount(settlement));
      case 'interestNet':
        return String(this.toNumber(settlement.interestNet));
      case 'interestVat':
        return String(this.toNumber(settlement.interestVat));
      case 'interestTotal':
        return String(this.toNumber(settlement.interestTotal));
      case 'servicesNet':
        return String(this.toNumber(settlement.servicesNet));
      case 'servicesVat':
        return String(this.toNumber(settlement.servicesVat));
      case 'servicesTotal':
        return String(this.toNumber(settlement.servicesTotal));
      case 'liquidationNet':
        return String(this.toNumber(settlement.liquidationNet));
      case 'liquidationVat':
        return String(this.toNumber(settlement.liquidationVat));
      case 'liquidationTotal':
        return String(this.toNumber(settlement.liquidationTotal));
      case 'status':
        return `${settlement.status ?? ''} ${this.getSettlementStatusLabel(settlement as Settlement)}`.trim();
      case 'createdAt':
        return this.getSettlementDateSearchValue(settlement.createdAt);
      default:
        return '';
    }
  }

  private getSettlementSortableValue(settlement: any, field: string): number | string {
    switch (field) {
      case 'id':
        return this.toNumber(settlement.id);
      case 'producer':
        return this.normalizeText(settlement.producer?.name ?? '');
      case 'season':
        return this.normalizeText(settlement.season?.code ?? settlement.season?.name ?? '');
      case 'netRiceAmount':
        return this.getSettlementNetRiceAmount(settlement);
      case 'riceVatAmount':
        return this.getSettlementRiceVatAmount(settlement);
      case 'totalRiceAmount':
        return this.getSettlementTotalRiceAmount(settlement);
      case 'totalAdvances':
        return this.getSettlementAdvancesAmount(settlement);
      case 'interestNet':
        return this.toNumber(settlement.interestNet);
      case 'interestVat':
        return this.toNumber(settlement.interestVat);
      case 'interestTotal':
        return this.toNumber(settlement.interestTotal);
      case 'servicesNet':
        return this.toNumber(settlement.servicesNet);
      case 'servicesVat':
        return this.toNumber(settlement.servicesVat);
      case 'servicesTotal':
        return this.toNumber(settlement.servicesTotal);
      case 'liquidationNet':
        return this.toNumber(settlement.liquidationNet);
      case 'liquidationVat':
        return this.toNumber(settlement.liquidationVat);
      case 'liquidationTotal':
        return this.toNumber(settlement.liquidationTotal);
      case 'status':
        return this.getSettlementStatusRank(settlement as Settlement);
      case 'createdAt': {
        const parsedCreatedAt = this.parseDateInput(settlement.createdAt);
        return parsedCreatedAt ? parsedCreatedAt.getTime() : 0;
      }
      default: {
        const parsedFallbackDate = this.parseDateInput(settlement.createdAt);
        return parsedFallbackDate ? parsedFallbackDate.getTime() : 0;
      }
    }
  }

  // ===== SETTLEMENTS (LIQUIDACIONES) =====
  async getAllSettlements(
    producerId?: number,
    status?: SettlementStatusEnum,
    search?: string,
    sort?: string,
    sortField?: string,
    filters?: string,
    page?: number,
    limit?: number,
  ) {
    const where: Record<string, unknown> = {};
    if (producerId) {
      where.producerId = producerId;
    }
    if (status) {
      where.status = status;
    }

    const settlements = await this.settlementsRepository.find({
      where,
      withDeleted: true,
      relations: ['producer', 'season'],
      order: { createdAt: 'DESC' },
    });

    const settlementsWithBreakdown = settlements.map((settlement) =>
      this.withSettlementFinancialBreakdown(settlement),
    );

    const normalizedSearch = this.normalizeText(search ?? '');
    const parsedFilters = this.parseGridFilters(filters);
    const normalizedSortDirection = sort?.toLowerCase() === 'asc' ? 'asc' : 'desc';
    const normalizedSortField = sortField?.trim() || 'createdAt';

    let filteredSettlements = settlementsWithBreakdown;

    if (normalizedSearch) {
      filteredSettlements = filteredSettlements.filter((settlement) => {
        const searchFields = [
          this.getSettlementFieldSearchValue(settlement, 'id'),
          this.getSettlementFieldSearchValue(settlement, 'producer'),
          this.getSettlementFieldSearchValue(settlement, 'season'),
          this.getSettlementFieldSearchValue(settlement, 'netRiceAmount'),
          this.getSettlementFieldSearchValue(settlement, 'riceVatAmount'),
          this.getSettlementFieldSearchValue(settlement, 'totalRiceAmount'),
          this.getSettlementFieldSearchValue(settlement, 'totalAdvances'),
          this.getSettlementFieldSearchValue(settlement, 'interestNet'),
          this.getSettlementFieldSearchValue(settlement, 'interestVat'),
          this.getSettlementFieldSearchValue(settlement, 'interestTotal'),
          this.getSettlementFieldSearchValue(settlement, 'servicesNet'),
          this.getSettlementFieldSearchValue(settlement, 'servicesVat'),
          this.getSettlementFieldSearchValue(settlement, 'servicesTotal'),
          this.getSettlementFieldSearchValue(settlement, 'liquidationNet'),
          this.getSettlementFieldSearchValue(settlement, 'liquidationVat'),
          this.getSettlementFieldSearchValue(settlement, 'liquidationTotal'),
          this.getSettlementFieldSearchValue(settlement, 'status'),
          this.getSettlementFieldSearchValue(settlement, 'createdAt'),
        ];

        return searchFields.some((fieldValue) =>
          this.normalizeText(fieldValue).includes(normalizedSearch),
        );
      });
    }

    if (parsedFilters.length > 0) {
      parsedFilters.forEach(({ field, value }) => {
        const normalizedFilterValue = this.normalizeText(value);

        filteredSettlements = filteredSettlements.filter((settlement) => {
          const fieldValue = this.getSettlementFieldSearchValue(settlement, field);
          return this.normalizeText(fieldValue).includes(normalizedFilterValue);
        });
      });
    }

    const sortedSettlements = [...filteredSettlements].sort((left, right) => {
      const leftValue = this.getSettlementSortableValue(left, normalizedSortField);
      const rightValue = this.getSettlementSortableValue(right, normalizedSortField);

      let comparison = 0;

      if (typeof leftValue === 'number' && typeof rightValue === 'number') {
        comparison = leftValue - rightValue;
      } else {
        comparison = String(leftValue).localeCompare(String(rightValue), 'es', {
          sensitivity: 'base',
          numeric: true,
        });
      }

      if (comparison === 0) {
        comparison = this.toNumber(right.id) - this.toNumber(left.id);
      }

      return normalizedSortDirection === 'asc' ? comparison : -comparison;
    });

    const shouldPaginate = page !== undefined || limit !== undefined;

    if (!shouldPaginate) {
      return sortedSettlements;
    }

    const safePage =
      Number.isFinite(page) && Number(page) > 0
        ? Math.floor(Number(page))
        : 1;
    const safeLimit =
      Number.isFinite(limit) && Number(limit) > 0
        ? Math.min(Math.floor(Number(limit)), 500)
        : 25;
    const startIndex = (safePage - 1) * safeLimit;

    return {
      data: sortedSettlements.slice(startIndex, startIndex + safeLimit),
      total: sortedSettlements.length,
      page: safePage,
      limit: safeLimit,
    };
  }

  async getSettlementReceptionCandidates(producerId: number) {
    const receptions = await this.receptionsRepository.find({
      where: { producerId, deletedAt: IsNull() },
      relations: ['producer', 'season', 'riceType'],
      order: { createdAt: 'DESC' },
    });

    const candidateReceptions = receptions.filter(
      (reception) =>
        reception.status !== ReceptionStatusEnum.SETTLED && !reception.settlementId,
    );

    if (candidateReceptions.length === 0) {
      return [];
    }

    const analysisRecords = await this.analysisRecordsRepository.find({
      where: {
        receptionId: In(candidateReceptions.map((reception) => reception.id)),
        deletedAt: IsNull(),
      },
      order: { createdAt: 'DESC' },
    });

    const analysisByReceptionId = new Map<number, AnalysisRecord>();

    for (const analysis of analysisRecords) {
      if (!analysisByReceptionId.has(analysis.receptionId)) {
        analysisByReceptionId.set(analysis.receptionId, analysis);
      }
    }

    return candidateReceptions.map((reception) => {
      const analysis = analysisByReceptionId.get(reception.id);
      const dryPercent =
        analysis?.dryPercent !== null && analysis?.dryPercent !== undefined
          ? Number(analysis.dryPercent)
          : reception.dryPercent !== null && reception.dryPercent !== undefined
            ? Number(reception.dryPercent)
            : null;

      return {
        ...reception,
        dryPercent,
        hasAnalysis: Boolean(analysis),
      };
    });
  }

  private mapSnapshotToSettlementReceptionPrintLine(
    snapshot: SettlementReceptionSnapshot,
  ): SettlementReceptionPrintLine {
    return {
      id: Number(snapshot.receptionId),
      receptionDate: snapshot.receptionDate ?? null,
      guideNumber: snapshot.guideNumber ?? '',
      riceTypeName: snapshot.riceTypeName ?? null,
      paddyKg: Number(snapshot.paddyKg ?? 0),
      ricePrice: Number(snapshot.ricePrice ?? 0),
      paddySubTotal: this.roundCurrency(Number(snapshot.paddySubTotal ?? 0)),
      paddyVat: this.roundCurrency(Number(snapshot.paddyVat ?? 0)),
      paddyTotal: this.roundCurrency(Number(snapshot.paddyTotal ?? 0)),
      dryPercent: Number(snapshot.dryPercent ?? 0),
      dryingSubTotal: this.roundCurrency(Number(snapshot.dryingSubTotal ?? 0)),
      dryingVat: this.roundCurrency(Number(snapshot.dryingVat ?? 0)),
      dryingTotal: this.roundCurrency(Number(snapshot.dryingTotal ?? 0)),
    };
  }

  private async buildSettlementReceptionPrintLines(
    manager: EntityManager,
    receptionIds: number[],
  ): Promise<SettlementReceptionPrintLine[]> {
    const normalizedReceptionIds = this.normalizeEntityIds(receptionIds);

    if (normalizedReceptionIds.length === 0) {
      return [];
    }

    const receptions = await manager.getRepository(Reception).find({
      where: {
        id: In(normalizedReceptionIds),
        deletedAt: IsNull(),
      },
      relations: ['riceType'],
    });

    if (receptions.length === 0) {
      return [];
    }

    const analysisRecords = await manager.getRepository(AnalysisRecord).find({
      where: {
        receptionId: In(receptions.map((reception) => reception.id)),
        deletedAt: IsNull(),
      },
      order: { createdAt: 'DESC' },
    });

    const analysisByReceptionId = new Map<number, AnalysisRecord>();

    for (const analysis of analysisRecords) {
      if (!analysisByReceptionId.has(analysis.receptionId)) {
        analysisByReceptionId.set(analysis.receptionId, analysis);
      }
    }

    const receptionById = new Map<number, Reception>(
      receptions.map((reception) => [reception.id, reception]),
    );

    return normalizedReceptionIds
      .map((receptionId) => {
        const reception = receptionById.get(receptionId);

        if (!reception) {
          return null;
        }

        const analysis = analysisByReceptionId.get(reception.id);
        const dryPercent =
          analysis?.dryPercent !== null && analysis?.dryPercent !== undefined
            ? Number(analysis.dryPercent)
            : reception.dryPercent !== null && reception.dryPercent !== undefined
              ? Number(reception.dryPercent)
              : 0;

        const paddyKg = Number(reception.netWeight ?? 0);
        const ricePrice = Number(reception.ricePrice ?? 0);
        const paddySubTotal = this.roundCurrency(paddyKg * ricePrice);
        const paddyVat = this.roundCurrency(
          paddySubTotal * FinancesService.RICE_VAT_RATE,
        );
        const paddyTotal = this.roundCurrency(paddySubTotal + paddyVat);
        const dryingSubTotal = this.roundCurrency(
          paddySubTotal * (dryPercent / 100),
        );
        const dryingVat = this.roundCurrency(
          dryingSubTotal * FinancesService.RICE_VAT_RATE,
        );
        const dryingTotal = this.roundCurrency(dryingSubTotal + dryingVat);

        return {
          id: reception.id,
          receptionDate: reception.createdAt ?? null,
          guideNumber: reception.guideNumber ?? '',
          riceTypeName: reception.riceType?.name ?? null,
          paddyKg,
          ricePrice,
          paddySubTotal,
          paddyVat,
          paddyTotal,
          dryPercent,
          dryingSubTotal,
          dryingVat,
          dryingTotal,
        };
      })
      .filter(
        (line): line is SettlementReceptionPrintLine => line !== null,
      );
  }

  private async getSettlementReceptionSnapshotLines(
    settlementId: number,
  ): Promise<SettlementReceptionPrintLine[]> {
    const snapshots = await this.settlementReceptionSnapshotsRepository.find({
      where: {
        settlementId,
        deletedAt: IsNull(),
      },
      order: {
        lineOrder: 'ASC',
        id: 'ASC',
      },
    });

    return snapshots.map((snapshot) =>
      this.mapSnapshotToSettlementReceptionPrintLine(snapshot),
    );
  }

  private async persistSettlementReceptionSnapshots(
    manager: EntityManager,
    settlementId: number,
    lines: SettlementReceptionPrintLine[],
  ) {
    const snapshotsRepository = manager.getRepository(SettlementReceptionSnapshot);

    await snapshotsRepository.delete({ settlementId } as any);

    if (lines.length === 0) {
      return;
    }

    const payload = lines.map((line, index) =>
      snapshotsRepository.create({
        settlementId,
        receptionId: line.id,
        lineOrder: index + 1,
        receptionDate: line.receptionDate,
        guideNumber: line.guideNumber || null,
        riceTypeName: line.riceTypeName || null,
        paddyKg: line.paddyKg,
        ricePrice: line.ricePrice,
        paddySubTotal: line.paddySubTotal,
        paddyVat: line.paddyVat,
        paddyTotal: line.paddyTotal,
        dryPercent: line.dryPercent,
        dryingSubTotal: line.dryingSubTotal,
        dryingVat: line.dryingVat,
        dryingTotal: line.dryingTotal,
      }),
    );

    await snapshotsRepository.save(payload);
  }

  private async getSettlementReceptionPrintLines(
    settlement: Settlement,
  ): Promise<SettlementReceptionPrintLine[]> {
    if (settlement.status === SettlementStatusEnum.COMPLETED) {
      const snapshotLines = await this.getSettlementReceptionSnapshotLines(
        settlement.id,
      );

      if (snapshotLines.length > 0) {
        return snapshotLines;
      }
    }

    const composition = this.getSettlementComposition(settlement);
    return this.buildSettlementReceptionPrintLines(
      this.settlementsRepository.manager,
      composition.receptionIds,
    );
  }

  private async getSettlementAdvancePrintLines(
    settlement: Settlement,
  ): Promise<SettlementAdvancePrintLine[]> {
    const composition = this.getSettlementComposition(settlement);

    if (composition.advanceIds.length === 0) {
      return [];
    }

    const advances = await this.advancesRepository.find({
      where: {
        id: In(composition.advanceIds),
        deletedAt: IsNull(),
      },
    });

    if (advances.length === 0) {
      return [];
    }

    const transactions = await this.transactionsRepository.find({
      where: {
        advanceId: In(composition.advanceIds),
        type: TransactionTypeEnum.ADVANCE,
        deletedAt: IsNull(),
      },
      order: { createdAt: 'DESC' },
    });

    const transactionByAdvanceId = new Map<number, Transaction>();

    for (const transaction of transactions) {
      if (
        transaction.advanceId &&
        !transactionByAdvanceId.has(transaction.advanceId)
      ) {
        transactionByAdvanceId.set(transaction.advanceId, transaction);
      }
    }

    const advanceById = new Map<number, Advance>(
      advances.map((advance) => [advance.id, advance]),
    );

    return composition.advanceIds
      .map((advanceId) => {
        const advance = advanceById.get(advanceId);

        if (!advance) {
          return null;
        }

        const transaction = transactionByAdvanceId.get(advance.id);
        const metadata = (transaction?.metadata ?? {}) as Record<string, any>;
        const rawPaymentMethod = metadata.paymentMethod;
        const paymentMethod: PaymentMethodEnum | null =
          rawPaymentMethod === PaymentMethodEnum.TRANSFER ||
          rawPaymentMethod === PaymentMethodEnum.CHECK ||
          rawPaymentMethod === PaymentMethodEnum.CASH
            ? rawPaymentMethod
            : null;

        const checkDetails =
          metadata.checkDetails && typeof metadata.checkDetails === 'object'
            ? (metadata.checkDetails as Record<string, unknown>)
            : null;

        const bankAccount =
          metadata.bankAccount && typeof metadata.bankAccount === 'object'
            ? (metadata.bankAccount as Record<string, unknown>)
            : null;

        const transferAccount =
          paymentMethod === PaymentMethodEnum.TRANSFER && bankAccount
            ? [
                bankAccount.bankName,
                bankAccount.accountTypeName,
                bankAccount.accountNumber,
              ]
                .filter(
                  (value) =>
                    typeof value === 'string' && value.trim().length > 0,
                )
                .map((value) => String(value).trim())
                .join(' - ') || null
            : null;

        const checkBankName =
          paymentMethod === PaymentMethodEnum.CHECK && checkDetails
            ? String(checkDetails.bankName ?? '').trim() || null
            : null;

        const bank =
          paymentMethod === PaymentMethodEnum.TRANSFER
            ? transferAccount
            : paymentMethod === PaymentMethodEnum.CHECK
              ? checkBankName
              : null;

        return {
          id: advance.id,
          issueDate: advance.issueDate ?? null,
          amount: Number(advance.amount ?? 0),
          interestRate: Number(advance.interestRate ?? 0),
          totalDays: this.calculateAdvanceAccruedDays(advance),
          accumulatedInterest: this.calculateAdvanceAccruedInterest(advance),
          paymentMethod,
          bank,
          reference: transaction?.referenceNumber?.trim() || null,
          transferAccount,
        };
      })
      .filter(
        (line): line is SettlementAdvancePrintLine => line !== null,
      );
  }

  async getSettlementById(id: number) {
    const settlement = await this.settlementsRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['producer', 'season'],
    });

    if (!settlement) {
      throw new NotFoundException(`Liquidación con ID ${id} no encontrada`);
    }

    const settlementReceptions = await this.getSettlementReceptionPrintLines(
      settlement,
    );
    const settlementAdvances = await this.getSettlementAdvancePrintLines(
      settlement,
    );
    const settlementWithBreakdown = this.withSettlementFinancialBreakdown(
      settlement,
    );

    return {
      ...settlementWithBreakdown,
      settlementReceptions,
      settlementAdvances,
    };
  }

  async createSettlement(createDto: CreateSettlementDto, userId?: number) {
    const receptionIds = this.normalizeEntityIds(createDto.receptionIds);
    const advanceIds = this.normalizeEntityIds(createDto.advanceIds);

    if (receptionIds.length === 0) {
      throw new BadRequestException(
        'Debes seleccionar al menos una recepción para crear la liquidación',
      );
    }

    const createdSettlement = await this.settlementsRepository.manager.transaction(
      async (manager) => {
        await this.validateReceptionsForSettlement(
          manager,
          createDto.producerId,
          createDto.seasonId,
          receptionIds,
        );
        await this.validateAdvancesForSettlement(
          manager,
          createDto.producerId,
          createDto.seasonId,
          advanceIds,
        );

        const settlementRepository = manager.getRepository(Settlement);
        const settlement = settlementRepository.create({
          producerId: createDto.producerId,
          seasonId: createDto.seasonId,
          status: SettlementStatusEnum.DRAFT,
          userId,
          issuedAt: new Date(),
          purchaseInvoiceNumber: this.extractPurchaseInvoiceNumber(
            createDto.calculationDetails ?? null,
          ),
          receptionIds,
          advanceIds,
          calculationDetails: createDto.calculationDetails ?? null,
          notes: createDto.notes?.trim() || null,
        });

        const savedSettlement = await settlementRepository.save(settlement);

        const normalizedComposition = await this.reconcileSettlementLinks(
          manager,
          savedSettlement.id,
          receptionIds,
          advanceIds,
        );

        await settlementRepository.update(savedSettlement.id, {
          receptionIds: normalizedComposition.receptionIds,
          advanceIds: normalizedComposition.advanceIds,
          updatedAt: new Date(),
        });

        return settlementRepository.findOne({
          where: { id: savedSettlement.id, deletedAt: IsNull() },
          relations: ['producer', 'season'],
        });
      },
    );

    if (!createdSettlement) {
      throw new BadRequestException('No fue posible crear la liquidación');
    }

    return this.withSettlementFinancialBreakdown(createdSettlement);
  }

  async updateSettlement(id: number, updateDto: UpdateSettlementDto, userId?: number) {
    // Capturar valores previos antes de la transacción
    const beforeSettlement = await this.getSettlementById(id);
    const beforeData = {
      status: beforeSettlement.status,
      receptionIds: beforeSettlement.receptionIds,
      advanceIds: beforeSettlement.advanceIds,
      notes: beforeSettlement.notes,
      calculationDetails: beforeSettlement.calculationDetails,
      purchaseInvoiceNumber: beforeSettlement.purchaseInvoiceNumber,
    };

    const result = await this.settlementsRepository.manager.transaction(async (manager) => {
      const settlement = await this.getSettlementForUpdate(manager, id);

      if (settlement.status !== SettlementStatusEnum.DRAFT) {
        throw new BadRequestException(
          'Solo puedes editar liquidaciones en estado DRAFT',
        );
      }

      if (
        updateDto.status !== undefined &&
        updateDto.status !== SettlementStatusEnum.DRAFT
      ) {
        throw new BadRequestException(
          'El cambio de estado debe realizarse desde las acciones de completar o cancelar',
        );
      }

      const currentComposition = this.getSettlementComposition(settlement);
      const targetReceptionIds =
        updateDto.receptionIds !== undefined
          ? this.normalizeEntityIds(updateDto.receptionIds)
          : currentComposition.receptionIds;
      const targetAdvanceIds =
        updateDto.advanceIds !== undefined
          ? this.normalizeEntityIds(updateDto.advanceIds)
          : currentComposition.advanceIds;

      await this.validateReceptionsForSettlement(
        manager,
        settlement.producerId,
        settlement.seasonId,
        targetReceptionIds,
        settlement.id,
      );
      await this.validateAdvancesForSettlement(
        manager,
        settlement.producerId,
        settlement.seasonId,
        targetAdvanceIds,
        settlement.id,
      );

      const normalizedComposition = await this.reconcileSettlementLinks(
        manager,
        settlement.id,
        targetReceptionIds,
        targetAdvanceIds,
      );

      const updatePayload: Partial<Settlement> = {
        receptionIds: normalizedComposition.receptionIds,
        advanceIds: normalizedComposition.advanceIds,
        updatedAt: new Date(),
      };

      if (updateDto.notes !== undefined) {
        updatePayload.notes = updateDto.notes?.trim() || null;
      }

      if (updateDto.calculationDetails !== undefined) {
        updatePayload.calculationDetails = updateDto.calculationDetails ?? null;

        const extractedPurchaseInvoiceNumber = this.extractPurchaseInvoiceNumber(
          updateDto.calculationDetails ?? null,
        );

        if (extractedPurchaseInvoiceNumber) {
          updatePayload.purchaseInvoiceNumber = extractedPurchaseInvoiceNumber;
        }
      }

      await manager.getRepository(Settlement).update(id, updatePayload);

      const updatedSettlement = await manager.findOne(Settlement, {
        where: { id, deletedAt: IsNull() },
        relations: ['producer', 'season'],
      });

      if (!updatedSettlement) {
        throw new NotFoundException(`Liquidación con ID ${id} no encontrada`);
      }

      return this.withSettlementFinancialBreakdown(updatedSettlement);
    });

    // Log evento de auditoría para UPDATE de liquidación
    const afterSettlement = await this.getSettlementById(id);
    const afterData = {
      status: afterSettlement.status,
      receptionIds: afterSettlement.receptionIds,
      advanceIds: afterSettlement.advanceIds,
      notes: afterSettlement.notes,
      calculationDetails: afterSettlement.calculationDetails,
      purchaseInvoiceNumber: afterSettlement.purchaseInvoiceNumber,
    };

    this.auditService.logEvent({
      eventCode: 'FINANCE.SETTLEMENTS.UPDATE',
      category: AuditCategory.FINANCE,
      action: AuditAction.UPDATE,
      status: AuditStatus.SUCCESS,
      severity: AuditSeverity.WARN,
      actorUserId: userId || null,
      entityType: 'Settlement',
      entityId: id,
      route: '/finances/settlements/:id',
      method: 'PUT',
      beforeData,
      afterData,
    });

    return result;
  }

  async deleteSettlement(id: number) {
    const deletedSettlement = await this.settlementsRepository.manager.transaction(async (manager) => {
      const settlement = await this.getSettlementForUpdate(manager, id);
      await this.reconcileSettlementLinks(manager, settlement.id, [], []);

      const settlementRepository = manager.getRepository(Settlement);

      await settlementRepository.update(settlement.id, {
        status: SettlementStatusEnum.CANCELLED,
        receptionIds: [],
        advanceIds: [],
        updatedAt: new Date(),
      });

      await settlementRepository.softDelete(settlement.id);

      return settlementRepository.findOne({
        where: { id: settlement.id },
        relations: ['producer', 'season'],
        withDeleted: true,
      });
    });

    if (!deletedSettlement) {
      throw new NotFoundException(`Liquidación con ID ${id} no encontrada`);
    }

    return this.withSettlementFinancialBreakdown(deletedSettlement);
  }

  async calculateSettlement(id: number): Promise<any> {
    const settlement = await this.getSettlementById(id);
    const composition = this.getSettlementComposition(settlement);
    const calculation = await this.calculateSettlementFromComposition(
      this.settlementsRepository.manager,
      settlement.producerId,
      settlement.seasonId,
      composition.receptionIds,
      composition.advanceIds,
      settlement.calculationDetails ?? null,
    );

    return {
      ...calculation,
      composition,
    };
  }

  async completeSettlement(id: number, completeDto: CompleteSettlementDto = {}) {
    return this.settlementsRepository.manager.transaction(async (manager) => {
      const settlement = await this.getSettlementForUpdate(manager, id);

      if (settlement.status !== SettlementStatusEnum.DRAFT) {
        throw new BadRequestException('La liquidación debe estar en DRAFT');
      }

      const currentComposition = this.getSettlementComposition(settlement);
      const targetReceptionIds =
        completeDto.receptionIds !== undefined
          ? this.normalizeEntityIds(completeDto.receptionIds)
          : currentComposition.receptionIds;
      const targetAdvanceIds =
        completeDto.advanceIds !== undefined
          ? this.normalizeEntityIds(completeDto.advanceIds)
          : currentComposition.advanceIds;

      await this.validateReceptionsForSettlement(
        manager,
        settlement.producerId,
        settlement.seasonId,
        targetReceptionIds,
        settlement.id,
      );
      await this.validateAdvancesForSettlement(
        manager,
        settlement.producerId,
        settlement.seasonId,
        targetAdvanceIds,
        settlement.id,
      );

      const normalizedComposition = await this.reconcileSettlementLinks(
        manager,
        settlement.id,
        targetReceptionIds,
        targetAdvanceIds,
      );

      await this.closeAdvanceInterestAtSettlementDate(
        manager,
        settlement.id,
        normalizedComposition.advanceIds,
      );

      const calculation = await this.calculateSettlementFromComposition(
        manager,
        settlement.producerId,
        settlement.seasonId,
        normalizedComposition.receptionIds,
        normalizedComposition.advanceIds,
        {
          ...(settlement.calculationDetails ?? {}),
          ...(completeDto.calculationDetails ?? {}),
        },
      );

      const receptionPrintLines = await this.buildSettlementReceptionPrintLines(
        manager,
        normalizedComposition.receptionIds,
      );

      const mergedCalculationDetails: Record<string, unknown> = {
        ...(settlement.calculationDetails ?? {}),
        ...(completeDto.calculationDetails ?? {}),
        backendCalculation: calculation,
        composition: normalizedComposition,
      };

      const mergedPaymentDetails =
        typeof mergedCalculationDetails.paymentDetails === 'object' &&
        mergedCalculationDetails.paymentDetails !== null
          ? (mergedCalculationDetails.paymentDetails as Record<string, unknown>)
          : undefined;

      const paymentInfo =
        (completeDto.paymentDetails ?? mergedPaymentDetails ?? {}) as Record<
          string,
          unknown
        >;

      const settledAt =
        this.parseDateInput(
          typeof paymentInfo.paymentDate === 'string'
            ? (paymentInfo.paymentDate as string)
            : null,
        ) ?? new Date();

      const purchaseInvoiceNumber =
        this.extractPurchaseInvoiceNumber(
          completeDto.calculationDetails ?? null,
          mergedCalculationDetails,
        ) ?? settlement.purchaseInvoiceNumber ?? null;

      await manager.getRepository(Settlement).update(id, {
        status: SettlementStatusEnum.COMPLETED,
        receptionIds: normalizedComposition.receptionIds,
        advanceIds: normalizedComposition.advanceIds,
        settledAt,
        purchaseInvoiceNumber,
        totalReceptions: calculation.totalReceptions,
        totalPrice: calculation.totalPrice,
        totalAdvances: calculation.totalAdvances,
        totalInterest: calculation.totalInterest,
        ivaRice: calculation.ivaRice,
        ivaServices: calculation.ivaServices,
        finalAmount: calculation.finalAmount,
        amountDue: calculation.amountDue,
        calculationDetails: mergedCalculationDetails,
        notes:
          completeDto.notes !== undefined
            ? completeDto.notes?.trim() || null
            : settlement.notes,
        updatedAt: new Date(),
      } as any);

      await this.persistSettlementReceptionSnapshots(
        manager,
        id,
        receptionPrintLines,
      );

      // Create settlement payment transaction
      const rawPaymentMethod = paymentInfo.paymentMethod;
      const settlementPaymentMethod: PaymentMethodEnum | null =
        rawPaymentMethod === PaymentMethodEnum.TRANSFER ||
        rawPaymentMethod === PaymentMethodEnum.CHECK ||
        rawPaymentMethod === PaymentMethodEnum.CASH
          ? (rawPaymentMethod as PaymentMethodEnum)
          : null;

      const settlementTransaction = manager.create(Transaction, {
        producerId: settlement.producerId,
        settlementId: id,
        type: TransactionTypeEnum.SETTLEMENT,
        amount: calculation.amountDue,
        transactionDate: paymentInfo.paymentDate
          ? this.parseDateOnly(paymentInfo.paymentDate as string) ?? new Date()
          : new Date(),
        referenceNumber: paymentInfo.referenceNumber
          ? String(paymentInfo.referenceNumber).trim() || null
          : null,
        notes: paymentInfo.notes
          ? String(paymentInfo.notes).trim() || null
          : null,
        metadata: {
          paymentMethod: settlementPaymentMethod,
          paymentDate: paymentInfo.paymentDate || null,
          bankAccountIndex: paymentInfo.bankAccountIndex ?? null,
        },
      });

      await manager.save(Transaction, settlementTransaction);

      const completedSettlement = await manager.findOne(Settlement, {
        where: { id, deletedAt: IsNull() },
        relations: ['producer', 'season'],
      });

      if (!completedSettlement) {
        throw new NotFoundException(`Liquidación con ID ${id} no encontrada`);
      }

      return this.withSettlementFinancialBreakdown(completedSettlement);
    });
  }

  async cancelSettlement(id: number) {
    return this.settlementsRepository.manager.transaction(async (manager) => {
      const settlement = await this.getSettlementForUpdate(manager, id);

      if (settlement.status === SettlementStatusEnum.COMPLETED) {
        throw new BadRequestException(
          'No puedes cancelar una liquidación completada',
        );
      }

      await this.reconcileSettlementLinks(manager, settlement.id, [], []);

      await manager.getRepository(Settlement).update(id, {
        status: SettlementStatusEnum.CANCELLED,
        receptionIds: [],
        advanceIds: [],
        updatedAt: new Date(),
      });

      const cancelledSettlement = await manager.findOne(Settlement, {
        where: { id, deletedAt: IsNull() },
        relations: ['producer', 'season'],
      });

      if (!cancelledSettlement) {
        throw new NotFoundException(`Liquidación con ID ${id} no encontrada`);
      }

      return this.withSettlementFinancialBreakdown(cancelledSettlement);
    });
  }

  async getProducerPendingBalance(producerId: number) {
    const producer = await this.producersRepository.findOne({
      where: { id: producerId, deletedAt: IsNull() },
    });

    if (!producer) {
      throw new NotFoundException(`Productor con ID ${producerId} no encontrado`);
    }

    const pendingReceptionsRaw = await this.getSettlementReceptionCandidates(producerId);

    const pendingReceptions = pendingReceptionsRaw.map((reception: any) => {
      const netWeight = Number(reception.netWeight ?? 0);
      const ricePrice = Number(reception.ricePrice ?? 0);
      const dryPercent =
        reception.dryPercent === null || reception.dryPercent === undefined
          ? 0
          : Number(reception.dryPercent);

      const netAmount = this.roundCurrency(netWeight * ricePrice);
      const dryingReferenceAmount = this.roundCurrency(netAmount * (dryPercent / 100));
      const riceVatAmount = this.roundCurrency(
        netAmount * FinancesService.RICE_VAT_RATE,
      );
      const totalAmount = netAmount + riceVatAmount;

      return {
        id: Number(reception.id),
        guideNumber: String(reception.guideNumber ?? ''),
        seasonId: Number(reception.seasonId ?? 0),
        seasonName: reception.season?.name ?? null,
        riceTypeId: Number(reception.riceTypeId ?? 0),
        riceTypeName: reception.riceType?.name ?? null,
        licensePlate: String(reception.licensePlate ?? ''),
        createdAt: reception.createdAt,
        status: reception.status,
        netWeight,
        ricePrice,
        dryPercent,
        netAmount,
        dryingReferenceAmount,
        riceVatAmount,
        totalAmount,
      };
    });

    const advances = await this.getAllAdvances(producerId);
    const pendingAdvances = advances
      .filter(
        (advance) =>
          advance.isActive &&
          advance.status === AdvanceStatusEnum.PAID,
      )
      .map((advance) => {
        const amount = Number(advance.amount ?? 0);
        const interest = this.calculateAdvanceAccruedInterest(advance);

        return {
          id: advance.id,
          seasonId: advance.seasonId,
          seasonName: advance.season?.name ?? null,
          issueDate: this.formatDateOnly(advance.issueDate),
          interestEndDate: this.formatDateOnly(advance.interestEndDate),
          isInterestCalculationEnabled: Boolean(advance.isInterestCalculationEnabled),
          interestRate: Number(advance.interestRate ?? 0),
          amount,
          interest,
          totalPending: this.roundCurrency(amount + interest),
          description: advance.description ?? null,
        };
      });

    const totalReceptionNet = pendingReceptions.reduce(
      (sum, reception) => sum + reception.netAmount,
      0,
    );
    const totalDryingReference = pendingReceptions.reduce(
      (sum, reception) => sum + reception.dryingReferenceAmount,
      0,
    );
    const totalReceptionVat = pendingReceptions.reduce(
      (sum, reception) => sum + reception.riceVatAmount,
      0,
    );
    const totalReceptionWithVat = pendingReceptions.reduce(
      (sum, reception) => sum + reception.totalAmount,
      0,
    );
    const totalAdvanceCapital = pendingAdvances.reduce(
      (sum, advance) => sum + advance.amount,
      0,
    );
    const totalAdvanceInterest = pendingAdvances.reduce(
      (sum, advance) => sum + advance.interest,
      0,
    );
    const totalAdvancesWithInterest = pendingAdvances.reduce(
      (sum, advance) => sum + advance.totalPending,
      0,
    );
    const pendingBalance = totalReceptionWithVat - totalAdvanceCapital;

    return {
      producer: {
        id: producer.id,
        name: producer.name,
        rut: producer.rut,
      },
      summary: {
        receptionsCount: pendingReceptions.length,
        advancesCount: pendingAdvances.length,
        totalReceptionNet,
        totalReceptionVat,
        totalReceptionWithVat,
        totalDryingReference,
        totalAdvanceCapital,
        totalAdvanceInterest,
        totalAdvancesWithInterest,
        pendingBalance,
        calculatedAt: new Date().toISOString(),
      },
      receptions: pendingReceptions,
      advances: pendingAdvances,
    };
  }

  // Cálculo de intereses en anticipo
  calculateInterest(advance: Advance): number {
    return this.calculateAdvanceAccruedInterest(advance);
  }
}
