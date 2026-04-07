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
  TransactionTypeEnum,
} from '../../../shared/enums';

dotenv.config();

const isDatabaseSslRequired = process.env.DATABASE_SSL_MODE?.toUpperCase() === 'REQUIRED';
const isDatabaseSslEnabled = isDatabaseSslRequired || process.env.DATABASE_SSL === 'true';
const sslRejectUnauthorized = process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false';
const sslCa = process.env.DATABASE_SSL_CA?.replace(/\\n/g, '\n');

const databaseSslConfig = isDatabaseSslEnabled
  ? {
      ssl: sslCa
        ? { rejectUnauthorized: sslRejectUnauthorized, ca: sslCa }
        : { rejectUnauthorized: sslRejectUnauthorized },
    }
  : {};

const roundTo2 = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;
const randomBetween = (min: number, max: number): number =>
  roundTo2(Math.random() * (max - min) + min);

/**
 * Genera una fecha aleatoria dentro de un rango
 */
const randomDateInRange = (startDate: Date, endDate: Date): Date => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const randomTimestamp = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTimestamp);
};

/**
 * Genera updatedAt como una fecha posterior a createdAt (máximo 7 días después)
 */
const generateUpdatedAt = (createdAt: Date): Date => {
  const daysLater = Math.floor(Math.random() * 7); // 0-6 días después
  const updated = new Date(createdAt);
  updated.setDate(updated.getDate() + daysLater);
  return updated;
};

async function seedExpanded() {
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

    const usersRepository = dataSource.getRepository(User);
    const producersRepository = dataSource.getRepository(Producer);
    const riceTypesRepository = dataSource.getRepository(RiceType);
    const seasonsRepository = dataSource.getRepository(Season);
    const templatesRepository = dataSource.getRepository(Template);
    const receptionRepository = dataSource.getRepository(Reception);
    const analysisRecordRepository = dataSource.getRepository(AnalysisRecord);
    const advanceRepository = dataSource.getRepository(Advance);
    const transactionRepository = dataSource.getRepository(Transaction);
    const settlementRepository = dataSource.getRepository(Settlement);
    const settlementSnapshotRepository = dataSource.getRepository(SettlementReceptionSnapshot);

    // 1. USUARIO ADMIN
    const admin = usersRepository.create({
      email: 'admin@ayg.cl',
      password: await bcrypt.hash('098098', 10),
      name: 'Administrador',
      role: RoleEnum.ADMIN,
      isActive: true,
    });
    await usersRepository.save(admin);
    console.log('✅ Admin creado');

    // 2. TIPOS DE ARROZ
    const riceTypes = [
      { code: 'DIAMANTE', name: 'Diamante', referencePrice: 600, isActive: true },
      { code: 'ZAFIRO', name: 'Zafiro', referencePrice: 550, isActive: true },
      { code: 'BR', name: 'Brillante', referencePrice: 200, isActive: true },
    ];
    const savedRiceTypes = await riceTypesRepository.save(
      riceTypes.map(rt => riceTypesRepository.create(rt)),
    );
    console.log('✅ Tipos de arroz creados');

    // 3. TEMPORADAS (4: 2 x 2024 + 2 x 2025)
    const seasons = [
      {
        code: 'SUMMER2024',
        name: 'Verano 2024',
        year: 2024,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-03-31'),
        isActive: false,
      },
      {
        code: 'WINTER2024',
        name: 'Invierno 2024',
        year: 2024,
        startDate: new Date('2024-04-01'),
        endDate: new Date('2024-06-30'),
        isActive: false,
      },
      {
        code: 'SUMMER2025',
        name: 'Verano 2025',
        year: 2025,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-03-31'),
        isActive: false,
      },
      {
        code: 'WINTER2025',
        name: 'Invierno 2025',
        year: 2025,
        startDate: new Date('2025-04-01'),
        endDate: new Date('2025-06-30'),
        isActive: false,
      },
    ];
    const savedSeasons = await seasonsRepository.save(
      seasons.map(s => seasonsRepository.create(s)),
    );
    console.log('✅ Temporadas creadas');

    // 4. TEMPLATE POR DEFECTO
    const defaultTemplate = templatesRepository.create({
      name: 'defaultTemplate',
      isDefault: true,
      useToleranceGroup: true,
      groupToleranceValue: 4.0,
      groupToleranceName: 'Análisis de Granos',
      availableHumedad: true,
      availableGranosVerdes: true,
      availableImpurezas: true,
      availableDry: false,
      availableBonus: false,
    });
    await templatesRepository.save(defaultTemplate);
    console.log('✅ Template creado');

    // 5. PRODUCTORES (5)
    const producerNames = [
      'Agrícola San Pedro LTDA',
      'Sociedad Agrícola Los Robles',
      'Empresa Agraria El Retiro',
      'Producción Arrocera Central',
      'Agroindustrial Maule SpA',
    ];
    const producers = await producersRepository.save(
      producerNames.map((name, i) =>
        producersRepository.create({
          rut: `${String(10000000 + i).padStart(8, '0')}-${i % 2 === 0 ? 'K' : i}`,
          name,
          address: `Camino a Historia ${(i + 1) * 500}`,
          city: 'Parral',
          email: `${name.toLowerCase().replace(/\s+/g, '')}.parral@example.com`,
          phone: `9${8000000 + i}`,
          contactPerson: name,
          isActive: true,
          bankAccounts: [
            {
              bankCode: 1,
              bankName: 'Banco de Chile',
              accountNumber: `${String(12000000 + i).padStart(8, '0')}`,
              accountTypeCode: 1,
              accountTypeName: 'Cuenta Corriente',
            },
          ],
        }),
      ),
    );
    console.log(`✅ ${producers.length} productores creados`);

    // 6. ESTRUCTURA POR PRODUCTOR POR TEMPORADA:
    //    - 3 Recepciones
    //    - 2 Anticipos
    //    - 1 Liquidación que agrupa las 3 recepciones + 2 anticipos

    console.log('🔄 Creando recepciones, anticipos y liquidaciones...');

    for (const producer of producers) {
      for (const season of savedSeasons) {
        // --- RECEPCIONES (3 por temporada) ---
        const receptionsData = [];
        for (let r = 0; r < 3; r++) {
          const riceType = savedRiceTypes[r % savedRiceTypes.length];
          const receptionDate = new Date(season.startDate);
          receptionDate.setDate(receptionDate.getDate() + r * 10);

          // 🔄 Fechas dentro del rango de la temporada
          const createdAt = randomDateInRange(season.startDate, season.endDate);
          const updatedAt = generateUpdatedAt(createdAt);

          const grossWeight = roundTo2(35000 + Math.random() * 15000);
          const tareWeight = roundTo2(13000 + Math.random() * 2000);
          const netWeight = roundTo2(grossWeight - tareWeight);

          const reception = receptionRepository.create({
            producerId: producer.id,
            templateId: defaultTemplate.id,
            seasonId: season.id,
            riceTypeId: riceType.id,
            grossWeight,
            tareWeight,
            netWeight,
            guideNumber: `${season.code}-P${producer.id}-R${r + 1}`,
            licensePlate: `P${producer.id}R${r}`,
            ricePrice: roundTo2((riceType.referencePrice || 600) + (Math.random() - 0.5) * 40),
            receptionDate,
            status: ReceptionStatusEnum.ANALYZED,
            createdAt,
            updatedAt,
            dryFeeApplied: false,
            notes: `Recepción ${r + 1} de ${producer.name} - ${season.code}`,
          });
          receptionsData.push(reception);
        }

        const savedReceptions = await receptionRepository.save(receptionsData);

        // --- ANÁLISIS PARA RECEPCIONES ---
        for (const reception of savedReceptions) {
          // Generar valores con redondeo preciso
          const humedadRange = randomBetween(14.5, 17.5);
          const humedadPercent = roundTo2(humedadRange > 15 ? (humedadRange - 15) * 0.5 : 0);
          
          const impurezasRange = randomBetween(0.1, 2.0);
          const impurezasPercent = roundTo2(Math.min(impurezasRange * 0.5, 5));
          
          const verdesValue = randomBetween(0.3, 2.5);
          const verdesPercent = roundTo2(randomBetween(0.1, 1));
          
          const manchadosValue = randomBetween(0.1, 1);
          const manchadosPercent = roundTo2(manchadosValue * 0.5);
          
          const yesososValue = randomBetween(0.05, 0.8);
          const yesososPercent = roundTo2(yesososValue * 0.3);
          
          const peladosValue = randomBetween(0.05, 0.6);
          const peladosPercent = roundTo2(peladosValue * 0.3);
          
          const vanoValue = randomBetween(0.02, 0.5);
          const vanoPercent = roundTo2(vanoValue * 0.2);
          
          const hualcachoValue = randomBetween(0.02, 0.4);
          const hualcachoPercent = roundTo2(hualcachoValue * 0.15);

          // Total de porcentajes en grupo de tolerancia
          const totalGroupPercent = roundTo2(
            humedadPercent + impurezasPercent + verdesPercent + manchadosPercent +
            yesososPercent + peladosPercent + vanoPercent + hualcachoPercent
          );

          // Aplicar tolerancia grupal
          const groupTolerance = 4.0;

          const analysis = analysisRecordRepository.create({
            receptionId: reception.id,
            humedadRange,
            humedadPercent,
            humedadValue: humedadRange,
            humedadTolerance: 0.5,
            impurezasRange,
            impurezasPercent,
            impurezasValue: impurezasRange,
            impurezasTolerance: 1.0,
            verdesRange: verdesValue,
            verdesValue,
            verdesPercent,
            verdesTolerance: 1.0,
            manchadosValue,
            manchadosPercent,
            manchadosTolerance: 0.5,
            yesososValue,
            yesososPercent,
            yesososTolerance: 0.5,
            peladosValue,
            peladosPercent,
            peladosTolerance: 0.5,
            vanoValue,
            vanoPercent,
            vanoTolerance: 0.2,
            hualcachoValue,
            hualcachoPercent,
            hualcachoTolerance: 0.2,
            totalGroupPercent,
            groupTolerance,
            bonusEnabled: false,
            useToleranceGroup: true,
          });
          await analysisRecordRepository.save(analysis);
        }

        // --- ANTICIPOS (2 por temporada) ---
        const advancesData = [];
        for (let a = 0; a < 2; a++) {
          const issueDate = new Date(season.startDate);
          issueDate.setDate(issueDate.getDate() + a * 15);
          const interestEndDate = new Date(issueDate);
          interestEndDate.setMonth(interestEndDate.getMonth() + 2);

          // 🔄 Fechas dentro del rango de la temporada
          const createdAt = randomDateInRange(season.startDate, season.endDate);
          const updatedAt = generateUpdatedAt(createdAt);

          // 💳 Detalles de cheque para el anticipo
          const checkIssueDate = new Date(issueDate);
          const checkDueDate = new Date(issueDate);
          checkDueDate.setDate(checkDueDate.getDate() + 15 + Math.floor(Math.random() * 15)); // 15-30 días después
          const checkBanks = ['Banco de Chile', 'Banco del Estado', 'ScotiaBank'];
          const checkBankName = checkBanks[Math.floor(Math.random() * checkBanks.length)];
          const checkNumber = `CHK${String(1000000 + Math.floor(Math.random() * 9000000)).slice(0, 7)}`;

          const advance = advanceRepository.create({
            producerId: producer.id,
            seasonId: season.id,
            issueDate,
            interestEndDate,
            amount: roundTo2(800000 + Math.random() * 600000),
            interestRate: roundTo2(2 + Math.random() * 3),
            status: AdvanceStatusEnum.PAID,
            isInterestCalculationEnabled: true,
            description: `Anticipo ${a + 1} de ${producer.name} - ${season.code}`,
            isActive: true,
            createdAt,
            updatedAt,
          });
          advancesData.push(advance);

          // Guardar datos de cheque para usarlos en la transacción después
          advance['checkDetails'] = {
            bankName: checkBankName,
            issueDate: checkIssueDate,
            dueDate: checkDueDate,
            payeeName: producer.name,
            payeeRut: producer.rut,
            referenceNumber: checkNumber,
          };
        }

        const savedAdvances = await advanceRepository.save(advancesData);

        // --- TRANSACCIONES DE ANTICIPOS ---
        for (let idx = 0; idx < savedAdvances.length; idx++) {
          const advance = savedAdvances[idx];
          const advanceWithCheckDetails = advancesData[idx] as any;
          const checkDetails = advanceWithCheckDetails.checkDetails || {};

          // 🔄 Fecha de transacción dentro de la temporada, después de issueDate
          const txCreatedAt = new Date(advance.issueDate);
          txCreatedAt.setDate(txCreatedAt.getDate() + Math.floor(Math.random() * 3)); // 0-2 días después
          const txUpdatedAt = generateUpdatedAt(txCreatedAt);

          // 💳 Metadata con detalles de cheque
          const transactionMetadata = {
            paymentMethod: 'check',
            advanceDescription: advance.description,
            checkDetails: {
              bankName: checkDetails.bankName || 'Banco de Chile',
              issueDate: checkDetails.issueDate?.toISOString()?.split('T')[0] || new Date().toISOString().split('T')[0],
              dueDate: checkDetails.dueDate?.toISOString()?.split('T')[0] || new Date().toISOString().split('T')[0],
              payeeName: checkDetails.payeeName || 'Productor',
              payeeRut: checkDetails.payeeRut || '00-0',
            },
          };

          const transaction = transactionRepository.create({
            producerId: producer.id,
            advanceId: advance.id,
            amount: advance.amount,
            type: TransactionTypeEnum.ADVANCE,
            transactionDate: new Date(advance.issueDate),
            referenceNumber: checkDetails.referenceNumber || `CHK${advance.id}`,
            notes: `Pago de anticipo por cheque`,
            metadata: transactionMetadata,
            createdAt: txCreatedAt,
            updatedAt: txUpdatedAt,
          });
          await transactionRepository.save(transaction);
        }

        // --- LIQUIDACIÓN (1 por temporada, agrupa 3 recepciones + 2 anticipos) ---
        const receptionIds = savedReceptions.map(r => r.id);
        const advanceIds = savedAdvances.map(a => a.id);

        // 🔄 Fechas de liquidación: después de las recepciones y anticipos (end of season)
        const settlementCreatedAt = new Date(season.endDate);
        settlementCreatedAt.setDate(settlementCreatedAt.getDate() - Math.floor(Math.random() * 7)); // 0-7 días antes del fin
        const settlementUpdatedAt = generateUpdatedAt(settlementCreatedAt);

        // Calcular totales con redondeo preciso
        let totalReceptionPrice = 0;
        for (const reception of savedReceptions) {
          const recPrice = roundTo2((reception.netWeight || 0) * (reception.ricePrice || 600));
          totalReceptionPrice = roundTo2(totalReceptionPrice + recPrice);
        }

        let totalAdvanceAmount = 0;
        let totalAdvanceInterest = 0;
        for (const advance of savedAdvances) {
          totalAdvanceAmount = roundTo2(totalAdvanceAmount + advance.amount);
          const interest = roundTo2((advance.amount * advance.interestRate) / 100);
          totalAdvanceInterest = roundTo2(totalAdvanceInterest + interest);
        }

        const settlementSubtotal = roundTo2(totalReceptionPrice);
        const settlementIva = roundTo2(settlementSubtotal * 0.19);
        const settlementTotal = roundTo2(settlementSubtotal + settlementIva);

        const settlement = settlementRepository.create({
          producerId: producer.id,
          seasonId: season.id,
          status: SettlementStatusEnum.COMPLETED,
          receptionIds,
          advanceIds,
          totalReceptions: receptionIds.length,
          totalPrice: settlementSubtotal,
          totalDiscounts: 0,
          totalBonuses: 0,
          finalAmount: settlementSubtotal,
          totalAdvances: totalAdvanceAmount,
          totalInterest: totalAdvanceInterest,
          ivaRice: settlementIva,
          ivaServices: 0,
          amountDue: roundTo2(settlementTotal - totalAdvanceAmount),
          issuedAt: settlementCreatedAt,
          settledAt: settlementUpdatedAt,
          notes: `Liquidación de ${producer.name} - ${season.code}`,
          createdAt: settlementCreatedAt,
          updatedAt: settlementUpdatedAt,
        });
        const savedSettlement = await settlementRepository.save(settlement);

        // --- SETTLEMENT SNAPSHOTS (Recepciones) ---
        for (let i = 0; i < savedReceptions.length; i++) {
          const reception = savedReceptions[i];
          const recSubTotal = roundTo2((reception.netWeight || 0) * (reception.ricePrice || 600));
          const recVat = roundTo2(recSubTotal * 0.19);

          // 🔄 Snapshots con misma fecha de creación que la liquidación
          const snapshotCreatedAt = settlementCreatedAt;
          const snapshotUpdatedAt = settlementUpdatedAt;

          const snapshot = settlementSnapshotRepository.create({
            settlementId: savedSettlement.id,
            receptionId: reception.id,
            lineOrder: i + 1,
            receptionDate: reception.receptionDate,
            guideNumber: reception.guideNumber,
            riceTypeName: savedRiceTypes.find(rt => rt.id === reception.riceTypeId)?.name || 'Unknown',
            paddyKg: reception.netWeight || 0,
            ricePrice: reception.ricePrice || 600,
            paddySubTotal: recSubTotal,
            paddyVat: recVat,
            paddyTotal: roundTo2(recSubTotal + recVat),
            dryPercent: 0,
            dryingSubTotal: 0,
            dryingVat: 0,
            dryingTotal: 0,
            createdAt: snapshotCreatedAt,
            updatedAt: snapshotUpdatedAt,
          });
          await settlementSnapshotRepository.save(snapshot);
        }

        // --- ACTUALIZAR ESTADOS DESPUÉS DE LIQUIDACIÓN ---
        // Recepciones → SETTLED (con updatedAt en fecha de liquidación)
        for (const reception of savedReceptions) {
          reception.status = ReceptionStatusEnum.SETTLED;
          reception.updatedAt = settlementUpdatedAt;
        }
        await receptionRepository.save(savedReceptions);

        // Anticipos → SETTLED (con updatedAt en fecha de liquidación)
        for (const advance of savedAdvances) {
          advance.status = AdvanceStatusEnum.SETTLED;
          advance.updatedAt = settlementUpdatedAt;
        }
        await advanceRepository.save(savedAdvances);
      }
    }

    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ SEED EXPANDIDO COMPLETADO CON LÓGICA CORRECTA');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 Estadísticas finales:');
    const totalProducers = await producersRepository.count();
    const totalSeasons = await seasonsRepository.count();
    const totalReceptions = await receptionRepository.count();
    const totalAdvances = await advanceRepository.count();
    const totalSettlements = await settlementRepository.count();
    const totalTransactions = await transactionRepository.count();

    console.log(`   • Productores: ${totalProducers}`);
    console.log(`   • Temporadas: ${totalSeasons}`);
    console.log(`   • Recepciones: ${totalReceptions} (${totalProducers * totalSeasons * 3})`);
    console.log(`   • Anticipos: ${totalAdvances} (${totalProducers * totalSeasons * 2})`);
    console.log(`   • Liquidaciones: ${totalSettlements} (${totalProducers * totalSeasons})`);
    console.log(`   • Transacciones: ${totalTransactions}`);
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ Estructura correcta:');
    console.log('   • Cada recepción PERTENECE a una temporada');
    console.log('   • Cada anticipo PERTENECE a una temporada');
    console.log('   • Cada liquidación agrupa sus recepciones + anticipos');
    console.log('   • Estados correctos después de liquidación:');
    console.log('     - Recepciones: SETTLED');
    console.log('     - Anticipos: SETTLED');
    console.log('     - Settlement: COMPLETED');
    console.log('═══════════════════════════════════════════════════════════');

    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Error durante seed:', error);
    process.exit(1);
  }
}

seedExpanded();
