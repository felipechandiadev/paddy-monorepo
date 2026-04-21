import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddGroupPercentToAnalysisRecords1781000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'analysis_records',
      new TableColumn({
        name: 'groupPercent',
        type: 'decimal',
        precision: 5,
        scale: 2,
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('analysis_records', 'groupPercent');
  }
}
