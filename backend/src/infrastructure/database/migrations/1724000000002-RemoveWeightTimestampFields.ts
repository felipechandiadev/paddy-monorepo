import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveWeightTimestampFields1724000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('truck_receptions', 'fecha_hora_peso_bruto');
    await queryRunner.dropColumn('truck_receptions', 'fecha_hora_peso_tara');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'truck_receptions',
      new TableColumn({
        name: 'fecha_hora_peso_bruto',
        type: 'timestamp',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'truck_receptions',
      new TableColumn({
        name: 'fecha_hora_peso_tara',
        type: 'timestamp',
        isNullable: true,
      }),
    );
  }
}
