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

type GranosPeladosRange = {
  start: number;
  end: number;
  percent: number;
};

const GRANOS_PELADOS_RANGES: GranosPeladosRange[] = [
  { start: 0.0, end: 1.0, percent: 0.0 },
  { start: 1.01, end: 2.0, percent: 1.0 },
  { start: 2.01, end: 3.0, percent: 2.0 },
  { start: 3.01, end: 4.0, percent: 3.0 },
  { start: 4.01, end: 5.0, percent: 4.0 },
  { start: 5.01, end: 6.0, percent: 5.0 },
  { start: 6.01, end: 7.0, percent: 6.0 },
  { start: 7.01, end: 8.0, percent: 7.0 },
  { start: 8.01, end: 9.0, percent: 8.0 },
  { start: 9.01, end: 10.0, percent: 9.0 },
  { start: 10.01, end: 100.0, percent: 100.0 },
];

async function backfillGranosPeladosAnalysisRanges() {
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
      await manager.delete(AnalysisParam, { discountCode: 7 });

      const newRows = GRANOS_PELADOS_RANGES.map((range, index) =>
        manager.create(AnalysisParam, {
          discountCode: 7,
          discountName: 'Granos Pelados',
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
      where: { discountCode: 7 },
      order: { rangeStart: 'ASC' },
    });

    console.log(
      `✅ GRANOS PELADOS actualizado (discountCode 7). Rangos guardados: ${savedRows.length}`,
    );
    console.table(
      savedRows.map((row) => ({
        rangeStart: Number(row.rangeStart),
        rangeEnd: Number(row.rangeEnd),
        discountPercent: Number(row.discountPercent),
      })),
    );
  } catch (error) {
    console.error('❌ Error actualizando rangos de GRANOS PELADOS:', error);
    process.exitCode = 1;
  } finally {
    await dataSource.destroy();
  }
}

void backfillGranosPeladosAnalysisRanges();
