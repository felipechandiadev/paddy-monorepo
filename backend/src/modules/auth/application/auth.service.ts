import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '@modules/users/domain/user.entity';
import { PermissionsService } from '@modules/users/application/permissions.service';
import { RoleEnum } from '@shared/enums';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private permissionsService: PermissionsService,
  ) {}

  /**
   * Registra un nuevo usuario
   */
  async register(email: string, password: string, firstName?: string) {
    // Validar que el usuario no exista
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      firstName,
    });

    const savedUser = await this.usersRepository.save(user);

    // Retornar sin la contraseña
    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  /**
   * Autentica un usuario y genera JWT token
   */
  async login(email: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Email o contraseña inválidos');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email o contraseña inválidos');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    // Generar JWT token
    const token = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      {
        expiresIn: process.env.JWT_EXPIRATION || '12h',
      },
    );

    // Actualizar lastLogin
    user.lastLogin = new Date();
    await this.usersRepository.save(user);

    const permissions = await this.permissionsService.getEffectivePermissions(
      user.id,
      user.role as RoleEnum,
    );

    return {
      access_token: token,
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions,
    };
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no encontrado o inactivo');
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }

    if (currentPassword === newPassword) {
      throw new BadRequestException('La nueva contraseña debe ser distinta a la actual');
    }

    this.validatePassword(newPassword);

    user.password = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.save(user);

    return { message: 'Contraseña actualizada correctamente' };
  }

  /**
   * Valida que la contraseña cumpla requisitos mínimos
   */
  validatePassword(password: string): boolean {
    if (password.length < 8) {
      throw new BadRequestException('La contraseña debe tener al menos 8 caracteres');
    }
    return true;
  }

  /**
   * Genera un nuevo token para un usuario (refresh)
   */
  async refreshToken(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const token = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      {
        expiresIn: process.env.JWT_EXPIRATION || '12h',
      },
    );

    return { access_token: token };
  }

  /**
   * Obtiene perfil actual del usuario autenticado
   */
  async getCurrentUser(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no encontrado o inactivo');
    }

    const permissions = await this.permissionsService.getEffectivePermissions(
      user.id,
      user.role as RoleEnum,
    );

    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions,
    };
  }
}
