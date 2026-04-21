import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { User } from '../../../modules/users/domain/user.entity';
import {
  Season,
  Template,
  AnalysisParam,
} from '../../../modules/configuration/domain/configuration.entity';
import { RoleEnum } from '../../../shared/enums';

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

type AnalysisRange = {
  start: number;
  end: number;
  percent: number;
};

type DiscountConfiguration = {
  discountCode: number;
  name: string;
  ranges: AnalysisRange[];
};

const DEFAULT_TEMPLATE: Partial<Template> = {
  name: 'newTemplate',
  isDefault: true,
  useToleranceGroup: true,
  groupToleranceValue: 4.0,
  groupToleranceName: 'Analisis de Granos edit',
  availableHumedad: true,
  percentHumedad: 0,
  toleranceHumedad: 0,
  showToleranceHumedad: true,
  groupToleranceHumedad: false,
  availableGranosVerdes: true,
  percentGranosVerdes: 0,
  toleranceGranosVerdes: 0,
  showToleranceGranosVerdes: true,
  groupToleranceGranosVerdes: true,
  availableImpurezas: true,
  percentImpurezas: 0,
  toleranceImpurezas: 0,
  showToleranceImpurezas: false,
  groupToleranceImpurezas: true,
  availableVano: false,
  percentVano: 0,
  toleranceVano: 0,
  showToleranceVano: false,
  groupToleranceVano: false,
  availableHualcacho: false,
  percentHualcacho: 0,
  toleranceHualcacho: 0,
  showToleranceHualcacho: false,
  groupToleranceHualcacho: false,
  availableGranosManchados: true,
  percentGranosManchados: 0,
  toleranceGranosManchados: 0,
  showToleranceGranosManchados: false,
  groupToleranceGranosManchados: true,
  availableGranosPelados: true,
  percentGranosPelados: 0,
  toleranceGranosPelados: 0,
  showToleranceGranosPelados: false,
  groupToleranceGranosPelados: true,
  availableGranosYesosos: false,
  percentGranosYesosos: 0,
  toleranceGranosYesosos: 0,
  showToleranceGranosYesosos: false,
  groupToleranceGranosYesosos: false,
  availableBonus: true,
  toleranceBonus: 0,
  availableDry: true,
  percentDry: 0,
  isActive: true,
};

const DISCOUNT_CONFIGURATIONS: DiscountConfiguration[] = [
  {
    discountCode: 1,
    name: 'Humedad',
    ranges: [
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
    ],
  },
  {
    discountCode: 2,
    name: 'Granos Verdes',
    ranges: [
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
    ],
  },
  {
    discountCode: 3,
    name: 'Impurezas',
    ranges: [
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
    ],
  },
  {
    discountCode: 4,
    name: 'Granos Manchados',
    ranges: [
      { start: 0.01, end: 0.5, percent: 0.5 },
      { start: 0.51, end: 1.0, percent: 1.0 },
      { start: 1.01, end: 1.5, percent: 1.5 },
      { start: 1.51, end: 2.0, percent: 2.0 },
      { start: 2.01, end: 2.5, percent: 2.5 },
      { start: 2.51, end: 3.0, percent: 3.0 },
      { start: 3.01, end: 3.5, percent: 3.5 },
      { start: 3.51, end: 4.0, percent: 4.0 },
      { start: 4.01, end: 4.5, percent: 4.5 },
      { start: 4.51, end: 5.0, percent: 5.0 },
      { start: 5.01, end: 100.0, percent: 100.0 },
    ],
  },
  {
    discountCode: 5,
    name: 'Granos Yesosos',
    ranges: [
      { start: 0.0, end: 1.0, percent: 0.0 },
      { start: 1.01, end: 1.5, percent: 0.5 },
      { start: 1.51, end: 2.0, percent: 1.0 },
      { start: 2.01, end: 2.5, percent: 1.5 },
      { start: 2.51, end: 3.0, percent: 2.0 },
      { start: 3.01, end: 3.5, percent: 2.5 },
      { start: 3.51, end: 4.0, percent: 3.0 },
      { start: 4.01, end: 4.5, percent: 3.5 },
      { start: 4.51, end: 5.0, percent: 4.0 },
      { start: 5.01, end: 100.0, percent: 100.0 },
    ],
  },
  {
    discountCode: 6,
    name: 'Granos Rojos',
    ranges: [
      { start: 0.01, end: 0.5, percent: 0.5 },
      { start: 0.51, end: 1.0, percent: 1.0 },
      { start: 1.01, end: 1.5, percent: 1.5 },
      { start: 1.51, end: 2.0, percent: 2.0 },
      { start: 2.01, end: 2.5, percent: 2.5 },
      { start: 2.51, end: 3.0, percent: 3.0 },
      { start: 3.01, end: 3.5, percent: 3.5 },
      { start: 3.51, end: 4.0, percent: 4.0 },
      { start: 4.01, end: 4.5, percent: 4.5 },
      { start: 4.51, end: 5.0, percent: 5.0 },
      { start: 5.01, end: 100.0, percent: 100.0 },
    ],
  },
  {
    discountCode: 7,
    name: 'Granos Dañados',
    ranges: [
      { start: 0.01, end: 0.5, percent: 0.5 },
      { start: 0.51, end: 1.0, percent: 1.0 },
      { start: 1.01, end: 1.5, percent: 1.5 },
      { start: 1.51, end: 2.0, percent: 2.0 },
      { start: 2.01, end: 2.5, percent: 2.5 },
      { start: 2.51, end: 3.0, percent: 2.0 },
      { start: 3.01, end: 3.5, percent: 2.5 },
      { start: 3.51, end: 4.0, percent: 3.0 },
      { start: 4.01, end: 4.5, percent: 3.5 },
      { start: 4.51, end: 5.0, percent: 4.0 },
      { start: 5.01, end: 100.0, percent: 100.0 },
    ],
  },
  {
    discountCode: 8,
    name: 'Secado',
    ranges: [
      { start: 15.01, end: 17.0, percent: 1.5 },
      { start: 17.01, end: 20.0, percent: 2.5 },
      { start: 20.01, end: 22.5, percent: 3.5 },
      { start: 22.51, end: 100.0, percent: 4.5 },
    ],
  },
];

async function seedMinimal() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT) || 3306,
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || 'redbull90',
    database: process.env.DATABASE_NAME || 'paddy',
    ...databaseSslConfig,
    entities: [User, Season, Template, AnalysisParam],
    synchronize: true,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Conectado a base de datos');

    const usersRepository = dataSource.getRepository(User);
    const seasonsRepository = dataSource.getRepository(Season);
    const templatesRepository = dataSource.getRepository(Template);
    const analysisParamsRepository = dataSource.getRepository(AnalysisParam);

    // 1) Usuario inicial solicitado
    const requestedUser = {
      email: 'pojeda@ayg.cl',
      password: await bcrypt.hash('pass', 10),
      name: 'Pojeda',
      role: RoleEnum.ADMIN,
      isActive: true,
    };

    const existingUser = await usersRepository.findOne({
      where: { email: requestedUser.email },
      withDeleted: true,
    });

    let savedUser: User;
    if (!existingUser) {
      savedUser = await usersRepository.save(usersRepository.create(requestedUser));
    } else {
      if (existingUser.deletedAt) {
        await usersRepository.restore(existingUser.id);
      }

      savedUser = await usersRepository.save(
        usersRepository.create({
          ...existingUser,
          ...requestedUser,
          id: existingUser.id,
        }),
      );
    }

    console.log(`✅ Usuario listo: ${savedUser.email}`);

    // 2) Temporada solicitada
    const requestedSeason: Partial<Season> = {
      code: 'COSECHA_2026',
      name: 'COSECHA 2026',
      year: 2026,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      isActive: true,
      notes: 'Temporada base para iniciar la operación',
    };

    const existingSeason = await seasonsRepository.findOne({
      where: [
        { code: requestedSeason.code, year: requestedSeason.year },
        { name: requestedSeason.name, year: requestedSeason.year },
      ],
      withDeleted: true,
    });

    let savedSeason: Season;
    if (!existingSeason) {
      savedSeason = await seasonsRepository.save(
        seasonsRepository.create(requestedSeason),
      );
    } else {
      if (existingSeason.deletedAt) {
        await seasonsRepository.restore(existingSeason.id);
      }

      savedSeason = await seasonsRepository.save(
        seasonsRepository.create({
          ...existingSeason,
          ...requestedSeason,
          id: existingSeason.id,
        }),
      );
    }

    await seasonsRepository
      .createQueryBuilder()
      .update(Season)
      .set({ isActive: false })
      .where('id <> :id', { id: savedSeason.id })
      .execute();

    console.log(`✅ Temporada lista: ${savedSeason.name}`);

    // 3) Plantilla por defecto actual
    const existingTemplate = await templatesRepository.findOne({
      where: { name: DEFAULT_TEMPLATE.name },
      withDeleted: true,
    });

    let savedTemplate: Template;
    if (!existingTemplate) {
      savedTemplate = await templatesRepository.save(
        templatesRepository.create(DEFAULT_TEMPLATE),
      );
    } else {
      if (existingTemplate.deletedAt) {
        await templatesRepository.restore(existingTemplate.id);
      }

      savedTemplate = await templatesRepository.save(
        templatesRepository.create({
          ...existingTemplate,
          ...DEFAULT_TEMPLATE,
          id: existingTemplate.id,
        }),
      );
    }

    await templatesRepository
      .createQueryBuilder()
      .update(Template)
      .set({ isDefault: false })
      .where('id <> :id', { id: savedTemplate.id })
      .execute();

    console.log(`✅ Plantilla lista: ${savedTemplate.name}`);

    // 4) Parámetros de análisis actuales
    for (const config of DISCOUNT_CONFIGURATIONS) {
      await analysisParamsRepository.delete({ discountCode: config.discountCode });

      const params = config.ranges.map((range) =>
        analysisParamsRepository.create({
          discountCode: config.discountCode,
          discountName: config.name,
          unit: '%',
          rangeStart: range.start,
          rangeEnd: range.end,
          discountPercent: range.percent,
          priority: 0,
          isActive: true,
        }),
      );

      await analysisParamsRepository.save(params);
    }

    console.log('✅ Parámetros de análisis listos');
    console.log('🎉 Seed mínimo completado');
  } catch (error) {
    console.error('❌ Error ejecutando seed mínimo:', error);
    throw error;
  } finally {
    await dataSource.destroy();
  }
}

seedMinimal();
