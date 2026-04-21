import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddConsultantRole1778500000000 implements MigrationInterface {
  name = 'AddConsultantRole1778500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` MODIFY COLUMN \`role\` ENUM('ADMIN','CONSULTANT') NOT NULL DEFAULT 'ADMIN'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert to ADMIN-only enum (users with CONSULTANT role must be changed first)
    await queryRunner.query(
      `UPDATE \`users\` SET \`role\` = 'ADMIN' WHERE \`role\` = 'CONSULTANT'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` MODIFY COLUMN \`role\` ENUM('ADMIN') NOT NULL DEFAULT 'ADMIN'`,
    );
  }
}
