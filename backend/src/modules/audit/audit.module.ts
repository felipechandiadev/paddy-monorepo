import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditEvent } from './domain/audit-event.entity';
import { AuditService } from './application/audit.service';
import { AuditController } from './presentation/audit.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AuditEvent])],
  providers: [AuditService],
  controllers: [AuditController],
  exports: [AuditService],
})
export class AuditModule {}
