import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeReceptionDateToDatetime1776507806304 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      // Change receptionDate from DATE to DATETIME
      // MySQL will automatically preserve existing DATE values as DATETIME with 00:00:00
      await queryRunner.query(`
        ALTER TABLE receptions 
        MODIFY COLUMN receptionDate DATETIME NULL 
        DEFAULT NULL
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      // Revert back to DATE type
      await queryRunner.query(`
        ALTER TABLE receptions 
        MODIFY COLUMN receptionDate DATE NULL 
        DEFAULT NULL
      `);
    }

}
