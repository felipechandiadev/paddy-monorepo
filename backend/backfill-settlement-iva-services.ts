import { DataSource, IsNull } from 'typeorm';
import * as dotenv from 'dotenv';
import {
  Advance,
  Settlement as SettlementEntity,
  SettlementReceptionSnapshot,
  Transaction,
} from './src/modules/finances/domain/finances.entity';
import { Producer } from './src/modules/producers/domain/producer.entity';
import { User } from './src/modules/users/domain/user.entity';
import {
  AnalysisParam,
  RiceType,
  Season,
  Template,
} from './src/modules/configuration/domain/configuration.entity';
import {
  AnalysisRecord,
  Reception,
} from './src/modules/operations/domain/operations.entity';
import { SettlementStatusEnum } from './src/shared/enums';

dotenv.config();

interface SettlementServiceTotals {
  totalServicesWithVat: number;
  ivaServices: number;
  ivaInterests: number;
  source: 'none' | 'summary' | 'serviceInvoices';
}

interface SettlementDelta {
  id: number;
  oldIvaServices: number;
  newIvaServices: number;
  oldAmountDue: number;
  newAmountDue: number;
  oldFinalAmount: number;
  newFinalAmount: number;
  totalServicesWithVat: number;
  ivaInterests: number;
  source: SettlementServiceTotals['source'];
}

function toNumber(value: unknown): number {
  if (value === null || value === undefined || value === '') {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function roundCurrency(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.round(value);
}

function extractServiceTotals(
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
  const summaryTotalServicesWithVat = roundCurrency(
    toNumber(summary?.totalServicesWithVat),
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
    const netAmount = roundCurrency(toNumber(invoice.invoiceNetAmount));
    const vatAmount = roundCurrency(toNumber(invoice.vatAmount));
    const invoiceTotalValue = toNumber(invoice.totalAmount);
    const totalAmount =
      invoiceTotalValue > 0
        ? roundCurrency(invoiceTotalValue)
        : roundCurrency(netAmount + vatAmount);

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
    totalServicesWithVat: roundCurrency(totalServicesWithVat),
    ivaServices: roundCurrency(ivaServices),
    ivaInterests: roundCurrency(ivaInterests),
    source: 'serviceInvoices',
  };
}

function parseLimitArg(args: string[]): number | null {
  const raw = args.find((arg) => arg.startsWith('--limit='));
  if (!raw) {
    return null;
  }

  const value = Number(raw.split('=')[1]);
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }

  return Math.floor(value);
}

function parseFromIdArg(args: string[]): number | null {
  const raw = args.find((arg) => arg.startsWith('--from-id='));
  if (!raw) {
    return null;
  }

  const value = Number(raw.split('=')[1]);
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }

  return Math.floor(value);
}

async function backfillSettlementIvaServices() {
  const args = process.argv.slice(2);
  const applyMode = args.includes('--apply');
  const limit = parseLimitArg(args);
  const fromId = parseFromIdArg(args);

  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '3306', 10),
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || 'redbull90',
    database: process.env.DATABASE_NAME || 'paddy',
    entities: [
      User,
      Producer,
      RiceType,
      Season,
      Template,
      AnalysisParam,
      Reception,
      AnalysisRecord,
      Advance,
      Transaction,
      SettlementEntity,
      SettlementReceptionSnapshot,
    ],
    synchronize: false,
  });

  try {
    await dataSource.initialize();

    const settlementsRepository = dataSource.getRepository(SettlementEntity) as any;

    const settlements = (await settlementsRepository.find({
      where: {
        status: SettlementStatusEnum.COMPLETED,
        deletedAt: IsNull(),
      },
      order: { id: 'ASC' },
    })) as any[];

    const filteredSettlements = settlements.filter((settlement) => {
      const settlementId = Number(settlement.id ?? 0);

      if (fromId && settlementId < fromId) {
        return false;
      }

      return true;
    });

    const targetSettlements =
      limit && limit > 0 ? filteredSettlements.slice(0, limit) : filteredSettlements;

    const deltas: SettlementDelta[] = [];
    let usingServiceInvoicesCount = 0;
    let usingSummaryCount = 0;
    let withoutServiceDataCount = 0;

    for (const settlement of targetSettlements) {
      const settlementId = Number(settlement.id ?? 0);
      const serviceTotals = extractServiceTotals(
        settlement.calculationDetails as Record<string, unknown> | undefined,
      );

      if (serviceTotals.source === 'serviceInvoices') {
        usingServiceInvoicesCount += 1;
      } else if (serviceTotals.source === 'summary') {
        usingSummaryCount += 1;
      } else {
        withoutServiceDataCount += 1;
      }

      const oldIvaServices = roundCurrency(toNumber(settlement.ivaServices));
      const oldAmountDue = roundCurrency(toNumber(settlement.amountDue));
      const oldFinalAmount = roundCurrency(toNumber(settlement.finalAmount));

      const newIvaServices = serviceTotals.ivaServices;
      const newAmountDue = roundCurrency(
        toNumber(settlement.totalPrice) +
          toNumber(settlement.ivaRice) -
          toNumber(settlement.totalAdvances) -
          serviceTotals.totalServicesWithVat,
      );
      const newFinalAmount = newAmountDue;

      const hasChange =
        oldIvaServices !== newIvaServices ||
        oldAmountDue !== newAmountDue ||
        oldFinalAmount !== newFinalAmount;

      if (!hasChange) {
        continue;
      }

      deltas.push({
        id: settlementId,
        oldIvaServices,
        newIvaServices,
        oldAmountDue,
        newAmountDue,
        oldFinalAmount,
        newFinalAmount,
        totalServicesWithVat: serviceTotals.totalServicesWithVat,
        ivaInterests: serviceTotals.ivaInterests,
        source: serviceTotals.source,
      });
    }

    const summary = {
      mode: applyMode ? 'APPLY' : 'DRY-RUN',
      scannedCompletedSettlements: settlements.length,
      evaluatedSettlements: targetSettlements.length,
      usingServiceInvoicesCount,
      usingSummaryCount,
      withoutServiceDataCount,
      settlementsWithChanges: deltas.length,
      settlementsWithoutChanges: targetSettlements.length - deltas.length,
      deltaIvaServices: deltas.reduce(
        (sum, row) => sum + (row.newIvaServices - row.oldIvaServices),
        0,
      ),
      deltaAmountDue: deltas.reduce(
        (sum, row) => sum + (row.newAmountDue - row.oldAmountDue),
        0,
      ),
      deltaFinalAmount: deltas.reduce(
        (sum, row) => sum + (row.newFinalAmount - row.oldFinalAmount),
        0,
      ),
    };

    console.log('--- Backfill Settlement IVA Services ---');
    console.table(summary);

    if (deltas.length > 0) {
      const preview = deltas.slice(0, 20).map((row) => ({
        id: row.id,
        source: row.source,
        oldIvaServices: row.oldIvaServices,
        newIvaServices: row.newIvaServices,
        oldAmountDue: row.oldAmountDue,
        newAmountDue: row.newAmountDue,
        oldFinalAmount: row.oldFinalAmount,
        newFinalAmount: row.newFinalAmount,
        servicesTotalWithVat: row.totalServicesWithVat,
      }));

      console.log('Preview de cambios (max 20):');
      console.table(preview);
    }

    if (!applyMode) {
      console.log('Dry-run finalizado. Para aplicar cambios ejecuta con --apply');
      return;
    }

    if (deltas.length === 0) {
      console.log('No hay cambios para aplicar.');
      return;
    }

    await dataSource.transaction(async (manager) => {
      for (const delta of deltas) {
        await manager.getRepository(SettlementEntity).update(delta.id, {
          ivaServices: delta.newIvaServices,
          amountDue: delta.newAmountDue,
          finalAmount: delta.newFinalAmount,
          updatedAt: new Date(),
        } as any);
      }
    });

    console.log(`Backfill aplicado correctamente. Filas actualizadas: ${deltas.length}`);
  } catch (error) {
    console.error('Error al ejecutar backfill de ivaServices en liquidaciones:', error);
    process.exitCode = 1;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

void backfillSettlementIvaServices();
