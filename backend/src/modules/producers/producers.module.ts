import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProducersService } from './application/producers.service';
import { ProducersController } from './presentation/producers.controller';
import { Producer } from './domain/producer.entity';
import { AuditModule } from '@modules/audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([Producer]), AuditModule],
  providers: [ProducersService],
  controllers: [ProducersController],
  exports: [ProducersService],
})
export class ProducersModule {}
