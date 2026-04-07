import { DataSource, In, IsNull } from 'typeorm';
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

interface SnapshotLine {
  receptionId: number;
  lineOrder: number;
  receptionDate: Date | null;
  guideNumber: string | null;
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

interface SettlementSnapshotPlan {
  settlementId: number;
  receptionIdsCount: number;
  existingSnapshotsCount: number;
  lines: SnapshotLine[];
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

function normalizeEntityIds(rawIds: unknown): number[] {
  if (!Array.isArray(rawIds)) {
    return [];
  }

  const normalized = rawIds
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value > 0)
    .map((value) => Math.trunc(value));

  return Array.from(new Set(normalized));
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

function parseSettlementIdArg(args: string[]): number | null {
  const raw = args.find((arg) => arg.startsWith('--settlement-id='));
  if (!raw) {
    return null;
  }

  const value = Number(raw.split('=')[1]);
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }

  return Math.floor(value);
}

async function buildSnapshotLinesForSettlement(
  dataSource: DataSource,
  receptionIds: number[],
): Promise<SnapshotLine[]> {
  if (receptionIds.length === 0) {
    return [];
  }

  const receptionsRepository = dataSource.getRepository(Reception) as any;
  const receptions = (await receptionsRepository.find({
    where: {
      id: In(receptionIds),
    },
    relations: ['riceType'],
    withDeleted: true,
  })) as any[];

  if (receptions.length === 0) {
    return [];
  }

  const analysisRecordsRepository = dataSource.getRepository(AnalysisRecord) as any;
  const analysisRecords = (await analysisRecordsRepository.find({
    where: {
      receptionId: In(receptions.map((reception) => reception.id)),
    },
    order: { createdAt: 'DESC' },
    withDeleted: true,
  })) as any[];

  const analysisByReceptionId = new Map<number, any>();
  for (const analysis of analysisRecords) {
    if (!analysisByReceptionId.has(analysis.receptionId)) {
      analysisByReceptionId.set(analysis.receptionId, analysis);
    }
  }

  const receptionById = new Map<number, any>(
    receptions.map((reception) => [reception.id, reception]),
  );

  const vatRate = 0.19;

  const lines: SnapshotLine[] = [];

  for (let index = 0; index < receptionIds.length; index += 1) {
    const receptionId = receptionIds[index];
    const reception = receptionById.get(receptionId);

    if (!reception) {
      continue;
    }

    const analysis = analysisByReceptionId.get(receptionId) as any;
    const dryPercent =
      analysis?.dryPercent !== null && analysis?.dryPercent !== undefined
        ? toNumber(analysis.dryPercent)
        : reception.dryPercent !== null && reception.dryPercent !== undefined
          ? toNumber(reception.dryPercent)
          : 0;

    const paddyKg = toNumber(reception.netWeight);
    const ricePrice = toNumber(reception.ricePrice);
    const paddySubTotal = roundCurrency(paddyKg * ricePrice);
    const paddyVat = roundCurrency(paddySubTotal * vatRate);
    const paddyTotal = roundCurrency(paddySubTotal + paddyVat);
    const dryingSubTotal = roundCurrency(paddySubTotal * (dryPercent / 100));
    const dryingVat = roundCurrency(dryingSubTotal * vatRate);
    const dryingTotal = roundCurrency(dryingSubTotal + dryingVat);

    lines.push({
      receptionId,
      lineOrder: index + 1,
      receptionDate: reception.createdAt ?? null,
      guideNumber: reception.guideNumber?.trim() || null,
      riceTypeName: reception.riceType?.name?.trim() || null,
      paddyKg,
      ricePrice,
      paddySubTotal,
      paddyVat,
      paddyTotal,
      dryPercent,
      dryingSubTotal,
      dryingVat,
      dryingTotal,
    });
  }

  return lines;
}

async function backfillSettlementReceptionSnapshots() {
  const args = process.argv.slice(2);
  const applyMode = args.includes('--apply');
  const limit = parseLimitArg(args);
  const fromId = parseFromIdArg(args);
  const settlementIdFilter = parseSettlementIdArg(args);
  const forceMode = args.includes('--force');

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
    const snapshotsRepository = dataSource.getRepository(SettlementReceptionSnapshot);

    const settlements = (await settlementsRepository.find({
      where: {
        status: SettlementStatusEnum.COMPLETED,
        deletedAt: IsNull(),
      },
      order: { id: 'ASC' },
    })) as any[];

    const filteredById = settlements.filter((settlement) => {
      const id = Number(settlement.id ?? 0);
      if (settlementIdFilter && id !== settlementIdFilter) {
        return false;
      }

      if (fromId && id < fromId) {
        return false;
      }

      return true;
    });

    const targetSettlements =
      limit && limit > 0 ? filteredById.slice(0, limit) : filteredById;

    const plans: SettlementSnapshotPlan[] = [];
    let alreadyWithSnapshots = 0;
    let emptyCompositionCount = 0;

    for (const settlement of targetSettlements) {
      const settlementId = Number(settlement.id ?? 0);
      const receptionIds = normalizeEntityIds(settlement.receptionIds);

      if (receptionIds.length === 0) {
        emptyCompositionCount += 1;
        continue;
      }

      const existingSnapshotsCount = await snapshotsRepository.count({
        where: {
          settlementId,
          deletedAt: IsNull(),
        },
      } as any);

      if (existingSnapshotsCount > 0 && !forceMode) {
        alreadyWithSnapshots += 1;
        continue;
      }

      const lines = await buildSnapshotLinesForSettlement(dataSource, receptionIds);

      if (lines.length === 0) {
        continue;
      }

      plans.push({
        settlementId,
        receptionIdsCount: receptionIds.length,
        existingSnapshotsCount,
        lines,
      });
    }

    const summary = {
      mode: applyMode ? 'APPLY' : 'DRY-RUN',
      forceMode,
      scannedCompletedSettlements: settlements.length,
      evaluatedSettlements: targetSettlements.length,
      alreadyWithSnapshots,
      emptyCompositionCount,
      settlementsToProcess: plans.length,
      settlementsWithoutLines: targetSettlements.length - alreadyWithSnapshots - emptyCompositionCount - plans.length,
      totalSnapshotLinesToInsert: plans.reduce((sum, plan) => sum + plan.lines.length, 0),
    };

    console.log('--- Backfill Settlement Reception Snapshots ---');
    console.table(summary);

    if (plans.length > 0) {
      const preview = plans.slice(0, 20).map((plan) => ({
        settlementId: plan.settlementId,
        receptionIdsCount: plan.receptionIdsCount,
        existingSnapshotsCount: plan.existingSnapshotsCount,
        linesToInsert: plan.lines.length,
      }));

      console.log('Preview de cambios (max 20):');
      console.table(preview);
    }

    if (!applyMode) {
      console.log('Dry-run finalizado. Para aplicar cambios ejecuta con --apply');
      return;
    }

    if (plans.length === 0) {
      console.log('No hay snapshots para generar.');
      return;
    }

    await dataSource.transaction(async (manager) => {
      const transactionalSnapshotsRepository = manager.getRepository(
        SettlementReceptionSnapshot,
      );

      for (const plan of plans) {
        await transactionalSnapshotsRepository.delete({
          settlementId: plan.settlementId,
        } as any);

        const payload = plan.lines.map((line) =>
          transactionalSnapshotsRepository.create({
            settlementId: plan.settlementId,
            receptionId: line.receptionId,
            lineOrder: line.lineOrder,
            receptionDate: line.receptionDate,
            guideNumber: line.guideNumber,
            riceTypeName: line.riceTypeName,
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

        await transactionalSnapshotsRepository.save(payload);
      }
    });

    console.log(
      `Backfill aplicado correctamente. Liquidaciones actualizadas: ${plans.length}. Líneas insertadas: ${plans.reduce((sum, plan) => sum + plan.lines.length, 0)}.`,
    );
  } catch (error) {
    console.error(
      'Error al ejecutar backfill de snapshots de recepciones en liquidaciones:',
      error,
    );
    process.exitCode = 1;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

void backfillSettlementReceptionSnapshots();
