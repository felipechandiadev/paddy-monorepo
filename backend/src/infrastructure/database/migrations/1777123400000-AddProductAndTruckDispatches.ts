import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductAndTruckDispatches1777123400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`truck_receptions\`
      ADD COLUMN \`product\` enum('ARROZ_PADDY','CASCARILLA') NOT NULL DEFAULT 'ARROZ_PADDY'
    `);

    await queryRunner.query(`
      CREATE TABLE \`truck_dispatches\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`status\` enum('ESPERA','FINISHED') NOT NULL DEFAULT 'ESPERA',
        \`numero_turno\` int NULL,
        \`turno_date\` date NULL,
        \`producer_id\` int NOT NULL,
        \`product\` enum('ARROZ_PADDY','CASCARILLA') NOT NULL DEFAULT 'ARROZ_PADDY',
        \`license_plate\` varchar(50) NOT NULL,
        \`driver_name\` varchar(100) NOT NULL,
        \`carrier_company\` varchar(100) NULL,
        \`dispatch_guide\` varchar(100) NULL,
        \`gross_weight\` decimal(10,2) NULL,
        \`tare_weight\` decimal(10,2) NULL,
        \`net_weight\` decimal(10,2) NULL,
        \`entry_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`finished_at\` timestamp NULL,
        \`created_by\` varchar(100) NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` datetime(6) NULL,
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_truck_dispatches_producer\` (\`producer_id\`),
        INDEX \`IDX_truck_dispatches_status\` (\`status\`),
        INDEX \`IDX_truck_dispatches_entry\` (\`entry_at\`),
        INDEX \`IDX_truck_dispatches_turno_date\` (\`turno_date\`),
        CONSTRAINT \`FK_truck_dispatches_producer\` FOREIGN KEY (\`producer_id\`) REFERENCES \`producers\`(\`id\`)
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`truck_dispatches\``);
    await queryRunner.query(`ALTER TABLE \`truck_receptions\` DROP COLUMN \`product\``);
  }
}
