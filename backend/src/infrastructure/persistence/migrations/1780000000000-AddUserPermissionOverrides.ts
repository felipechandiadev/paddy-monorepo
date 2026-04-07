import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserPermissionOverrides1780000000000 implements MigrationInterface {
  name = 'AddUserPermissionOverrides1780000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('user_permission_overrides');

    if (!tableExists) {
      await queryRunner.query(`
        CREATE TABLE \`user_permission_overrides\` (
          \`id\`                INT          NOT NULL AUTO_INCREMENT,
          \`userId\`            INT          NOT NULL,
          \`permissionKey\`     VARCHAR(100) NOT NULL,
          \`effect\`            ENUM('GRANT','REVOKE') NOT NULL,
          \`assignedByUserId\`  INT          NULL,
          \`createdAt\`         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
          \`updatedAt\`         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          \`deletedAt\`         TIMESTAMP    NULL,
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`idx_upo_user_permission\` (\`userId\`, \`permissionKey\`),
          CONSTRAINT \`fk_upo_user\`
            FOREIGN KEY (\`userId\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_upo_assigned_by\`
            FOREIGN KEY (\`assignedByUserId\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`user_permission_overrides\``);
  }
}
