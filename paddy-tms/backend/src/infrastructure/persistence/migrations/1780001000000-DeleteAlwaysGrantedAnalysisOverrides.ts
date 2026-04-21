import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteAlwaysGrantedAnalysisOverrides1780001000000
  implements MigrationInterface
{
  name = 'DeleteAlwaysGrantedAnalysisOverrides1780001000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('user_permission_overrides');

    if (!hasTable) {
      return;
    }

    await queryRunner.query(`
      DELETE FROM \`user_permission_overrides\`
      WHERE \`permissionKey\` IN (
        'analysis_records.view',
        'analysis_records.create',
        'analysis_records.update'
      )
    `);
  }

  public async down(): Promise<void> {
    // No reversible: se trata de limpieza de datos legacy.
  }
}
