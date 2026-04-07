import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAnalysisRecordSnapshotFields1778800000000
  implements MigrationInterface
{
  name = 'AddAnalysisRecordSnapshotFields1778800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTemplateId = await queryRunner.hasColumn(
      'analysis_records',
      'templateId',
    );

    if (!hasTemplateId) {
      await queryRunner.query(
        "ALTER TABLE `analysis_records` " +
          "ADD `templateId` int NULL AFTER `receptionId`, " +
          "ADD `useToleranceGroup` tinyint NOT NULL DEFAULT 0 AFTER `templateId`, " +
          "ADD `groupToleranceName` varchar(255) NULL AFTER `useToleranceGroup`, " +
          "ADD `groupToleranceValue` decimal(5,2) NULL AFTER `groupToleranceName`, " +
          "ADD `humedadValue` decimal(5,2) NULL, " +
          "ADD `humedadTolerance` decimal(5,2) NULL, " +
          "ADD `humedadIsGroup` tinyint NOT NULL DEFAULT 0, " +
          "ADD `humedadTolVisible` tinyint NOT NULL DEFAULT 1, " +
          "ADD `verdesValue` decimal(5,2) NULL, " +
          "ADD `verdesPercent` decimal(5,2) NULL, " +
          "ADD `verdesTolerance` decimal(5,2) NULL, " +
          "ADD `verdesIsGroup` tinyint NOT NULL DEFAULT 0, " +
          "ADD `verdesTolVisible` tinyint NOT NULL DEFAULT 1, " +
          "ADD `impurezasValue` decimal(5,2) NULL, " +
          "ADD `impurezasTolerance` decimal(5,2) NULL, " +
          "ADD `impurezasIsGroup` tinyint NOT NULL DEFAULT 0, " +
          "ADD `impurezasTolVisible` tinyint NOT NULL DEFAULT 1, " +
          "ADD `vanoValue` decimal(5,2) NULL, " +
          "ADD `vanoPercent` decimal(5,2) NULL, " +
          "ADD `vanoTolerance` decimal(5,2) NULL, " +
          "ADD `vanoIsGroup` tinyint NOT NULL DEFAULT 0, " +
          "ADD `vanoTolVisible` tinyint NOT NULL DEFAULT 1, " +
          "ADD `hualcachoValue` decimal(5,2) NULL, " +
          "ADD `hualcachoPercent` decimal(5,2) NULL, " +
          "ADD `hualcachoTolerance` decimal(5,2) NULL, " +
          "ADD `hualcachoIsGroup` tinyint NOT NULL DEFAULT 0, " +
          "ADD `hualcachoTolVisible` tinyint NOT NULL DEFAULT 1, " +
          "ADD `manchadosValue` decimal(5,2) NULL, " +
          "ADD `manchadosPercent` decimal(5,2) NULL, " +
          "ADD `manchadosTolerance` decimal(5,2) NULL, " +
          "ADD `manchadosIsGroup` tinyint NOT NULL DEFAULT 0, " +
          "ADD `manchadosTolVisible` tinyint NOT NULL DEFAULT 1, " +
          "ADD `peladosValue` decimal(5,2) NULL, " +
          "ADD `peladosPercent` decimal(5,2) NULL, " +
          "ADD `peladosTolerance` decimal(5,2) NULL, " +
          "ADD `peladosIsGroup` tinyint NOT NULL DEFAULT 0, " +
          "ADD `peladosTolVisible` tinyint NOT NULL DEFAULT 1, " +
          "ADD `yesososValue` decimal(5,2) NULL, " +
          "ADD `yesososPercent` decimal(5,2) NULL, " +
          "ADD `yesososTolerance` decimal(5,2) NULL, " +
          "ADD `yesososIsGroup` tinyint NOT NULL DEFAULT 0, " +
          "ADD `yesososTolVisible` tinyint NOT NULL DEFAULT 1, " +
          "ADD `summaryPercent` decimal(7,2) NULL, " +
          "ADD `summaryTolerance` decimal(7,2) NULL, " +
          "ADD `summaryPenaltyKg` decimal(10,2) NULL, " +
          "ADD `bonusEnabled` tinyint NOT NULL DEFAULT 0, " +
          "ADD `bonusPercent` decimal(5,2) NULL",
      );

      await queryRunner.query(
        'CREATE INDEX `IDX_analysis_records_templateId` ON `analysis_records` (`templateId`)',
      );

      await queryRunner.query(
        'ALTER TABLE `analysis_records` ADD CONSTRAINT `FK_analysis_records_templateId` FOREIGN KEY (`templateId`) REFERENCES `templates`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION',
      );
    }

    const hasBonusPercent = await queryRunner.hasColumn(
      'analysis_records',
      'bonusPercent',
    );

    if (!hasBonusPercent) {
      return;
    }

    // Snapshot base desde columnas legacy
    await queryRunner.query(
      'UPDATE `analysis_records` `ar` INNER JOIN `receptions` `r` ON `r`.`id` = `ar`.`receptionId` SET `ar`.`templateId` = `r`.`templateId` WHERE `ar`.`templateId` IS NULL',
    );

    await queryRunner.query(
      'UPDATE `analysis_records` SET `humedadValue` = `humedadRange`, `impurezasValue` = `impurezasRange`, `verdesValue` = `verdesRange`, `manchadosValue` = `manchadosRange`, `yesososValue` = `yesososRange`, `peladosValue` = `peladosRange`, `vanoValue` = `vanoRange`, `hualcachoValue` = `hualcachoRange`',
    );

    await queryRunner.query(
      'UPDATE `analysis_records` SET `groupToleranceValue` = COALESCE(`groupToleranceValue`, `groupTolerance`), `summaryPercent` = COALESCE(`summaryPercent`, `totalGroupPercent`)',
    );

    await queryRunner.query(
      'UPDATE `analysis_records` `ar` INNER JOIN `receptions` `r` ON `r`.`id` = `ar`.`receptionId` SET `ar`.`summaryPenaltyKg` = ROUND((COALESCE(`ar`.`summaryPercent`, 0) * COALESCE(`r`.`netWeight`, 0)) / 100, 2) WHERE `ar`.`summaryPenaltyKg` IS NULL',
    );

    await queryRunner.query(
      'UPDATE `analysis_records` `ar` INNER JOIN `templates` `t` ON `t`.`id` = `ar`.`templateId` SET ' +
        '`ar`.`useToleranceGroup` = `t`.`useToleranceGroup`, ' +
        '`ar`.`groupToleranceName` = COALESCE(`ar`.`groupToleranceName`, `t`.`groupToleranceName`), ' +
        '`ar`.`groupToleranceValue` = COALESCE(`ar`.`groupToleranceValue`, `t`.`groupToleranceValue`), ' +
        '`ar`.`humedadTolerance` = COALESCE(`ar`.`humedadTolerance`, `t`.`toleranceHumedad`), ' +
        '`ar`.`humedadIsGroup` = `t`.`groupToleranceHumedad`, ' +
        '`ar`.`humedadTolVisible` = `t`.`showToleranceHumedad`, ' +
        '`ar`.`verdesPercent` = COALESCE(`ar`.`verdesPercent`, `t`.`percentGranosVerdes`), ' +
        '`ar`.`verdesTolerance` = COALESCE(`ar`.`verdesTolerance`, `t`.`toleranceGranosVerdes`), ' +
        '`ar`.`verdesIsGroup` = `t`.`groupToleranceGranosVerdes`, ' +
        '`ar`.`verdesTolVisible` = `t`.`showToleranceGranosVerdes`, ' +
        '`ar`.`impurezasTolerance` = COALESCE(`ar`.`impurezasTolerance`, `t`.`toleranceImpurezas`), ' +
        '`ar`.`impurezasIsGroup` = `t`.`groupToleranceImpurezas`, ' +
        '`ar`.`impurezasTolVisible` = `t`.`showToleranceImpurezas`, ' +
        '`ar`.`vanoPercent` = COALESCE(`ar`.`vanoPercent`, `t`.`percentVano`), ' +
        '`ar`.`vanoTolerance` = COALESCE(`ar`.`vanoTolerance`, `t`.`toleranceVano`), ' +
        '`ar`.`vanoIsGroup` = `t`.`groupToleranceVano`, ' +
        '`ar`.`vanoTolVisible` = `t`.`showToleranceVano`, ' +
        '`ar`.`hualcachoPercent` = COALESCE(`ar`.`hualcachoPercent`, `t`.`percentHualcacho`), ' +
        '`ar`.`hualcachoTolerance` = COALESCE(`ar`.`hualcachoTolerance`, `t`.`toleranceHualcacho`), ' +
        '`ar`.`hualcachoIsGroup` = `t`.`groupToleranceHualcacho`, ' +
        '`ar`.`hualcachoTolVisible` = `t`.`showToleranceHualcacho`, ' +
        '`ar`.`manchadosPercent` = COALESCE(`ar`.`manchadosPercent`, `t`.`percentGranosManchados`), ' +
        '`ar`.`manchadosTolerance` = COALESCE(`ar`.`manchadosTolerance`, `t`.`toleranceGranosManchados`), ' +
        '`ar`.`manchadosIsGroup` = `t`.`groupToleranceGranosManchados`, ' +
        '`ar`.`manchadosTolVisible` = `t`.`showToleranceGranosManchados`, ' +
        '`ar`.`peladosPercent` = COALESCE(`ar`.`peladosPercent`, `t`.`percentGranosPelados`), ' +
        '`ar`.`peladosTolerance` = COALESCE(`ar`.`peladosTolerance`, `t`.`toleranceGranosPelados`), ' +
        '`ar`.`peladosIsGroup` = `t`.`groupToleranceGranosPelados`, ' +
        '`ar`.`peladosTolVisible` = `t`.`showToleranceGranosPelados`, ' +
        '`ar`.`yesososPercent` = COALESCE(`ar`.`yesososPercent`, `t`.`percentGranosYesosos`), ' +
        '`ar`.`yesososTolerance` = COALESCE(`ar`.`yesososTolerance`, `t`.`toleranceGranosYesosos`), ' +
        '`ar`.`yesososIsGroup` = `t`.`groupToleranceGranosYesosos`, ' +
        '`ar`.`yesososTolVisible` = `t`.`showToleranceGranosYesosos`, ' +
        '`ar`.`bonusEnabled` = `t`.`availableBonus`, ' +
        '`ar`.`bonusPercent` = COALESCE(`ar`.`bonusPercent`, `t`.`toleranceBonus`)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `analysis_records` DROP FOREIGN KEY `FK_analysis_records_templateId`',
    );

    await queryRunner.query(
      'DROP INDEX `IDX_analysis_records_templateId` ON `analysis_records`',
    );

    await queryRunner.query(
      "ALTER TABLE `analysis_records` " +
        "DROP COLUMN `templateId`, " +
        "DROP COLUMN `useToleranceGroup`, " +
        "DROP COLUMN `groupToleranceName`, " +
        "DROP COLUMN `groupToleranceValue`, " +
        "DROP COLUMN `humedadValue`, " +
        "DROP COLUMN `humedadTolerance`, " +
        "DROP COLUMN `humedadIsGroup`, " +
        "DROP COLUMN `humedadTolVisible`, " +
        "DROP COLUMN `verdesValue`, " +
        "DROP COLUMN `verdesPercent`, " +
        "DROP COLUMN `verdesTolerance`, " +
        "DROP COLUMN `verdesIsGroup`, " +
        "DROP COLUMN `verdesTolVisible`, " +
        "DROP COLUMN `impurezasValue`, " +
        "DROP COLUMN `impurezasTolerance`, " +
        "DROP COLUMN `impurezasIsGroup`, " +
        "DROP COLUMN `impurezasTolVisible`, " +
        "DROP COLUMN `vanoValue`, " +
        "DROP COLUMN `vanoPercent`, " +
        "DROP COLUMN `vanoTolerance`, " +
        "DROP COLUMN `vanoIsGroup`, " +
        "DROP COLUMN `vanoTolVisible`, " +
        "DROP COLUMN `hualcachoValue`, " +
        "DROP COLUMN `hualcachoPercent`, " +
        "DROP COLUMN `hualcachoTolerance`, " +
        "DROP COLUMN `hualcachoIsGroup`, " +
        "DROP COLUMN `hualcachoTolVisible`, " +
        "DROP COLUMN `manchadosValue`, " +
        "DROP COLUMN `manchadosPercent`, " +
        "DROP COLUMN `manchadosTolerance`, " +
        "DROP COLUMN `manchadosIsGroup`, " +
        "DROP COLUMN `manchadosTolVisible`, " +
        "DROP COLUMN `peladosValue`, " +
        "DROP COLUMN `peladosPercent`, " +
        "DROP COLUMN `peladosTolerance`, " +
        "DROP COLUMN `peladosIsGroup`, " +
        "DROP COLUMN `peladosTolVisible`, " +
        "DROP COLUMN `yesososValue`, " +
        "DROP COLUMN `yesososPercent`, " +
        "DROP COLUMN `yesososTolerance`, " +
        "DROP COLUMN `yesososIsGroup`, " +
        "DROP COLUMN `yesososTolVisible`, " +
        "DROP COLUMN `summaryPercent`, " +
        "DROP COLUMN `summaryTolerance`, " +
        "DROP COLUMN `summaryPenaltyKg`, " +
        "DROP COLUMN `bonusEnabled`, " +
        "DROP COLUMN `bonusPercent`",
    );
  }
}
