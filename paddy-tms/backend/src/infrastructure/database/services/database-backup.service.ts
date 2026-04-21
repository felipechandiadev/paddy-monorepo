import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../modules/users/domain/user.entity';
import {
  RiceType,
  Season,
  Template,
  AnalysisParam,
} from '../../../modules/configuration/domain/configuration.entity';
import {
  Reception,
  AnalysisRecord,
} from '../../../modules/operations/domain/operations.entity';
import {
  Advance,
  Settlement,
  SettlementReceptionSnapshot,
  Transaction,
} from '../../../modules/finances/domain/finances.entity';
import { Producer } from '../../../modules/producers/domain/producer.entity';
import { UserPermissionOverride } from '../../../modules/users/domain/user-permission-override.entity';
import { BackupMetadata } from '../types/backup-metadata.types';

@Injectable()
export class DatabaseBackupService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Producer) private producerRepository: Repository<Producer>,
    @InjectRepository(RiceType) private riceTypeRepository: Repository<RiceType>,
    @InjectRepository(Season) private seasonRepository: Repository<Season>,
    @InjectRepository(AnalysisParam)
    private analysisParamRepository: Repository<AnalysisParam>,
    @InjectRepository(Template) private templateRepository: Repository<Template>,
    @InjectRepository(Reception)
    private receptionRepository: Repository<Reception>,
    @InjectRepository(AnalysisRecord)
    private analysisRecordRepository: Repository<AnalysisRecord>,
    @InjectRepository(Advance) private advanceRepository: Repository<Advance>,
    @InjectRepository(Settlement)
    private settlementRepository: Repository<Settlement>,
    @InjectRepository(SettlementReceptionSnapshot)
    private settlementReceptionSnapshotRepository: Repository<SettlementReceptionSnapshot>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(UserPermissionOverride)
    private userPermissionOverrideRepository: Repository<UserPermissionOverride>,
  ) {}

  async backupAllTables(): Promise<{
    data: Record<string, any[]>;
    metadata: Omit<BackupMetadata, 'fileSizeBytes'>;
  }> {
    try {
      const entities = [
        { name: 'users', repo: this.userRepository },
        { name: 'producers', repo: this.producerRepository },
        { name: 'rice_types', repo: this.riceTypeRepository },
        { name: 'seasons', repo: this.seasonRepository },
        { name: 'analysis_params', repo: this.analysisParamRepository },
        { name: 'templates', repo: this.templateRepository },
        { name: 'receptions', repo: this.receptionRepository },
        { name: 'analysis_records', repo: this.analysisRecordRepository },
        { name: 'advances', repo: this.advanceRepository },
        { name: 'settlements', repo: this.settlementRepository },
        {
          name: 'settlement_reception_snapshots',
          repo: this.settlementReceptionSnapshotRepository,
        },
        { name: 'transactions', repo: this.transactionRepository },
        {
          name: 'user_permission_overrides',
          repo: this.userPermissionOverrideRepository,
        },
      ];

      const data: Record<string, any[]> = {};
      const recordCounts: Record<string, number> = {};

      // Fetch all active records (soft deletes excluded)
      for (const entity of entities) {
        const records = await entity.repo
          .createQueryBuilder()
          .where('"deletedAt" IS NULL')
          .orderBy('id', 'ASC')
          .getMany();

        data[entity.name] = records;
        recordCounts[entity.name] = records.length;
      }

      const metadata: Omit<BackupMetadata, 'fileSizeBytes'> = {
        timestamp: new Date().toISOString(),
        backupVersion: '1.0',
        databaseSchema: 'paddy_v1.2.0',
        recordCounts,
      };

      return { data, metadata };
    } catch (error) {
      throw new Error(`Backup failed: ${error.message}`);
    }
  }
}
