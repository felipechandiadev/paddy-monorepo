import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/domain/user.entity';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async check() {
    try {
      const users = await this.usersRepository
        .createQueryBuilder('user')
        .select(['user.id'])
        .where('user.deletedAt IS NULL')
        .orderBy('user.id', 'ASC')
        .take(1)
        .getMany();

      return {
        status: 'ok',
        checks: {
          database: 'ok',
          usersTable: 'ok',
        },
        usersSampleSize: users.length,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown database error';

      this.logger.error(`Health check failed: ${message}`);

      throw new ServiceUnavailableException(
        'Database health check failed while querying users',
      );
    }
  }
}