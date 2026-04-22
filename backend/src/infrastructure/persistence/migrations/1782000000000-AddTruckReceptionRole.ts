import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Rol TRUCK_RECEPTION: operador de recepción de camiones / báscula (TMS).
 * Valor por defecto de `users.role` pasa a TRUCK_RECEPTION para nuevos registros.
 */
export class AddTruckReceptionRole1782000000000 implements MigrationInterface {
  name = 'AddTruckReceptionRole1782000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` MODIFY COLUMN \`role\` ENUM('ADMIN','CONSULTANT','TRUCK_RECEPTION') NOT NULL DEFAULT 'TRUCK_RECEPTION'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE \`users\` SET \`role\` = 'CONSULTANT' WHERE \`role\` = 'TRUCK_RECEPTION'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` MODIFY COLUMN \`role\` ENUM('ADMIN','CONSULTANT') NOT NULL DEFAULT 'ADMIN'`,
    );
  }
}
