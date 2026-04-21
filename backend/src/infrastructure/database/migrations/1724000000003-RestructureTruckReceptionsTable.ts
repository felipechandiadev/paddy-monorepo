import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class RestructureTruckReceptionsTable1724000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Eliminar tabla antigua
    await queryRunner.dropTable('truck_receptions', true);

    // Crear tabla nueva con estructura correcta
    await queryRunner.createTable(
      new Table({
        name: 'truck_receptions',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['WEIGHING_GROSS', 'WEIGHING_TARE', 'FINISHED'],
            default: "'WEIGHING_GROSS'",
          },
          {
            name: 'producer_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'license_plate',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'driver_name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'carrier_company',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'dispatch_guide',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'gross_weight',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'tare_weight',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'net_weight',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'entry_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'finished_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'created_by',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
        indices: [
          {
            columnNames: ['producer_id'],
          },
          {
            columnNames: ['status'],
          },
          {
            columnNames: ['entry_at'],
          },
        ],
        foreignKeys: [
          {
            columnNames: ['producer_id'],
            referencedTableName: 'producers',
            referencedColumnNames: ['id'],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar tabla nueva
    await queryRunner.dropTable('truck_receptions', true);

    // Recrear tabla antigua (opcional - solo si quieres poder revertir completamente)
    // Por seguridad, dejaremos la tabla eliminada
  }
}
