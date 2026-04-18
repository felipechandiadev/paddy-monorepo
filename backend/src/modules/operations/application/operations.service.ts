import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Brackets } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { DateTime } from 'luxon';
import { formatDateString } from '@shared/utils/luxon-utils';
import { Reception, AnalysisRecord } from '../domain/operations.entity';
import { ReceptionStatusEnum } from '@shared/enums';
import { ConfigurationService } from '@modules/configuration/application/configuration.service';
import { Template } from '@modules/configuration/domain/configuration.entity';
import { CreateReceptionWithAnalysisDto } from '../dto/operations.dto';
import { AuditService } from '@modules/audit/application/audit.service';
import {
  AuditCategory,
  AuditAction,
  AuditStatus,
  AuditSeverity,
} from '@modules/audit/domain/audit-event.entity';

// Type para entrada que acepta receptionDate como string o Date
type CreateReceptionInput = Omit<Partial<Reception>, 'receptionDate'> & { receptionDate?: string | Date | null };
type UpdateReceptionInput = Omit<Partial<Reception>, 'receptionDate'> & { receptionDate?: string | Date | null };

@Injectable()
export class OperationsService {
  constructor(
    @InjectRepository(Reception)
    private receptionsRepository: Repository<Reception>,
    @InjectRepository(AnalysisRecord)
    private analysisRecordsRepository: Repository<AnalysisRecord>,
    private configService: ConfigurationService,
    private auditService: AuditService,
  ) {}

    async getLastReception(): Promise<Reception | null> {
      const lastReception = await this.receptionsRepository.findOne({
        where: { deletedAt: IsNull() },
        relations: ['producer', 'season', 'riceType', 'template'],
        order: { createdAt: 'DESC' },
      });
      return lastReception || null;
    }

  private roundTo2(value: number): number {
    return Math.round(value * 100) / 100;
  }

  private toNumber(value: unknown): number {
    if (value === null || value === undefined || value === '') {
      return 0;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private toOptionalNumber(value: unknown): number | undefined {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  private parseDateInput(value?: Date | string | null): string | null {
    if (!value) {
      return null;
    }

    let dateStr: string;

    if (value instanceof Date) {
      // Convertir Date a string UTC
      dateStr = value.toISOString().split('T')[0];
    } else {
      // Ya es string, extraer solo la parte de fecha
      dateStr = value;
    }

    // Validar formato YYYY-MM-DD
    const dateMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (dateMatch) {
      const [, year, month, day] = dateMatch;
      // Devolver en formato MySQL: "YYYY-MM-DD 12:00:00"
      return `${year}-${month}-${day} 12:00:00`;
    }

    return null;
  }

  private calculateReceptionTotals(
    reception: Partial<Reception>,
    analysis: Partial<AnalysisRecord>,
  ): Pick<Reception, 'totalDiscountKg' | 'bonusKg' | 'finalNetWeight' | 'dryPercent'> {
    const netWeight = this.toNumber(reception.netWeight);
    const summaryPenalty = this.toOptionalNumber(analysis.summaryPenaltyKg);
    const summaryPercent = this.toNumber(
      analysis.summaryPercent ?? analysis.totalGroupPercent,
    );

    const totalDiscountKg = Math.round(
      summaryPenalty ?? (netWeight * summaryPercent) / 100,
    );

    const bonusEnabled = Boolean(analysis.bonusEnabled);
    const bonusPercent = this.toNumber(analysis.bonusPercent);
    const bonusKg =
      bonusEnabled && bonusPercent > 0
        ? Math.round((netWeight * bonusPercent) / 100)
        : 0;

    const finalNetWeight = Math.round(netWeight - totalDiscountKg + bonusKg);
    const dryPercent = this.toNumber(
      analysis.dryPercent ?? reception.dryPercent,
    );

    return {
      totalDiscountKg,
      bonusKg,
      finalNetWeight,
      dryPercent,
    };
  }

  // ===== RECEPTIONS =====
  async getAllReceptions(
    status?: ReceptionStatusEnum,
    includeDeleted = false,
    search?: string,
    sort?: string,
    sortField?: string,
    filters?: string,
    page = 1,
    limit = 25,
  ) {
    const normalizedSearch = search?.trim();
    const normalizedSort = sort?.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    const normalizedFilters = filters?.trim();
    const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const safeLimit =
      Number.isFinite(limit) && limit > 0
        ? Math.min(Math.floor(limit), 500)
        : 25;
    const sortableColumns: Record<string, string> = {
      id: 'reception.id',
      guide: 'reception.guideNumber',
      producer: 'producer.name',
      season: 'season.name',
      riceType: 'riceType.name',
      licensePlate: 'reception.licensePlate',
      grossWeight: 'reception.grossWeight',
      tare: 'reception.tareWeight',
      netWeight: 'reception.netWeight',
      paddyNeto: 'reception.finalNetWeight',
      price: 'reception.ricePrice',
      status: 'reception.status',
      createdAt: 'reception.createdAt',
    };
    const filterableColumns: Record<string, string> = {
      id: 'CAST(reception.id AS CHAR)',
      guide: 'reception.guideNumber',
      producer: 'producer.name',
      season: "CONCAT(COALESCE(season.code, ''), ' ', COALESCE(season.name, ''))",
      riceType: 'riceType.name',
      licensePlate: 'reception.licensePlate',
      grossWeight: 'CAST(reception.grossWeight AS CHAR)',
      tare: 'CAST(reception.tareWeight AS CHAR)',
      netWeight: 'CAST(reception.netWeight AS CHAR)',
      paddyNeto: 'CAST(reception.finalNetWeight AS CHAR)',
      price: 'CAST(reception.ricePrice AS CHAR)',
    };
    const normalizedSortField = sortField?.trim() || 'createdAt';
    const sortColumn = sortableColumns[normalizedSortField] || 'reception.createdAt';

    const queryBuilder = this.receptionsRepository
      .createQueryBuilder('reception')
      .leftJoinAndSelect('reception.producer', 'producer')
      .leftJoinAndSelect('reception.season', 'season')
      .leftJoinAndSelect('reception.riceType', 'riceType')
      .leftJoinAndSelect('reception.template', 'template');

    if (includeDeleted) {
      queryBuilder.withDeleted();
    } else {
      queryBuilder.andWhere('reception.deletedAt IS NULL');
    }

    if (status) {
      queryBuilder.andWhere('reception.status = :status', { status });
    }

    if (normalizedSearch) {
      const searchPattern = `%${normalizedSearch}%`;

      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('CAST(reception.id AS CHAR) LIKE :searchPattern', {
            searchPattern,
          })
            .orWhere('reception.guideNumber LIKE :searchPattern', {
              searchPattern,
            })
            .orWhere('reception.licensePlate LIKE :searchPattern', {
              searchPattern,
            })
            .orWhere('producer.name LIKE :searchPattern', {
              searchPattern,
            })
            .orWhere('producer.rut LIKE :searchPattern', {
              searchPattern,
            })
            .orWhere('season.name LIKE :searchPattern', {
              searchPattern,
            })
            .orWhere('season.code LIKE :searchPattern', {
              searchPattern,
            })
            .orWhere('riceType.name LIKE :searchPattern', {
              searchPattern,
            });
        }),
      );
    }

    if (normalizedFilters) {
      const parsedFilters = normalizedFilters
        .split(',')
        .map((filterPair) => {
          const separatorIndex = filterPair.indexOf('-');

          if (separatorIndex <= 0) {
            return null;
          }

          const field = filterPair.slice(0, separatorIndex).trim();
          const rawValue = filterPair.slice(separatorIndex + 1).trim();

          if (!field || !rawValue) {
            return null;
          }

          let decodedValue = rawValue;
          try {
            decodedValue = decodeURIComponent(rawValue);
          } catch {
            decodedValue = rawValue;
          }

          const value = decodedValue.trim();
          if (!value) {
            return null;
          }

          return { field, value };
        })
        .filter((item): item is { field: string; value: string } => item !== null);

      parsedFilters.forEach(({ field, value }, index) => {
        if (field === 'status') {
          const normalizedStatus = value.toLowerCase();

          if (normalizedStatus.includes('anulad')) {
            queryBuilder.andWhere('reception.deletedAt IS NOT NULL');
            return;
          }

          if (normalizedStatus.includes('liquid') || normalizedStatus.includes('settled')) {
            const statusSettledParam = `status_settled_${index}`;
            queryBuilder.andWhere(`reception.status = :${statusSettledParam}`, {
              [statusSettledParam]: ReceptionStatusEnum.SETTLED,
            });
            return;
          }

          if (normalizedStatus.includes('analiz') || normalizedStatus.includes('analyz')) {
            const statusAnalyzedParam = `status_analyzed_${index}`;
            queryBuilder.andWhere(`reception.status = :${statusAnalyzedParam}`, {
              [statusAnalyzedParam]: ReceptionStatusEnum.ANALYZED,
            });
            return;
          }

          if (normalizedStatus.includes('cancel')) {
            const statusCancelledParam = `status_cancelled_${index}`;
            queryBuilder.andWhere(`reception.status = :${statusCancelledParam}`, {
              [statusCancelledParam]: ReceptionStatusEnum.CANCELLED,
            });
            return;
          }

          const statusLikeParam = `status_like_${index}`;
          queryBuilder.andWhere(`LOWER(reception.status) LIKE :${statusLikeParam}`, {
            [statusLikeParam]: `%${normalizedStatus}%`,
          });
          return;
        }

        if (field === 'createdAt') {
          const createdAtParam = `created_at_${index}`;
          queryBuilder.andWhere(
            new Brackets((qb) => {
              qb.where(`DATE_FORMAT(reception.createdAt, '%Y-%m-%d') LIKE :${createdAtParam}`, {
                [createdAtParam]: `%${value}%`,
              }).orWhere(
                `DATE_FORMAT(reception.createdAt, '%d/%m/%Y') LIKE :${createdAtParam}`,
                {
                  [createdAtParam]: `%${value}%`,
                },
              );
            }),
          );
          return;
        }

        const filterExpression = filterableColumns[field];
        if (!filterExpression) {
          return;
        }

        const filterParam = `filter_${field}_${index}`;
        queryBuilder.andWhere(`${filterExpression} LIKE :${filterParam}`, {
          [filterParam]: `%${value}%`,
        });
      });
    }

    queryBuilder.orderBy(sortColumn, normalizedSort);
    if (sortColumn !== 'reception.id') {
      queryBuilder.addOrderBy('reception.id', 'DESC');
    }

    const [data, total] = await queryBuilder
      .skip((safePage - 1) * safeLimit)
      .take(safeLimit)
      .getManyAndCount();

    return {
      data,
      total,
      page: safePage,
      limit: safeLimit,
    };
  }

  async getAllReceptionsForExport(
    status?: ReceptionStatusEnum,
    includeDeleted = false,
    search?: string,
    sort?: string,
    sortField?: string,
    filters?: string,
  ): Promise<Reception[]> {
    const chunkSize = 500;
    const firstPage = await this.getAllReceptions(
      status,
      includeDeleted,
      search,
      sort,
      sortField,
      filters,
      1,
      chunkSize,
    );

    const receptions = [...firstPage.data];
    const totalPages = Math.ceil(firstPage.total / chunkSize);

    for (let currentPage = 2; currentPage <= totalPages; currentPage += 1) {
      const pageResult = await this.getAllReceptions(
        status,
        includeDeleted,
        search,
        sort,
        sortField,
        filters,
        currentPage,
        chunkSize,
      );

      receptions.push(...pageResult.data);
    }

    return receptions;
  }

  private formatReceptionStatusLabel(reception: Reception): string {
    if (reception.deletedAt) {
      return 'Anulada';
    }

    if (reception.status === ReceptionStatusEnum.SETTLED) {
      return 'Liquidada';
    }

    if (reception.status === ReceptionStatusEnum.ANALYZED) {
      return 'Analizada';
    }

    return 'Cancelada';
  }

  private formatDateValue(value?: Date | string | null): string {
    if (!value) {
      return '';
    }

    const parsedDate = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
      return '';
    }

    return new Intl.DateTimeFormat('es-CL', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(parsedDate);
  }

  private buildReceptionsExportFileName(): string {
    const now = new Date();
    const padded = (value: number) => value.toString().padStart(2, '0');

    const timestamp = `${now.getFullYear()}${padded(now.getMonth() + 1)}${padded(now.getDate())}_${padded(now.getHours())}${padded(now.getMinutes())}${padded(now.getSeconds())}`;
    return `recepciones_${timestamp}.xlsx`;
  }

  async generateReceptionsExcel(
    status?: ReceptionStatusEnum,
    includeDeleted = false,
    search?: string,
    sort?: string,
    sortField?: string,
    filters?: string,
  ): Promise<{ fileName: string; fileBuffer: Buffer }> {
    const receptions = await this.getAllReceptionsForExport(
      status,
      includeDeleted,
      search,
      sort,
      sortField,
      filters,
    );

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Paddy';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Recepciones');
    worksheet.views = [{ state: 'frozen', ySplit: 1 }];

    worksheet.columns = [
      { header: 'Folio', key: 'id' },
      { header: 'Guía', key: 'guideNumber' },
      { header: 'Fecha Recepción', key: 'createdAt' },
      { header: 'Productor', key: 'producerName' },
      { header: 'RUT Productor', key: 'producerRut' },
      { header: 'Patente', key: 'licensePlate' },
      { header: 'Peso Bruto (kg)', key: 'grossWeight' },
      { header: 'Tara (kg)', key: 'tareWeight' },
      { header: 'Peso Neto (kg)', key: 'netWeight' },
      { header: 'Paddy Neto (kg)', key: 'finalNetWeight' },
      { header: 'Precio Arroz (CLP)', key: 'ricePrice' },
      { header: 'Estado', key: 'statusLabel' },
      { header: 'Tipo de Arroz', key: 'riceTypeName' },
      { header: 'Temporada', key: 'seasonName' },
    ];

    receptions.forEach((reception) => {
      // Si finalNetWeight es null/undefined, usar netWeight (caso de recepciones sin análisis)
      const paddyNeto = reception.finalNetWeight ?? reception.netWeight ?? 0;
      
      worksheet.addRow({
        id: Number(reception.id),
        guideNumber: reception.guideNumber || '',
        createdAt: this.formatDateValue(reception.createdAt),
        producerName: reception.producer?.name || '',
        producerRut: reception.producer?.rut || '',
        licensePlate: reception.licensePlate || '',
        grossWeight: Number(reception.grossWeight || 0),
        tareWeight: Number(reception.tareWeight || 0),
        netWeight: Number(reception.netWeight || 0),
        finalNetWeight: Number(paddyNeto),
        ricePrice: Number(reception.ricePrice || 0),
        statusLabel: this.formatReceptionStatusLabel(reception),
        riceTypeName: reception.riceType?.name || '',
        seasonName: reception.season?.name || '',
      });
    });

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.autoFilter = {
      from: 'A1',
      to: 'N1',
    };

    ['G', 'H', 'I', 'J'].forEach((columnKey) => {
      worksheet.getColumn(columnKey).numFmt = '#,##0';
    });
    worksheet.getColumn('K').numFmt = '$#,##0';

    worksheet.columns.forEach((column) => {
      let maxLength = 12;

      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellValue = cell.value === null || cell.value === undefined ? '' : String(cell.value);
        maxLength = Math.max(maxLength, cellValue.length + 2);
      });

      column.width = Math.min(maxLength, 45);
    });

    const rawBuffer = await workbook.xlsx.writeBuffer();
    const fileBuffer = Buffer.isBuffer(rawBuffer)
      ? rawBuffer
      : Buffer.from(rawBuffer as ArrayBuffer);

    return {
      fileName: this.buildReceptionsExportFileName(),
      fileBuffer,
    };
  }

  async getReceptionById(id: number) {
    const reception = await this.receptionsRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['producer', 'season', 'riceType', 'template'],
    });

    if (!reception) {
      throw new NotFoundException(`Recepción con ID ${id} no encontrada`);
    }

    return reception;
  }

  async getReceptionsByProducer(
    producerId: number,
    status?: ReceptionStatusEnum,
  ) {
    const where: Record<string, unknown> = { producerId, deletedAt: IsNull() };
    if (status) {
      where.status = status;
    }

    return this.receptionsRepository.find({
      where,
      relations: ['season', 'riceType'],
      order: { createdAt: 'DESC' },
    });
  }

  async createReception(createDto: CreateReceptionInput, userId: number) {
    // Validar que template existe
    await this.configService.getTemplateById(createDto.templateId);

    // Calcular netWeight = grossWeight - tareWeight
    const netWeight = Math.round(
      createDto.grossWeight - createDto.tareWeight
    );

    // Parse reception date or use null (will be set by creation timestamp)
    const receptionDate = this.parseDateInput(createDto.receptionDate);
    const receptionBookNumber =
      typeof createDto.receptionBookNumber === 'string'
        ? createDto.receptionBookNumber.trim() || null
        : null;

    const reception = this.receptionsRepository.create({
      ...createDto,
      netWeight,
      status: ReceptionStatusEnum.CANCELLED,
      totalDiscountKg: 0,
      bonusKg: 0,
      finalNetWeight: netWeight,
      dryPercent: createDto.dryPercent ?? 0,
      receptionDate: receptionDate || null,
      receptionBookNumber,
      userId,
    });

    const savedReception = await this.receptionsRepository.save(reception);

    if (!savedReception.receptionBookNumber) {
      savedReception.receptionBookNumber = String(savedReception.id);
      savedReception.updatedAt = new Date();
      await this.receptionsRepository.save(savedReception);
    }

    return savedReception;
  }

  async createReceptionWithAnalysis(
    createDto: CreateReceptionWithAnalysisDto,
    userId: number,
  ) {
    const template = await this.configService.getTemplateById(
      createDto.reception.templateId,
    );

    return this.receptionsRepository.manager.transaction(async (manager) => {
      const receptionsRepo = manager.getRepository(Reception);
      const analysisRepo = manager.getRepository(AnalysisRecord);

      const netWeight = Math.round(
        createDto.reception.grossWeight - createDto.reception.tareWeight
      );

      const receptionDate = this.parseDateInput(createDto.reception.receptionDate);

      const reception = receptionsRepo.create({
        ...createDto.reception,
        netWeight,
        status: ReceptionStatusEnum.ANALYZED,
        receptionDate: receptionDate || null,
        userId,
      });

      const savedReception = await receptionsRepo.save(reception);

      if (!savedReception.receptionBookNumber) {
        savedReception.receptionBookNumber = String(savedReception.id);
        savedReception.updatedAt = new Date();
        await receptionsRepo.save(savedReception);
      }

      const normalizedPayload = this.normalizeAnalysisRecordPayload(
        {
          ...createDto.analysis,
          receptionId: savedReception.id,
          templateId:
            createDto.analysis.templateId ?? createDto.reception.templateId,
        },
        savedReception,
        template,
      );

      const analysis = analysisRepo.create({
        ...createDto.analysis,
        ...normalizedPayload,
        receptionId: savedReception.id,
        userId,
      });

      const savedAnalysis = await analysisRepo.save(analysis);
      const receptionTotals = this.calculateReceptionTotals(
        savedReception,
        savedAnalysis,
      );

      await receptionsRepo.update(
        { id: savedReception.id },
        {
          ...receptionTotals,
          updatedAt: new Date(),
        },
      );

      Object.assign(savedReception, receptionTotals);

      return {
        receptionId: savedReception.id,
        reception: savedReception,
        analysis: savedAnalysis,
      };
    });
  }

  async updateReception(id: number, updateDto: UpdateReceptionInput, userId?: number) {
    const reception = await this.getReceptionById(id);

    // Capturar valores previos
    const beforeData = {
      producerId: reception.producerId,
      seasonId: reception.seasonId,
      riceTypeId: reception.riceTypeId,
      guideNumber: reception.guideNumber,
      grossWeight: reception.grossWeight,
      tareWeight: reception.tareWeight,
      netWeight: reception.netWeight,
      ricePrice: reception.ricePrice,
      totalDiscountKg: reception.totalDiscountKg,
      bonusKg: reception.bonusKg,
      finalNetWeight: reception.finalNetWeight,
      notes: reception.notes,
      status: reception.status,
    };

    // No permitir cambiar status aquí (debe hacerse vía endpoints específicos)
    delete updateDto.status;

    // Log qué recibimos
    console.log('[BACKEND] updateReception called with receptionDate in payload:', 'receptionDate' in updateDto);
    console.log('[BACKEND] updateDto.receptionDate value:', updateDto.receptionDate);

    // Parse receptionDate if provided - now returns string "YYYY-MM-DD 12:00:00"
    if (updateDto.receptionDate !== undefined && updateDto.receptionDate !== null) {
      console.log('[BACKEND] 🔄 Processing receptionDate...');
      
      const dateStr = typeof updateDto.receptionDate === 'string' 
        ? updateDto.receptionDate 
        : (updateDto.receptionDate as Date).toISOString().split('T')[0];
      
      console.log('[BACKEND] receptionDate received (raw):', dateStr);
      
      const parsedDate = this.parseDateInput(dateStr);
      console.log('[BACKEND] receptionDate parsed result:', parsedDate);
      
      if (parsedDate) {
        reception.receptionDate = parsedDate;
        console.log('[BACKEND] ✅ receptionDate set to:', parsedDate);
      } else {
        console.log('[BACKEND] ❌ parseDateInput returned null for:', dateStr);
      }
      
      delete updateDto.receptionDate;
    } else {
      console.log('[BACKEND] ⏭️  No receptionDate in updateDto, skipping');
    }

    if (updateDto.grossWeight || updateDto.tareWeight) {
      updateDto.netWeight = Math.round(
        (updateDto.grossWeight || reception.grossWeight) -
        (updateDto.tareWeight || reception.tareWeight)
      );
       // If reception is not analyzed, recalculate finalNetWeight
       if (reception.status === ReceptionStatusEnum.CANCELLED) {
         const netWeight = updateDto.netWeight;
        const totalDiscountKg = Number(reception.totalDiscountKg) || 0;
        const bonusKg = Number(reception.bonusKg) || 0;
         updateDto.finalNetWeight = Math.round(netWeight - totalDiscountKg + bonusKg);
       }
    }

    Object.assign(reception, updateDto);
    reception.updatedAt = new Date();

    const updatedReception = await this.receptionsRepository.save(reception);

    // Re-fetch to verify the date was saved correctly as string
    if (reception.receptionDate) {
      const refreshed = await this.receptionsRepository.findOne({
        where: { id: updatedReception.id }
      });
      if (refreshed && refreshed.receptionDate) {
        Object.assign(updatedReception, refreshed);
        console.log('[BACKEND] receptionDate persisted as:', updatedReception.receptionDate);
      }
    }

    // Capturar valores posteriores y loguear auditoría
    const afterData = {
      producerId: updatedReception.producerId,
      seasonId: updatedReception.seasonId,
      riceTypeId: updatedReception.riceTypeId,
      guideNumber: updatedReception.guideNumber,
      grossWeight: updatedReception.grossWeight,
      tareWeight: updatedReception.tareWeight,
      netWeight: updatedReception.netWeight,
      ricePrice: updatedReception.ricePrice,
      totalDiscountKg: updatedReception.totalDiscountKg,
      bonusKg: updatedReception.bonusKg,
      finalNetWeight: updatedReception.finalNetWeight,
      notes: updatedReception.notes,
      status: updatedReception.status,
    };

    // Log evento de auditoría para UPDATE de recepción
    this.auditService.logEvent({
      eventCode: 'OPS.RECEPTIONS.UPDATE',
      category: AuditCategory.OPERATIONS,
      action: AuditAction.UPDATE,
      status: AuditStatus.SUCCESS,
      severity: AuditSeverity.WARN,
      actorUserId: userId || null,
      entityType: 'Reception',
      entityId: id,
      route: '/operations/receptions/:id',
      method: 'PUT',
      beforeData,
      afterData,
    });

    return updatedReception;
  }

  async updateReceptionRicePrice(
    receptionId: number,
    ricePrice: number,
    userId?: number,
  ) {
    const reception = await this.getReceptionById(receptionId);

    if (reception.status === ReceptionStatusEnum.SETTLED) {
      throw new BadRequestException(
        'No se puede editar el precio de una recepción liquidada',
      );
    }

    reception.ricePrice = ricePrice;
    if (userId) {
      reception.userId = userId;
    }
    reception.updatedAt = new Date();

    const savedReception = await this.receptionsRepository.save(reception);

    return {
      receptionId: savedReception.id,
      ricePrice: Number(savedReception.ricePrice ?? ricePrice),
    };
  }

  async deleteReception(id: number) {
    const reception = await this.getReceptionById(id);

    reception.status = ReceptionStatusEnum.CANCELLED;
    reception.updatedAt = new Date();
    await this.receptionsRepository.save(reception);

    await this.analysisRecordsRepository.softDelete({ receptionId: id });
    await this.receptionsRepository.softDelete(id);

    return {
      message: 'Recepción anulada',
      receptionId: id,
      status: ReceptionStatusEnum.CANCELLED,
    };
  }

  // ===== ANALYSIS RECORDS =====
  async getAnalysisRecord(receptionId: number) {
    const analysis = await this.analysisRecordsRepository.findOne({
      where: { receptionId, deletedAt: IsNull() },
      relations: ['reception'],
    });

    if (!analysis) {
      throw new NotFoundException(
        `Registro de análisis para recepción ${receptionId} no encontrado`,
      );
    }

    return analysis;
  }

  async createAnalysisRecord(
    createDto: Partial<AnalysisRecord>,
    userId: number,
  ) {
    // Validar que la recepción existe
    const reception = await this.getReceptionById(createDto.receptionId);

    // No puede haber 2 análisis para la misma recepción
    const existing = await this.analysisRecordsRepository.findOne({
      where: { receptionId: createDto.receptionId, deletedAt: IsNull() },
    });

    if (existing) {
      throw new BadRequestException(
        'Ya existe un análisis para esta recepción',
      );
    }

    const normalizedPayload = this.normalizeAnalysisRecordPayload(
      createDto,
      reception,
      reception.template,
    );

    const analysisRecord = this.analysisRecordsRepository.create({
      ...createDto,
      ...normalizedPayload,
      userId,
    });

    const saved = await this.analysisRecordsRepository.save(analysisRecord);
    const receptionTotals = this.calculateReceptionTotals(reception, saved);

    // Cambiar status de reception a "analyzed"
    await this.receptionsRepository.update(
      { id: createDto.receptionId },
      {
        status: ReceptionStatusEnum.ANALYZED,
        ...receptionTotals,
        updatedAt: new Date(),
      },
    );

    return saved;
  }

  async updateAnalysisRecord(
    receptionId: number,
    updateDto: Partial<AnalysisRecord>,
    userId?: number,
  ) {
    const analysis = await this.getAnalysisRecord(receptionId);
    const reception = await this.getReceptionById(receptionId);

    // Capturar valores previos
    const beforeData = JSON.parse(JSON.stringify(analysis));
    delete beforeData.id;
    delete beforeData.createdAt;
    delete beforeData.updatedAt;

    const mergedPayload: Partial<AnalysisRecord> = {
      ...analysis,
      ...updateDto,
    };
    const normalizedPayload = this.normalizeAnalysisRecordPayload(
      mergedPayload,
      reception,
      reception.template,
    );

    Object.assign(analysis, updateDto, normalizedPayload);
    if (userId) {
      analysis.userId = userId;
    }
    const savedAnalysis = await this.analysisRecordsRepository.save(analysis);
    const receptionTotals = this.calculateReceptionTotals(
      reception,
      savedAnalysis,
    );

    await this.receptionsRepository.update(
      { id: receptionId },
      {
        ...receptionTotals,
        updatedAt: new Date(),
      },
    );

    // Capturar valores posteriores y loguear auditoría
    const afterData = JSON.parse(JSON.stringify(savedAnalysis));
    delete afterData.id;
    delete afterData.createdAt;
    delete afterData.updatedAt;

    // Log evento de auditoría para UPDATE de análisis
    this.auditService.logEvent({
      eventCode: 'OPS.ANALYSIS.UPDATE',
      category: AuditCategory.OPERATIONS,
      action: AuditAction.UPDATE,
      status: AuditStatus.SUCCESS,
      severity: AuditSeverity.WARN,
      actorUserId: userId || null,
      entityType: 'AnalysisRecord',
      entityId: analysis.id,
      route: '/operations/receptions/:receptionId/analysis',
      method: 'PUT',
      beforeData,
      afterData,
    });

    return savedAnalysis;
  }

  async updateAnalysisDryPercent(
    receptionId: number,
    dryPercent: number,
    userId?: number,
  ) {
    const reception = await this.getReceptionById(receptionId);

    if (reception.status === ReceptionStatusEnum.SETTLED) {
      throw new BadRequestException(
        'No se puede editar el secado de una recepción liquidada',
      );
    }

    const analysis = await this.getAnalysisRecord(receptionId);

    analysis.dryPercent = dryPercent;
    const normalizedPayload = this.normalizeAnalysisRecordPayload(
      {
        ...analysis,
        dryPercent,
      },
      reception,
      reception.template,
    );
    Object.assign(analysis, normalizedPayload);

    if (userId) {
      analysis.userId = userId;
    }

    const savedAnalysis = await this.analysisRecordsRepository.save(analysis);

    // Mantener el valor sincronizado en recepción como respaldo para consultas históricas.
    await this.receptionsRepository.update(
      { id: receptionId },
      { dryPercent, updatedAt: new Date() },
    );

    return {
      receptionId,
      dryPercent: Number(savedAnalysis.dryPercent ?? dryPercent),
      analysisRecordId: savedAnalysis.id,
    };
  }

  async deleteAnalysisRecord(receptionId: number) {
    const analysis = await this.getAnalysisRecord(receptionId);

    await this.analysisRecordsRepository.softDelete(analysis.id);

    // Revertir status de reception a "cancelled"
    await this.receptionsRepository.update(
      { id: receptionId },
      {
        status: ReceptionStatusEnum.CANCELLED,
        totalDiscountKg: null,
        bonusKg: null,
        finalNetWeight: null,
        updatedAt: new Date(),
      },
    );

    return { message: 'Análisis eliminado' };
  }

  // ===== CÁLCULOS DE DESCUENTOS =====
  async calculateDiscounts(receptionId: number): Promise<any> {
    const reception = await this.getReceptionById(receptionId);
    const analysis = await this.getAnalysisRecord(receptionId);
    const template = await this.configService.getTemplateById(
      reception.templateId,
    );

    let totalDiscountKg = 0;
    let bonusKg = 0;

    // Aplicar descuentos según parámetros de análisis
    if (analysis.humedadPercent) {
      totalDiscountKg += (reception.netWeight * analysis.humedadPercent) / 100;
    }
    if (analysis.impurezasPercent) {
      totalDiscountKg += (reception.netWeight * analysis.impurezasPercent) / 100;
    }

    const groupPercentBase = Number(
      analysis.totalGroupPercent ?? analysis.summaryPercent ?? 0,
    );

    // Aplicar bonificación
    if (template.availableBonus && groupPercentBase < 2) {
      bonusKg = (reception.netWeight * template.toleranceBonus) / 100;
    }

    const finalNetWeight =
      reception.netWeight - totalDiscountKg + bonusKg;

    return {
      totalDiscountKg: Math.round(totalDiscountKg * 100) / 100,
      bonusKg: Math.round(bonusKg * 100) / 100,
      finalNetWeight: Math.round(finalNetWeight * 100) / 100,
    };
  }

  private normalizeAnalysisRecordPayload(
    source: Partial<AnalysisRecord>,
    reception: Reception,
    template?: Template,
  ): Partial<AnalysisRecord> {
    const parseNumber = (value: unknown): number | undefined => {
      if (value === null || value === undefined || value === '') {
        return undefined;
      }

      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : undefined;
    };

    const toBoolean = (value: unknown, fallback: boolean): boolean => {
      if (typeof value === 'boolean') {
        return value;
      }

      if (typeof value === 'number') {
        return value === 1;
      }

      if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();

        if (['true', '1', 'yes', 'si', 'on'].includes(normalized)) {
          return true;
        }

        if (['false', '0', 'no', 'off'].includes(normalized)) {
          return false;
        }
      }

      return fallback;
    };

    const roundTo2 = (value: number): number => Math.round(value * 100) / 100;
    const sumNumbers = (values: Array<number | undefined>): number =>
      values.reduce((sum, current) => sum + Number(current ?? 0), 0);

    const humedadValue = parseNumber(source.humedadValue ?? source.humedadRange);
    const impurezasValue = parseNumber(source.impurezasValue ?? source.impurezasRange);
    const verdesValue = parseNumber(source.verdesValue ?? source.verdesRange);
    const manchadosValue = parseNumber(source.manchadosValue ?? source.manchadosRange);
    const yesososValue = parseNumber(source.yesososValue ?? source.yesososRange);
    const peladosValue = parseNumber(source.peladosValue ?? source.peladosRange);
    const vanoValue = parseNumber(source.vanoValue ?? source.vanoRange);
    const hualcachoValue = parseNumber(source.hualcachoValue ?? source.hualcachoRange);

    const humedadPercent = parseNumber(source.humedadPercent ?? template?.percentHumedad);
    const impurezasPercent = parseNumber(source.impurezasPercent ?? template?.percentImpurezas);
    const verdesPercent = parseNumber(source.verdesPercent ?? template?.percentGranosVerdes);
    const vanoPercent = parseNumber(source.vanoPercent ?? template?.percentVano);
    const hualcachoPercent = parseNumber(
      source.hualcachoPercent ?? template?.percentHualcacho,
    );
    const manchadosPercent = parseNumber(
      source.manchadosPercent ?? template?.percentGranosManchados,
    );
    const peladosPercent = parseNumber(source.peladosPercent ?? template?.percentGranosPelados);
    const yesososPercent = parseNumber(source.yesososPercent ?? template?.percentGranosYesosos);

    const humedadToleranceInput = parseNumber(source.humedadTolerance);
    const impurezasToleranceInput = parseNumber(source.impurezasTolerance);
    const verdesToleranceInput = parseNumber(source.verdesTolerance);
    const vanoToleranceInput = parseNumber(source.vanoTolerance);
    const hualcachoToleranceInput = parseNumber(source.hualcachoTolerance);
    const manchadosToleranceInput = parseNumber(source.manchadosTolerance);
    const peladosToleranceInput = parseNumber(source.peladosTolerance);
    const yesososToleranceInput = parseNumber(source.yesososTolerance);

    const useToleranceGroup = toBoolean(
      source.useToleranceGroup,
      template?.useToleranceGroup ?? false,
    );
    const groupToleranceName =
      source.groupToleranceName ?? template?.groupToleranceName ?? null;
    const groupToleranceValue = parseNumber(
      source.groupToleranceValue ?? source.groupTolerance ?? template?.groupToleranceValue,
    );

    const humedadIsGroup = toBoolean(
      source.humedadIsGroup,
      template?.groupToleranceHumedad ?? false,
    );
    const verdesIsGroup = toBoolean(
      source.verdesIsGroup,
      template?.groupToleranceGranosVerdes ?? false,
    );
    const impurezasIsGroup = toBoolean(
      source.impurezasIsGroup,
      template?.groupToleranceImpurezas ?? false,
    );
    const vanoIsGroup = toBoolean(
      source.vanoIsGroup,
      template?.groupToleranceVano ?? false,
    );
    const hualcachoIsGroup = toBoolean(
      source.hualcachoIsGroup,
      template?.groupToleranceHualcacho ?? false,
    );
    const manchadosIsGroup = toBoolean(
      source.manchadosIsGroup,
      template?.groupToleranceGranosManchados ?? false,
    );
    const peladosIsGroup = toBoolean(
      source.peladosIsGroup,
      template?.groupToleranceGranosPelados ?? false,
    );
    const yesososIsGroup = toBoolean(
      source.yesososIsGroup,
      template?.groupToleranceGranosYesosos ?? false,
    );

    const groupedFlags = [
      humedadIsGroup,
      verdesIsGroup,
      impurezasIsGroup,
      vanoIsGroup,
      hualcachoIsGroup,
      manchadosIsGroup,
      peladosIsGroup,
      yesososIsGroup,
    ];

    const groupedParamsCount = groupedFlags.filter(Boolean).length;
    const distributedGroupTolerance =
      useToleranceGroup && groupedParamsCount > 0
        ? Number(groupToleranceValue ?? 0) / groupedParamsCount
        : 0;

    const resolveTolerance = (
      inputValue: number | undefined,
      templateValue: number | undefined,
      isGroup: boolean,
    ): number | undefined => {
      if (inputValue !== undefined) {
        return inputValue;
      }

      if (useToleranceGroup && isGroup && groupedParamsCount > 0) {
        return distributedGroupTolerance;
      }

      return templateValue;
    };

    const humedadTolerance = resolveTolerance(
      humedadToleranceInput,
      parseNumber(template?.toleranceHumedad),
      humedadIsGroup,
    );
    const impurezasTolerance = resolveTolerance(
      impurezasToleranceInput,
      parseNumber(template?.toleranceImpurezas),
      impurezasIsGroup,
    );
    const verdesTolerance = resolveTolerance(
      verdesToleranceInput,
      parseNumber(template?.toleranceGranosVerdes),
      verdesIsGroup,
    );
    const vanoTolerance = resolveTolerance(
      vanoToleranceInput,
      parseNumber(template?.toleranceVano),
      vanoIsGroup,
    );
    const hualcachoTolerance = resolveTolerance(
      hualcachoToleranceInput,
      parseNumber(template?.toleranceHualcacho),
      hualcachoIsGroup,
    );
    const manchadosTolerance = resolveTolerance(
      manchadosToleranceInput,
      parseNumber(template?.toleranceGranosManchados),
      manchadosIsGroup,
    );
    const peladosTolerance = resolveTolerance(
      peladosToleranceInput,
      parseNumber(template?.toleranceGranosPelados),
      peladosIsGroup,
    );
    const yesososTolerance = resolveTolerance(
      yesososToleranceInput,
      parseNumber(template?.toleranceGranosYesosos),
      yesososIsGroup,
    );

    const summaryPercentCalculated = roundTo2(
      sumNumbers([
        humedadPercent,
        impurezasPercent,
        verdesPercent,
        vanoPercent,
        hualcachoPercent,
        manchadosPercent,
        peladosPercent,
        yesososPercent,
      ]),
    );

    const summaryPercent =
      parseNumber(source.summaryPercent ?? source.totalGroupPercent) ??
      summaryPercentCalculated;

    const groupPercentCalculated = roundTo2(
      sumNumbers([
        humedadIsGroup ? humedadPercent : undefined,
        impurezasIsGroup ? impurezasPercent : undefined,
        verdesIsGroup ? verdesPercent : undefined,
        vanoIsGroup ? vanoPercent : undefined,
        hualcachoIsGroup ? hualcachoPercent : undefined,
        manchadosIsGroup ? manchadosPercent : undefined,
        peladosIsGroup ? peladosPercent : undefined,
        yesososIsGroup ? yesososPercent : undefined,
      ]),
    );

    const groupPercent =
      parseNumber(source.groupPercent) ?? groupPercentCalculated;

    const summaryToleranceCalculated = roundTo2(
      sumNumbers([
        humedadTolerance,
        impurezasTolerance,
        verdesTolerance,
        vanoTolerance,
        hualcachoTolerance,
        manchadosTolerance,
        peladosTolerance,
        yesososTolerance,
      ]),
    );

    const summaryTolerance =
      parseNumber(source.summaryTolerance) ?? summaryToleranceCalculated;

    const summaryPenaltyKg =
      parseNumber(source.summaryPenaltyKg) ??
      Math.round(
        (Number(reception.netWeight ?? 0) / 100) *
          sumNumbers([
            Math.max(0, Number(humedadPercent ?? 0) - Number(humedadTolerance ?? 0)),
            Math.max(
              0,
              Number(impurezasPercent ?? 0) - Number(impurezasTolerance ?? 0),
            ),
            Math.max(0, Number(verdesPercent ?? 0) - Number(verdesTolerance ?? 0)),
            Math.max(0, Number(vanoPercent ?? 0) - Number(vanoTolerance ?? 0)),
            Math.max(
              0,
              Number(hualcachoPercent ?? 0) - Number(hualcachoTolerance ?? 0),
            ),
            Math.max(
              0,
              Number(manchadosPercent ?? 0) - Number(manchadosTolerance ?? 0),
            ),
            Math.max(0, Number(peladosPercent ?? 0) - Number(peladosTolerance ?? 0)),
            Math.max(0, Number(yesososPercent ?? 0) - Number(yesososTolerance ?? 0)),
          ]),
      );

    const templateId = Number(source.templateId ?? reception.templateId ?? 0) || undefined;

    return {
      templateId,
      useToleranceGroup,
      groupToleranceName,
      groupToleranceValue,

      humedadValue,
      humedadPercent,
      humedadTolerance,
      humedadIsGroup,
      humedadTolVisible: toBoolean(
        source.humedadTolVisible,
        template?.showToleranceHumedad ?? true,
      ),

      verdesValue,
      verdesPercent,
      verdesTolerance,
      verdesIsGroup,
      verdesTolVisible: toBoolean(
        source.verdesTolVisible,
        template?.showToleranceGranosVerdes ?? true,
      ),

      impurezasValue,
      impurezasPercent,
      impurezasTolerance,
      impurezasIsGroup,
      impurezasTolVisible: toBoolean(
        source.impurezasTolVisible,
        template?.showToleranceImpurezas ?? true,
      ),

      vanoValue,
      vanoPercent,
      vanoTolerance,
      vanoIsGroup,
      vanoTolVisible: toBoolean(
        source.vanoTolVisible,
        template?.showToleranceVano ?? true,
      ),

      hualcachoValue,
      hualcachoPercent,
      hualcachoTolerance,
      hualcachoIsGroup,
      hualcachoTolVisible: toBoolean(
        source.hualcachoTolVisible,
        template?.showToleranceHualcacho ?? true,
      ),

      manchadosValue,
      manchadosPercent,
      manchadosTolerance,
      manchadosIsGroup,
      manchadosTolVisible: toBoolean(
        source.manchadosTolVisible,
        template?.showToleranceGranosManchados ?? true,
      ),

      peladosValue,
      peladosPercent,
      peladosTolerance,
      peladosIsGroup,
      peladosTolVisible: toBoolean(
        source.peladosTolVisible,
        template?.showToleranceGranosPelados ?? true,
      ),

      yesososValue,
      yesososPercent,
      yesososTolerance,
      yesososIsGroup,
      yesososTolVisible: toBoolean(
        source.yesososTolVisible,
        template?.showToleranceGranosYesosos ?? true,
      ),

      summaryPercent,
      summaryTolerance,
      summaryPenaltyKg,
      bonusEnabled: toBoolean(source.bonusEnabled, template?.availableBonus ?? false),
      bonusPercent: parseNumber(source.bonusPercent ?? template?.toleranceBonus),

      // Compatibilidad backward: mantener columnas legacy consistentes
      humedadRange: humedadValue,
      impurezasRange: impurezasValue,
      verdesRange: verdesValue,
      manchadosRange: manchadosValue,
      yesososRange: yesososValue,
      peladosRange: peladosValue,
      vanoRange: vanoValue,
      hualcachoRange: hualcachoValue,
      totalGroupPercent: summaryPercent,
      groupPercent,
      groupTolerance: groupToleranceValue,
      dryPercent: parseNumber(source.dryPercent),
    };
  }

  async applySettlement(
    receptionId: number,
    settlementId: number,
  ) {
    const reception = await this.getReceptionById(receptionId);

    if (reception.status !== ReceptionStatusEnum.ANALYZED) {
      throw new BadRequestException(
        'La recepción debe estar analizada para liquidar',
      );
    }

    await this.receptionsRepository.update(
      { id: receptionId },
      {
        status: ReceptionStatusEnum.SETTLED,
        settlementId,
        updatedAt: new Date(),
      },
    );

    return this.getReceptionById(receptionId);
  }
}
