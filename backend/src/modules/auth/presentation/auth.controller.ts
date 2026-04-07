import {
  BadRequestException,
  Controller,
  Post,
  Put,
  Body,
  UseGuards,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { DateTime } from 'luxon';
import { AuthService } from '../application/auth.service';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { GetUser } from '@shared/decorators/get-user.decorator';
import { ChangePasswordDto } from '../dto/auth.dto';

/**
 * Auth Controller
 * Endpoints públicos para autenticación
 * POST /auth/login - Login con email y contraseña
 * POST /auth/register - Registro de nuevo usuario
 * POST /auth/refresh - Refrescar token
 * GET /auth/health - Health check
 */
@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');

  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: { email: string; password: string },
  ) {
    this.logger.log(`Login attempt for email: ${loginDto.email}`);
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body()
    registerDto: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
    },
  ) {
    this.logger.log(`Register attempt for email: ${registerDto.email}`);
    this.authService.validatePassword(registerDto.password);
    return this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.firstName,
    );
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(@GetUser('userId') userId: number) {
    this.logger.log(`Token refresh for user: ${userId}`);
    return this.authService.refreshToken(userId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@GetUser('userId') userId: number) {
    return this.authService.getCurrentUser(userId);
  }

  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @GetUser('userId') userId: number,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException('La confirmación de contraseña no coincide');
    }

    return this.authService.changePassword(
      userId,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }

  @Get('health')
  @HttpCode(HttpStatus.OK)
  health() {
    return { status: 'ok', timestamp: DateTime.now().toISO() };
  }
}
