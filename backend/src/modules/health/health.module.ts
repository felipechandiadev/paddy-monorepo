import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthService } from './application/health.service';
import { HealthController } from './presentation/health.controller';
import { User } from '../users/domain/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [HealthService],
  controllers: [HealthController],
})
export class HealthModule {}