import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../domain/user.entity';
import { RoleEnum } from '@shared/enums';

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

    // Guardar en base de datos
    const savedUser = await this.usersRepository.save(user);

    // Retornar sin incluir la password
    return this.getUserById(savedUser.id);
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
    // Si incluye password, haciarlo
    if (updateDto.password && updateDto.password.trim()) {
      updateDto.password = await bcrypt.hash(updateDto.password, 10);
    } else {
      // Si no hay password, no incluirlo en la actualización
      delete updateDto.password;
    }

    await this.usersRepository.update(id, updateDto);
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
