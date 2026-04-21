import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { User } from '../../../modules/users/domain/user.entity';
import { Producer } from '../../../modules/producers/domain/producer.entity';
import {
  RiceType,
  Season,
  Template,
  AnalysisParam,
} from '../../../modules/configuration/domain/configuration.entity';
import { Reception, AnalysisRecord } from '../../../modules/operations/domain/operations.entity';
import {
  Advance,
  Transaction,
  Settlement,
  SettlementReceptionSnapshot,
} from '../../../modules/finances/domain/finances.entity';
import {
  RoleEnum,
  ReceptionStatusEnum,
  AdvanceStatusEnum,
  SettlementStatusEnum,
  PaymentMethodEnum,
  TransactionTypeEnum,
} from '../../../shared/enums';

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

// Mapear índices de columnas para cada tabla
const COLUMN_MAPPINGS = {
  users: {
    id: 0,
    createdAt: 1,
    updatedAt: 2,
    deletedAt: 3,
    email: 4,
    password: 5,
    name: 6,
    firstName: 7,
    lastName: 8,
    role: 9,
    isActive: 10,
    phone: 11,
    lastLogin: 12,
  },
  rice_types: {
    id: 0,
    createdAt: 1,
    updatedAt: 2,
    deletedAt: 3,
    code: 4,
    name: 5,
    description: 6,
    referencePrice: 7,
    isActive: 8,
  },
  seasons: {
    id: 0,
    createdAt: 1,
    updatedAt: 2,
    deletedAt: 3,
    code: 4,
    name: 5,
    year: 6,
    startDate: 7,
    endDate: 8,
    isActive: 9,
    notes: 10,
  },
  templates: {
    id: 0,
    createdAt: 1,
    updatedAt: 2,
    deletedAt: 3,
    name: 4,
    producerId: 5,
    isDefault: 6,
    useToleranceGroup: 7,
    groupToleranceValue: 8,
    groupToleranceName: 9,
    availableHumedad: 10,
    percentHumedad: 11,
    toleranceHumedad: 12,
    showToleranceHumedad: 13,
    groupToleranceHumedad: 14,
    availableGranosVerdes: 15,
    percentGranosVerdes: 16,
    toleranceGranosVerdes: 17,
    showToleranceGranosVerdes: 18,
    groupToleranceGranosVerdes: 19,
    availableImpurezas: 20,
    percentImpurezas: 21,
    toleranceImpurezas: 22,
    showToleranceImpurezas: 23,
    groupToleranceImpurezas: 24,
    availableVano: 25,
    percentVano: 26,
    toleranceVano: 27,
    showToleranceVano: 28,
    groupToleranceVano: 29,
    availableHualcacho: 30,
    percentHualcacho: 31,
    toleranceHualcacho: 32,
    showToleranceHualcacho: 33,
    groupToleranceHualcacho: 34,
    availableGranosManchados: 35,
    percentGranosManchados: 36,
    toleranceGranosManchados: 37,
    showToleranceGranosManchados: 38,
    groupToleranceGranosManchados: 39,
    availableGranosPelados: 40,
    percentGranosPelados: 41,
    toleranceGranosPelados: 42,
    showToleranceGranosPelados: 43,
    groupToleranceGranosPelados: 44,
    availableGranosYesosos: 45,
    percentGranosYesosos: 46,
    toleranceGranosYesosos: 47,
    showToleranceGranosYesosos: 48,
    groupToleranceGranosYesosos: 49,
    availableBonus: 50,
    toleranceBonus: 51,
    availableDry: 52,
    percentDry: 53,
    isActive: 54,
  },
  analysis_params: {
    id: 0,
    createdAt: 1,
    updatedAt: 2,
    deletedAt: 3,
    discountCode: 4,
    discountName: 5,
    unit: 6,
    rangeStart: 7,
    rangeEnd: 8,
    discountPercent: 9,
    priority: 10,
    isActive: 11,
  },
};

async function seedProduction() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT) || 3306,
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
    ],
  });

  try {
    await dataSource.initialize();
    console.log('✅ Conectado a base de datos');

    // Cargar datos del JSON
    const dumpPath = path.join(__dirname, '../../../..', 'database_dump.json');
    if (!fs.existsSync(dumpPath)) {
      throw new Error(`Archivo database_dump.json no encontrado en ${dumpPath}`);
    }

    const dumpData = JSON.parse(fs.readFileSync(dumpPath, 'utf-8'));
    console.log(`✅ Archivo database_dump.json cargado`);

    // 1. Resetear base de datos - Limpiar tablas
    console.log('\n📊 Reseteando base de datos...');
    
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');
    
    const tableNames = [
      'settlement_reception_snapshots',
      'settlements',
      'transactions',
      'advances',
      'analysis_records',
      'receptions',
      'analysis_params',
      'templates',
      'seasons',
      'rice_types',
      'producers',
      'users',
      'user_permission_overrides',
      'audit_events',
      'migrations',
    ];

    for (const tableName of tableNames) {
      try {
        await dataSource.query(`TRUNCATE TABLE ${tableName}`);
        console.log(`  ✓ Truncada tabla: ${tableName}`);
      } catch (error) {
        console.log(`  ℹ Tabla ${tableName} no existe o no pudo ser truncada`);
      }
    }

    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✅ Base de datos reseteada\n');

    // 2. Cargar datos desde JSON
    console.log('📥 Cargando datos desde database_dump.json...\n');

    // Usuarios
    if (dumpData.tables.users && dumpData.tables.users.data.length > 0) {
      const usersRepository = dataSource.getRepository(User);
      const users = dumpData.tables.users.data.map((row) => {
        const mapping = COLUMN_MAPPINGS.users;
        return usersRepository.create({
          id: row[mapping.id],
          email: row[mapping.email],
          password: row[mapping.password],
          name: row[mapping.name],
          firstName: row[mapping.firstName],
          lastName: row[mapping.lastName],
          role: row[mapping.role] as RoleEnum,
          isActive: row[mapping.isActive],
          phone: row[mapping.phone],
          lastLogin: row[mapping.lastLogin],
        });
      });
      await usersRepository.save(users);
      console.log(`✅ Usuarios cargados: ${users.length}`);
    }

    // Tipos de Arroz
    if (dumpData.tables.rice_types && dumpData.tables.rice_types.data.length > 0) {
      const riceTypesRepository = dataSource.getRepository(RiceType);
      const riceTypes = dumpData.tables.rice_types.data.map((row) => {
        const mapping = COLUMN_MAPPINGS.rice_types;
        return riceTypesRepository.create({
          id: row[mapping.id],
          code: row[mapping.code],
          name: row[mapping.name],
          description: row[mapping.description],
          referencePrice: row[mapping.referencePrice],
          isActive: row[mapping.isActive],
        });
      });
      await riceTypesRepository.save(riceTypes);
      console.log(`✅ Tipos de Arroz cargados: ${riceTypes.length}`);
    }

    // Temporadas
    if (dumpData.tables.seasons && dumpData.tables.seasons.data.length > 0) {
      const seasonsRepository = dataSource.getRepository(Season);
      const seasons = dumpData.tables.seasons.data.map((row) => {
        const mapping = COLUMN_MAPPINGS.seasons;
        return seasonsRepository.create({
          id: row[mapping.id],
          code: row[mapping.code],
          name: row[mapping.name],
          year: row[mapping.year],
          startDate: row[mapping.startDate],
          endDate: row[mapping.endDate],
          isActive: row[mapping.isActive],
          notes: row[mapping.notes],
        });
      });
      await seasonsRepository.save(seasons);
      console.log(`✅ Temporadas cargadas: ${seasons.length}`);
    }

    // Plantillas
    if (dumpData.tables.templates && dumpData.tables.templates.data.length > 0) {
      const templatesRepository = dataSource.getRepository(Template);
      const templates = dumpData.tables.templates.data.map((row) => {
        const mapping = COLUMN_MAPPINGS.templates;
        return templatesRepository.create({
          id: row[mapping.id],
          name: row[mapping.name],
          producerId: row[mapping.producerId],
          isDefault: row[mapping.isDefault],
          useToleranceGroup: row[mapping.useToleranceGroup],
          groupToleranceValue: row[mapping.groupToleranceValue],
          groupToleranceName: row[mapping.groupToleranceName],
          availableHumedad: row[mapping.availableHumedad],
          percentHumedad: row[mapping.percentHumedad],
          toleranceHumedad: row[mapping.toleranceHumedad],
          showToleranceHumedad: row[mapping.showToleranceHumedad],
          groupToleranceHumedad: row[mapping.groupToleranceHumedad],
          availableGranosVerdes: row[mapping.availableGranosVerdes],
          percentGranosVerdes: row[mapping.percentGranosVerdes],
          toleranceGranosVerdes: row[mapping.toleranceGranosVerdes],
          showToleranceGranosVerdes: row[mapping.showToleranceGranosVerdes],
          groupToleranceGranosVerdes: row[mapping.groupToleranceGranosVerdes],
          availableImpurezas: row[mapping.availableImpurezas],
          percentImpurezas: row[mapping.percentImpurezas],
          toleranceImpurezas: row[mapping.toleranceImpurezas],
          showToleranceImpurezas: row[mapping.showToleranceImpurezas],
          groupToleranceImpurezas: row[mapping.groupToleranceImpurezas],
          availableVano: row[mapping.availableVano],
          percentVano: row[mapping.percentVano],
          toleranceVano: row[mapping.toleranceVano],
          showToleranceVano: row[mapping.showToleranceVano],
          groupToleranceVano: row[mapping.groupToleranceVano],
          availableHualcacho: row[mapping.availableHualcacho],
          percentHualcacho: row[mapping.percentHualcacho],
          toleranceHualcacho: row[mapping.toleranceHualcacho],
          showToleranceHualcacho: row[mapping.showToleranceHualcacho],
          groupToleranceHualcacho: row[mapping.groupToleranceHualcacho],
          availableGranosManchados: row[mapping.availableGranosManchados],
          percentGranosManchados: row[mapping.percentGranosManchados],
          toleranceGranosManchados: row[mapping.toleranceGranosManchados],
          showToleranceGranosManchados: row[mapping.showToleranceGranosManchados],
          groupToleranceGranosManchados: row[mapping.groupToleranceGranosManchados],
          availableGranosPelados: row[mapping.availableGranosPelados],
          percentGranosPelados: row[mapping.percentGranosPelados],
          toleranceGranosPelados: row[mapping.toleranceGranosPelados],
          showToleranceGranosPelados: row[mapping.showToleranceGranosPelados],
          groupToleranceGranosPelados: row[mapping.groupToleranceGranosPelados],
          availableGranosYesosos: row[mapping.availableGranosYesosos],
          percentGranosYesosos: row[mapping.percentGranosYesosos],
          toleranceGranosYesosos: row[mapping.toleranceGranosYesosos],
          showToleranceGranosYesosos: row[mapping.showToleranceGranosYesosos],
          groupToleranceGranosYesosos: row[mapping.groupToleranceGranosYesosos],
          availableBonus: row[mapping.availableBonus],
          toleranceBonus: row[mapping.toleranceBonus],
          availableDry: row[mapping.availableDry],
          percentDry: row[mapping.percentDry],
          isActive: row[mapping.isActive],
        });
      });
      await templatesRepository.save(templates);
      console.log(`✅ Plantillas cargadas: ${templates.length}`);
    }

    // Parámetros de Análisis
    if (dumpData.tables.analysis_params && dumpData.tables.analysis_params.data.length > 0) {
      const analysisParamsRepository = dataSource.getRepository(AnalysisParam);
      const analysisParams = dumpData.tables.analysis_params.data.map((row) => {
        const mapping = COLUMN_MAPPINGS.analysis_params;
        return analysisParamsRepository.create({
          id: row[mapping.id],
          discountCode: row[mapping.discountCode],
          discountName: row[mapping.discountName],
          unit: row[mapping.unit],
          rangeStart: row[mapping.rangeStart],
          rangeEnd: row[mapping.rangeEnd],
          discountPercent: row[mapping.discountPercent],
          priority: row[mapping.priority],
          isActive: row[mapping.isActive],
        });
      });
      await analysisParamsRepository.save(analysisParams);
      console.log(`✅ Parámetros de Análisis cargados: ${analysisParams.length}`);
    }

    console.log('\n✅ Seed de Producción completado exitosamente!');
    console.log(`\nResumen de datos cargados:`);
    console.log(`  • Usuarios: ${dumpData.tables.users?.rowCount || 0}`);
    console.log(`  • Tipos de Arroz: ${dumpData.tables.rice_types?.rowCount || 0}`);
    console.log(`  • Temporadas: ${dumpData.tables.seasons?.rowCount || 0}`);
    console.log(`  • Plantillas: ${dumpData.tables.templates?.rowCount || 0}`);
    console.log(`  • Parámetros de Análisis: ${dumpData.tables.analysis_params?.rowCount || 0}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed de producción:', error);
    process.exit(1);
  }
}

seedProduction();
