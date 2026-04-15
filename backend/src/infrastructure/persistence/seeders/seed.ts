import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
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

// Cargar variables de entorno
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

async function seed() {
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

    // 1. Crear usuarios de prueba
    const usersRepository = dataSource.getRepository(User);
    const admin = usersRepository.create({
      email: 'admin@ayg.cl',
      password: await bcrypt.hash('098098', 10),
      name: 'Administrador',
      role: RoleEnum.ADMIN,
      isActive: true,
    });

    await usersRepository.save([admin]);
    console.log('✅ Usuarios creados (admin)');

    // 2. Crear tipos de arroz
    const riceTypesRepository = dataSource.getRepository(RiceType);
    const riceTypes = [
      {
        id: 1,
        code: 'DIAMANTE',
        name: 'Diamante',
        referencePrice: 600,
        isActive: true,
      },
      {
        id: 2,
        code: 'ZAFIRO',
        name: 'Zafiro',
        referencePrice: 550,
        isActive: true,
      },
      {
        id: 7,
        code: 'BR',
        name: 'Brillante',
        referencePrice: 200,
        isActive: true,
      },
      {
        id: 8,
        code: 'HR',
        name: 'Harper',
        referencePrice: 200,
        isActive: true,
      },
    ];

    for (const rt of riceTypes) {
      const existing = await riceTypesRepository.findOne({
        where: { code: rt.code },
        withDeleted: true,
      });

      if (!existing) {
        await riceTypesRepository.save(riceTypesRepository.create(rt));
        continue;
      }

      if (existing.deletedAt) {
        await riceTypesRepository.restore(existing.id);
      }

      await riceTypesRepository.save(
        riceTypesRepository.create({
          ...existing,
          ...rt,
          id: existing.id,
        }),
      );
    }
    console.log('✅ Tipos de arroz creados');

    // 3. Crear temporadas
    const seasonsRepository = dataSource.getRepository(Season);
    const seasons = [
      {
        code: 'SUMMER2026',
        name: 'Verano 2026',
        year: 2026,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-03-31'),
        isActive: true,
      },
      {
        code: 'WINTER2026',
        name: 'Invierno 2026',
        year: 2026,
        startDate: new Date('2026-04-01'),
        endDate: new Date('2026-06-30'),
        isActive: false,
      },
    ];

    for (const season of seasons) {
      const existing = await seasonsRepository.findOne({
        where: { code: season.code, year: season.year },
      });
      if (!existing) {
        await seasonsRepository.save(seasonsRepository.create(season));
      }
    }
    console.log('✅ Temporadas creadas');

    // 4. Crear template por defecto
    const templatesRepository = dataSource.getRepository(Template);
    const defaultTemplate = templatesRepository.create({
      name: 'newTemplate',
      isDefault: true,
      useToleranceGroup: true,
      groupToleranceValue: 4.0,
      groupToleranceName: 'Análisis de Granos edit',
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
    });

    await templatesRepository.save(defaultTemplate);
    console.log('✅ Template por defecto creado');

    // 5. Crear parámetros de análisis (rangos de descuento)
    const analysisParamsRepository = dataSource.getRepository(AnalysisParam);
    
    const discountConfigurations = [
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
          { start: 0.01, end: 0.5, percent: -0.5 },
          { start: 0.51, end: 1.0, percent: -1.0 },
          { start: 1.01, end: 1.5, percent: -1.5 },
          { start: 1.51, end: 2.0, percent: -2.0 },
          { start: 2.01, end: 2.5, percent: -2.5 },
          { start: 2.51, end: 3.0, percent: -3.0 },
          { start: 3.01, end: 3.5, percent: -3.5 },
          { start: 3.51, end: 4.0, percent: -4.0 },
          { start: 4.01, end: 4.5, percent: -4.5 },
          { start: 4.51, end: 5.0, percent: -5.0 },
          { start: 5.01, end: 100.0, percent: -100.0 },
        ],
      },
      {
        discountCode: 5,
        name: 'Granos Yesosos',
        ranges: [
          { start: 0.01, end: 0.5, percent: -0.5 },
          { start: 0.51, end: 1.0, percent: -1.0 },
          { start: 1.01, end: 1.5, percent: -1.5 },
          { start: 1.51, end: 2.0, percent: -2.0 },
          { start: 2.01, end: 2.5, percent: -2.5 },
          { start: 2.51, end: 3.0, percent: -3.0 },
          { start: 3.01, end: 3.5, percent: -3.5 },
          { start: 3.51, end: 4.0, percent: -4.0 },
          { start: 4.01, end: 4.5, percent: -4.5 },
          { start: 4.51, end: 5.0, percent: -5.0 },
          { start: 5.01, end: 100.0, percent: -100.0 },
        ],
      },
      {
        discountCode: 6,
        name: 'Granos Rojos',
        ranges: [
          { start: 0.01, end: 0.5, percent: -0.5 },
          { start: 0.51, end: 1.0, percent: -1.0 },
          { start: 1.01, end: 1.5, percent: -1.5 },
          { start: 1.51, end: 2.0, percent: -2.0 },
          { start: 2.01, end: 2.5, percent: -2.5 },
          { start: 2.51, end: 3.0, percent: -3.0 },
          { start: 3.01, end: 3.5, percent: -3.5 },
          { start: 3.51, end: 4.0, percent: -4.0 },
          { start: 4.01, end: 4.5, percent: -4.5 },
          { start: 4.51, end: 5.0, percent: -5.0 },
          { start: 5.01, end: 100.0, percent: -100.0 },
        ],
      },
      {
        discountCode: 7,
        name: 'Granos Dañados',
        ranges: [
          { start: 0.01, end: 0.5, percent: -0.5 },
          { start: 0.51, end: 1.0, percent: -1.0 },
          { start: 1.01, end: 1.5, percent: -1.5 },
          { start: 1.51, end: 2.0, percent: -2.0 },
          { start: 2.01, end: 2.5, percent: -2.5 },
          { start: 2.51, end: 3.0, percent: -2.0 },
          { start: 3.01, end: 3.5, percent: -2.5 },
          { start: 3.51, end: 4.0, percent: -3.0 },
          { start: 4.01, end: 4.5, percent: -3.5 },
          { start: 4.51, end: 5.0, percent: -4.0 },
          { start: 5.01, end: 100.0, percent: -100.0 },
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

    const roundTo2 = (value: number) => Math.round(value * 100) / 100;

    const randomBetween = (min: number, max: number) =>
      roundTo2(min + Math.random() * (max - min));

    const getDiscountPercentFromRanges = (
      discountCode: number,
      measuredValue: number,
    ) => {
      const config = discountConfigurations.find(
        (item) => item.discountCode === discountCode,
      );

      if (!config) {
        return 0;
      }

      const matchingRange = config.ranges.find(
        (range) => measuredValue >= range.start && measuredValue <= range.end,
      );

      return matchingRange ? Math.abs(matchingRange.percent) : 0;
    };

    const buildCoherentAnalysisForReception = (
      reception: Reception,
      template: Template,
    ): {
      analysisData: Partial<AnalysisRecord>;
      receptionPatch: Partial<Reception>;
    } => {
      const isLowDefectCase = reception.id % 2 === 0;

      const humedadRange = isLowDefectCase
        ? randomBetween(14.7, 15.4)
        : randomBetween(15.5, 17.8);

      const impurezasRange = isLowDefectCase
        ? randomBetween(0.05, 0.5)
        : randomBetween(0.6, 2.3);

      const verdesRange = isLowDefectCase
        ? randomBetween(0.2, 0.6)
        : randomBetween(0.9, 2.1);

      const manchadosRange = isLowDefectCase
        ? randomBetween(0.1, 0.4)
        : randomBetween(0.5, 1.3);

      const yesososRange = isLowDefectCase
        ? randomBetween(0.1, 0.4)
        : randomBetween(0.5, 1.2);

      const peladosRange = isLowDefectCase
        ? randomBetween(0.1, 0.4)
        : randomBetween(0.5, 1.1);

      const vanoRange = isLowDefectCase
        ? randomBetween(0.05, 0.25)
        : randomBetween(0.3, 1.1);

      const hualcachoRange = isLowDefectCase
        ? randomBetween(0.05, 0.25)
        : randomBetween(0.25, 0.9);

      const groupTolerance = roundTo2(template.groupToleranceValue || 5);
      const totalGroupPercent = roundTo2(
        verdesRange +
          manchadosRange +
          yesososRange +
          peladosRange +
          vanoRange +
          hualcachoRange,
      );

      const humedadPercent = getDiscountPercentFromRanges(1, humedadRange);
      const impurezasPercent = getDiscountPercentFromRanges(3, impurezasRange);
      const dryPercent = template.availableDry
        ? roundTo2(Math.max(0, humedadRange - 15))
        : 0;

      const totalDiscountKg = Math.round(
        (reception.netWeight * (humedadPercent + impurezasPercent)) / 100,
      );

      const bonusEnabled = Boolean(
        template.availableBonus && template.toleranceBonus > 0,
      );

      const bonusKg =
        bonusEnabled && totalGroupPercent < groupTolerance
          ? Math.round((reception.netWeight * template.toleranceBonus) / 100)
          : 0;

      const finalNetWeight = Math.round(
        reception.netWeight - totalDiscountKg + bonusKg,
      );

      return {
        analysisData: {
          receptionId: reception.id,
          humedadRange,
          humedadPercent,
          impurezasRange,
          impurezasPercent,
          verdesRange,
          manchadosRange,
          yesososRange,
          peladosRange,
          vanoRange,
          hualcachoRange,
          totalGroupPercent,
          groupTolerance,
          dryPercent,
          notes: `Analisis autogenerado por seed para recepcion ${reception.guideNumber}`,
        },
        receptionPatch: {
          totalDiscountKg,
          bonusKg,
          finalNetWeight,
          dryPercent,
          dryFeeApplied: dryPercent > 0,
          status: ReceptionStatusEnum.ANALYZED,
          notes:
            reception.notes ||
            `Recepcion de prueba con analisis coherente - guia ${reception.guideNumber}`,
        },
      };
    };

    // Procesar cada configuración de descuento
    for (const config of discountConfigurations) {
      console.log(`Creando parámetros de análisis: ${config.name}`);
      
      // Eliminar parámetros existentes para este código de descuento
      await analysisParamsRepository.delete({ discountCode: config.discountCode });
      
      // Crear nuevos parámetros para cada rango
      for (const range of config.ranges) {
        const param = analysisParamsRepository.create({
          discountCode: config.discountCode,
          discountName: config.name,
          unit: '%',
          rangeStart: range.start,
          rangeEnd: range.end,
          discountPercent: Math.abs(range.percent),
        });
        await analysisParamsRepository.save(param);
      }
    }
    console.log('✅ Parámetros de análisis creados')

    // 6. Crear productores de prueba
    const producersRepository = dataSource.getRepository(Producer);
    const producersToCreate = [];
    const producerNames = [
      'Joaquin Andres Bustamante',
      'Camila Fernanda Araya',
      'Felipe Ignacio Cardenas',
      'Daniela Soledad Sepulveda',
      'Rodrigo Esteban Fuentes',
      'Francisca Paz Mardones',
      'Ignacio Matias Valenzuela',
      'Paula Andrea Contreras',
      'Mauricio Daniel Saavedra',
      'Carolina Beatriz Rojas',
    ];

    for (let i = 1; i <= 10; i++) {
      const rut = `12.345.67${String(i).padStart(2, '0')}-${i % 2 === 0 ? 'K' : i}`;
      const producerName = producerNames[i - 1] || `Productor ${i}`;
      const producer = producersRepository.create({
        rut,
        name: producerName,
        address: `Calle Principal ${i * 100}, Parral`,
        city: 'Parral',
        email: `productor${i}@example.com`,
        phone: `9${8000000 + i}`,
        contactPerson: producerName,
        isActive: true,
        bankAccounts: [
          {
            bankCode: 1,
            bankName: 'Banco de Chile',
            accountNumber: `12345678${i}`,
            accountTypeCode: 1,
            accountTypeName: 'Cuenta Corriente',
          },
        ],
      });
      producersToCreate.push(producer);
    }

    await producersRepository.save(producersToCreate);
    console.log('✅ 10 productores de prueba creados');

    // 7. Crear 20 recepciones (distribuidas por temporadas) y garantizar análisis coherente
    const receptionRepository = dataSource.getRepository(Reception);
    const analysisRecordRepository = dataSource.getRepository(AnalysisRecord);
    const riceTypesFromDb = await riceTypesRepository.find();
    const producersFromDb = await producersRepository.find();
    const seasonsFromDb = await seasonsRepository.find();
    const templatesFromDb = await templatesRepository.find();
    const settlementsRepository = dataSource.getRepository(Settlement);

    const activeSeason = seasonsFromDb.find((season) => season.isActive) || seasonsFromDb[0];
    const previousSeason =
      seasonsFromDb.find((season) => !season.isActive) ||
      seasonsFromDb.find((season) => season.id !== activeSeason.id) ||
      activeSeason;

    const defaultTemplateFromDb =
      templatesFromDb.find((template) => template.isDefault) || templatesFromDb[0];

    const getProducerByIndex = (index: number) =>
      producersFromDb[index] || producersFromDb[0];
    const getRiceTypeByIndex = (index: number) =>
      riceTypesFromDb[index % riceTypesFromDb.length] || riceTypesFromDb[0];

    type ReceptionSeedRow = {
      producerIndex: number;
      seasonId: number;
      riceTypeIndex: number;
      grossWeight: number;
      tareWeight: number;
      guideNumber: string;
      licensePlate: string;
      ricePrice: number;
      receptionDate: string;
      notes: string;
    };

    const receptionSeedPlan: ReceptionSeedRow[] = [];

    const activeSeasonDates = [
      '2026-01-04',
      '2026-01-07',
      '2026-01-11',
      '2026-01-16',
      '2026-01-20',
      '2026-01-24',
      '2026-01-29',
      '2026-02-03',
      '2026-02-08',
      '2026-02-12',
      '2026-02-17',
      '2026-02-21',
    ];

    for (let i = 0; i < 12; i++) {
      const riceType = getRiceTypeByIndex(i);
      const grossWeight = Math.round(43200 + i * 780 + (i % 3) * 240);
      const tareWeight = Math.round(14700 + (i % 4) * 180);

      receptionSeedPlan.push({
        producerIndex: i % 6,
        seasonId: activeSeason.id,
        riceTypeIndex: i,
        grossWeight,
        tareWeight,
        guideNumber: `VER26-${String(1001 + i).padStart(4, '0')}`,
        licensePlate: `VA${String(10 + i).padStart(2, '0')}TR`,
        ricePrice: roundTo2((riceType.referencePrice || 600) + (i % 2 === 0 ? 12 : -8)),
        receptionDate: activeSeasonDates[i],
        notes: `Recepcion temporada activa ${activeSeason.code} - lote ${i + 1}`,
      });
    }

    const previousSeasonDates = [
      '2026-04-05',
      '2026-04-09',
      '2026-04-14',
      '2026-04-18',
      '2026-04-23',
      '2026-04-28',
      '2026-05-03',
      '2026-05-08',
    ];

    for (let i = 0; i < 8; i++) {
      const riceType = getRiceTypeByIndex(i + 2);
      const grossWeight = roundTo2(41800 + i * 710 + (i % 2) * 260);
      const tareWeight = roundTo2(14520 + (i % 3) * 210);

      receptionSeedPlan.push({
        producerIndex: i % 4,
        seasonId: previousSeason.id,
        riceTypeIndex: i + 2,
        grossWeight,
        tareWeight,
        guideNumber: `INV26-${String(3001 + i).padStart(4, '0')}`,
        licensePlate: `IV${String(40 + i).padStart(2, '0')}QP`,
        ricePrice: roundTo2((riceType.referencePrice || 560) + (i % 2 === 0 ? 18 : -12)),
        receptionDate: previousSeasonDates[i],
        notes: `Recepcion temporada cerrada ${previousSeason.code} - lote ${i + 1}`,
      });
    }

    let createdReceptionsCount = 0;
    let updatedReceptionsCount = 0;

    for (const receptionSeed of receptionSeedPlan) {
      const producer = getProducerByIndex(receptionSeed.producerIndex);
      const riceType = getRiceTypeByIndex(receptionSeed.riceTypeIndex);

      const grossWeight = roundTo2(receptionSeed.grossWeight);
      const tareWeight = roundTo2(receptionSeed.tareWeight);
      const netWeight = roundTo2(grossWeight - tareWeight);

      const receptionPayload: Partial<Reception> = {
        producerId: producer.id,
        templateId: defaultTemplateFromDb.id,
        riceTypeId: riceType.id,
        seasonId: receptionSeed.seasonId,
        grossWeight,
        tareWeight,
        netWeight,
        guideNumber: receptionSeed.guideNumber,
        licensePlate: receptionSeed.licensePlate,
        ricePrice: receptionSeed.ricePrice,
        status: ReceptionStatusEnum.ANALYZED,
        notes: `${receptionSeed.notes} | fecha_recepcion=${receptionSeed.receptionDate} | productor=${producer.name}`,
      };

      const existingReception = await receptionRepository.findOne({
        where: { guideNumber: receptionSeed.guideNumber },
      });

      if (existingReception) {
        await receptionRepository.update({ id: existingReception.id }, receptionPayload);
        updatedReceptionsCount += 1;
      } else {
        const reception = receptionRepository.create(receptionPayload);
        await receptionRepository.save(reception);
        createdReceptionsCount += 1;
      }
    }

    const allReceptions = await receptionRepository.find();
    const seededGuideSet = new Set(receptionSeedPlan.map((item) => item.guideNumber));
    const seededReceptions = allReceptions.filter((reception) =>
      seededGuideSet.has(reception.guideNumber),
    );
    const previousSeasonSeededReceptions = seededReceptions.filter(
      (reception) => reception.seasonId === previousSeason.id,
    );

    const templatesById = new Map<number, Template>(
      templatesFromDb.map((template) => [template.id, template]),
    );

    let createdAnalysisCount = 0;
    let restoredAnalysisCount = 0;
    let updatedAnalysisCount = 0;
    let patchedReceptionsCount = 0;

    for (const reception of allReceptions) {
      const normalizedNetWeight =
        reception.netWeight ||
        roundTo2(Number(reception.grossWeight) - Number(reception.tareWeight));

      const templateForReception =
        templatesById.get(reception.templateId) || defaultTemplateFromDb;

      const { analysisData, receptionPatch } = buildCoherentAnalysisForReception(
        {
          ...reception,
          netWeight: normalizedNetWeight,
        },
        templateForReception,
      );

      const existingAnalysis = await analysisRecordRepository.findOne({
        where: { receptionId: reception.id },
        withDeleted: true,
      });

      if (!existingAnalysis) {
        const analysisRecord = analysisRecordRepository.create(analysisData);
        await analysisRecordRepository.save(analysisRecord);
        createdAnalysisCount += 1;
      } else {
        if (existingAnalysis.deletedAt) {
          await analysisRecordRepository.restore(existingAnalysis.id);
          restoredAnalysisCount += 1;
        }

        const analysisRecord = analysisRecordRepository.create({
          ...existingAnalysis,
          ...analysisData,
          id: existingAnalysis.id,
          receptionId: reception.id,
        });

        await analysisRecordRepository.save(analysisRecord);
        updatedAnalysisCount += 1;
      }

      await receptionRepository.update(
        { id: reception.id },
        {
          ...receptionPatch,
          netWeight: normalizedNetWeight,
        },
      );
      patchedReceptionsCount += 1;
    }

    const receptionsWithoutAnalysis = await receptionRepository
      .createQueryBuilder('r')
      .leftJoin(
        'analysis_records',
        'a',
        'a.receptionId = r.id AND a.deletedAt IS NULL',
      )
      .where('a.id IS NULL')
      .getCount();

    console.log(
      `✅ ${allReceptions.length} recepciones con análisis coherente (${createdAnalysisCount} creados, ${updatedAnalysisCount} actualizados, ${restoredAnalysisCount} restaurados)`,
    );
    console.log(
      `✅ Recepciones seed: ${createdReceptionsCount} creadas, ${updatedReceptionsCount} actualizadas, ${patchedReceptionsCount} recalculadas (planificadas: ${receptionSeedPlan.length})`,
    );
    console.log(
      `✅ Distribucion por temporada: activa=${seededReceptions.filter((r) => r.seasonId === activeSeason.id).length}, cerrada=${previousSeasonSeededReceptions.length}`,
    );

    if (receptionsWithoutAnalysis > 0) {
      console.warn(
        `⚠️ Quedaron ${receptionsWithoutAnalysis} recepciones sin análisis asociado`,
      );
    } else {
      console.log('✅ Validación OK: todas las recepciones tienen análisis asociado');
    }

    // 8. Crear anticipos realistas para productores (distribuidos en ambas temporadas)
    const advancesRepository = dataSource.getRepository(Advance);
    const transactionsRepository = dataSource.getRepository(Transaction);
    type AdvanceSeedRow = {
      producerIndex: number;
      seasonId: number;
      amount: number;
      issueDate: string;
      interestRate: number;
      description: string;
    };

    const advancesData: AdvanceSeedRow[] = [
      // Temporada cerrada (usada para liquidaciones de prueba)
      {
        producerIndex: 0,
        seasonId: previousSeason.id,
        amount: 720000,
        issueDate: '2026-04-03',
        interestRate: 2.4,
        description: 'Anticipo temporada cerrada - insumos abril',
      },
      {
        producerIndex: 0,
        seasonId: previousSeason.id,
        amount: 480000,
        issueDate: '2026-04-17',
        interestRate: 2.4,
        description: 'Anticipo temporada cerrada - mano de obra',
      },
      {
        producerIndex: 0,
        seasonId: previousSeason.id,
        amount: 350000,
        issueDate: '2026-05-02',
        interestRate: 2.4,
        description: 'Anticipo temporada cerrada - combustible',
      },
      {
        producerIndex: 1,
        seasonId: previousSeason.id,
        amount: 690000,
        issueDate: '2026-04-04',
        interestRate: 2.3,
        description: 'Anticipo temporada cerrada - insumos abril',
      },
      {
        producerIndex: 1,
        seasonId: previousSeason.id,
        amount: 430000,
        issueDate: '2026-04-19',
        interestRate: 2.3,
        description: 'Anticipo temporada cerrada - riego',
      },
      {
        producerIndex: 1,
        seasonId: previousSeason.id,
        amount: 390000,
        issueDate: '2026-05-05',
        interestRate: 2.3,
        description: 'Anticipo temporada cerrada - cosecha parcial',
      },
      {
        producerIndex: 2,
        seasonId: previousSeason.id,
        amount: 880000,
        issueDate: '2026-04-06',
        interestRate: 2.5,
        description: 'Anticipo temporada cerrada - capital operativo',
      },
      {
        producerIndex: 2,
        seasonId: previousSeason.id,
        amount: 520000,
        issueDate: '2026-04-21',
        interestRate: 2.5,
        description: 'Anticipo temporada cerrada - fertilizacion',
      },
      {
        producerIndex: 2,
        seasonId: previousSeason.id,
        amount: 410000,
        issueDate: '2026-05-06',
        interestRate: 2.5,
        description: 'Anticipo temporada cerrada - traslado y logistica',
      },
      {
        producerIndex: 3,
        seasonId: previousSeason.id,
        amount: 760000,
        issueDate: '2026-04-08',
        interestRate: 2.6,
        description: 'Anticipo temporada cerrada - insumos abril',
      },
      {
        producerIndex: 3,
        seasonId: previousSeason.id,
        amount: 470000,
        issueDate: '2026-04-24',
        interestRate: 2.6,
        description: 'Anticipo temporada cerrada - cosecha parcial',
      },
      {
        producerIndex: 3,
        seasonId: previousSeason.id,
        amount: 330000,
        issueDate: '2026-05-07',
        interestRate: 2.6,
        description: 'Anticipo temporada cerrada - cierre de faena',
      },

      // Temporada activa (pendientes para pruebas de flujo en proceso)
      {
        producerIndex: 4,
        seasonId: activeSeason.id,
        amount: 540000,
        issueDate: '2026-01-09',
        interestRate: 2.4,
        description: 'Anticipo temporada activa - preparacion de siembra',
      },
      {
        producerIndex: 4,
        seasonId: activeSeason.id,
        amount: 380000,
        issueDate: '2026-01-27',
        interestRate: 2.4,
        description: 'Anticipo temporada activa - mantencion de maquinaria',
      },
      {
        producerIndex: 5,
        seasonId: activeSeason.id,
        amount: 610000,
        issueDate: '2026-01-10',
        interestRate: 2.5,
        description: 'Anticipo temporada activa - compra de semillas',
      },
      {
        producerIndex: 5,
        seasonId: activeSeason.id,
        amount: 420000,
        issueDate: '2026-01-30',
        interestRate: 2.5,
        description: 'Anticipo temporada activa - combustible y transporte',
      },
      {
        producerIndex: 6,
        seasonId: activeSeason.id,
        amount: 490000,
        issueDate: '2026-01-12',
        interestRate: 2.6,
        description: 'Anticipo temporada activa - labores de terreno',
      },
      {
        producerIndex: 6,
        seasonId: activeSeason.id,
        amount: 360000,
        issueDate: '2026-02-02',
        interestRate: 2.6,
        description: 'Anticipo temporada activa - control de malezas',
      },
      {
        producerIndex: 7,
        seasonId: activeSeason.id,
        amount: 670000,
        issueDate: '2026-01-14',
        interestRate: 2.5,
        description: 'Anticipo temporada activa - costos de operacion',
      },
      {
        producerIndex: 7,
        seasonId: activeSeason.id,
        amount: 410000,
        issueDate: '2026-02-05',
        interestRate: 2.5,
        description: 'Anticipo temporada activa - ajuste de capital de trabajo',
      },
      {
        producerIndex: 8,
        seasonId: activeSeason.id,
        amount: 560000,
        issueDate: '2026-01-16',
        interestRate: 2.7,
        description: 'Anticipo temporada activa - preparacion de cosecha',
      },
      {
        producerIndex: 8,
        seasonId: activeSeason.id,
        amount: 340000,
        issueDate: '2026-02-07',
        interestRate: 2.7,
        description: 'Anticipo temporada activa - gastos operativos febrero',
      },
      {
        producerIndex: 9,
        seasonId: activeSeason.id,
        amount: 630000,
        issueDate: '2026-01-18',
        interestRate: 2.5,
        description: 'Anticipo temporada activa - financiamiento de faena',
      },
      {
        producerIndex: 9,
        seasonId: activeSeason.id,
        amount: 370000,
        issueDate: '2026-02-10',
        interestRate: 2.5,
        description: 'Anticipo temporada activa - continuidad operacional',
      },
    ];

    const savedAdvances: Advance[] = [];

    for (const [index, advanceData] of advancesData.entries()) {
      const producer = getProducerByIndex(advanceData.producerIndex);
      const issueDate = new Date(`${advanceData.issueDate}T00:00:00`);
      const advancePayload: Partial<Advance> = {
        producerId: producer.id,
        seasonId: advanceData.seasonId,
        amount: advanceData.amount,
        issueDate,
        interestRate: advanceData.interestRate,
        interestEndDate: null,
        isInterestCalculationEnabled: true,
        status: AdvanceStatusEnum.PAID,
        description: advanceData.description,
      };

      const advance = advancesRepository.create(advancePayload);
      const savedAdvance = await advancesRepository.save(advance);
      savedAdvances.push(savedAdvance);

      const paymentMethodCycle = [
        PaymentMethodEnum.TRANSFER,
        PaymentMethodEnum.CASH,
        PaymentMethodEnum.CHECK,
      ] as const;
      const paymentMethod = paymentMethodCycle[index % paymentMethodCycle.length];
      const producerBankAccounts = Array.isArray(producer?.bankAccounts)
        ? producer.bankAccounts
        : [];

      const selectedBankAccount =
        paymentMethod === PaymentMethodEnum.TRANSFER
          ? producerBankAccounts[0] ?? null
          : null;

      const selectedBankAccountIndex =
        paymentMethod === PaymentMethodEnum.TRANSFER && producer && selectedBankAccount
          ? producerBankAccounts.findIndex(
              (account) => account.accountNumber === selectedBankAccount.accountNumber,
            )
          : -1;

      const paddedSequence = String(index + 1).padStart(3, '0');
      const seasonCode =
        seasonsFromDb.find((season) => season.id === advanceData.seasonId)?.code ||
        'SEASON';
      const referenceNumber =
        paymentMethod === PaymentMethodEnum.TRANSFER
          ? `TRF-ADV-${seasonCode}-${paddedSequence}`
          : paymentMethod === PaymentMethodEnum.CHECK
            ? `CHK-ADV-${seasonCode}-${paddedSequence}`
            : `CSH-ADV-${seasonCode}-${paddedSequence}`;

      const checkDueDate = new Date(issueDate);
      checkDueDate.setDate(checkDueDate.getDate() + 15);

      const transactionMetadata: Record<string, unknown> = {
        paymentMethod,
        advanceDescription: advanceData.description ?? null,
        bankAccount:
          paymentMethod === PaymentMethodEnum.TRANSFER &&
          selectedBankAccount &&
          selectedBankAccountIndex >= 0
            ? {
                ...selectedBankAccount,
                accountIndex: selectedBankAccountIndex,
              }
            : null,
        checkDetails:
          paymentMethod === PaymentMethodEnum.CHECK
            ? {
                bankName: 'Banco del Estado de Chile',
                issueDate: issueDate.toISOString().slice(0, 10),
                dueDate: checkDueDate.toISOString().slice(0, 10),
                payeeName: producer?.name ?? 'Productor',
                payeeRut: producer?.rut ?? null,
              }
            : null,
      };

      const transaction = transactionsRepository.create({
        producerId: producer.id,
        advanceId: savedAdvance.id,
        type: TransactionTypeEnum.ADVANCE,
        amount: advanceData.amount,
        transactionDate: issueDate,
        userId: admin.id,
        referenceNumber,
        notes: advanceData.description ?? null,
        metadata: transactionMetadata,
      });

      await transactionsRepository.save(transaction);
    }

    console.log(
      `✅ ${advancesData.length} anticipos realistas creados y distribuidos en ambas temporadas con trazabilidad de pago`,
    );

    // 9. Crear liquidaciones completadas solo para temporada cerrada/anterior
    const roundCurrency = (value: number) => Math.round(value);
    const formatDateOnly = (value: Date) => value.toISOString().slice(0, 10);

    const calculateAdvanceInterestAtDate = (
      advance: Advance,
      settlementDate: Date,
    ): number => {
      if (!advance.isInterestCalculationEnabled) {
        return 0;
      }

      const issueDate =
        advance.issueDate instanceof Date
          ? advance.issueDate
          : new Date(advance.issueDate);

      const diffInMs = settlementDate.getTime() - issueDate.getTime();
      const daysActive = Math.max(0, diffInMs / (1000 * 60 * 60 * 24));
      const monthsActive = daysActive / 30;

      return roundCurrency(
        (Number(advance.amount ?? 0) * Number(advance.interestRate ?? 0) * monthsActive) /
          100,
      );
    };

    const settlementPlans = [
      {
        producerIndex: 0,
        settlementDate: '2026-06-20',
        paymentReference: `TRF-LIQ-${previousSeason.code}-001`,
      },
      {
        producerIndex: 1,
        settlementDate: '2026-06-22',
        paymentReference: `TRF-LIQ-${previousSeason.code}-002`,
      },
      {
        producerIndex: 2,
        settlementDate: '2026-06-24',
        paymentReference: `TRF-LIQ-${previousSeason.code}-003`,
      },
      {
        producerIndex: 3,
        settlementDate: '2026-06-26',
        paymentReference: `TRF-LIQ-${previousSeason.code}-004`,
      },
    ];

    let createdSettlementsCount = 0;

    for (const [settlementIndex, plan] of settlementPlans.entries()) {
      const producer = getProducerByIndex(plan.producerIndex);

      const producerReceptions = previousSeasonSeededReceptions
        .filter((reception) => reception.producerId === producer.id)
        .sort((a, b) => a.id - b.id);

      const producerAdvances = savedAdvances
        .filter(
          (advance) =>
            advance.producerId === producer.id &&
            advance.seasonId === previousSeason.id,
        )
        .sort(
          (a, b) =>
            new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime(),
        );

      if (producerReceptions.length === 0 || producerAdvances.length === 0) {
        console.warn(
          `⚠️ Se omite liquidación del productor ${producer.name} por falta de recepciones o anticipos en temporada cerrada`,
        );
        continue;
      }

      const settlementDate = new Date(`${plan.settlementDate}T00:00:00`);
      const receptionIds = producerReceptions.map((reception) => reception.id);
      const advanceIds = producerAdvances.map((advance) => advance.id);

      const totalReceptions = roundCurrency(
        producerReceptions.reduce(
          (sum, reception) =>
            sum + Number(reception.finalNetWeight ?? reception.netWeight ?? 0),
          0,
        ),
      );

      const totalPrice = roundCurrency(
        producerReceptions.reduce(
          (sum, reception) =>
            sum + Number(reception.netWeight ?? 0) * Number(reception.ricePrice ?? 0),
          0,
        ),
      );

      const totalDiscounts = roundCurrency(
        producerReceptions.reduce(
          (sum, reception) => sum + Number(reception.totalDiscountKg ?? 0),
          0,
        ),
      );

      const totalBonuses = roundCurrency(
        producerReceptions.reduce(
          (sum, reception) => sum + Number(reception.bonusKg ?? 0),
          0,
        ),
      );

      const totalAdvances = roundCurrency(
        producerAdvances.reduce(
          (sum, advance) => sum + Number(advance.amount ?? 0),
          0,
        ),
      );

      const totalInterest = roundCurrency(
        producerAdvances.reduce(
          (sum, advance) =>
            sum + calculateAdvanceInterestAtDate(advance, settlementDate),
          0,
        ),
      );

      const ivaRice = roundCurrency(totalPrice * 0.19);

      const dryingNetAmount = roundCurrency(
        producerReceptions.reduce((sum, reception) => {
          const paddySubTotal =
            Number(reception.netWeight ?? 0) * Number(reception.ricePrice ?? 0);
          const dryPercent = Number(reception.dryPercent ?? 0);
          return sum + paddySubTotal * (dryPercent / 100);
        }, 0),
      );

      const dryingVatAmount = roundCurrency(dryingNetAmount * 0.19);
      const dryingTotalAmount = roundCurrency(dryingNetAmount + dryingVatAmount);

      const interestVatAmount = roundCurrency(totalInterest * 0.19);
      const interestTotalAmount = roundCurrency(totalInterest + interestVatAmount);

      const totalServicesWithVat = roundCurrency(
        dryingTotalAmount + interestTotalAmount,
      );

      const ivaServices = roundCurrency(dryingVatAmount + interestVatAmount);

      const amountDue = roundCurrency(
        totalPrice + ivaRice - totalAdvances - totalServicesWithVat,
      );

      const sequence = String(settlementIndex + 1).padStart(3, '0');
      const purchaseInvoiceNumber = `FCOMP-${previousSeason.code}-${sequence}`;
      const dryingInvoiceNumber = `FSEC-${previousSeason.code}-${sequence}`;
      const interestInvoiceNumber = `FINT-${previousSeason.code}-${sequence}`;

      const settlementPayload: Partial<Settlement> = {
        producerId: producer.id,
        seasonId: previousSeason.id,
        status: SettlementStatusEnum.COMPLETED,
        receptionIds,
        advanceIds,
        totalReceptions,
        totalPrice,
        totalDiscounts,
        totalBonuses,
        finalAmount: amountDue,
        totalAdvances,
        totalInterest,
        ivaRice,
        ivaServices,
        amountDue,
        issuedAt: settlementDate,
        userId: admin.id,
        notes: `Liquidacion seed temporada cerrada ${previousSeason.code} - productor ${producer.name}`,
        calculationDetails: {
          summary: {
            totalReceptions: receptionIds.length,
            totalAdvancesCount: advanceIds.length,
            netRiceAmount: totalPrice,
            riceVatAmount: ivaRice,
            totalRiceAmount: totalPrice + ivaRice,
            dryingReferenceAmount: dryingNetAmount,
            totalAdvances,
            estimatedInterest: totalInterest,
            totalServicesWithVat,
            finalBalance: amountDue,
          },
          serviceInvoices: {
            drying: {
              invoiceNumber: dryingInvoiceNumber,
              invoiceDate: plan.settlementDate,
              invoiceNetAmount: dryingNetAmount,
              vatAmount: dryingVatAmount,
              totalAmount: dryingTotalAmount,
            },
            interest: {
              invoiceNumber: interestInvoiceNumber,
              invoiceDate: plan.settlementDate,
              invoiceNetAmount: totalInterest,
              vatAmount: interestVatAmount,
              totalAmount: interestTotalAmount,
            },
          },
          purchaseInvoice: {
            invoiceNumber: purchaseInvoiceNumber,
            invoiceDate: plan.settlementDate,
            netAmount: totalPrice,
            ivaAmount: ivaRice,
            totalAmount: totalPrice + ivaRice,
          },
          paymentDetails: {
            paymentMethod: PaymentMethodEnum.TRANSFER,
            paymentDate: plan.settlementDate,
            referenceNumber: plan.paymentReference,
            bankAccountIndex: 0,
            notes: `Pago liquidacion seed ${previousSeason.code}`,
          },
          backendCalculation: {
            receptionIds,
            advanceIds,
            totalReceptions,
            totalPrice,
            totalAdvances,
            totalInterest,
            ivaRice,
            ivaServices,
            totalServicesWithVat,
            ivaInterestServices: interestVatAmount,
            serviceTotalsSource: 'serviceInvoices',
            finalAmount: amountDue,
            amountDue,
          },
          composition: {
            receptionIds,
            advanceIds,
          },
        },
      };

      const settlement = settlementsRepository.create(settlementPayload);

      const savedSettlement = await settlementsRepository.save(settlement);

      for (const reception of producerReceptions) {
        await receptionRepository.update(
          { id: reception.id },
          {
            settlementId: savedSettlement.id,
            status: ReceptionStatusEnum.SETTLED,
          },
        );
      }

      for (const advance of producerAdvances) {
        await advancesRepository.update(
          { id: advance.id },
          {
            settlementId: savedSettlement.id,
            status: AdvanceStatusEnum.SETTLED,
            interestEndDate: settlementDate,
          },
        );
      }

      const settlementTransaction = transactionsRepository.create({
        producerId: producer.id,
        settlementId: savedSettlement.id,
        type: TransactionTypeEnum.SETTLEMENT,
        amount: amountDue,
        transactionDate: settlementDate,
        userId: admin.id,
        referenceNumber: plan.paymentReference,
        notes: `Pago liquidacion ${savedSettlement.id} temporada ${previousSeason.code}`,
        metadata: {
          paymentMethod: PaymentMethodEnum.TRANSFER,
          paymentDate: formatDateOnly(settlementDate),
          bankAccountIndex: 0,
        },
      });

      await transactionsRepository.save(settlementTransaction);
      createdSettlementsCount += 1;
    }

    console.log(
      `✅ ${createdSettlementsCount} liquidaciones COMPLETED creadas para temporada cerrada ${previousSeason.code}`,
    );

    console.log('\n✅ SEED COMPLETADO EXITOSAMENTE\n');
    console.log('Usuarios de prueba:');
    console.log('  - Email: admin@ayg.cl, Password: 098098, Role: ADMIN');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
}

seed();
