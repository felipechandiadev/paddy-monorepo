export interface BackupMetadata {
  timestamp: string; // ISO 8601 format
  backupVersion: string;
  databaseSchema: string;
  recordCounts: Record<string, number>;
  fileSizeBytes: number;
}

export interface DatabaseBackup {
  metadata: BackupMetadata;
  data: Record<string, any[]>;
}
