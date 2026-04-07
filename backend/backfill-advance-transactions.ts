import { DataSource, IsNull } from 'typeorm';
import * as dotenv from 'dotenv';
import {
  Advance,
  Transaction,
  SettlementReceptionSnapshot,
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
import {
  PaymentMethodEnum,
  TransactionTypeEnum,
} from './src/shared/enums';

dotenv.config();

async function backfillAdvanceTransactions() {
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
      SettlementReceptionSnapshot,
    ],
    synchronize: false,
  });

  try {
    await dataSource.initialize();

    const advancesRepository = dataSource.getRepository(Advance);
    const transactionsRepository = dataSource.getRepository(Transaction);

    const advances = await advancesRepository.find({
      where: { deletedAt: IsNull() },
      order: { issueDate: 'ASC', id: 'ASC' },
    });

    const existingTransactions = await transactionsRepository.find({
      where: {
        deletedAt: IsNull(),
        type: TransactionTypeEnum.ADVANCE,
      },
    });

    const existingAdvanceIds = new Set(
      existingTransactions
        .map((transaction) => transaction.advanceId)
        .filter((advanceId): advanceId is number => typeof advanceId === 'number'),
    );

    const missingAdvances = advances.filter(
      (advance) => !existingAdvanceIds.has(advance.id),
    );

    if (missingAdvances.length === 0) {
      console.log('No hay anticipos pendientes de backfill.');
      return;
    }

    for (const advance of missingAdvances) {
      const transaction = transactionsRepository.create({
        producerId: advance.producerId,
        advanceId: advance.id,
        type: TransactionTypeEnum.ADVANCE,
        amount: advance.amount,
        transactionDate: advance.issueDate,
        referenceNumber: null,
        notes: advance.description?.trim() || 'Backfill de anticipo sin trazabilidad previa',
        metadata: {
          paymentMethod: PaymentMethodEnum.CASH,
          advanceDescription: advance.description?.trim() || null,
          backfilled: true,
          backfillReason: 'Advance existed without ADVANCE transaction',
        },
      });

      await transactionsRepository.save(transaction);
      console.log(`Backfill OK: anticipo ${advance.id} -> transaccion advance creada`);
    }

    console.log(`Backfill completado: ${missingAdvances.length} anticipos actualizados.`);
  } catch (error) {
    console.error('Error al ejecutar el backfill de anticipos:', error);
    process.exitCode = 1;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

backfillAdvanceTransactions();