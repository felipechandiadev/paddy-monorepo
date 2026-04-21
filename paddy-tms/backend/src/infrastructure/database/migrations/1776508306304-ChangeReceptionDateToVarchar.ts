import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeReceptionDateToVarchar1776508306304 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`receptions\` MODIFY COLUMN \`receptionDate\` VARCHAR(19) NULL DEFAULT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`receptions\` MODIFY COLUMN \`receptionDate\` DATETIME NULL DEFAULT NULL`
    );
  }
}
