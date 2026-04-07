import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationService } from './application/configuration.service';
import { ConfigurationController } from './presentation/configuration.controller';
import {
  RiceType,
  Season,
  Template,
  AnalysisParam,
} from './domain/configuration.entity';
import { AuditModule } from '@modules/audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RiceType, Season, Template, AnalysisParam]),
    AuditModule,
  ],
  providers: [ConfigurationService],
  controllers: [ConfigurationController],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
