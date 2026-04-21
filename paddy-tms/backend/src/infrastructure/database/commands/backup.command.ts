import { Injectable } from '@nestjs/common';
import { DatabaseBackupService } from '../services/database-backup.service';
import { BackupSerializer } from '../utils/backup-serializer.util';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BackupDatabaseCommand {
  constructor(private readonly backupService: DatabaseBackupService) {}

  async execute(): Promise<void> {
    try {
      console.log('🔄 Starting database backup...');

      // Backup all tables
      const { data, metadata } = await this.backupService.backupAllTables();

      // Serialize to JSON
      const jsonContent = BackupSerializer.serializeToJSON(data, metadata);

      // Generate filename
      const fileName = BackupSerializer.generateFileName();
      const backupDir = path.join(process.cwd(), 'backups');

      // Create backups directory if it doesn't exist
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      const filePath = path.join(backupDir, fileName);

      // Write file
      fs.writeFileSync(filePath, jsonContent, 'utf8');

      // Display summary
      const totalRecords = Object.values(metadata.recordCounts).reduce(
        (a, b) => a + b,
        0,
      );
      const fileSizeKB = (fs.statSync(filePath).size / 1024).toFixed(2);

      console.log('✅ Database backup completed successfully!');
      console.log(`📄 File: backups/${fileName}`);
      console.log(`📊 Total records: ${totalRecords}`);
      console.log(`💾 File size: ${fileSizeKB} KB`);
      console.log(`⏰ Timestamp: ${metadata.timestamp}`);
      console.log('\n📋 Record counts by entity:');
      Object.entries(metadata.recordCounts).forEach(([entity, count]) => {
        console.log(`   - ${entity}: ${count}`);
      });
    } catch (error) {
      console.error('❌ Backup failed:', error.message);
      process.exit(1);
    }
  }
}

