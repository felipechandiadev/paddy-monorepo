import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeTruckDriverNameNullable1777200000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`truck_receptions\`
      MODIFY COLUMN \`driver_name\` varchar(100) NULL
    `);
    await queryRunner.query(`
      ALTER TABLE \`truck_dispatches\`
      MODIFY COLUMN \`driver_name\` varchar(100) NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE \`truck_receptions\` SET \`driver_name\` = '' WHERE \`driver_name\` IS NULL
    `);
    await queryRunner.query(`
      UPDATE \`truck_dispatches\` SET \`driver_name\` = '' WHERE \`driver_name\` IS NULL
    `);
    await queryRunner.query(`
      ALTER TABLE \`truck_receptions\`
      MODIFY COLUMN \`driver_name\` varchar(100) NOT NULL
    `);
    await queryRunner.query(`
      ALTER TABLE \`truck_dispatches\`
      MODIFY COLUMN \`driver_name\` varchar(100) NOT NULL
    `);
  }
}
