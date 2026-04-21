import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogisticsController } from './presentation/logistics.controller';
import { LogisticsService } from './application/logistics.service';
import { LogisticsGateway } from './application/logistics.gateway';
import { TruckReception } from './domain/truck-reception.entity';
import { Producer } from './domain/producer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TruckReception, Producer])],
  controllers: [LogisticsController],
  providers: [LogisticsService, LogisticsGateway],
  exports: [LogisticsService, LogisticsGateway],
})
export class LogisticsModule {}
