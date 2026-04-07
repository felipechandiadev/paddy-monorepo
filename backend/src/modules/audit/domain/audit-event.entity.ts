import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum AuditCategory {
  AUTH = 'AUTH',
  USERS = 'USERS',
  PRODUCERS = 'PRODUCERS',
  CONFIG = 'CONFIG',
  OPERATIONS = 'OPERATIONS',
  FINANCE = 'FINANCE',
  ANALYTICS = 'ANALYTICS',
  SYSTEM = 'SYSTEM',
  SECURITY = 'SECURITY',
  VALIDATION = 'VALIDATION',
}

export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  REFRESH = 'REFRESH',
  CALCULATE = 'CALCULATE',
  COMPLETE = 'COMPLETE',
  CANCEL = 'CANCEL',
  EXECUTE = 'EXECUTE',
  EXPORT = 'EXPORT',
}

export enum AuditStatus {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
  DENIED = 'DENIED',
}

export enum AuditSeverity {
  INFO = 'INFO',
  WARN = 'WARN',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

@Entity('audit_events')
export class AuditEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  eventCode: string; // e.g., "AUTH.LOGIN.SUCCESS"

  @Column({ type: 'enum', enum: AuditCategory })
  category: AuditCategory;

  @Column({ type: 'enum', enum: AuditAction })
  action: AuditAction;

  @Column({ type: 'enum', enum: AuditStatus })
  status: AuditStatus;

  @Column({ type: 'enum', enum: AuditSeverity })
  severity: AuditSeverity;

  @Column({ type: 'int', nullable: true })
  actorUserId: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  actorEmail: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  actorRole: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  entityType: string | null;

  @Column({ type: 'int', nullable: true })
  entityId: number | null;

  @Column({ type: 'varchar', length: 500 })
  route: string;

  @Column({ type: 'varchar', length: 10 })
  method: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  ip: string | null;

  @Column({ type: 'text', nullable: true })
  userAgent: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  requestId: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  correlationId: string | null;

  @Column({ type: 'json', nullable: true })
  beforeData: Record<string, any> | null;

  @Column({ type: 'json', nullable: true })
  afterData: Record<string, any> | null;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any> | null;

  @Column({ type: 'text', nullable: true })
  errorMessage: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
