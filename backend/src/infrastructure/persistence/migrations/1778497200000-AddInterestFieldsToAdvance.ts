import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddInterestFieldsToAdvance1778497200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasColumn('advances', 'interest_end_date'))) {
      await queryRunner.addColumn(
        'advances',
        new TableColumn({
          name: 'interest_end_date',
          type: 'date',
          isNullable: true,
          comment: 'Fecha de termino del interes (si es NULL, se usa hoy)',
        }),
      );
    }

    if (!(await queryRunner.hasColumn('advances', 'is_interest_calculation_enabled'))) {
      await queryRunner.addColumn(
        'advances',
        new TableColumn({
          name: 'is_interest_calculation_enabled',
          type: 'boolean',
          default: true,
          comment: 'Habilitar/Deshabilitar calculo de interes',
        }),
      );
    }

    if (!(await queryRunner.hasColumn('advances', 'status'))) {
      await queryRunner.addColumn(
        'advances',
        new TableColumn({
          name: 'status',
          type: 'varchar',
          length: '20',
          default: "'pending'",
          comment: 'pending, settled (para saber si puede editarse)',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasColumn('advances', 'status')) {
      await queryRunner.dropColumn('advances', 'status');
    }
    if (await queryRunner.hasColumn('advances', 'is_interest_calculation_enabled')) {
      await queryRunner.dropColumn('advances', 'is_interest_calculation_enabled');
    }
    if (await queryRunner.hasColumn('advances', 'interest_end_date')) {
      await queryRunner.dropColumn('advances', 'interest_end_date');
    }
  }
}
