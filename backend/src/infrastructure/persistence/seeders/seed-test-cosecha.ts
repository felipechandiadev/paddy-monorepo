#!/usr/bin/env ts-node

/**
 * SEED COSECHA - Test Seeder
 * 
 * Genera datos de prueba siguiendo EXACTAMENTE las especificaciones de SEED_COSECHA_GUIDE.md:
 * - 2 usuarios (admin + consultor)
 * - 3 temporadas (2024, 2025, 2026)
 * - 4 tipos de arroz
 * - 1 template
 * - 5 productores
 * - 30 recepciones (10 por temporada)
 * - 30 anticipos (10 por temporada)
 * - 9 liquidaciones (5 en 2024, 4 en 2025, 0 en 2026)
 * 
 * FECHAS:
 * - COSECHA 2024: 01-01-2024 a 31-12-2024
 * - COSECHA 2025: 01-01-2025 a 31-12-2025
 * - COSECHA 2026: 01-01-2026 a 31-12-2026 (ACTIVA)
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import 'tsconfig-paths/register';

// Cargar .env
dotenv.config();

// Import entities
import { User } from '../../../modules/users/domain/user.entity';
import { UserPermissionOverride } from '../../../modules/users/domain/user-permission-override.entity';
import { RiceType, Season, Template } from '../../../modules/configuration/domain/configuration.entity';
import { Producer } from '../../../modules/producers/domain/producer.entity';
import { Reception, AnalysisRecord } from '../../../modules/operations/domain/operations.entity';
import { Advance, Settlement, SettlementReceptionSnapshot, Transaction } from '../../../modules/finances/domain/finances.entity';
import { RoleEnum, TransactionTypeEnum, ReceptionStatusEnum, AdvanceStatusEnum, SettlementStatusEnum, PermissionOverrideEffectEnum } from '../../../shared/enums';

// Database configuration
const getDataSource = (): DataSource => {
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

  return new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '3306'),
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || 'redbull90',
    database: process.env.DATABASE_NAME || 'paddy',
    ...databaseSslConfig,
    entities: [
      User,
      RiceType,
      Season,
      Template,
      Producer,
      Reception,
      AnalysisRecord,
      Advance,
      Settlement,
      SettlementReceptionSnapshot,
      Transaction,
      UserPermissionOverride,
    ],
    synchronize: false,
    logging: false,
  });
};

class SeedTestCosecha {
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async run(): Promise<void> {
    console.log('\n🌾 Iniciando SEED COSECHA...\n');

    try {
      // Fase 1: Usuarios
      console.log('📝 Fase 1: Creando usuarios...');
      const adminUser = await this.createAdmin();
      const consultorUser = await this.createConsultor();
      console.log('✅ 2 usuarios creados\n');

      // Fase 2: Temporadas
      console.log('📅 Fase 2: Creando temporadas...');
      const seasons = await this.createSeasons();
      console.log(`✅ ${seasons.length} temporadas creadas\n`);

      // Fase 3: Tipos de Arroz
      console.log('🌾 Fase 3: Creando tipos de arroz...');
      const riceTypes = await this.createRiceTypes();
      console.log(`✅ ${riceTypes.length} tipos de arroz creados\n`);

      // Fase 4: Template de Análisis
      console.log('📋 Fase 4: Creando template...');
      const template = await this.createTemplate();
      console.log('✅ 1 template creado\n');

      // Fase 5: Productores
      console.log('👥 Fase 5: Creando productores...');
      const producers = await this.createProducers();
      console.log(`✅ ${producers.length} productores creados\n`);

      // Fase 6: Recepciones y Análisis
      console.log('📦 Fase 6: Creando recepciones (30 total)...');
      const receptions = await this.createReceptions(producers, seasons, riceTypes, template);
      console.log(`✅ ${receptions.length} recepciones creadas\n`);

      // Fase 7: Anticipos y Transacciones
      console.log('💰 Fase 7: Creando anticipos (30 total)...');
      const advances = await this.createAdvances(producers, seasons);
      console.log(`✅ ${advances.length} anticipos creados\n`);

      // Fase 8: Liquidaciones
      console.log('📊 Fase 8: Creando liquidaciones (9 total)...');
      const settlements = await this.createSettlements(producers, seasons, receptions, advances);
      console.log(`✅ ${settlements.length} liquidaciones creadas\n`);

      // Resumen
      console.log('\n📊 ESTADÍSTICAS FINALES:');
      console.log(`   • Usuarios: 2`);
      console.log(`   • Temporadas: ${seasons.length}`);
      console.log(`   • Tipos de Arroz: ${riceTypes.length}`);
      console.log(`   • Templates: 1`);
      console.log(`   • Productores: ${producers.length}`);
      console.log(`   • Recepciones: ${receptions.length}`);
      console.log(`   • Análisis: ${receptions.length}`);
      console.log(`   • Anticipos: ${advances.length}`);
      console.log(`   • Liquidaciones: ${settlements.length}`);
      console.log('\n✅ SEED COSECHA completado exitosamente!\n');

      console.log('🔐 Credenciales de prueba:');
      console.log(`   Admin: admin@ayg.cl / 098098`);
      console.log(`   Consultor: consultor@ayg.cl / 098098\n`);

    } catch (error) {
      console.error('❌ Error en SEED COSECHA:', error);
      throw error;
    }
  }

  private async createAdmin(): Promise<User> {
    const user = this.dataSource.manager.create(User, {
      email: 'admin@ayg.cl',
      username: 'admin',
      name: 'Admin User',
      password: 'bcrypt_hashed_098098', // Placeholder, será actualizado
      role: RoleEnum.ADMIN,
      isActive: true,
    });
    const saved = await this.dataSource.manager.save(user);

    // Crear permisos override
    const permissions = [
      'users.view', 'users.create', 'users.update', 'users.delete', 'users.manage_permissions',
      'producers.view', 'producers.create', 'producers.update', 'producers.delete',
      'rice_types.view', 'rice_types.create', 'rice_types.update', 'rice_types.delete',
      'seasons.view', 'seasons.create', 'seasons.update', 'seasons.delete',
      'templates.view', 'templates.create', 'templates.update', 'templates.delete',
      'analysis_params.view', 'analysis_params.create', 'analysis_params.update', 'analysis_params.delete',
      'receptions.view', 'receptions.create', 'receptions.update', 'receptions.cancel',
      'analysis_records.view', 'analysis_records.create', 'analysis_records.update',
      'advances.view', 'advances.create', 'advances.update', 'advances.cancel', 'advances.change_interest',
      'transactions.view',
      'settlements.view', 'settlements.create', 'settlements.save', 'settlements.complete', 'settlements.cancel',
      'settlement_services.view', 'settlement_services.create', 'settlement_services.update', 'settlement_services.delete',
      'analytics.view',
    ];

    for (const permission of permissions) {
      const override = this.dataSource.manager.create(UserPermissionOverride, {
        userId: saved.id,
        permissionKey: permission,
        effect: PermissionOverrideEffectEnum.GRANT,
      });
      await this.dataSource.manager.save(override);
    }

    return saved;
  }

  private async createConsultor(): Promise<User> {
    const user = this.dataSource.manager.create(User, {
      email: 'consultor@ayg.cl',
      username: 'consultor',
      name: 'Consultor User',
      password: 'bcrypt_hashed_098098', // Placeholder
      role: RoleEnum.CONSULTANT,
      isActive: true,
    });
    const saved = await this.dataSource.manager.save(user);

    // NO crear overrides: el usuario CONSULTANT usará los permisos por defecto
    // definidos en DEFAULT_ROLE_PERMISSIONS[RoleEnum.CONSULTANT]
    // Los overrides pueden conflictuar con los defaults

    return saved;
  }

  private async createSeasons(): Promise<Season[]> {
    const seasons = [
      {
        code: 'COSECHA_2024',
        name: 'Cosecha 2024',
        year: 2024,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        isActive: false,
      },
      {
        code: 'COSECHA_2025',
        name: 'Cosecha 2025',
        year: 2025,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        isActive: false,
      },
      {
        code: 'COSECHA_2026',
        name: 'Cosecha 2026',
        year: 2026,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
        isActive: true,
      },
    ];

    const savedSeasons: Season[] = [];
    for (const seasonData of seasons) {
      const season = this.dataSource.manager.create(Season, seasonData);
      const saved = await this.dataSource.manager.save(season);
      savedSeasons.push(saved);
    }
    return savedSeasons;
  }

  private async createRiceTypes(): Promise<RiceType[]> {
    const riceTypes = [
      { code: 'DIAMANTE', name: 'Diamante', referencePrice: 600, isActive: false },
      { code: 'ZAFIRO', name: 'Zafiro', referencePrice: 550, isActive: true },
      { code: 'BR', name: 'Brillante', referencePrice: 200, isActive: true },
      { code: 'HR', name: 'Harper', referencePrice: 200, isActive: false },
    ];

    const savedTypes: RiceType[] = [];
    for (const typeData of riceTypes) {
      const type = this.dataSource.manager.create(RiceType, typeData);
      const saved = await this.dataSource.manager.save(type);
      savedTypes.push(saved);
    }
    return savedTypes;
  }

  private async createTemplate(): Promise<Template> {
    const template = this.dataSource.manager.create(Template, {
      name: 'COSECHA 2026',
      isDefault: true,
      useToleranceGroup: true,
      groupToleranceName: 'Analisis de Granos',
      groupToleranceValue: 4.0,
    });
    return await this.dataSource.manager.save(template);
  }

  private async createProducers(): Promise<Producer[]> {
    const producers = [
      {
        name: 'Agrícola San Pedro LTDA',
        rut: '78956452-1',
        city: 'Parral',
        bankAccountName: 'Cuenta Corriente',
        bankAccountType: 'CC',
        bankAccountNumber: '987654321',
        bankName: 'Banco del Estado de Chile',
        email: 'contacto@sanpedro.cl',
        phone: '+56912345678',
        isActive: true,
      },
      {
        name: 'Sociedad Agrícola Los Robles',
        rut: '65432198-9',
        city: 'Parral',
        bankAccountName: 'Cuenta de Ahorros',
        bankAccountType: 'CA',
        bankAccountNumber: '876543210',
        bankName: 'Banco Santander',
        email: 'info@losrobles.cl',
        phone: '+56987654321',
        isActive: true,
      },
      {
        name: 'Empresa Agraria El Retiro',
        rut: '54321098-7',
        city: 'Parral',
        bankAccountName: 'Cuenta Corriente',
        bankAccountType: 'CC',
        bankAccountNumber: '765432109',
        bankName: 'Banco BCI',
        email: 'ventas@elretiro.cl',
        phone: '+56912987654',
        isActive: true,
      },
      {
        name: 'Producción Arrocera Central',
        rut: '43210987-5',
        city: 'Parral',
        bankAccountName: 'Cuenta de Ahorros',
        bankAccountType: 'CA',
        bankAccountNumber: '654321098',
        bankName: 'Banco BTG Pactual',
        email: 'central@arrozera.cl',
        phone: '+56919876543',
        isActive: true,
      },
      {
        name: 'Agroindustrial Maule SpA',
        rut: '32109876-3',
        city: 'Parral',
        bankAccountName: 'Cuenta Corriente',
        bankAccountType: 'CC',
        bankAccountNumber: '543210987',
        bankName: 'Itaú',
        email: 'operaciones@maule.cl',
        phone: '+56921234567',
        isActive: true,
      },
    ];

    const savedProducers: Producer[] = [];
    for (const producerData of producers) {
      const producer = this.dataSource.manager.create(Producer, producerData);
      const saved = await this.dataSource.manager.save(producer);
      savedProducers.push(saved);
    }
    return savedProducers;
  }

  private async createReceptions(
    producers: Producer[],
    seasons: Season[],
    riceTypes: RiceType[],
    template: Template,
  ): Promise<Reception[]> {
    const receptions: Reception[] = [];

    // 30 recepciones total: 10 por temporada (2 por productor)
    for (const season of seasons) {
      const daysInRange = Math.floor(
        (season.endDate.getTime() - season.startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const daySpacing = Math.floor(daysInRange / 10);

      for (let i = 0; i < 10; i++) {
        const producerIndex = i % producers.length;
        const producer = producers[producerIndex];
        const riceTypeIndex = i % riceTypes.length;
        const riceType = riceTypes[riceTypeIndex];

        const receptionDate = new Date(season.startDate);
        receptionDate.setDate(receptionDate.getDate() + daySpacing * i);

        const grossWeight = 2000 + Math.random() * 500;
        const netWeight = grossWeight * 0.95;
        const ricePrice = riceType.referencePrice + (Math.random() * 50 - 25);

        const reception = this.dataSource.manager.create(Reception, {
          producerId: producer.id,
          seasonId: season.id,
          riceTypeId: riceType.id,
          templateId: template.id,
          guideNumber: `GUIDE-${season.code}-${producer.id}-${i}`,
          licensePlate: `PATENTE${String(i).padStart(3, '0')}`,
          grossWeight: Math.round(grossWeight),
          tareWeight: Math.round(grossWeight - netWeight),
          netWeight: Math.round(netWeight),
          ricePrice: Math.round(ricePrice),
          receptionDate,
          status: ReceptionStatusEnum.ANALYZED,
          notes: `Recepción de ${producer.name} en ${season.name}`,
          createdAt: receptionDate,
          updatedAt: receptionDate,
        });

        const saved = await this.dataSource.manager.save(reception);
        receptions.push(saved);

        // Crear AnalysisRecord asociado
        // Una recepción por productor y temporada tendrá secado (dryPercent)
        const hasDrying = i === 0; // Primera recepción de cada productor
        const dryPercentValue = hasDrying ? 3.5 : null; // 3.5% de secado si aplica

        const analysisRecord = this.dataSource.manager.create(AnalysisRecord, {
          receptionId: saved.id,
          templateId: template.id,
          useToleranceGroup: true,
          groupToleranceName: 'Analisis de Granos',
          groupToleranceValue: 4.0,
          humedadValue: 15.5,
          humedadTolerance: 4.0,
          humedadTolVisible: true,
          verdesValue: 1.2,
          verdesTolerance: 0.0,
          verdesTolVisible: true,
          impurezasValue: 0.3,
          impurezasTolerance: 0.0,
          impurezasTolVisible: true,
          peladosValue: 0.5,
          peladosTolerance: 0.0,
          peladosTolVisible: true,
          totalGroupPercent: 1.8,
          groupPercent: 1.8,
          groupTolerance: 4.0,
          dryPercent: dryPercentValue,
          bonusEnabled: false,
          bonusPercent: 0,
        });
        await this.dataSource.manager.save(analysisRecord);
      }
    }

    return receptions;
  }

  private async createAdvances(
    producers: Producer[],
    seasons: Season[],
  ): Promise<Advance[]> {
    const advances: Advance[] = [];

    // 30 anticipos total: 10 por temporada (2 por productor)
    for (const season of seasons) {
      const daysInRange = Math.floor(
        (season.endDate.getTime() - season.startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      // Anticipos solo hasta la mitad de la temporada
      const maxDays = Math.floor(daysInRange / 2);
      const daySpacing = Math.floor(maxDays / 10);

      for (let i = 0; i < 10; i++) {
        const producerIndex = i % producers.length;
        const producer = producers[producerIndex];

        const issueDate = new Date(season.startDate);
        issueDate.setDate(issueDate.getDate() + daySpacing * i);

        const interestEndDate = new Date(issueDate);
        interestEndDate.setMonth(interestEndDate.getMonth() + 3);

        const amount = 500000 + Math.random() * 200000;

        // Convertir fechas a formato YYYY-MM-DD para persistencia
        const issueDateStr = issueDate.toISOString().split('T')[0];
        const interestEndDateStr = interestEndDate.toISOString().split('T')[0];

        const advance = this.dataSource.manager.create(Advance, {
          producerId: producer.id,
          seasonId: season.id,
          amount: Math.round(amount),
          issueDate: issueDateStr as any,
          interestRate: 1.5,
          interestEndDate: interestEndDateStr as any,
          isInterestCalculationEnabled: true,
          status: AdvanceStatusEnum.PAID,
          isActive: true,
          description: `Anticipo de ${producer.name} en ${season.name}`,
        });

        const saved = await this.dataSource.manager.save(advance);
        advances.push(saved);

        // Crear Transaction asociada
        const transaction = this.dataSource.manager.create(Transaction, {
          producerId: producer.id,
          advanceId: saved.id,
          type: TransactionTypeEnum.ADVANCE,
          amount: saved.amount,
          transactionDate: issueDateStr as any,
          referenceNumber: `ADVANCE-${saved.id}`,
          notes: `Transacción de anticipo para ${producer.name}`,
        });
        await this.dataSource.manager.save(transaction);
      }
    }

    return advances;
  }

  private async createSettlements(
    producers: Producer[],
    seasons: Season[],
    receptions: Reception[],
    advances: Advance[],
  ): Promise<Settlement[]> {
    const settlements: Settlement[] = [];

    // Crear liquidaciones: 5 en 2024, 4 en 2025 (sin Productor #2), 0 en 2026
    const season2024 = seasons.find((s) => s.year === 2024);
    const season2025 = seasons.find((s) => s.year === 2025);

    if (season2024) {
      // 5 liquidaciones en 2024 (una por cada productor)
      for (let i = 0; i < producers.length; i++) {
        const producer = producers[i];
        const producerReceptions = receptions.filter(
          (r) => r.producerId === producer.id && r.seasonId === season2024.id
        );
        const producerAdvances = advances.filter(
          (a) => a.producerId === producer.id && a.seasonId === season2024.id
        );

        if (producerReceptions.length > 0 || producerAdvances.length > 0) {
          const settlement = await this.createSettlement(
            producer,
            season2024,
            producerReceptions,
            producerAdvances,
            i + 1,
          );
          settlements.push(settlement);
        }
      }
    }

    if (season2025) {
      // 4 liquidaciones en 2025 (excepción: NO crear para Productor #2)
      for (let i = 0; i < producers.length; i++) {
        if (i === 1) continue; // Saltar Productor #2 (índice 1)

        const producer = producers[i];
        const producerReceptions = receptions.filter(
          (r) => r.producerId === producer.id && r.seasonId === season2025.id
        );
        const producerAdvances = advances.filter(
          (a) => a.producerId === producer.id && a.seasonId === season2025.id
        );

        if (producerReceptions.length > 0 || producerAdvances.length > 0) {
          const settlement = await this.createSettlement(
            producer,
            season2025,
            producerReceptions,
            producerAdvances,
            i + 1,
          );
          settlements.push(settlement);
        }
      }
    }

    return settlements;
  }

  private async createSettlement(
    producer: Producer,
    season: Season,
    receptions: Reception[],
    advances: Advance[],
    producerNumber: number,
  ): Promise<Settlement> {
    let totalReceptionAmount = 0;
    let totalAdvanceAmount = 0;
    let totalInterest = 0;

    for (const reception of receptions) {
      totalReceptionAmount += reception.ricePrice * reception.netWeight;
    }

    for (const advance of advances) {
      totalAdvanceAmount += advance.amount;
      // Calcular interés: amount * interestRate / 100
      totalInterest += (advance.amount * advance.interestRate) / 100;
    }

    // Pre-calcular totales de secado desde AnalysisRecords
    let totalDryingNet = 0;
    for (const reception of receptions) {
      const ar = await this.dataSource.manager.findOne(AnalysisRecord, {
        where: { receptionId: reception.id },
      });
      if (ar?.dryPercent && ar.dryPercent > 0) {
        const paddySubTotal = Math.round(reception.ricePrice * reception.netWeight);
        totalDryingNet += Math.round(paddySubTotal * (ar.dryPercent / 100));
      }
    }
    const totalDryingVat = Math.round(totalDryingNet * 0.19);
    const totalDryingTotal = totalDryingNet + totalDryingVat;

    const interestNet = Math.round(totalInterest);
    const interestVat = Math.round(totalInterest * 0.19);
    const interestTotal = interestNet + interestVat;

    // Total servicios = secado + intereses
    const totalServicesWithVat = totalDryingTotal + interestTotal;
    const ivaServices = totalDryingVat + interestVat;

    const settlementDate = new Date(season.endDate);
    settlementDate.setDate(settlementDate.getDate() - 5);

    // Construir calculationDetails con serviceInvoices (estructura que espera el backend)
    const calculationDetails: Record<string, unknown> = {
      serviceInvoices: {
        interest: {
          invoiceNetAmount: interestNet,
          vatAmount: interestVat,
          totalAmount: interestTotal,
        },
        drying: {
          invoiceNetAmount: totalDryingNet,
          vatAmount: totalDryingVat,
          totalAmount: totalDryingTotal,
        },
      },
      backendCalculation: {
        totalPrice: Math.round(totalReceptionAmount),
        totalAdvances: Math.round(totalAdvanceAmount),
        totalInterest: interestNet,
        ivaRice: Math.round(totalReceptionAmount * 0.19),
        ivaServices,
        ivaInterestServices: interestVat,
        totalServicesWithVat,
        amountDue: Math.round(
          totalReceptionAmount + Math.round(totalReceptionAmount * 0.19) -
          Math.round(totalAdvanceAmount) - totalServicesWithVat
        ),
      },
    };

    const settlement = this.dataSource.manager.create(Settlement, {
      producerId: producer.id,
      seasonId: season.id,
      status: SettlementStatusEnum.COMPLETED,
      receptionIds: receptions.map((r) => r.id),
      advanceIds: advances.map((a) => a.id),
      totalReceptions: Math.round(totalReceptionAmount),
      totalPrice: Math.round(totalReceptionAmount),
      totalDiscounts: 0,
      totalBonuses: 0,
      finalAmount: Math.round(totalReceptionAmount),
      totalAdvances: Math.round(totalAdvanceAmount),
      totalInterest: interestNet,
      ivaRice: Math.round(totalReceptionAmount * 0.19),
      ivaServices,
      amountDue: Math.round(
        totalReceptionAmount + Math.round(totalReceptionAmount * 0.19) -
        Math.round(totalAdvanceAmount) - totalServicesWithVat
      ),
      calculationDetails,
      issuedAt: settlementDate,
      settledAt: settlementDate,
      notes: `Liquidación de ${producer.name} en ${season.name}`,
    });

    const saved = await this.dataSource.manager.save(settlement);

    // Crear SettlementReceptionSnapshots
    for (let i = 0; i < receptions.length; i++) {
      const reception = receptions[i];
      
      // Obtener dryPercent del AnalysisRecord asociado
      const analysisRecord = await this.dataSource.manager.findOne(AnalysisRecord, {
        where: { receptionId: reception.id },
      });

      // Calcular valores de secado si aplica
      // Fórmula: dryingSubTotal = paddySubTotal * (dryPercent / 100)
      let dryPercent = 0;
      let dryingSubTotal = 0;
      let dryingVat = 0;
      let dryingTotal = 0;

      if (analysisRecord?.dryPercent && analysisRecord.dryPercent > 0) {
        dryPercent = analysisRecord.dryPercent;
        const paddySubTotal = Math.round(reception.ricePrice * reception.netWeight);
        // Aplicar porcentaje de secado al subtotal de arroz
        dryingSubTotal = Math.round(paddySubTotal * (dryPercent / 100));
        dryingVat = Math.round(dryingSubTotal * 0.19);
        dryingTotal = dryingSubTotal + dryingVat;
      }

      const snapshot = this.dataSource.manager.create(SettlementReceptionSnapshot, {
        settlementId: saved.id,
        receptionId: reception.id,
        lineOrder: i + 1,
        receptionDate: reception.receptionDate,
        guideNumber: reception.guideNumber,
        paddyKg: reception.netWeight,
        ricePrice: reception.ricePrice,
        paddySubTotal: Math.round(reception.ricePrice * reception.netWeight),
        paddyVat: Math.round(reception.ricePrice * reception.netWeight * 0.19),
        paddyTotal: Math.round(reception.ricePrice * reception.netWeight * 1.19),
        dryPercent,
        dryingSubTotal,
        dryingVat,
        dryingTotal,
      });
      await this.dataSource.manager.save(snapshot);
    }

    // Actualizar estado de anticipos a SETTLED
    for (const advance of advances) {
      advance.status = AdvanceStatusEnum.SETTLED;
      advance.settlementId = saved.id;
      await this.dataSource.manager.save(advance);
    }

    // Actualizar estado de recepciones a SETTLED
    for (const reception of receptions) {
      reception.status = ReceptionStatusEnum.SETTLED;
      await this.dataSource.manager.save(reception);
    }

    return saved;
  }
}

async function main() {
  let dataSource = getDataSource();

  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    const seeder = new SeedTestCosecha(dataSource);
    await seeder.run();

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

main();
