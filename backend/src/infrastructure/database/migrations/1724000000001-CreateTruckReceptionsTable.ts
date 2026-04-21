import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateTruckReceptionsTable1724000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'truck_receptions',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'numero_turno',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'producer_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'patente',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'guia',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'chofer_nombre',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'rut_chofer',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'peso_bruto',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'peso_tara',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'peso_neto',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'estado',
            type: 'enum',
            enum: ['ESPERA', 'PESANDO_BRUTO', 'PESANDO_TARA', 'FINALIZADO'],
            default: "'ESPERA'",
          },
          {
            name: 'fecha_hora_entrada',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'fecha_hora_peso_bruto',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'fecha_hora_peso_tara',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'fecha_hora_finalizacion',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'numero_ticket',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'pdf_url',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'created_by',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Agregar índices
    await queryRunner.createIndex(
      'truck_receptions',
      new TableIndex({
        name: 'idx_numero_turno',
        columnNames: ['numero_turno'],
      }),
    );

    await queryRunner.createIndex(
      'truck_receptions',
      new TableIndex({
        name: 'idx_producer_id',
        columnNames: ['producer_id'],
      }),
    );

    await queryRunner.createIndex(
      'truck_receptions',
      new TableIndex({
        name: 'idx_estado',
        columnNames: ['estado'],
      }),
    );

    await queryRunner.createIndex(
      'truck_receptions',
      new TableIndex({
        name: 'idx_fecha_hora_entrada',
        columnNames: ['fecha_hora_entrada'],
      }),
    );

    // Agregar foreign key a producers
    await queryRunner.createForeignKey(
      'truck_receptions',
      new TableForeignKey({
        name: 'fk_truck_receptions_producer_id',
        columnNames: ['producer_id'],
        referencedTableName: 'producers',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('truck_receptions');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.name === 'fk_truck_receptions_producer_id',
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('truck_receptions', foreignKey);
    }

    await queryRunner.dropIndex('truck_receptions', 'idx_fecha_hora_entrada');
    await queryRunner.dropIndex('truck_receptions', 'idx_estado');
    await queryRunner.dropIndex('truck_receptions', 'idx_producer_id');
    await queryRunner.dropIndex('truck_receptions', 'idx_numero_turno');
    await queryRunner.dropTable('truck_receptions');
  }
}
