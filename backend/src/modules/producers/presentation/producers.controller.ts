import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ProducersService } from '../application/producers.service';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
import { Roles } from '@shared/decorators/roles.decorator';
import { RoleEnum } from '@shared/enums';

/**
 * Producers Controller
 * Endpoints para gestión de productores/agricultores
 * GET  /producers           - Listar todos
 * GET  /producers/:id       - Obtener uno
 * POST /producers           - Crear
 * PUT  /producers/:id       - Actualizar
 * DELETE /producers/:id     - Eliminar (soft delete)
 */
@Controller('producers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProducersController {
  private logger = new Logger('ProducersController');

  constructor(private producersService: ProducersService) {}

  @Get()
  async getAllProducers() {
    this.logger.log('Fetching all producers');
    return this.producersService.getAllProducers();
  }

  @Get(':id')
  async getProducerById(@Param('id') id: number) {
    this.logger.log(`Fetching producer: ${id}`);
    return this.producersService.getProducerById(id);
  }

  @Post()
  @Roles(RoleEnum.ADMIN)
  async createProducer(@Body() createProducerDto: any) {
    this.logger.log(`Creating producer: ${createProducerDto.name}`);
    return this.producersService.createProducer(createProducerDto);
  }

  @Put(':id')
  @Roles(RoleEnum.ADMIN)
  async updateProducer(@Param('id') id: number, @Body() updateDto: any) {
    this.logger.log(`Updating producer: ${id}`);
    return this.producersService.updateProducer(id, updateDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  async deleteProducer(@Param('id') id: number) {
    this.logger.log(`Deleting producer: ${id}`);
    return this.producersService.deleteProducer(id);
  }

  @Post(':id/bank-accounts')
  @Roles(RoleEnum.ADMIN)
  async addBankAccount(@Param('id') id: number, @Body() account: any) {
    this.logger.log(`Adding bank account to producer: ${id}`);
    return this.producersService.addBankAccount(id, account);
  }

  @Delete(':id/bank-accounts/:index')
  @Roles(RoleEnum.ADMIN)
  async removeBankAccount(
    @Param('id') id: number,
    @Param('index') index: number,
  ) {
    this.logger.log(`Removing bank account from producer: ${id}`);
    return this.producersService.removeBankAccount(id, index);
  }
}
