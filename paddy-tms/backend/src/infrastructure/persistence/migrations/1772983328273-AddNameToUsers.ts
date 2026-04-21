import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNameToUsers1772983328273 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        if (!(await queryRunner.hasColumn('users', 'name'))) {
            await queryRunner.query(
                `ALTER TABLE \`users\` ADD COLUMN \`name\` varchar(255) NOT NULL DEFAULT '' AFTER \`password\``,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        if (await queryRunner.hasColumn('users', 'name')) {
            await queryRunner.query(
                `ALTER TABLE \`users\` DROP COLUMN \`name\``,
            );
        }
    }
}
