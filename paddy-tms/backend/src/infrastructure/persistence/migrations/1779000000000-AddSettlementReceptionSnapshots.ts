import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class AddSettlementReceptionSnapshots1779000000000
  implements MigrationInterface
{
  name = 'AddSettlementReceptionSnapshots1779000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableName = 'settlement_reception_snapshots';

    if (await queryRunner.hasTable(tableName)) {
      return;
    }

    await queryRunner.createTable(
      new Table({
        name: tableName,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'settlementId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'receptionId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'lineOrder',
            type: 'int',
            default: 0,
          },
          {
            name: 'receptionDate',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'guideNumber',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'riceTypeName',
            type: 'varchar',
            length: '150',
            isNullable: true,
          },
          {
            name: 'paddyKg',
            type: 'decimal',
            precision: 12,
            scale: 2,
            default: 0,
          },
          {
            name: 'ricePrice',
            type: 'decimal',
            precision: 12,
            scale: 2,
            default: 0,
          },
          {
            name: 'paddySubTotal',
            type: 'bigint',
            default: 0,
          },
          {
            name: 'paddyVat',
            type: 'bigint',
            default: 0,
          },
          {
            name: 'paddyTotal',
            type: 'bigint',
            default: 0,
          },
          {
            name: 'dryPercent',
            type: 'decimal',
            precision: 5,
            scale: 2,
            default: 0,
          },
          {
            name: 'dryingSubTotal',
            type: 'bigint',
            default: 0,
          },
          {
            name: 'dryingVat',
            type: 'bigint',
            default: 0,
          },
          {
            name: 'dryingTotal',
            type: 'bigint',
            default: 0,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      tableName,
      new TableForeignKey({
        name: 'fk_settlement_reception_snapshot_settlement',
        columnNames: ['settlementId'],
        referencedTableName: 'settlements',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      tableName,
      new TableForeignKey({
        name: 'fk_settlement_reception_snapshot_reception',
        columnNames: ['receptionId'],
        referencedTableName: 'receptions',
        referencedColumnNames: ['id'],
        onDelete: 'NO ACTION',
      }),
    );

    await queryRunner.createIndex(
      tableName,
      new TableIndex({
        name: 'idx_settlement_reception_snapshot_settlement',
        columnNames: ['settlementId'],
      }),
    );

    await queryRunner.createIndex(
      tableName,
      new TableIndex({
        name: 'idx_settlement_reception_snapshot_reception',
        columnNames: ['receptionId'],
      }),
    );

    await queryRunner.createIndex(
      tableName,
      new TableIndex({
        name: 'idx_settlement_reception_snapshot_order',
        columnNames: ['settlementId', 'lineOrder'],
      }),
    );

    await queryRunner.createIndex(
      tableName,
      new TableIndex({
        name: 'uq_settlement_reception_snapshot_settlement_reception',
        columnNames: ['settlementId', 'receptionId'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableName = 'settlement_reception_snapshots';

    if (!(await queryRunner.hasTable(tableName))) {
      return;
    }

    const table = await queryRunner.getTable(tableName);
    if (table) {
      const settlementForeignKey = table.foreignKeys.find(
        (fk) => fk.name === 'fk_settlement_reception_snapshot_settlement',
      );
      if (settlementForeignKey) {
        await queryRunner.dropForeignKey(tableName, settlementForeignKey);
      }

      const receptionForeignKey = table.foreignKeys.find(
        (fk) => fk.name === 'fk_settlement_reception_snapshot_reception',
      );
      if (receptionForeignKey) {
        await queryRunner.dropForeignKey(tableName, receptionForeignKey);
      }
    }

    await queryRunner.dropIndex(
      tableName,
      'uq_settlement_reception_snapshot_settlement_reception',
    );
    await queryRunner.dropIndex(tableName, 'idx_settlement_reception_snapshot_order');
    await queryRunner.dropIndex(tableName, 'idx_settlement_reception_snapshot_reception');
    await queryRunner.dropIndex(tableName, 'idx_settlement_reception_snapshot_settlement');

    await queryRunner.dropTable(tableName);
  }
}
