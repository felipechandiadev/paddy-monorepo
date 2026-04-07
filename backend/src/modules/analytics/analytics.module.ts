import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reception } from '@modules/operations/domain/operations.entity';
import {
  Advance,
  Settlement,
  Transaction,
} from '@modules/finances/domain/finances.entity';
import { Producer } from '@modules/producers/domain/producer.entity';
import { Season } from '@modules/configuration/domain/configuration.entity';
import { AnalyticsService } from './application/analytics.service';
import { AnalyticsController } from './presentation/analytics.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reception,
      Advance,
      Settlement,
      Producer,
      Transaction,
      Season,
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
