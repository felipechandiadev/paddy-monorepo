import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTurnoFieldsToTruckReceptions1724000000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'truck_receptions',
      new TableColumn({
        name: 'numero_turno',
        type: 'int',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'truck_receptions',
      new TableColumn({
        name: 'turno_date',
        type: 'date',
        isNullable: true,
      }),
    );

    // Cambiar los valores del enum de status
    await queryRunner.query(
      `ALTER TABLE truck_receptions MODIFY COLUMN status ENUM('ESPERA', 'FINISHED') NOT NULL DEFAULT 'ESPERA'`,
    );

    // Crear índice para turno_date
    await queryRunner.query(
      `CREATE INDEX idx_turno_date ON truck_receptions (turno_date)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('truck_receptions', 'numero_turno');
    await queryRunner.dropColumn('truck_receptions', 'turno_date');

    // Restaurar enum anterior
    await queryRunner.query(
      `ALTER TABLE truck_receptions MODIFY COLUMN status ENUM('WEIGHING_GROSS', 'WEIGHING_TARE', 'FINISHED') NOT NULL DEFAULT 'WEIGHING_GROSS'`,
    );

    await queryRunner.query(
      `DROP INDEX idx_turno_date ON truck_receptions`,
    );
  }
}
