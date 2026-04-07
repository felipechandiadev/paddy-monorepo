import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancesService } from './application/finances.service';
import { FinancesController } from './presentation/finances.controller';
import {
  Advance,
  Transaction,
  Settlement,
  SettlementReceptionSnapshot,
} from './domain/finances.entity';
import { AnalysisRecord, Reception } from '@modules/operations/domain/operations.entity';
import { Producer } from '@modules/producers/domain/producer.entity';
import { AuditModule } from '@modules/audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Advance,
      Transaction,
      Settlement,
      SettlementReceptionSnapshot,
      Reception,
      AnalysisRecord,
      Producer,
    ]),
    AuditModule,
  ],
  providers: [FinancesService],
  controllers: [FinancesController],
  exports: [FinancesService],
})
export class FinancesModule {}
