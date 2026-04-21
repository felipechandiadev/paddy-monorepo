import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateTruckReceptions1724000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create producers table first
    await queryRunner.createTable(
      new Table({
        name: 'producers',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'rut',
            type: 'varchar',
            length: '20',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'nombre',
            type: 'varchar',
            length: '200',
            isNullable: false,
          },
          {
            name: 'contacto',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'telefono',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'direccion',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'activo',
            type: 'boolean',
            default: true,
            isNullable: false,
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
      }),
      true,
    );

    // Create indexes for producers
    await queryRunner.createIndex(
      'producers',
      new TableIndex({
        name: 'idx_producers_rut',
        columnNames: ['rut'],
      }),
    );

    await queryRunner.createIndex(
      'producers',
      new TableIndex({
        name: 'idx_producers_nombre',
        columnNames: ['nombre'],
      }),
    );

    // Create truck_receptions table
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
            type: 'varchar',
            length: '36',
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
            default: null,
          },
          {
            name: 'estado',
            type: 'enum',
            enum: ['ESPERA', 'PESANDO_BRUTO', 'PESANDO_TARA', 'FINALIZADO'],
            default: "'ESPERA'",
            isNullable: false,
          },
          {
            name: 'fecha_hora_entrada',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
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

    // Create indexes for truck_receptions
    await queryRunner.createIndex(
      'truck_receptions',
      new TableIndex({
        name: 'idx_truck_receptions_numero_turno',
        columnNames: ['numero_turno'],
      }),
    );

    await queryRunner.createIndex(
      'truck_receptions',
      new TableIndex({
        name: 'idx_truck_receptions_producer_id',
        columnNames: ['producer_id'],
      }),
    );

    await queryRunner.createIndex(
      'truck_receptions',
      new TableIndex({
        name: 'idx_truck_receptions_estado',
        columnNames: ['estado'],
      }),
    );

    await queryRunner.createIndex(
      'truck_receptions',
      new TableIndex({
        name: 'idx_truck_receptions_fecha_hora_entrada',
        columnNames: ['fecha_hora_entrada'],
      }),
    );

    // Add foreign key constraint
    await queryRunner.createForeignKey(
      'truck_receptions',
      new TableForeignKey({
        columnNames: ['producer_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'producers',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key first
    const table = await queryRunner.getTable('truck_receptions');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('producer_id') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('truck_receptions', foreignKey);
    }

    // Drop truck_receptions table
    await queryRunner.dropTable('truck_receptions');

    // Drop producers table
    await queryRunner.dropTable('producers');
  }
}
