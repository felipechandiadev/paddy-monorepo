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
  Res,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { FinancesService } from '../application/finances.service';
import {
  CompleteSettlementDto,
  CreateAdvanceDto,
  CreateSettlementDto,
  UpdateAdvanceDto,
  UpdateSettlementDto,
} from '../dto/finances.dto';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
import { Roles } from '@shared/decorators/roles.decorator';
import { GetUser } from '@shared/decorators/get-user.decorator';
import { RoleEnum, TransactionTypeEnum, SettlementStatusEnum } from '@shared/enums';

/**
 * Finances Controller
 * Endpoints para gestión de finanzas:
 * - Advances (Anticipos)
 * - Transactions (Movimientos de dinero)
 * - Settlements (Liquidaciones)
 */
@Controller('finances')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FinancesController {
  private logger = new Logger('FinancesController');

  constructor(private financesService: FinancesService) {}

  // ===== ADVANCES =====
  @Get('advances')
  async getAllAdvances(
    @Query('producerId') producerId?: number,
    @Query('includeDeleted') includeDeleted?: string,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('sortField') sortField?: string,
    @Query('filters') filters?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    this.logger.log('Fetching all advances');
    const shouldIncludeDeleted = String(includeDeleted ?? '').toLowerCase() === 'true';
    const parsedPage = Number.parseInt(page ?? '', 10);
    const parsedLimit = Number.parseInt(limit ?? '', 10);
    const safePage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : undefined;
    const safeLimit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : undefined;

    return this.financesService.getAllAdvancesWithQuery(
      producerId,
      shouldIncludeDeleted,
      search,
      sort,
      sortField,
      filters,
      safePage,
      safeLimit,
    );
  }

  @Get('advances/export/excel')
  async exportAdvancesExcel(
    @Res() response: Response,
    @Query('producerId') producerId?: number,
    @Query('includeDeleted') includeDeleted?: string,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('sortField') sortField?: string,
    @Query('filters') filters?: string,
  ): Promise<void> {
    const shouldIncludeDeleted =
      includeDeleted === 'true' || includeDeleted === '1';

    this.logger.log(
      `Exporting advances to excel${shouldIncludeDeleted ? ' (including deleted)' : ''}${producerId ? ` (producerId: ${producerId})` : ''}${search ? ` (search: ${search})` : ''}${sort && sortField ? ` (sort: ${sortField} ${sort})` : ''}${filters ? ` (filters: ${filters})` : ''}`,
    );

    const { fileName, fileBuffer } =
      await this.financesService.generateAdvancesExcel(
        producerId,
        shouldIncludeDeleted,
        search,
        sort,
        sortField,
        filters,
      );

    response.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    response.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    response.setHeader('Content-Length', fileBuffer.length.toString());
    response.send(fileBuffer);
  }

  @Get('advances/:id')
  async getAdvanceById(@Param('id') id: number) {
    this.logger.log(`Fetching advance: ${id}`);
    return this.financesService.getAdvanceById(id);
  }

  @Get('advances/:id/details')
  async getAdvanceDetails(@Param('id') id: number) {
    this.logger.log(`Fetching advance details: ${id}`);
    return this.financesService.getAdvanceDetails(id);
  }

  @Post('advances')
  @Roles(RoleEnum.ADMIN)
  async createAdvance(
    @Body() createDto: CreateAdvanceDto,
    @GetUser('userId') userId: number,
  ) {
    this.logger.log(`Creating advance for producer: ${createDto.producerId}`);
    return this.financesService.createAdvance(createDto, userId);
  }

  @Put('advances/:id')
  @Roles(RoleEnum.ADMIN)
  async updateAdvanceFull(
    @Param('id') id: number,
    @Body() updateDto: UpdateAdvanceDto,
    @GetUser('userId') userId: number,
  ) {
    this.logger.log(`Updating advance (PUT): ${id}`);
    return this.financesService.updateAdvance(id, updateDto, userId);
  }

  @Patch('advances/:id')
  @Roles(RoleEnum.ADMIN)
  async updateAdvance(
    @Param('id') id: number,
    @Body() updateDto: UpdateAdvanceDto,
    @GetUser('userId') userId: number,
  ) {
    this.logger.log(`Updating advance (PATCH): ${id}`);
    return this.financesService.updateAdvance(id, updateDto, userId);
  }

  @Delete('advances/:id')
  @Roles(RoleEnum.ADMIN)
  async deleteAdvance(@Param('id') id: number) {
    this.logger.log(`Deleting advance: ${id}`);
    return this.financesService.deleteAdvance(id);
  }

  // ===== TRANSACTIONS =====
  @Get('transactions')
  async getAllTransactions(
    @Query('producerId') producerId?: number,
    @Query('type') type?: TransactionTypeEnum,
  ) {
    this.logger.log('Fetching all transactions');
    return this.financesService.getAllTransactions(producerId, type);
  }

  @Get('transactions/:id')
  async getTransactionById(@Param('id') id: number) {
    this.logger.log(`Fetching transaction: ${id}`);
    return this.financesService.getTransactionById(id);
  }

  @Get('producers/:producerId/pending-balance')
  async getProducerPendingBalance(@Param('producerId') producerId: number) {
    this.logger.log(`Calculating pending balance for producer: ${producerId}`);
    return this.financesService.getProducerPendingBalance(producerId);
  }

  @Post('transactions')
  @Roles(RoleEnum.ADMIN)
  async createTransaction(
    @Body() createDto: any,
    @GetUser('userId') userId: number,
  ) {
    this.logger.log(
      `Creating transaction for producer: ${createDto.producerId}`,
    );
    return this.financesService.createTransaction(createDto, userId);
  }

  @Put('transactions/:id')
  @Roles(RoleEnum.ADMIN)
  async updateTransaction(@Param('id') id: number, @Body() updateDto: any) {
    this.logger.log(`Updating transaction: ${id}`);
    return this.financesService.updateTransaction(id, updateDto);
  }

  @Delete('transactions/:id')
  @Roles(RoleEnum.ADMIN)
  async deleteTransaction(@Param('id') id: number) {
    this.logger.log(`Deleting transaction: ${id}`);
    return this.financesService.deleteTransaction(id);
  }

  // ===== SETTLEMENTS =====
  @Get('settlements')
  async getAllSettlements(
    @Query('producerId') producerId?: string,
    @Query('status') status?: SettlementStatusEnum,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('sortField') sortField?: string,
    @Query('filters') filters?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    this.logger.log('Fetching all settlements');

    const parsedProducerId = producerId ? Number(producerId) : undefined;
    const parsedPage = page ? Number(page) : undefined;
    const parsedLimit = limit ? Number(limit) : undefined;

    return this.financesService.getAllSettlements(
      Number.isFinite(parsedProducerId) ? parsedProducerId : undefined,
      status,
      search,
      sort,
      sortField,
      filters,
      Number.isFinite(parsedPage) ? parsedPage : undefined,
      Number.isFinite(parsedLimit) ? parsedLimit : undefined,
    );
  }

  @Get('settlements/candidates')
  async getSettlementReceptionCandidates(@Query('producerId') producerId: number) {
    this.logger.log(`Fetching settlement candidates for producer: ${producerId}`);
    return this.financesService.getSettlementReceptionCandidates(producerId);
  }

  @Get('settlements/:id')
  async getSettlementById(@Param('id') id: number) {
    this.logger.log(`Fetching settlement: ${id}`);
    return this.financesService.getSettlementById(id);
  }

  @Post('settlements')
  @Roles(RoleEnum.ADMIN)
  async createSettlement(
    @Body() createDto: CreateSettlementDto,
    @GetUser('userId') userId: number,
  ) {
    this.logger.log(
      `Creating settlement for producer: ${createDto.producerId}`,
    );
    return this.financesService.createSettlement(createDto, userId);
  }

  @Put('settlements/:id')
  @Roles(RoleEnum.ADMIN)
  async updateSettlement(
    @Param('id') id: number,
    @Body() updateDto: UpdateSettlementDto,
  ) {
    this.logger.log(`Updating settlement: ${id}`);
    return this.financesService.updateSettlement(id, updateDto);
  }

  @Delete('settlements/:id')
  @Roles(RoleEnum.ADMIN)
  async deleteSettlement(@Param('id') id: number) {
    this.logger.log(`Deleting settlement: ${id}`);
    return this.financesService.deleteSettlement(id);
  }

  @Post('settlements/:id/calculate')
  @Roles(RoleEnum.ADMIN)
  async calculateSettlement(@Param('id') id: number) {
    this.logger.log(`Calculating settlement: ${id}`);
    return this.financesService.calculateSettlement(id);
  }

  @Post('settlements/:id/complete')
  @Roles(RoleEnum.ADMIN)
  async completeSettlement(
    @Param('id') id: number,
    @Body() completeDto: CompleteSettlementDto,
  ) {
    this.logger.log(`Completing settlement: ${id}`);
    return this.financesService.completeSettlement(id, completeDto);
  }

  @Post('settlements/:id/cancel')
  @Roles(RoleEnum.ADMIN)
  async cancelSettlement(@Param('id') id: number) {
    this.logger.log(`Cancelling settlement: ${id}`);
    return this.financesService.cancelSettlement(id);
  }

  @Get('advances/:id/interest')
  async calculateInterest(@Param('id') id: number) {
    this.logger.log(`Calculating interest for advance: ${id}`);
    const advance = await this.financesService.getAdvanceById(id);
    const interest = this.financesService.calculateInterest(advance);
    return { advanceId: id, interest };
  }
}
