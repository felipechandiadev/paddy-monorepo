import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../modules/users/domain/user.entity';
import { UserPermissionOverride } from '../../modules/users/domain/user-permission-override.entity';
import { Producer } from '../../modules/producers/domain/producer.entity';
import {
  RiceType,
  Season,
  Template,
  AnalysisParam,
} from '../../modules/configuration/domain/configuration.entity';
import {
  Reception,
  AnalysisRecord,
} from '../../modules/operations/domain/operations.entity';
import {
  Advance,
  Transaction,
  Settlement,
  SettlementReceptionSnapshot,
} from '../../modules/finances/domain/finances.entity';
import { DatabaseBackupService } from './services/database-backup.service';
import { BackupDatabaseCommand } from './commands/backup.command';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserPermissionOverride,
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
    ]),
  ],
  providers: [DatabaseBackupService, BackupDatabaseCommand],
  exports: [DatabaseBackupService],
})
export class DatabaseModule {}
