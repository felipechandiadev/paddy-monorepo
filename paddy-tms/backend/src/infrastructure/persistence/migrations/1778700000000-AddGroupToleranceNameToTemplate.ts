import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGroupToleranceNameToTemplate1778700000000
  implements MigrationInterface
{
  name = 'AddGroupToleranceNameToTemplate1778700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasGroupToleranceName = await queryRunner.hasColumn(
      'templates',
      'groupToleranceName',
    );

    if (!hasGroupToleranceName) {
      await queryRunner.query(
        "ALTER TABLE `templates` ADD `groupToleranceName` varchar(255) NULL AFTER `groupToleranceValue`",
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasGroupToleranceName = await queryRunner.hasColumn(
      'templates',
      'groupToleranceName',
    );

    if (hasGroupToleranceName) {
      await queryRunner.query(
        'ALTER TABLE `templates` DROP COLUMN `groupToleranceName`',
      );
    }
  }
}
