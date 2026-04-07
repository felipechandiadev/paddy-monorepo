import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { DateTime } from 'luxon';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
import { Roles } from '@shared/decorators/roles.decorator';
import { RoleEnum } from '@shared/enums';
import { AuditService } from '../application/audit.service';
import { AuditQueryDto, AuditResponseDto, AuditEventResponseDto } from '../application/dto/audit-query.dto';

@Controller('audit')
@UseGuards(JwtAuthGuard)
export class AuditController {
  constructor(private auditService: AuditService) {}

  /**
   * GET /api/v1/audit/events
   * List audit events with filtering and pagination
   * Query params:
   *   - startDate: ISO date string
   *   - endDate: ISO date string
   *   - actorUserId: number
   *   - actorEmail: string
   *   - severity: CRITICAL | HIGH | WARN | INFO
   *   - status: SUCCESS | FAIL | DENIED
   *   - category: AUTH | USERS | PRODUCERS | CONFIG | OPERATIONS | FINANCE | ANALYTICS | SYSTEM | SECURITY | VALIDATION
   *   - eventCode: string (supports partial match)
   *   - correlationId: string (exact match)
   *   - page: number (default: 1)
   *   - limit: number (default: 20, max: 100)
   */
  @Get('events')
  async getEvents(@Query() query: AuditQueryDto) {
    const { events, total } = await this.auditService.findEvents({
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      actorUserId: query.actorUserId,
      actorEmail: query.actorEmail,
      severity: query.severity,
      status: query.status,
      category: query.category,
      eventCode: query.eventCode,
      correlationId: query.correlationId,
      page: query.page,
      limit: query.limit,
    });

    const page = query.page || 1;
    const limit = query.limit || 20;
    const totalPages = Math.ceil(total / limit);

    // Return only data - TransformInterceptor will wrap it
    return {
      events: events.map((event) => this.mapAuditEventToDto(event)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * GET /api/v1/audit/events/:id
   * Get a specific audit event by ID
   */
  @Get('events/:id')
  async getEventById(@Param('id') id: number) {
    const event = await this.auditService.findById(id);

    // Return only data - TransformInterceptor will wrap it
    return event ? this.mapAuditEventToDto(event) : null;
  }

  /**
   * GET /api/v1/audit/actor/:actorUserId/events
   * Get all events for a specific actor (user)
   */
  @Get('actor/:actorUserId/events')
  async getEventsByActor(@Param('actorUserId') actorUserId: number, @Query() query: AuditQueryDto) {
    const { events, total } = await this.auditService.findEvents({
      actorUserId,
      page: query.page,
      limit: query.limit,
    });

    const page = query.page || 1;
    const limit = query.limit || 20;
    const totalPages = Math.ceil(total / limit);

    // Return only data - TransformInterceptor will wrap it
    return {
      events: events.map((event) => this.mapAuditEventToDto(event)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * GET /api/v1/audit/correlation/:correlationId
   * Get all events with a specific correlation ID (useful for tracing a request flow)
   */
  @Get('correlation/:correlationId')
  async getEventsByCorrelationId(
    @Param('correlationId') correlationId: string,
    @Query() query: AuditQueryDto,
  ) {
    const { events, total } = await this.auditService.findEvents({
      correlationId,
      page: query.page,
      limit: query.limit,
    });

    const page = query.page || 1;
    const limit = query.limit || 20;
    const totalPages = Math.ceil(total / limit);

    // Return only data - TransformInterceptor will wrap it
    return {
      events: events.map((event) => this.mapAuditEventToDto(event)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * GET /api/v1/audit/summary
   * Get audit summary by severity over last N days
   */
  @Get('summary')
  async getAuditSummary(@Query('days') days: number = 7) {
    const clampedDays = Math.min(Math.max(days, 1), 30);
    const startDate = DateTime.now()
      .minus({ days: clampedDays })
      .toJSDate();

    const { events } = await this.auditService.findEvents({
      startDate,
      limit: 10000, // Get all events in date range
    });

    const summary = {
      CRITICAL: 0,
      HIGH: 0,
      WARN: 0,
      INFO: 0,
    };

    const categoryBreakdown = {};

    for (const event of events) {
      summary[event.severity] = (summary[event.severity] || 0) + 1;
      categoryBreakdown[event.category] = (categoryBreakdown[event.category] || 0) + 1;
    }

    // Return only data - TransformInterceptor will wrap it
    return {
      period: `Last ${days} days`,
      startDate,
      endDate: new Date(),
      totalEvents: events.length,
      severitySummary: summary,
      categoryBreakdown,
    };
  }

  /**
   * Helper method to map AuditEvent entity to DTO
   */
  private mapAuditEventToDto(event: any): AuditEventResponseDto {
    return {
      id: event.id,
      eventCode: event.eventCode,
      description: event.description ?? event.eventCode,
      category: event.category,
      action: event.action,
      status: event.status,
      severity: event.severity,
      actorUserId: event.actorUserId,
      actorEmail: event.actorEmail,
      actorRole: event.actorRole,
      entityType: event.entityType,
      entityId: event.entityId,
      route: event.route,
      method: event.method,
      ip: event.ip,
      requestId: event.requestId,
      correlationId: event.correlationId,
      beforeData: event.beforeData,
      afterData: event.afterData,
      metadata: event.metadata,
      errorMessage: event.errorMessage,
      createdAt: event.createdAt,
    };
  }
}
