import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReplaceInProcessReceptionStatusWithCancelled1778900000000
  implements MigrationInterface
{
  name = 'ReplaceInProcessReceptionStatusWithCancelled1778900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `receptions` MODIFY `status` enum('in_process','cancelled','analyzed','settled') NOT NULL DEFAULT 'in_process'",
    );

    await queryRunner.query(
      "UPDATE `receptions` SET `status` = 'cancelled' WHERE `status` = 'in_process'",
    );

    await queryRunner.query(
      "ALTER TABLE `receptions` MODIFY `status` enum('cancelled','analyzed','settled') NOT NULL DEFAULT 'cancelled'",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `receptions` MODIFY `status` enum('in_process','cancelled','analyzed','settled') NOT NULL DEFAULT 'cancelled'",
    );

    await queryRunner.query(
      "UPDATE `receptions` SET `status` = 'in_process' WHERE `status` = 'cancelled'",
    );

    await queryRunner.query(
      "ALTER TABLE `receptions` MODIFY `status` enum('in_process','analyzed','settled') NOT NULL DEFAULT 'in_process'",
    );
  }
}
