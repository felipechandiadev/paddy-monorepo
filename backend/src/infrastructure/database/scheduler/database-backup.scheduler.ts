import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import * as fs from 'fs';
import { MysqldumpBackupService } from '../services/mysqldump-backup.service';

const JOB_NAME = 'databaseMysqlBackup';

/**
 * Registra un cron job según DATABASE_BACKUP_* en .env.
 * Expresión cron: minuto hora día-mes mes día-semana (estándar cron, 5 campos).
 * Ejemplo diario 03:00 → 0 3 * * *
 */
@Injectable()
export class DatabaseBackupScheduler implements OnModuleInit {
  private readonly logger = new Logger(DatabaseBackupScheduler.name);

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly mysqldumpBackup: MysqldumpBackupService,
  ) {}

  onModuleInit(): void {
    const enabled = process.env.DATABASE_BACKUP_ENABLED === 'true';
    if (!enabled) {
      this.logger.log(
        'Scheduled DB backup off (set DATABASE_BACKUP_ENABLED=true to enable).',
      );
      return;
    }

    if (this.schedulerRegistry.doesExist('cron', JOB_NAME)) {
      this.schedulerRegistry.deleteCronJob(JOB_NAME);
    }

    const cronExpr =
      process.env.DATABASE_BACKUP_CRON?.trim() || '0 3 * * *';
    const tz = process.env.DATABASE_BACKUP_TIMEZONE?.trim() || undefined;

    const job = new CronJob(
      cronExpr,
      () => {
        void this.runSafe();
      },
      null,
      true,
      tz,
    );

    this.schedulerRegistry.addCronJob(JOB_NAME, job);
    this.logger.log(
      `Scheduled MySQL backup: cron="${cronExpr}"` +
        (tz ? ` timezone="${tz}"` : ' (server local timezone)'),
    );
  }

  private async runSafe(): Promise<void> {
    try {
      const filePath = await this.mysqldumpBackup.runScheduledBackup();
      const stat = fs.statSync(filePath);
      const mb = (stat.size / (1024 * 1024)).toFixed(2);
      this.logger.log(`Backup OK: ${filePath} (${mb} MiB)`);
    } catch (e) {
      this.logger.error(
        `Backup failed: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  }
}
