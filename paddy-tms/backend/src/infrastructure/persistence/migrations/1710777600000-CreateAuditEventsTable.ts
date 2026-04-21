import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAuditEventsTable1710777600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'audit_events',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'eventCode',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'category',
            type: 'enum',
            enum: [
              'AUTH',
              'USERS',
              'PRODUCERS',
              'CONFIG',
              'OPERATIONS',
              'FINANCE',
              'ANALYTICS',
              'SYSTEM',
              'SECURITY',
              'VALIDATION',
            ],
            isNullable: false,
          },
          {
            name: 'action',
            type: 'enum',
            enum: [
              'CREATE',
              'READ',
              'UPDATE',
              'DELETE',
              'LOGIN',
              'LOGOUT',
              'REFRESH',
              'CALCULATE',
              'COMPLETE',
              'CANCEL',
              'EXECUTE',
              'EXPORT',
            ],
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['SUCCESS', 'FAIL', 'DENIED'],
            isNullable: false,
          },
          {
            name: 'severity',
            type: 'enum',
            enum: ['INFO', 'WARN', 'HIGH', 'CRITICAL'],
            isNullable: false,
          },
          {
            name: 'actorUserId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'actorEmail',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'actorRole',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'entityType',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'entityId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'route',
            type: 'varchar',
            length: '500',
            isNullable: false,
          },
          {
            name: 'method',
            type: 'varchar',
            length: '10',
            isNullable: false,
          },
          {
            name: 'ip',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'userAgent',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'requestId',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'correlationId',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'beforeData',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'afterData',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'metadata',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'errorMessage',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
        indices: [
          {
            name: 'IDX_audit_events_eventCode',
            columnNames: ['eventCode'],
          },
          {
            name: 'IDX_audit_events_actorUserId',
            columnNames: ['actorUserId'],
          },
          {
            name: 'IDX_audit_events_createdAt',
            columnNames: ['createdAt'],
          },
          {
            name: 'IDX_audit_events_severity',
            columnNames: ['severity'],
          },
          {
            name: 'IDX_audit_events_correlationId',
            columnNames: ['correlationId'],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('audit_events');
  }
}
