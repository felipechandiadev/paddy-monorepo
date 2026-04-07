import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

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

async function resetDatabase() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT) || 3306,
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || 'redbull90',
    database: process.env.DATABASE_NAME || 'paddy',
    ...databaseSslConfig,
    entities: [
      path.join(__dirname, 'dist/**/*.entity.js'),
    ],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Connected to database');

    console.log('🔄 Dropping all tables...');
    await dataSource.dropDatabase();
    console.log('✅ All tables dropped');

    console.log('🔄 Syncing schema...');
    await dataSource.synchronize(true);
    console.log('✅ Schema synchronized');

    await dataSource.destroy();
    console.log('✅ Database reset completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Reset error:', error);
    process.exit(1);
  }
}

resetDatabase();
