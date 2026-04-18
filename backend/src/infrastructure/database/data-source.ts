import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Importar todas las entidades
import { User } from '@modules/users/domain/user.entity';
import { UserPermissionOverride } from '@modules/users/domain/user-permission-override.entity';
import { Producer } from '@modules/producers/domain/producer.entity';
import {
  RiceType,
  Season,
  Template,
  AnalysisParam,
} from '@modules/configuration/domain/configuration.entity';
import {
  Reception,
  AnalysisRecord,
} from '@modules/operations/domain/operations.entity';
import {
  Advance,
  Transaction,
  Settlement,
  SettlementReceptionSnapshot,
} from '@modules/finances/domain/finances.entity';

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

/**
 * Configuración de TypeORM para MySQL
 * Las migraciones se ejecutarán automáticamente si está habilitado synchronize
 */
export const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  username: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || 'redbull90',
  database: process.env.DATABASE_NAME || 'paddy',
  ...databaseSslConfig,
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
    Settlement,
    SettlementReceptionSnapshot,
    UserPermissionOverride,
  ],
  migrations: [`${__dirname}/migrations/**/*{.ts,.js}`],
  migrationsRun: process.env.NODE_ENV === 'production',
  synchronize:
    process.env.TYPEORM_SYNCHRONIZE === 'true' &&
    process.env.NODE_ENV === 'development',
  logging: false, // Disable all logging to prevent memory buildup
  dropSchema: process.env.NODE_ENV === 'test', // Drop en tests
});
