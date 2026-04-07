import { IsOptional, IsEnum, IsInt, IsString, Min, Max } from 'class-validator';
import {
  IsDateStringLuxon,
  IsOptionalDateStringLuxon,
} from '@shared/validators/is-date-string-luxon.validator';
import {
  AuditSeverity,
  AuditStatus,
  AuditCategory,
} from '../../domain/audit-event.entity';
import { Type } from 'class-transformer';

export class AuditQueryDto {
  @IsOptional()
  @IsOptionalDateStringLuxon()
  startDate?: string;

  @IsOptional()
  @IsOptionalDateStringLuxon()
  endDate?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  actorUserId?: number;

  @IsOptional()
  @IsString()
  actorEmail?: string;

  @IsOptional()
  @IsEnum(AuditSeverity)
  severity?: AuditSeverity;

  @IsOptional()
  @IsEnum(AuditStatus)
  status?: AuditStatus;

  @IsOptional()
  @IsEnum(AuditCategory)
  category?: AuditCategory;

  @IsOptional()
  @IsString()
  eventCode?: string;

  @IsOptional()
  @IsString()
  correlationId?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(1000)
  limit?: number = 200;
}

export class AuditEventResponseDto {
  id: number;
  eventCode: string;
  description: string;
  category: string;
  action: string;
  status: string;
  severity: string;
  actorUserId: number | null;
  actorEmail: string | null;
  actorRole: string | null;
  entityType: string | null;
  entityId: number | null;
  route: string;
  method: string;
  ip: string | null;
  requestId: string | null;
  correlationId: string | null;
  beforeData: Record<string, any> | null;
  afterData: Record<string, any> | null;
  metadata: Record<string, any> | null;
  errorMessage: string | null;
  createdAt: Date;
}

export class AuditResponseDto {
  success: boolean;
  data: {
    events: AuditEventResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
}
