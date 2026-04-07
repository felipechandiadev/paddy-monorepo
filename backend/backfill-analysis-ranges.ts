import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
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

type CliArgs = Record<string, string>;

type NormalizedRange = {
  start: number;
  end: number;
  percent: number;
};

function parseCliArgs(argv: string[]): CliArgs {
  const args: CliArgs = {};

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];

    if (!token.startsWith('--')) {
      throw new Error(`Argumento invalido: ${token}`);
    }

    const key = token.slice(2);
    const value = argv[i + 1];

    if (!value || value.startsWith('--')) {
      throw new Error(`Falta valor para --${key}`);
    }

    args[key] = value;
    i += 1;
  }

  return args;
}

function getRequiredArg(args: CliArgs, key: string): string {
  const value = args[key];

  if (!value) {
    throw new Error(`Falta argumento requerido --${key}`);
  }

  return value;
}

function toNumber(value: unknown, fieldName: string, index: number): number {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`Valor numerico invalido en rango #${index + 1} para ${fieldName}`);
  }

  return parsed;
}

function extractRangesInput(parsedPayload: unknown): unknown[] {
  if (Array.isArray(parsedPayload)) {
    return parsedPayload;
  }

  if (parsedPayload && typeof parsedPayload === 'object') {
    const values = Object.values(parsedPayload as Record<string, unknown>);
    const firstArray = values.find((value) => Array.isArray(value));

    if (firstArray && Array.isArray(firstArray)) {
      return firstArray;
    }
  }

  throw new Error(
    'El payload de rangos debe ser un arreglo o un objeto que contenga un arreglo',
  );
}

function normalizeRanges(rawRanges: unknown[]): NormalizedRange[] {
  return rawRanges.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`Rango invalido en posicion ${index + 1}`);
    }

    const row = item as Record<string, unknown>;

    const start = toNumber(
      row.start ?? row.rango_inicial ?? row.rangeStart,
      'start/rango_inicial',
      index,
    );
    const end = toNumber(
      row.end ?? row.rango_final ?? row.rangeEnd,
      'end/rango_final',
      index,
    );
    const percent = toNumber(
      row.percent ?? row.porcentaje ?? row.discountPercent,
      'percent/porcentaje',
      index,
    );

    if (end < start) {
      throw new Error(`Rango invalido en posicion ${index + 1}: end < start`);
    }

    return { start, end, percent };
  });
}

function loadRangesPayload(args: CliArgs): unknown {
  if (args.rangesFile) {
    const fileContent = fs.readFileSync(args.rangesFile, 'utf8');
    return JSON.parse(fileContent);
  }

  const rangesRaw = getRequiredArg(args, 'ranges');
  return JSON.parse(rangesRaw);
}

function printUsage() {
  console.log('Uso:');
  console.log(
    'npx ts-node -r tsconfig-paths/register backfill-analysis-ranges.ts --discountCode <numero> --discountName <nombre> --ranges <json>',
  );
  console.log('o');
  console.log(
    'npx ts-node -r tsconfig-paths/register backfill-analysis-ranges.ts --discountCode <numero> --discountName <nombre> --rangesFile <ruta.json>',
  );
}

async function run() {
  try {
    const args = parseCliArgs(process.argv);

    const discountCode = Number(getRequiredArg(args, 'discountCode'));
    if (!Number.isInteger(discountCode)) {
      throw new Error('discountCode debe ser un numero entero');
    }

    const discountName = getRequiredArg(args, 'discountName');
    const unit = args.unit || '%';

    const payload = loadRangesPayload(args);
    const rawRanges = extractRangesInput(payload);
    const ranges = normalizeRanges(rawRanges);

    if (ranges.length === 0) {
      throw new Error('No se recibieron rangos para guardar');
    }

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
        await manager.delete(AnalysisParam, { discountCode });

        const newRows = ranges.map((range, index) =>
          manager.create(AnalysisParam, {
            discountCode,
            discountName,
            unit,
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
        where: { discountCode },
        order: { rangeStart: 'ASC' },
      });

      console.log(
        `✅ ${discountName} actualizado (discountCode ${discountCode}). Rangos guardados: ${savedRows.length}`,
      );
      console.table(
        savedRows.map((row) => ({
          rangeStart: Number(row.rangeStart),
          rangeEnd: Number(row.rangeEnd),
          discountPercent: Number(row.discountPercent),
        })),
      );
    } finally {
      await dataSource.destroy();
    }
  } catch (error) {
    printUsage();
    console.error('❌ Error ejecutando backfill generico:', error);
    process.exitCode = 1;
  }
}

void run();
