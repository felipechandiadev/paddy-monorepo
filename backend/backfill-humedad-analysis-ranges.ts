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

type HumedadRange = {
  start: number;
  end: number;
  percent: number;
};

const HUMEDAD_RANGES: HumedadRange[] = [
  { start: 15.01, end: 15.5, percent: 1.0 },
  { start: 15.51, end: 16.0, percent: 1.5 },
  { start: 16.01, end: 16.5, percent: 2.0 },
  { start: 16.51, end: 17.0, percent: 2.5 },
  { start: 17.01, end: 17.5, percent: 3.0 },
  { start: 17.51, end: 18.0, percent: 4.03 },
  { start: 18.01, end: 18.5, percent: 4.62 },
  { start: 18.51, end: 19.0, percent: 5.21 },
  { start: 19.01, end: 19.5, percent: 5.79 },
  { start: 19.51, end: 20.0, percent: 6.38 },
  { start: 20.01, end: 20.5, percent: 6.97 },
  { start: 20.51, end: 21.0, percent: 7.56 },
  { start: 21.01, end: 21.5, percent: 8.15 },
  { start: 21.51, end: 22.0, percent: 8.74 },
  { start: 22.01, end: 22.5, percent: 9.32 },
  { start: 22.51, end: 23.0, percent: 9.91 },
  { start: 23.01, end: 23.5, percent: 10.5 },
  { start: 23.51, end: 24.0, percent: 11.09 },
  { start: 24.01, end: 24.5, percent: 11.68 },
  { start: 24.51, end: 25.0, percent: 12.26 },
  { start: 25.51, end: 100.0, percent: 100.0 },
];

async function backfillHumedadAnalysisRanges() {
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
      await manager.delete(AnalysisParam, { discountCode: 1 });

      const newRows = HUMEDAD_RANGES.map((range, index) =>
        manager.create(AnalysisParam, {
          discountCode: 1,
          discountName: 'Humedad',
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
      where: { discountCode: 1 },
      order: { rangeStart: 'ASC' },
    });

    console.log(`✅ HUMEDAD actualizado. Rangos guardados: ${savedRows.length}`);
    console.table(
      savedRows.map((row) => ({
        rangeStart: Number(row.rangeStart),
        rangeEnd: Number(row.rangeEnd),
        discountPercent: Number(row.discountPercent),
      })),
    );
  } catch (error) {
    console.error('❌ Error actualizando rangos de HUMEDAD:', error);
    process.exitCode = 1;
  } finally {
    await dataSource.destroy();
  }
}

void backfillHumedadAnalysisRanges();
