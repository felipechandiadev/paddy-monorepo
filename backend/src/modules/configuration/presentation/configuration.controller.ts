import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ConfigurationService } from '../application/configuration.service';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
import { Roles } from '@shared/decorators/roles.decorator';
import { GetUser } from '@shared/decorators/get-user.decorator';
import { RoleEnum } from '@shared/enums';
import {
  CreateTemplateDto,
  CreateAnalysisParamDto,
  UpdateAnalysisParamDto,
  UpdateTemplateDto,
} from '../dto/configuration.dto';

/**
 * Configuration Controller
 * Endpoints para gestión de parámetros del sistema:
 * - Rice Types (variedades de arroz)
 * - Seasons (temporadas de cosecha)
 * - Templates (plantillas de análisis)
 * - Analysis Params (rangos de descuento)
 */
@Controller('configuration')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ConfigurationController {
  private logger = new Logger('ConfigurationController');

  constructor(private configService: ConfigurationService) {}

  // ===== RICE TYPES =====
  @Get('rice-types')
  async getAllRiceTypes() {
    this.logger.log('Fetching all rice types');
    return this.configService.getAllRiceTypes();
  }

  @Get('rice-types/:id')
  async getRiceTypeById(@Param('id') id: number) {
    this.logger.log(`Fetching rice type: ${id}`);
    return this.configService.getRiceTypeById(id);
  }

  @Post('rice-types')
  @Roles(RoleEnum.ADMIN)
  async createRiceType(@Body() createDto: any) {
    this.logger.log(`Creating rice type: ${createDto.name}`);
    return this.configService.createRiceType(createDto);
  }

  @Put('rice-types/:id')
  @Roles(RoleEnum.ADMIN)
  async updateRiceType(
    @Param('id') id: number,
    @Body() updateDto: any,
    @GetUser('userId') userId: number,
  ) {
    this.logger.log(`Updating rice type: ${id}`);
    return this.configService.updateRiceType(id, updateDto, userId);
  }

  @Delete('rice-types/:id')
  @Roles(RoleEnum.ADMIN)
  async deleteRiceType(@Param('id') id: number) {
    this.logger.log(`Deleting rice type: ${id}`);
    return this.configService.deleteRiceType(id);
  }

  // ===== SEASONS =====
  @Get('seasons')
  async getAllSeasons(@Query('search') search?: string) {
    this.logger.log(`Fetching all seasons${search ? ` (search: ${search})` : ''}`);
    return this.configService.getAllSeasons(search);
  }

  @Get('seasons/active')
  async getActiveSeason() {
    this.logger.log('Fetching active season');
    return this.configService.getActiveSeason();
  }

  @Get('seasons/:id')
  async getSeasonById(@Param('id') id: number) {
    this.logger.log(`Fetching season: ${id}`);
    return this.configService.getSeasonById(id);
  }

  @Post('seasons')
  @Roles(RoleEnum.ADMIN)
  async createSeason(@Body() createDto: any) {
    this.logger.log(`Creating season: ${createDto.name}`);
    return this.configService.createSeason(createDto);
  }

  @Put('seasons/:id')
  @Roles(RoleEnum.ADMIN)
  async updateSeason(@Param('id') id: number, @Body() updateDto: any) {
    this.logger.log(`Updating season: ${id}`);
    return this.configService.updateSeason(id, updateDto);
  }

  @Delete('seasons/:id')
  @Roles(RoleEnum.ADMIN)
  async deleteSeason(@Param('id') id: number) {
    this.logger.log(`Deleting season: ${id}`);
    return this.configService.deleteSeason(id);
  }

  // ===== TEMPLATES =====
  @Get('templates')
  async getAllTemplates() {
    this.logger.log('Fetching all templates');
    return this.configService.getAllTemplates();
  }

  @Get('templates/default')
  async getDefaultTemplate() {
    this.logger.log('Fetching default template');
    return this.configService.getDefaultTemplate();
  }

  @Get('templates/:id')
  async getTemplateById(@Param('id') id: number) {
    this.logger.log(`Fetching template: ${id}`);
    return this.configService.getTemplateById(id);
  }

  @Post('templates')
  @Roles(RoleEnum.ADMIN)
  async createTemplate(@Body() createDto: CreateTemplateDto) {
    this.logger.log(`Creating template: ${createDto.name}`);
    return this.configService.createTemplate(createDto);
  }

  @Put('templates/:id')
  @Roles(RoleEnum.ADMIN)
  async updateTemplate(@Param('id') id: number, @Body() updateDto: UpdateTemplateDto) {
    this.logger.log(`Updating template: ${id}`);
    return this.configService.updateTemplate(id, updateDto);
  }

  @Delete('templates/:id')
  @Roles(RoleEnum.ADMIN)
  async deleteTemplate(@Param('id') id: number) {
    this.logger.log(`Deleting template: ${id}`);
    return this.configService.deleteTemplate(id);
  }

  // ===== ANALYSIS PARAMS =====
  @Get('analysis-params')
  // Allow all authenticated users to get analysis params (needed for receptions)
  async getAllAnalysisParams(@Query('includeInactive') includeInactive?: string) {
    const shouldIncludeInactive =
      includeInactive === 'true' || includeInactive === '1';

    this.logger.log(
      `Fetching all analysis params${shouldIncludeInactive ? ' (including inactive)' : ''}`,
    );
    return this.configService.getAllAnalysisParams(shouldIncludeInactive);
  }

  @Get('analysis-params/code/:code')
  async getAnalysisParamsByCode(@Param('code') code: number) {
    this.logger.log(`Fetching analysis params for code: ${code}`);
    return this.configService.getAnalysisParamsByCode(code);
  }

  @Get('analysis-params/:code/percent')
  async getPercentByRange(@Param('code') code: string, @Query('range') range: number) {
    this.logger.log(`[getPercentByRange] Request - Code: ${code}, Range: ${range}`);
    
    // Mapear código string a número
    const codeMap: Record<string, number> = {
      'HUMEDAD': 1,
      'GRANOS_VERDES': 2,
      'IMPUREZAS': 3,
      'VANO': 4,
      'HUALCACHO': 5,
      'GRANOS_MANCHADOS': 6,
      'GRANOS_PELADOS': 7,
      'GRANOS_YESOSOS': 8,
    };
    
    const discountCode = codeMap[code];
    if (!discountCode) {
      this.logger.warn(`Invalid parameter code: ${code}`);
      throw new BadRequestException(`Código de parámetro inválido: ${code}`);
    }

    const rangeNum = Number(range) || 0;
    if (rangeNum <= 0) {
      this.logger.warn(`Invalid range: ${range}`);
      throw new BadRequestException(`Rango inválido: ${range}`);
    }

    this.logger.debug(`Looking up percent for discountCode ${discountCode}, range ${rangeNum}`);
    const percent = await this.configService.getDiscountPercent(discountCode, rangeNum);
    this.logger.log(`Found percent: ${percent}`);
    
    return { data: { percent } };
  }

  @Get('analysis-params/:id')
  async getAnalysisParamById(@Param('id') id: number) {
    this.logger.log(`Fetching analysis param: ${id}`);
    return this.configService.getAnalysisParamById(id);
  }

  @Post('analysis-params')
  @Roles(RoleEnum.ADMIN)
  async createAnalysisParam(@Body() createDto: CreateAnalysisParamDto) {
    this.logger.log(`Creating analysis param`);
    return this.configService.createAnalysisParam(createDto);
  }

  @Put('analysis-params/:id')
  @Roles(RoleEnum.ADMIN)
  async updateAnalysisParam(
    @Param('id') id: number,
    @Body() updateDto: UpdateAnalysisParamDto,
  ) {
    this.logger.log(`Updating analysis param: ${id}`);
    return this.configService.updateAnalysisParam(id, updateDto);
  }

  @Delete('analysis-params/:id')
  @Roles(RoleEnum.ADMIN)
  async deleteAnalysisParam(@Param('id') id: number) {
    this.logger.log(`Deleting analysis param: ${id}`);
    return this.configService.deleteAnalysisParam(id);
  }

  // ===== ROLES =====
  @Get('roles')
  async getRoles() {
    this.logger.log('Fetching available roles');
    return this.configService.getRoles();
  }

  // ===== BANK OPTIONS =====
  @Get('banks')
  async getBanks() {
    this.logger.log('Fetching available banks and account types');
    return this.configService.getBanks();
  }
}
