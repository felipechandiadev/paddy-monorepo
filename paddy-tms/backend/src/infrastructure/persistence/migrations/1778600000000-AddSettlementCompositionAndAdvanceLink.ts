import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class AddSettlementCompositionAndAdvanceLink1778600000000
  implements MigrationInterface
{
  name = 'AddSettlementCompositionAndAdvanceLink1778600000000';

  private cloneForeignKey(foreignKey: TableForeignKey): TableForeignKey {
    return new TableForeignKey({
      name: foreignKey.name,
      columnNames: [...foreignKey.columnNames],
      referencedDatabase: foreignKey.referencedDatabase,
      referencedSchema: foreignKey.referencedSchema,
      referencedTableName: foreignKey.referencedTableName,
      referencedColumnNames: [...foreignKey.referencedColumnNames],
      onDelete: foreignKey.onDelete,
      onUpdate: foreignKey.onUpdate,
      deferrable: foreignKey.deferrable,
    });
  }

  private findColumnName(table: Table | undefined, candidates: string[]): string | null {
    if (!table) {
      return null;
    }

    const column = table.columns.find((item) => candidates.includes(item.name));
    return column?.name ?? null;
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasColumn('settlements', 'receptionIds'))) {
      await queryRunner.addColumn(
        'settlements',
        new TableColumn({
          name: 'receptionIds',
          type: 'json',
          isNullable: true,
          comment: 'Snapshot de recepciones asociadas a la liquidacion',
        }),
      );
    }

    if (!(await queryRunner.hasColumn('settlements', 'advanceIds'))) {
      await queryRunner.addColumn(
        'settlements',
        new TableColumn({
          name: 'advanceIds',
          type: 'json',
          isNullable: true,
          comment: 'Snapshot de anticipos asociados a la liquidacion',
        }),
      );
    }

    await queryRunner.query(
      'UPDATE `settlements` SET `receptionIds` = JSON_ARRAY() WHERE `receptionIds` IS NULL',
    );
    await queryRunner.query(
      'UPDATE `settlements` SET `advanceIds` = JSON_ARRAY() WHERE `advanceIds` IS NULL',
    );

    let settlementsTable = await queryRunner.getTable('settlements');
    const producerColumn = this.findColumnName(settlementsTable, [
      'producerId',
      'producer_id',
    ]);
    const seasonColumn = this.findColumnName(settlementsTable, [
      'seasonId',
      'season_id',
    ]);

    if (settlementsTable && producerColumn && seasonColumn) {
      const settlementForeignKeys = settlementsTable.foreignKeys.filter((foreignKey) =>
        foreignKey.columnNames.some(
          (columnName) => columnName === producerColumn || columnName === seasonColumn,
        ),
      );

      const foreignKeysToRecreate = settlementForeignKeys.map((foreignKey) =>
        this.cloneForeignKey(foreignKey),
      );

      for (const foreignKey of settlementForeignKeys) {
        await queryRunner.dropForeignKey('settlements', foreignKey);
      }

      const hasProducerIndex = settlementsTable.indices.some(
        (index) => index.columnNames.length === 1 && index.columnNames[0] === producerColumn,
      );
      if (!hasProducerIndex) {
        await queryRunner.createIndex(
          'settlements',
          new TableIndex({
            name: 'idx_settlement_producer',
            columnNames: [producerColumn],
          }),
        );
      }

      const hasSeasonIndex = settlementsTable.indices.some(
        (index) => index.columnNames.length === 1 && index.columnNames[0] === seasonColumn,
      );
      if (!hasSeasonIndex) {
        await queryRunner.createIndex(
          'settlements',
          new TableIndex({
            name: 'idx_settlement_season',
            columnNames: [seasonColumn],
          }),
        );
      }

      const uniqueProducerSeasonIndex = settlementsTable.indices.find(
        (index) =>
          index.isUnique &&
          index.columnNames.length === 2 &&
          index.columnNames.includes(producerColumn) &&
          index.columnNames.includes(seasonColumn),
      );

      if (uniqueProducerSeasonIndex) {
        await queryRunner.dropIndex('settlements', uniqueProducerSeasonIndex);
      }

      settlementsTable = await queryRunner.getTable('settlements');
      for (const foreignKey of foreignKeysToRecreate) {
        const alreadyExists = settlementsTable?.foreignKeys.some(
          (existingForeignKey) => existingForeignKey.name === foreignKey.name,
        );

        if (!alreadyExists) {
          await queryRunner.createForeignKey('settlements', foreignKey);
          settlementsTable = await queryRunner.getTable('settlements');
        }
      }
    }

    settlementsTable = await queryRunner.getTable('settlements');

    if (settlementsTable && producerColumn && seasonColumn) {
      const hasProducerSeasonIndex = settlementsTable.indices.some(
        (index) => index.name === 'idx_settlement_producer_season',
      );

      if (!hasProducerSeasonIndex) {
        await queryRunner.createIndex(
          'settlements',
          new TableIndex({
            name: 'idx_settlement_producer_season',
            columnNames: [producerColumn, seasonColumn],
            isUnique: false,
          }),
        );
      }
    }

    if (!(await queryRunner.hasColumn('advances', 'settlementId'))) {
      await queryRunner.addColumn(
        'advances',
        new TableColumn({
          name: 'settlementId',
          type: 'int',
          isNullable: true,
          comment: 'Liquidacion asociada al anticipo',
        }),
      );
    }

    const advancesTable = await queryRunner.getTable('advances');
    const settlementColumn = this.findColumnName(advancesTable, [
      'settlementId',
      'settlement_id',
    ]);

    if (advancesTable && settlementColumn) {
      const hasSettlementIndex = advancesTable.indices.some(
        (index) => index.name === 'idx_advance_settlement',
      );

      if (!hasSettlementIndex) {
        await queryRunner.createIndex(
          'advances',
          new TableIndex({
            name: 'idx_advance_settlement',
            columnNames: [settlementColumn],
          }),
        );
      }

      const hasSettlementForeignKey = advancesTable.foreignKeys.some((foreignKey) =>
        foreignKey.columnNames.includes(settlementColumn),
      );

      if (!hasSettlementForeignKey) {
        await queryRunner.createForeignKey(
          'advances',
          new TableForeignKey({
            columnNames: [settlementColumn],
            referencedTableName: 'settlements',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
            name: 'fk_advances_settlement',
          }),
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    let advancesTable = await queryRunner.getTable('advances');
    const settlementColumn = this.findColumnName(advancesTable, [
      'settlementId',
      'settlement_id',
    ]);

    if (advancesTable && settlementColumn) {
      const settlementForeignKeys = advancesTable.foreignKeys.filter((foreignKey) =>
        foreignKey.columnNames.includes(settlementColumn),
      );

      for (const foreignKey of settlementForeignKeys) {
        await queryRunner.dropForeignKey('advances', foreignKey);
      }
    }

    advancesTable = await queryRunner.getTable('advances');
    if (advancesTable) {
      const settlementIndex = advancesTable.indices.find(
        (index) => index.name === 'idx_advance_settlement',
      );

      if (settlementIndex) {
        await queryRunner.dropIndex('advances', settlementIndex);
      }
    }

    if (await queryRunner.hasColumn('advances', 'settlementId')) {
      await queryRunner.dropColumn('advances', 'settlementId');
    }

    const settlementsTable = await queryRunner.getTable('settlements');
    const producerColumn = this.findColumnName(settlementsTable, [
      'producerId',
      'producer_id',
    ]);
    const seasonColumn = this.findColumnName(settlementsTable, [
      'seasonId',
      'season_id',
    ]);

    if (settlementsTable) {
      const settlementForeignKeys = settlementsTable.foreignKeys.filter((foreignKey) =>
        foreignKey.columnNames.some(
          (columnName) => columnName === producerColumn || columnName === seasonColumn,
        ),
      );

      const foreignKeysToRecreate = settlementForeignKeys.map((foreignKey) =>
        this.cloneForeignKey(foreignKey),
      );

      for (const foreignKey of settlementForeignKeys) {
        await queryRunner.dropForeignKey('settlements', foreignKey);
      }

      const producerSeasonIndex = settlementsTable.indices.find(
        (index) => index.name === 'idx_settlement_producer_season',
      );

      if (producerSeasonIndex) {
        await queryRunner.dropIndex('settlements', producerSeasonIndex);
      }

      if (producerColumn && seasonColumn) {
        await queryRunner.createIndex(
          'settlements',
          new TableIndex({
            name: 'idx_settlement_producer_season',
            columnNames: [producerColumn, seasonColumn],
            isUnique: true,
          }),
        );
      }

      const refreshedSettlementsTable = await queryRunner.getTable('settlements');

      for (const foreignKey of foreignKeysToRecreate) {
        const alreadyExists = refreshedSettlementsTable?.foreignKeys.some(
          (existingForeignKey) => existingForeignKey.name === foreignKey.name,
        );

        if (!alreadyExists) {
          await queryRunner.createForeignKey('settlements', foreignKey);
        }
      }
    }

    if (await queryRunner.hasColumn('settlements', 'advanceIds')) {
      await queryRunner.dropColumn('settlements', 'advanceIds');
    }

    if (await queryRunner.hasColumn('settlements', 'receptionIds')) {
      await queryRunner.dropColumn('settlements', 'receptionIds');
    }
  }
}
