import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameAdvancePendingStatusToPaid1778620000000
  implements MigrationInterface
{
  name = 'RenameAdvancePendingStatusToPaid1778620000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "UPDATE `advances` SET `status` = 'paid' WHERE `status` = 'pending'",
    );

    await queryRunner.query(
      "ALTER TABLE `advances` MODIFY `status` varchar(20) NOT NULL DEFAULT 'paid' COMMENT 'paid, settled (para saber si puede editarse)'",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "UPDATE `advances` SET `status` = 'pending' WHERE `status` = 'paid'",
    );

    await queryRunner.query(
      "ALTER TABLE `advances` MODIFY `status` varchar(20) NOT NULL DEFAULT 'pending' COMMENT 'pending, settled (para saber si puede editarse)'",
    );
  }
}
