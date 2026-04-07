import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { AnalysisParam } from './src/modules/configuration/domain/configuration.entity';

dotenv.config();

const isDatabaseSslRequired =
  process.env.DATABASE_SSL_MODE?.toUpperCase() === 'REQUIRED';
const isDatabaseSslEnabled =
  isDatabaseSslRequired || process.env.DATABASE_SSL === 'true';
const sslRejectUnauthorized =
  process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false';
const sslCa = process.env.DATABASE_SSL_CA?.replace(/\\n/g, '\n');

const databaseSslConfig = isDatabaseSslEnabled
  ? {
      ssl: sslCa
        ? { rejectUnauthorized: sslRejectUnauthorized, ca: sslCa }
        : { rejectUnauthorized: sslRejectUnauthorized },
    }
  : {};

type SecadoRange = {
  start: number;
  end: number;
  percent: number;
};

const SECADO_RANGES: SecadoRange[] = [
  { start: 15.01, end: 17.0, percent: 1.5 },
  { start: 17.01, end: 20.0, percent: 2.5 },
  { start: 20.01, end: 22.5, percent: 3.5 },
  { start: 22.51, end: 100.0, percent: 4.5 },
];

async function backfillSecadoAnalysisRanges() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '3306', 10),
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || 'redbull90',
    database: process.env.DATABASE_NAME || 'paddy',
    ...databaseSslConfig,
    entities: [AnalysisParam],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    const repository = dataSource.getRepository(AnalysisParam);

    await dataSource.transaction(async (manager) => {
      await manager.delete(AnalysisParam, { discountCode: 8 });

      const newRows = SECADO_RANGES.map((range, index) =>
        manager.create(AnalysisParam, {
          discountCode: 8,
          discountName: 'Secado',
          unit: '%',
          rangeStart: range.start,
          rangeEnd: range.end,
          discountPercent: range.percent,
          priority: index + 1,
          isActive: true,
        }),
      );

      await manager.save(AnalysisParam, newRows);
    });

    const savedRows = await repository.find({
      where: { discountCode: 8 },
      order: { rangeStart: 'ASC' },
    });

    console.log(`✅ SECADO actualizado. Rangos guardados: ${savedRows.length}`);
    console.table(
      savedRows.map((row) => ({
        rangeStart: Number(row.rangeStart),
        rangeEnd: Number(row.rangeEnd),
        discountPercent: Number(row.discountPercent),
      })),
    );
  } catch (error) {
    console.error('❌ Error actualizando rangos de SECADO:', error);
    process.exitCode = 1;
  } finally {
    await dataSource.destroy();
  }
}

void backfillSecadoAnalysisRanges();
