import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Like } from 'typeorm';
import { DateTime } from 'luxon';
import {
  parseDateString,
  formatDateString,
  compareDateTime,
  isValidDate,
} from '@shared/utils/luxon-utils';
import { RiceType, Season, Template, AnalysisParam } from '../domain/configuration.entity';
import { CreateAnalysisParamDto, UpdateAnalysisParamDto } from '../dto/configuration.dto';
import { BankNameEnum, BankAccountTypeEnum, RoleEnum } from '@shared/enums';
import { AuditService } from '@modules/audit/application/audit.service';
import {
  AuditCategory,
  AuditAction,
  AuditStatus,
  AuditSeverity,
} from '@modules/audit/domain/audit-event.entity';

@Injectable()
export class ConfigurationService {
  constructor(
    @InjectRepository(RiceType)
    private riceTypesRepository: Repository<RiceType>,
    @InjectRepository(Season)
    private seasonsRepository: Repository<Season>,
    @InjectRepository(Template)
    private templatesRepository: Repository<Template>,
    @InjectRepository(AnalysisParam)
    private analysisParamsRepository: Repository<AnalysisParam>,
    private auditService: AuditService,
  ) {}

  // ===== RICE TYPES =====
  async getAllRiceTypes() {
    return this.riceTypesRepository.find({
      where: { deletedAt: IsNull() },
      order: { name: 'ASC' },
    });
  }

  async getRiceTypeById(id: number) {
    const riceType = await this.riceTypesRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!riceType) {
      throw new NotFoundException(`Tipo de arroz con ID ${id} no encontrado`);
    }
    return riceType;
  }

  async createRiceType(createDto: Partial<RiceType>) {
    const existing = await this.riceTypesRepository.findOne({
      where: { code: createDto.code },
    });
    if (existing) {
      throw new BadRequestException('Código de arroz ya existe');
    }
    return this.riceTypesRepository.save(
      this.riceTypesRepository.create(createDto),
    );
  }

  async updateRiceType(id: number, updateDto: Partial<RiceType>, userId?: number) {
    // Capturar valores previos
    const beforeRiceType = await this.getRiceTypeById(id);
    const beforeData = {
      name: beforeRiceType.name,
      code: beforeRiceType.code,
      description: beforeRiceType.description,
      referencePrice: beforeRiceType.referencePrice,
      isActive: beforeRiceType.isActive,
    };

    // Actualizar
    await this.riceTypesRepository.update(id, updateDto);

    // Capturar valores posteriores y loguear auditoría
    const afterRiceType = await this.getRiceTypeById(id);
    const afterData = {
      name: afterRiceType.name,
      code: afterRiceType.code,
      description: afterRiceType.description,
      referencePrice: afterRiceType.referencePrice,
      isActive: afterRiceType.isActive,
    };

    // Log evento de auditoría para UPDATE de tipo de arroz
    this.auditService.logEvent({
      eventCode: 'CONFIG.RICE_TYPES.UPDATE',
      category: AuditCategory.CONFIG,
      action: AuditAction.UPDATE,
      status: AuditStatus.SUCCESS,
      severity: AuditSeverity.WARN,
      actorUserId: userId || null,
      entityType: 'RiceType',
      entityId: id,
      route: '/configuration/rice-types/:id',
      method: 'PUT',
      beforeData,
      afterData,
    });

    return afterRiceType;
  }

  async deleteRiceType(id: number) {
    await this.getRiceTypeById(id);
    await this.riceTypesRepository.softDelete(id);
    return { message: 'Tipo de arroz eliminado' };
  }

  // ===== SEASONS =====
  async getAllSeasons(search?: string) {
    if (!search) {
      return this.seasonsRepository.find({
        where: { deletedAt: IsNull() },
        order: { startDate: 'DESC' },
      });
    }

    const searchTerm = `%${search}%`;
    return this.seasonsRepository.find({
      where: [
        { name: Like(searchTerm), deletedAt: IsNull() },
        { code: Like(searchTerm), deletedAt: IsNull() },
      ],
      order: { startDate: 'DESC' },
    });
  }

  async getSeasonById(id: number) {
    const season = await this.seasonsRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!season) {
      throw new NotFoundException(`Temporada con ID ${id} no encontrada`);
    }
    return season;
  }

  async getActiveSeason() {
    const season = await this.seasonsRepository.findOne({
      where: { isActive: true, deletedAt: IsNull() },
    });
    if (!season) {
      throw new NotFoundException('No hay temporada activa');
    }
    return season;
  }

  async createSeason(createDto: Partial<Season>) {
    const startDate = this.normalizeSeasonDate(createDto.startDate, 'inicio');
    const endDate = this.normalizeSeasonDate(createDto.endDate, 'fin');

    this.validateSeasonDateRange(startDate, endDate);
    await this.ensureSeasonDatesDoNotOverlap(startDate, endDate);

    // Auto-generate code from name if not provided
    const code = createDto.code?.trim() ||
      (createDto.name ?? '').trim().toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '') ||
      `SEASON_${Date.now()}`;

    // Derive year from startDate if not provided
    const year = createDto.year ?? new Date(startDate as unknown as string).getFullYear();

    const existing = await this.seasonsRepository.findOne({
      where: { code, year, deletedAt: IsNull() },
    });

    if (existing) {
      throw new BadRequestException('Temporada con ese código y año ya existe');
    }

    return this.seasonsRepository.save(
      this.seasonsRepository.create({
        ...createDto,
        code,
        year,
        startDate,
        endDate,
      }),
    );
  }

  async updateSeason(id: number, updateDto: Partial<Season>) {
    const season = await this.getSeasonById(id);

    const startDate = this.normalizeSeasonDate(
      updateDto.startDate ?? season.startDate,
      'inicio',
    );
    const endDate = this.normalizeSeasonDate(
      updateDto.endDate ?? season.endDate,
      'fin',
    );

    this.validateSeasonDateRange(startDate, endDate);
    await this.ensureSeasonDatesDoNotOverlap(startDate, endDate, id);

    await this.seasonsRepository.update(id, {
      ...updateDto,
      startDate,
      endDate,
    });
    return this.getSeasonById(id);
  }

  async deleteSeason(id: number) {
    await this.getSeasonById(id);
    await this.seasonsRepository.softDelete(id);
    return { message: 'Temporada eliminada' };
  }

  // ===== TEMPLATES =====
  async getAllTemplates() {
    return this.templatesRepository.find({
      where: { deletedAt: IsNull(), isActive: true },
      order: { isDefault: 'DESC', name: 'ASC' },
    });
  }

  async getTemplateById(id: number) {
    const template = await this.templatesRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!template) {
      throw new NotFoundException(`Plantilla con ID ${id} no encontrada`);
    }
    return template;
  }

  async getDefaultTemplate() {
    const template = await this.templatesRepository.findOne({
      where: { isDefault: true, isActive: true, deletedAt: IsNull() },
    });
    if (!template) {
      throw new NotFoundException('No hay plantilla por defecto configurada');
    }
    return template;
  }

  async getProducerTemplate(producerId: number) {
    // Buscar template específica del productor, si no existe devolver la por defecto
    const producerTemplate = await this.templatesRepository.findOne({
      where: {
        producerId,
        isActive: true,
        deletedAt: IsNull(),
      },
    });

    if (producerTemplate) {
      return producerTemplate;
    }

    return this.getDefaultTemplate();
  }

  async createTemplate(createDto: Partial<Template>) {
    const normalizedGroupToleranceName = this.normalizeGroupToleranceName(
      createDto.groupToleranceName,
    );
    const payload: Partial<Template> = {
      ...createDto,
      groupToleranceName:
        createDto.useToleranceGroup === false
          ? null
          : normalizedGroupToleranceName ?? null,
    };

    // Si es default, desactivar otras
    if (payload.isDefault) {
      await this.templatesRepository.update(
        { isDefault: true },
        { isDefault: false },
      );
    }

    return this.templatesRepository.save(
      this.templatesRepository.create(payload),
    );
  }

  async updateTemplate(id: number, updateDto: Partial<Template>) {
    await this.getTemplateById(id);

    const payload: Partial<Template> = { ...updateDto };
    const normalizedGroupToleranceName = this.normalizeGroupToleranceName(
      updateDto.groupToleranceName,
    );

    if ('groupToleranceName' in updateDto) {
      payload.groupToleranceName = normalizedGroupToleranceName ?? null;
    }

    if (payload.useToleranceGroup === false) {
      payload.groupToleranceName = null;
    }

    if (payload.isDefault) {
      await this.templatesRepository.update(
        { isDefault: true },
        { isDefault: false },
      );
    }

    await this.templatesRepository.update(id, payload);
    return this.getTemplateById(id);
  }

  async deleteTemplate(id: number) {
    await this.getTemplateById(id);
    await this.templatesRepository.softDelete(id);
    return { message: 'Plantilla eliminada' };
  }

  // ===== ANALYSIS PARAMS (Rangos de descuento) =====
  async getAllAnalysisParams(includeInactive = false) {
    const where: Record<string, unknown> = {
      deletedAt: IsNull(),
    };

    if (!includeInactive) {
      where.isActive = true;
    }

    const params = await this.analysisParamsRepository.find({
      where,
      order: { discountCode: 'ASC', rangeStart: 'ASC' },
    });

    // Mapeo de nombres a códigos
    const codeMap: Record<string, string> = {
      'Humedad': 'HUMEDAD',
      'Granos Verdes': 'GRANOS_VERDES',
      'Impurezas': 'IMPUREZAS',
      'Vano': 'VANO',
      'Hualcacho': 'HUALCACHO',
      'Granos Manchados': 'GRANOS_MANCHADOS',
      'Granos Pelados': 'GRANOS_PELADOS',
      'Granos Yesosos': 'GRANOS_YESOSOS',
    };

    // Agrupar por código y nombre de descuento
    const grouped = new Map<number, any>();
    
    params.forEach(param => {
      if (!grouped.has(param.discountCode)) {
        grouped.set(param.discountCode, {
          id: param.discountCode,
          code: codeMap[param.discountName] || param.discountName.toUpperCase().replace(/\s+/g, '_'),
          name: param.discountName,
          description: param.unit,
          ranges: [],
        });
      }
      
      const group = grouped.get(param.discountCode);
      group.ranges.push({
        id: param.id,
        rangeStart: parseFloat(param.rangeStart.toString()),
        rangeEnd: parseFloat(param.rangeEnd.toString()),
        percent: parseFloat(param.discountPercent.toString()),
        priority: Number(param.priority ?? 0),
        isActive: Boolean(param.isActive),
        createdAt: param.createdAt,
        updatedAt: param.updatedAt,
      });
    });

    return {
      data: Array.from(grouped.values()),
    };
  }

  async getAnalysisParamsByCode(discountCode: number) {
    return this.analysisParamsRepository.find({
      where: { discountCode, deletedAt: IsNull(), isActive: true },
      order: { rangeStart: 'ASC' },
    });
  }

  async getAnalysisParamById(id: number) {
    const param = await this.analysisParamsRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!param) {
      throw new NotFoundException(`Parámetro de análisis con ID ${id} no encontrado`);
    }
    return param;
  }

  async getDiscountPercent(discountCode: number, value: number): Promise<number> {
    const param = await this.analysisParamsRepository
      .createQueryBuilder('p')
      .where('p.discountCode = :code', { code: discountCode })
      .andWhere('p.rangeStart <= :value', { value })
      .andWhere('p.rangeEnd >= :value', { value })
      .andWhere('p.isActive = true')
      .andWhere('p.deletedAt IS NULL')
      .orderBy('p.rangeStart', 'DESC')
      .getOne();

    return param?.discountPercent || 0;
  }

  async createAnalysisParam(createDto: CreateAnalysisParamDto) {
    const discountCode = this.requireAnalysisParamNumber(
      this.pickFirstNumber(createDto.paramCode, createDto.discountCode),
      'código del parámetro',
    );
    const rangeStart = this.requireAnalysisParamNumber(
      this.pickFirstNumber(createDto.start, createDto.rangeStart),
      'inicio de rango',
    );
    const rangeEnd = this.requireAnalysisParamNumber(
      this.pickFirstNumber(createDto.end, createDto.rangeEnd),
      'fin de rango',
    );
    const discountPercent = this.requireAnalysisParamNumber(
      this.pickFirstNumber(createDto.percent, createDto.discountPercent),
      'porcentaje de descuento',
    );

    this.validateAnalysisParamRange(rangeStart, rangeEnd);
    await this.ensureAnalysisParamsDoNotOverlap(
      discountCode,
      rangeStart,
      rangeEnd,
    );

    const metadata = await this.resolveAnalysisParamMetadata(
      discountCode,
      createDto.discountName,
      createDto.unit,
    );

    return this.analysisParamsRepository.save(
      this.analysisParamsRepository.create({
        discountCode,
        discountName: metadata.discountName,
        unit: metadata.unit,
        rangeStart,
        rangeEnd,
        discountPercent,
        priority: this.pickFirstNumber(createDto.priority) ?? 0,
        isActive: typeof createDto.isActive === 'boolean' ? createDto.isActive : true,
      }),
    );
  }

  async updateAnalysisParam(id: number, updateDto: UpdateAnalysisParamDto) {
    const current = await this.getAnalysisParamById(id);

    const discountCode = this.requireAnalysisParamNumber(
      this.pickFirstNumber(
        updateDto.paramCode,
        updateDto.discountCode,
        current.discountCode,
      ),
      'código del parámetro',
    );
    const rangeStart = this.requireAnalysisParamNumber(
      this.pickFirstNumber(updateDto.start, updateDto.rangeStart, current.rangeStart),
      'inicio de rango',
    );
    const rangeEnd = this.requireAnalysisParamNumber(
      this.pickFirstNumber(updateDto.end, updateDto.rangeEnd, current.rangeEnd),
      'fin de rango',
    );
    const discountPercent = this.requireAnalysisParamNumber(
      this.pickFirstNumber(
        updateDto.percent,
        updateDto.discountPercent,
        current.discountPercent,
      ),
      'porcentaje de descuento',
    );

    this.validateAnalysisParamRange(rangeStart, rangeEnd);
    await this.ensureAnalysisParamsDoNotOverlap(
      discountCode,
      rangeStart,
      rangeEnd,
      id,
    );

    const metadata = await this.resolveAnalysisParamMetadata(
      discountCode,
      undefined,
      undefined,
      discountCode === Number(current.discountCode) ? current : undefined,
    );

    await this.analysisParamsRepository.update(id, {
      discountCode,
      discountName: metadata.discountName,
      unit: metadata.unit,
      rangeStart,
      rangeEnd,
      discountPercent,
      priority: this.pickFirstNumber(updateDto.priority, current.priority) ?? 0,
      isActive: typeof updateDto.isActive === 'boolean' ? updateDto.isActive : current.isActive,
    });

    return this.getAnalysisParamById(id);
  }

  async deleteAnalysisParam(id: number) {
    await this.getAnalysisParamById(id);
    await this.analysisParamsRepository.softDelete(id);
    return { message: 'Parámetro de análisis eliminado' };
  }

  // ===== ROLES =====
  /**
   * Obtiene los roles disponibles en el sistema
   */
  getRoles() {
    const metadata: Partial<Record<RoleEnum, { label: string; description: string }>> = {
      [RoleEnum.ADMIN]: {
        label: 'Administrador',
        description: 'Acceso total al sistema',
      },
      [RoleEnum.CONSULTANT]: {
        label: 'Consultor',
        description: 'Acceso de solo lectura',
      },
    };

    return Object.values(RoleEnum).map((role) => ({
      id: role,
      label: metadata[role]?.label ?? role,
      description: metadata[role]?.description ?? 'Rol del sistema',
    }));
  }

  // ===== BANK OPTIONS =====
  /**
   * Obtiene la lista de bancos y tipos de cuenta disponibles
   * Usado por el frontend para llenar selectores en la creación de cuentas bancarias
   */
  getBanks() {
    const banks = Object.entries(BankNameEnum).map(([key, value]) => ({
      id: value,
      label: value,
    }));

    const accountTypes = Object.entries(BankAccountTypeEnum).map(([key, value]) => ({
      id: value,
      label: this.formatAccountTypeName(value),
    }));

    return {
      banks,
      accountTypes,
    };
  }

  /**
   * Formatea el nombre del tipo de cuenta para mostrar
   */
  private formatAccountTypeName(type: string): string {
    const typeMap: Record<string, string> = {
      corriente: 'Corriente',
      vista: 'Vista',
      ahorro: 'Ahorro',
      rut: 'RUT',
    };
    return typeMap[type] || type;
  }

  private pickFirstNumber(...values: unknown[]): number | undefined {
    for (const value of values) {
      if (value === null || value === undefined || value === '') {
        continue;
      }

      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }

    return undefined;
  }

  private requireAnalysisParamNumber(
    value: number | undefined,
    fieldLabel: string,
  ): number {
    if (value === undefined || !Number.isFinite(value)) {
      throw new BadRequestException(`El ${fieldLabel} es obligatorio y debe ser numérico`);
    }

    return value;
  }

  private validateAnalysisParamRange(rangeStart: number, rangeEnd: number) {
    if (rangeStart >= rangeEnd) {
      throw new BadRequestException(
        'El inicio del rango debe ser menor que el fin del rango',
      );
    }
  }

  private async resolveAnalysisParamMetadata(
    discountCode: number,
    providedName?: string,
    providedUnit?: string,
    current?: AnalysisParam,
  ): Promise<{ discountName: string; unit: string }> {
    const normalizedName = providedName?.trim();
    const normalizedUnit = providedUnit?.trim();

    if (normalizedName) {
      return {
        discountName: normalizedName,
        unit: normalizedUnit || current?.unit || '%',
      };
    }

    if (current) {
      return {
        discountName: current.discountName,
        unit: normalizedUnit || current.unit || '%',
      };
    }

    const existingParam = await this.analysisParamsRepository.findOne({
      where: { discountCode, deletedAt: IsNull() },
      order: { rangeStart: 'ASC' },
    });

    if (!existingParam) {
      throw new BadRequestException(
        'No existe un parámetro base para el código seleccionado',
      );
    }

    return {
      discountName: existingParam.discountName,
      unit: normalizedUnit || existingParam.unit || '%',
    };
  }

  private async ensureAnalysisParamsDoNotOverlap(
    discountCode: number,
    rangeStart: number,
    rangeEnd: number,
    excludeId?: number,
  ) {
    const query = this.analysisParamsRepository
      .createQueryBuilder('param')
      .where('param.discountCode = :discountCode', { discountCode })
      .andWhere('param.deletedAt IS NULL')
      .andWhere('param.rangeStart <= :rangeEnd', { rangeEnd })
      .andWhere('param.rangeEnd >= :rangeStart', { rangeStart });

    if (excludeId) {
      query.andWhere('param.id <> :excludeId', { excludeId });
    }

    const overlappedRange = await query.orderBy('param.rangeStart', 'ASC').getOne();

    if (overlappedRange) {
      const existingStart = Number(overlappedRange.rangeStart);
      const existingEnd = Number(overlappedRange.rangeEnd);

      throw new BadRequestException(
        `El rango ${rangeStart} - ${rangeEnd} se traslapa con un rango existente (${existingStart} - ${existingEnd}) para el mismo parámetro`,
      );
    }
  }

  private normalizeGroupToleranceName(
    value: unknown,
  ): string | null | undefined {
    if (value === undefined) {
      return undefined;
    }

    if (value === null) {
      return null;
    }

    const normalized = String(value).trim();
    return normalized.length > 0 ? normalized : null;
  }

  private normalizeSeasonDate(
    value: string | Date | undefined,
    field: 'inicio' | 'fin',
  ): string {
    if (!value) {
      throw new BadRequestException(`La fecha de ${field} es obligatoria`);
    }

    const dt = parseDateString(
      value instanceof Date ? value.toISOString().slice(0, 10) : String(value),
    );

    if (!dt || !dt.isValid) {
      throw new BadRequestException(`La fecha de ${field} no es válida`);
    }

    return formatDateString(dt) as string;
  }

  private validateSeasonDateRange(startDate: string, endDate: string) {
    const startDt = parseDateString(startDate);
    const endDt = parseDateString(endDate);

    if (!startDt || !endDt) {
      throw new BadRequestException(
        'Las fechas de inicio y fin deben estar en formato válido YYYY-MM-DD',
      );
    }

    if (compareDateTime(startDt, endDt) > 0) {
      throw new BadRequestException(
        'La fecha de inicio no puede ser posterior a la fecha de fin',
      );
    }
  }

  private async ensureSeasonDatesDoNotOverlap(
    startDate: string,
    endDate: string,
    excludeSeasonId?: number,
  ) {
    const query = this.seasonsRepository
      .createQueryBuilder('season')
      .where('season.deletedAt IS NULL')
      .andWhere('season.startDate <= :endDate', { endDate })
      .andWhere('season.endDate >= :startDate', { startDate });

    if (excludeSeasonId) {
      query.andWhere('season.id <> :excludeSeasonId', { excludeSeasonId });
    }

    const overlappedSeason = await query.orderBy('season.startDate', 'ASC').getOne();

    if (overlappedSeason) {
      const overlapStart = this.normalizeSeasonDate(overlappedSeason.startDate, 'inicio');
      const overlapEnd = this.normalizeSeasonDate(overlappedSeason.endDate, 'fin');

      throw new BadRequestException(
        `El rango de fechas se traslapa con la temporada \"${overlappedSeason.name}\" (${overlapStart} a ${overlapEnd})`,
      );
    }
  }
}
