import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditEvent, AuditStatus, AuditCategory, AuditAction, AuditSeverity } from '../domain/audit-event.entity';
import { getEventDescription } from '../domain/event-descriptions';

export interface AuditLogInput {
  eventCode: string;
  category: AuditCategory;
  action: AuditAction;
  status: AuditStatus;
  severity: AuditSeverity;
  actorUserId?: number | null;
  actorEmail?: string | null;
  actorRole?: string | null;
  entityType?: string | null;
  entityId?: number | null;
  route: string;
  method: string;
  ip?: string | null;
  userAgent?: string | null;
  requestId?: string | null;
  correlationId?: string | null;
  beforeData?: Record<string, any> | null;
  afterData?: Record<string, any> | null;
  metadata?: Record<string, any> | null;
  errorMessage?: string | null;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger('AuditService');

  constructor(
    @InjectRepository(AuditEvent)
    private auditEventRepository: Repository<AuditEvent>,
  ) {}

  /**
   * Log audit event asynchronously without blocking the response
   */
  async logEvent(input: AuditLogInput): Promise<void> {
    try {
      // Mascarar datos sensibles antes de persistir
      const beforeData = input.beforeData ? this.maskSensitiveData(input.beforeData) : null;
      const afterData = input.afterData ? this.maskSensitiveData(input.afterData) : null;

      const auditEvent = this.auditEventRepository.create({
        eventCode: input.eventCode,
        category: input.category,
        action: input.action,
        status: input.status,
        severity: input.severity,
        actorUserId: input.actorUserId || null,
        actorEmail: input.actorEmail || null,
        actorRole: input.actorRole || null,
        entityType: input.entityType || null,
        entityId: input.entityId || null,
        route: input.route,
        method: input.method,
        ip: input.ip || null,
        userAgent: input.userAgent || null,
        requestId: input.requestId || null,
        correlationId: input.correlationId || null,
        beforeData,
        afterData,
        metadata: input.metadata || null,
        errorMessage: input.errorMessage ? input.errorMessage.substring(0, 500) : null,
      });

      // Persist asynchronously - don't await to avoid blocking response
      setImmediate(() => {
        this.auditEventRepository.save(auditEvent).catch((err) => {
          this.logger.error(`Failed to save audit event: ${input.eventCode}`, err);
        });
      });
    } catch (error) {
      this.logger.error(`Error logging audit event: ${input.eventCode}`, error);
    }
  }

  /**
   * Mask sensitive data: passwords, tokens, banking info, PII
   */
  private maskSensitiveData(data: Record<string, any>): Record<string, any> {
    const masked = { ...data };
    const sensitiveFields = [
      'password',
      'currentPassword',
      'newPassword',
      'token',
      'accessToken',
      'refreshToken',
      'secret',
      'apiKey',
    ];

    const bankingFields = ['accountNumber', 'bankAccount', 'bankAccountNumber'];

    for (const field of sensitiveFields) {
      if (field in masked) {
        masked[field] = '***MASKED***';
      }
    }

    for (const field of bankingFields) {
      if (field in masked && typeof masked[field] === 'string') {
        const value = masked[field];
        masked[field] = value.length > 4 ? `****${value.slice(-4)}` : '****';
      }
    }

    return masked;
  }

  /**
   * Query audit events with advanced filtering and pagination
   */
  async findEvents(filters: {
    startDate?: Date;
    endDate?: Date;
    actorUserId?: number;
    actorEmail?: string;
    severity?: AuditSeverity;
    status?: string;
    category?: string;
    eventCode?: string;
    correlationId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ events: AuditEvent[]; total: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    let query = this.auditEventRepository.createQueryBuilder('audit');

    // Apply filters
    if (filters.startDate) {
      query = query.andWhere('audit.createdAt >= :startDate', {
        startDate: filters.startDate,
      });
    }

    if (filters.endDate) {
      query = query.andWhere('audit.createdAt <= :endDate', {
        endDate: filters.endDate,
      });
    }

    if (filters.actorUserId) {
      query = query.andWhere('audit.actorUserId = :actorUserId', {
        actorUserId: filters.actorUserId,
      });
    }

    if (filters.actorEmail) {
      query = query.andWhere('audit.actorEmail LIKE :actorEmail', {
        actorEmail: `%${filters.actorEmail}%`,
      });
    }

    if (filters.severity) {
      query = query.andWhere('audit.severity = :severity', {
        severity: filters.severity,
      });
    }

    if (filters.status) {
      query = query.andWhere('audit.status = :status', {
        status: filters.status,
      });
    }

    if (filters.category) {
      query = query.andWhere('audit.category = :category', {
        category: filters.category,
      });
    }

    if (filters.eventCode) {
      query = query.andWhere('audit.eventCode LIKE :eventCode', {
        eventCode: `%${filters.eventCode}%`,
      });
    }

    if (filters.correlationId) {
      query = query.andWhere('audit.correlationId = :correlationId', {
        correlationId: filters.correlationId,
      });
    }

    // Get total count before pagination
    const total = await query.getCount();

    // Apply pagination and ordering
    const events = await query
      .orderBy('audit.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    // Enrich events with human-readable description
    const enrichedEvents = events.map((event) => ({
      ...event,
      description: getEventDescription(event.eventCode),
    }));

    return { events: enrichedEvents, total };
  }

  /**
   * Query audit events (legacy methods for backward compatibility)
   */
  async findById(id: number): Promise<AuditEvent | null> {
    return this.auditEventRepository.findOne({ where: { id } });
  }

  async findByEventCode(eventCode: string): Promise<AuditEvent[]> {
    return this.auditEventRepository.find({ where: { eventCode } });
  }

  async findByActor(actorUserId: number): Promise<AuditEvent[]> {
    return this.auditEventRepository.find({ where: { actorUserId } });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<AuditEvent[]> {
    return this.auditEventRepository
      .createQueryBuilder('audit')
      .where('audit.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .orderBy('audit.createdAt', 'DESC')
      .take(1000)
      .getMany();
  }

  async findBySeverity(severity: AuditSeverity): Promise<AuditEvent[]> {
    return this.auditEventRepository.find({
      where: { severity },
      order: { createdAt: 'DESC' },
      take: 500,
    });
  }
}
