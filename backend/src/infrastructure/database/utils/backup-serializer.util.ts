import { DatabaseBackup, BackupMetadata } from '../types/backup-metadata.types';

export class BackupSerializer {
  static serializeToJSON(
    data: Record<string, any[]>,
    metadata: Omit<BackupMetadata, 'fileSizeBytes'>,
  ): string {
    const backupData: DatabaseBackup = {
      metadata: {
        ...metadata,
        fileSizeBytes: 0, // Will be calculated after serialization
      },
      data,
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    backupData.metadata.fileSizeBytes = Buffer.byteLength(jsonString, 'utf8');

    return JSON.stringify(backupData, null, 2);
  }

  static generateFileName(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `backup-${year}-${month}-${day}-${hours}-${minutes}-${seconds}.json`;
  }

  static getSchemaVersion(): string {
    // Get the latest migration name to infer schema version
    const packageJson = require('../../../../../package.json');
    return packageJson.version || '1.0.0';
  }
}
