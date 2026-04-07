import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { PermissionsService } from '../application/permissions.service';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
import { Roles } from '@shared/decorators/roles.decorator';
import { GetUser } from '@shared/decorators/get-user.decorator';
import { RoleEnum } from '@shared/enums';

/**
 * Users Controller
 * Endpoints privados para gestión de usuarios del sistema
 * Requieren JWT token y rol ADMIN
 */
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  private logger = new Logger('UsersController');

  constructor(
    private usersService: UsersService,
    private permissionsService: PermissionsService,
  ) {}

  @Get()
  async getAllUsers(@Query('search') search?: string) {
    if (search && search.trim()) {
      this.logger.log(`🔍 Searching users with: "${search}"`);
    } else {
      this.logger.log('📋 Fetching all users');
    }
    const users = await this.usersService.getAllUsers(search);
    this.logger.log(`✅ Found ${users.length} users`);
    return users;
  }

  @Post()
  @Roles(RoleEnum.ADMIN)
  async createUser(
    @Body() createDto: { email: string; password: string; role: string; name: string },
  ) {
    this.logger.log(`Creating user: ${createDto.email}`);
    return this.usersService.createUser(
      createDto.email,
      createDto.password,
      createDto.role as RoleEnum,
      createDto.name,
    );
  }

  @Get(':id')
  async getUserById(@Param('id') id: number) {
    this.logger.log(`Fetching user: ${id}`);
    return this.usersService.getUserById(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.ADMIN)
  async updateUser(
    @Param('id') id: number,
    @Body() updateDto: any,
  ) {
    this.logger.log(`Updating user: ${id}`);
    return this.usersService.updateUser(id, updateDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  async deleteUser(@Param('id') id: number) {
    this.logger.log(`Deleting user: ${id}`);
    return this.usersService.deleteUser(id);
  }

  @Put(':id/toggle-active')
  @Roles(RoleEnum.ADMIN)
  async toggleUserActive(@Param('id') id: number) {
    this.logger.log(`Toggling active status for user: ${id}`);
    return this.usersService.toggleUserActive(id);
  }

  /**
   * Devuelve los permisos efectivos de un usuario
   * GET /users/:id/permissions
   */
  @Get(':id/permissions')
  async getUserPermissions(
    @Param('id') id: number,
  ) {
    this.logger.log(`Fetching permissions for user: ${id}`);
    const user = await this.usersService.getUserById(id);
    if (!user) return { effective: [], overrides: [] };

    const [effective, overrides] = await Promise.all([
      this.permissionsService.getEffectivePermissions(id, user.role as RoleEnum),
      this.permissionsService.getUserOverrides(id),
    ]);

    return {
      effective,
      overrides: overrides.map((o) => ({
        permissionKey: o.permissionKey,
        effect: o.effect,
      })),
    };
  }

  /**
   * Reemplaza los overrides de permisos de un usuario
   * PUT /users/:id/permissions
   */
  @Put(':id/permissions')
  @Roles(RoleEnum.ADMIN)
  async setUserPermissions(
    @Param('id') id: number,
    @Body() body: { grants: string[]; revokes: string[] },
    @GetUser() currentUser: { userId: number },
  ) {
    this.logger.log(`Setting permissions for user: ${id}`);
    await this.permissionsService.setUserOverrides(
      id,
      body.grants ?? [],
      body.revokes ?? [],
      currentUser.userId,
    );
    return { message: 'Permisos actualizados' };
  }
}
