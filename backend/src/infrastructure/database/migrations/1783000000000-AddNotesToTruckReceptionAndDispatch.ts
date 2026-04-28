import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNotesToTruckReceptionAndDispatch1783000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`truck_receptions\`
      ADD COLUMN \`notes\` text NULL
    `);

    await queryRunner.query(`
      ALTER TABLE \`truck_dispatches\`
      ADD COLUMN \`notes\` text NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`truck_dispatches\`
      DROP COLUMN \`notes\`
    `);

    await queryRunner.query(`
      ALTER TABLE \`truck_receptions\`
      DROP COLUMN \`notes\`
    `);
  }
}

