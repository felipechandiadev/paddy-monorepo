import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationsService } from './application/operations.service';
import { OperationsController } from './presentation/operations.controller';
import { Reception, AnalysisRecord } from './domain/operations.entity';
import { ConfigurationModule } from '@modules/configuration/configuration.module';
import { AuditModule } from '@modules/audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reception, AnalysisRecord]),
    ConfigurationModule,
    AuditModule,
  ],
  providers: [OperationsService],
  controllers: [OperationsController],
  exports: [OperationsService],
})
export class OperationsModule {}
