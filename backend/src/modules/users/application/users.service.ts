import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, QueryFailedError } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../domain/user.entity';
import { RoleEnum } from '@shared/enums';

const ROLE_DB_HINT =
  'Si eliges «Recepción y desapacho de carga», la base debe incluir el rol TRUCK_RECEPTION. En el servidor del API ejecuta: npm run db:migrate';

function assertRoleAllowed(role: RoleEnum): void {
  const allowed = Object.values(RoleEnum) as string[];
  if (!allowed.includes(role)) {
    throw new BadRequestException(
      `Rol inválido: ${String(role)}. Valores permitidos: ${allowed.join(', ')}`,
    );
  }
}

function rethrowUserPersistenceError(err: unknown): never {
  if (err instanceof QueryFailedError) {
    const driver = (err as QueryFailedError & {
      driverError?: { code?: string; errno?: number; sqlMessage?: string };
    }).driverError;
    const errno = driver?.errno;
    const sqlMessage = (driver?.sqlMessage ?? err.message ?? '').toLowerCase();

    if (errno === 1062 || sqlMessage.includes('duplicate')) {
      throw new ConflictException('Ya existe un usuario con este correo.');
    }
    if (
      errno === 1265 ||
      errno === 1366 ||
      sqlMessage.includes('data truncated') ||
      sqlMessage.includes('incorrect') ||
      sqlMessage.includes('enum')
    ) {
      throw new BadRequestException(
        `No se pudo guardar el usuario. ${ROLE_DB_HINT}`,
      );
    }
  }
  throw err;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getAllUsers(search?: string) {
    let query = this.usersRepository.createQueryBuilder('user')
      .where('user.deletedAt IS NULL')
      .select(['user.id', 'user.email', 'user.name', 'user.role', 'user.isActive', 'user.createdAt', 'user.updatedAt']);

    // Si hay búsqueda, filtrar por email o nombre (case-insensitive)
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      query = query.andWhere('(LOWER(user.email) LIKE LOWER(:search) OR LOWER(user.name) LIKE LOWER(:search))', { search: searchTerm });
    }

    return query.getMany();
  }

  async createUser(
    email: string,
    password: string,
    role: RoleEnum,
    name: string,
  ) {
    assertRoleAllowed(role);

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      role,
      name,
      isActive: true,
    });

    try {
      const savedUser = await this.usersRepository.save(user);
      return this.getUserById(savedUser.id);
    } catch (err) {
      rethrowUserPersistenceError(err);
    }
  }

  async getUserById(id: number) {
    return this.usersRepository.findOne({
      where: { id, deletedAt: IsNull() },
      select: ['id', 'email', 'name', 'role', 'isActive'],
    });
  }

  async updateUser(
    id: number,
    updateDto: Partial<{ email?: string; password?: string; name?: string; role?: RoleEnum; isActive?: boolean }>,
  ) {
    if (updateDto.role !== undefined) {
      assertRoleAllowed(updateDto.role);
    }

    // Si incluye password, haciarlo
    if (updateDto.password && updateDto.password.trim()) {
      updateDto.password = await bcrypt.hash(updateDto.password, 10);
    } else {
      // Si no hay password, no incluirlo en la actualización
      delete updateDto.password;
    }

    try {
      await this.usersRepository.update(id, updateDto);
    } catch (err) {
      rethrowUserPersistenceError(err);
    }
    return this.getUserById(id);
  }

  async deleteUser(id: number) {
    await this.usersRepository.softDelete(id);
    return { message: 'Usuario eliminado' };
  }

  async toggleUserActive(id: number) {
    const user = await this.getUserById(id);
    await this.usersRepository.update(id, { isActive: !user.isActive });
    return this.getUserById(id);
  }
}
