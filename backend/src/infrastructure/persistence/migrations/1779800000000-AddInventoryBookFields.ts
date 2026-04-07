import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddInventoryBookFields1779800000000 implements MigrationInterface {
  name = 'AddInventoryBookFields1779800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasColumn('receptions', 'receptionDate'))) {
      await queryRunner.addColumn(
        'receptions',
        new TableColumn({
          name: 'receptionDate',
          type: 'date',
          isNullable: true,
        }),
      );
    }

    if (!(await queryRunner.hasColumn('receptions', 'receptionBookNumber'))) {
      await queryRunner.addColumn(
        'receptions',
        new TableColumn({
          name: 'receptionBookNumber',
          type: 'varchar',
          length: '50',
          isNullable: true,
        }),
      );
    }

    if (!(await queryRunner.hasColumn('settlements', 'settledAt'))) {
      await queryRunner.addColumn(
        'settlements',
        new TableColumn({
          name: 'settledAt',
          type: 'date',
          isNullable: true,
        }),
      );
    }

    if (!(await queryRunner.hasColumn('settlements', 'purchaseInvoiceNumber'))) {
      await queryRunner.addColumn(
        'settlements',
        new TableColumn({
          name: 'purchaseInvoiceNumber',
          type: 'varchar',
          length: '80',
          isNullable: true,
        }),
      );
    }

    await queryRunner.query(`
      UPDATE receptions
      SET receptionDate = DATE(createdAt)
      WHERE receptionDate IS NULL
    `);

    await queryRunner.query(`
      UPDATE receptions
      SET receptionBookNumber = CAST(id AS CHAR)
      WHERE receptionBookNumber IS NULL OR TRIM(receptionBookNumber) = ''
    `);

    await queryRunner.query(`
      UPDATE settlements s
      LEFT JOIN (
        SELECT
          settlementId,
          MAX(COALESCE(transactionDate, createdAt)) AS latestTransactionDate
        FROM transactions
        WHERE settlementId IS NOT NULL
          AND type = 'settlement'
          AND deletedAt IS NULL
        GROUP BY settlementId
      ) tx ON tx.settlementId = s.id
      SET s.settledAt = DATE(
        COALESCE(tx.latestTransactionDate, s.updatedAt, s.issuedAt, s.createdAt)
      )
      WHERE s.settledAt IS NULL
        AND s.status = 'completed'
    `);

    await queryRunner.query(`
      UPDATE settlements
      SET purchaseInvoiceNumber = NULLIF(
        TRIM(
          COALESCE(
            JSON_UNQUOTE(JSON_EXTRACT(calculationDetails, '$.purchaseInvoice.invoiceNumber')),
            JSON_UNQUOTE(JSON_EXTRACT(calculationDetails, '$.purchaseInvoiceNumber')),
            ''
          )
        ),
        ''
      )
      WHERE (purchaseInvoiceNumber IS NULL OR TRIM(purchaseInvoiceNumber) = '')
        AND calculationDetails IS NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasColumn('settlements', 'purchaseInvoiceNumber')) {
      await queryRunner.dropColumn('settlements', 'purchaseInvoiceNumber');
    }

    if (await queryRunner.hasColumn('settlements', 'settledAt')) {
      await queryRunner.dropColumn('settlements', 'settledAt');
    }

    if (await queryRunner.hasColumn('receptions', 'receptionBookNumber')) {
      await queryRunner.dropColumn('receptions', 'receptionBookNumber');
    }

    if (await queryRunner.hasColumn('receptions', 'receptionDate')) {
      await queryRunner.dropColumn('receptions', 'receptionDate');
    }
  }
}
