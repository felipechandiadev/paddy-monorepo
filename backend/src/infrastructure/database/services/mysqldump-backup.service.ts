import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { pipeline } from 'stream/promises';

/**
 * Ejecuta mysqldump y escribe un .sql en un directorio del servidor.
 * El directorio debe ser una ruta absoluta; el SO debe permitir escritura al usuario que corre Node.
 */
@Injectable()
export class MysqldumpBackupService {
  private readonly logger = new Logger(MysqldumpBackupService.name);

  async runScheduledBackup(): Promise<string> {
    const enabled = process.env.DATABASE_BACKUP_ENABLED === 'true';
    if (!enabled) {
      throw new Error('DATABASE_BACKUP_ENABLED is not true');
    }

    const outputDir = process.env.DATABASE_BACKUP_OUTPUT_DIR?.trim();
    if (!outputDir) {
      throw new Error('DATABASE_BACKUP_OUTPUT_DIR is required when backup is enabled');
    }
    if (!path.isAbsolute(outputDir)) {
      throw new Error(
        `DATABASE_BACKUP_OUTPUT_DIR must be an absolute path (got: ${outputDir})`,
      );
    }

    const host = process.env.DATABASE_HOST || 'localhost';
    const port = process.env.DATABASE_PORT || '3306';
    const user = process.env.DATABASE_USER || 'root';
    const password = process.env.DATABASE_PASSWORD ?? '';
    const database = process.env.DATABASE_NAME || 'paddy';
    const mysqldumpPath =
      process.env.DATABASE_BACKUP_MYSQLDUMP_PATH?.trim() || 'mysqldump';

    const extraArgs = this.parseExtraArgs(
      process.env.DATABASE_BACKUP_MYSQLDUMP_EXTRA,
    );

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const stamp = this.formatTimestampLocal();
    const fileName = `paddy-mysqldump-${stamp}.sql`;
    const filePath = path.join(outputDir, fileName);

    const args = [
      `-h${host}`,
      `-P${String(port)}`,
      `-u${user}`,
      '--single-transaction',
      '--routines',
      '--triggers',
      '--column-statistics=0',
      ...extraArgs,
      database,
    ];

    await this.spawnMysqldump(mysqldumpPath, args, password, filePath);

    const retentionDays = parseInt(
      process.env.DATABASE_BACKUP_RETENTION_DAYS || '0',
      10,
    );
    if (retentionDays > 0) {
      this.pruneOldBackups(outputDir, retentionDays);
    }

    return filePath;
  }

  private parseExtraArgs(raw: string | undefined): string[] {
    if (!raw?.trim()) {
      return [];
    }
    return raw
      .trim()
      .split(/\s+/)
      .filter((a) => a.length > 0);
  }

  private formatTimestampLocal(): string {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}-${p(d.getMinutes())}-${p(d.getSeconds())}`;
  }

  private async spawnMysqldump(
    mysqldumpPath: string,
    args: string[],
    password: string,
    filePath: string,
  ): Promise<void> {
    const writeStream = fs.createWriteStream(filePath, { flags: 'w' });
    const child = spawn(mysqldumpPath, args, {
      env: { ...process.env, MYSQL_PWD: password },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stderr = '';
    child.stderr?.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    const stdout = child.stdout;
    if (!stdout) {
      writeStream.destroy();
      try {
        fs.unlinkSync(filePath);
      } catch {
        /* ignore */
      }
      throw new Error('mysqldump stdout is not available');
    }

    const exitPromise = new Promise<number>((resolve, reject) => {
      child.on('error', (err) => {
        reject(
          new Error(
            `Failed to start mysqldump (${mysqldumpPath}): ${err.message}. Is the MySQL client installed?`,
          ),
        );
      });
      child.on('close', (code) => resolve(code ?? -1));
    });

    try {
      const [, code] = await Promise.all([
        pipeline(stdout, writeStream),
        exitPromise,
      ]);
      if (code !== 0) {
        throw new Error(
          `mysqldump exited with code ${code}${stderr ? `: ${stderr.trim()}` : ''}`,
        );
      }
    } catch (e) {
      try {
        fs.unlinkSync(filePath);
      } catch {
        /* ignore */
      }
      throw e;
    }
  }

  private pruneOldBackups(outputDir: string, retentionDays: number): void {
    const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
    try {
      const names = fs.readdirSync(outputDir);
      for (const name of names) {
        if (!name.startsWith('paddy-mysqldump-') || !name.endsWith('.sql')) {
          continue;
        }
        const full = path.join(outputDir, name);
        const stat = fs.statSync(full);
        if (stat.mtimeMs < cutoff) {
          fs.unlinkSync(full);
          this.logger.log(`Removed old backup: ${name}`);
        }
      }
    } catch (e) {
      this.logger.warn(
        `Retention cleanup failed: ${e instanceof Error ? e.message : e}`,
      );
    }
  }
}
