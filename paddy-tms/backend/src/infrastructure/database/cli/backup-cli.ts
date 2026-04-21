import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../../app.module';
import { BackupDatabaseCommand } from '../commands/backup.command';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const backupCommand = app.get(BackupDatabaseCommand);
  await backupCommand.execute();
  await app.close();
  process.exit(0);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
