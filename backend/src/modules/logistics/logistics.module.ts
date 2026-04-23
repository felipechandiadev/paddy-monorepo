import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TruckReception } from './domain/truck-reception.entity';
import { TruckDispatch } from './domain/truck-dispatch.entity';
import { Producer } from '@modules/producers/domain/producer.entity';
import { LogisticsService } from './application/logistics.service';
import { LogisticsGateway } from './application/logistics.gateway';
import { LogisticsController } from './presentation/logistics.controller';
import { ProducersModule } from '@modules/producers/producers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TruckReception, TruckDispatch, Producer]),
    ProducersModule,
  ],
  controllers: [LogisticsController],
  providers: [LogisticsService, LogisticsGateway],
  exports: [LogisticsService],
})
export class LogisticsModule {}
