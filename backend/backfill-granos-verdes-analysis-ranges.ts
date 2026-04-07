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

type GranosVerdesRange = {
  start: number;
  end: number;
  percent: number;
};

const GRANOS_VERDES_RANGES: GranosVerdesRange[] = [
  { start: 0.0, end: 2.0, percent: 0.0 },
  { start: 2.01, end: 2.5, percent: 0.25 },
  { start: 2.51, end: 3.0, percent: 0.5 },
  { start: 3.01, end: 3.5, percent: 0.75 },
  { start: 3.51, end: 4.0, percent: 1.0 },
  { start: 4.01, end: 4.5, percent: 1.25 },
  { start: 4.51, end: 5.0, percent: 1.5 },
  { start: 5.01, end: 5.5, percent: 1.75 },
  { start: 5.51, end: 6.0, percent: 2.0 },
  { start: 6.01, end: 6.5, percent: 2.25 },
  { start: 6.51, end: 7.0, percent: 2.5 },
  { start: 7.01, end: 7.5, percent: 2.75 },
  { start: 7.51, end: 8.0, percent: 3.0 },
  { start: 8.01, end: 8.5, percent: 3.25 },
  { start: 8.51, end: 9.0, percent: 3.5 },
  { start: 9.01, end: 9.5, percent: 3.75 },
  { start: 9.51, end: 10.0, percent: 4.0 },
  { start: 10.01, end: 100.0, percent: 100.0 },
];

async function backfillGranosVerdesAnalysisRanges() {
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
      await manager.delete(AnalysisParam, { discountCode: 2 });

      const newRows = GRANOS_VERDES_RANGES.map((range, index) =>
        manager.create(AnalysisParam, {
          discountCode: 2,
          discountName: 'Granos Verdes',
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
      where: { discountCode: 2 },
      order: { rangeStart: 'ASC' },
    });

    console.log(
      `✅ GRANOS VERDES actualizado (discountCode 2). Rangos guardados: ${savedRows.length}`,
    );
    console.table(
      savedRows.map((row) => ({
        rangeStart: Number(row.rangeStart),
        rangeEnd: Number(row.rangeEnd),
        discountPercent: Number(row.discountPercent),
      })),
    );
  } catch (error) {
    console.error('❌ Error actualizando rangos de GRANOS VERDES:', error);
    process.exitCode = 1;
  } finally {
    await dataSource.destroy();
  }
}

void backfillGranosVerdesAnalysisRanges();
