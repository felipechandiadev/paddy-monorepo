import { MigrationInterface, QueryRunner } from 'typeorm';

type TemplateColumnDef = {
  name: string;
  typeDefinition: string;
  after: string;
};

const TEMPLATE_COLUMNS: TemplateColumnDef[] = [
  { name: 'availableGranosVerdes', typeDefinition: 'boolean NOT NULL DEFAULT true', after: 'groupToleranceHumedad' },
  { name: 'percentGranosVerdes', typeDefinition: 'decimal(5, 2) NOT NULL DEFAULT 0', after: 'availableGranosVerdes' },
  { name: 'toleranceGranosVerdes', typeDefinition: 'decimal(5, 2) NOT NULL DEFAULT 2.0', after: 'percentGranosVerdes' },
  { name: 'showToleranceGranosVerdes', typeDefinition: 'boolean NOT NULL DEFAULT true', after: 'toleranceGranosVerdes' },
  { name: 'groupToleranceGranosVerdes', typeDefinition: 'boolean NOT NULL DEFAULT false', after: 'showToleranceGranosVerdes' },

  { name: 'availableImpurezas', typeDefinition: 'boolean NOT NULL DEFAULT true', after: 'groupToleranceGranosVerdes' },
  { name: 'percentImpurezas', typeDefinition: 'decimal(5, 2) NOT NULL DEFAULT 0', after: 'availableImpurezas' },
  { name: 'toleranceImpurezas', typeDefinition: 'decimal(5, 2) NOT NULL DEFAULT 2.0', after: 'percentImpurezas' },
  { name: 'showToleranceImpurezas', typeDefinition: 'boolean NOT NULL DEFAULT true', after: 'toleranceImpurezas' },
  { name: 'groupToleranceImpurezas', typeDefinition: 'boolean NOT NULL DEFAULT false', after: 'showToleranceImpurezas' },

  { name: 'availableVano', typeDefinition: 'boolean NOT NULL DEFAULT true', after: 'groupToleranceImpurezas' },
  { name: 'percentVano', typeDefinition: 'decimal(5, 2) NOT NULL DEFAULT 0', after: 'availableVano' },
  { name: 'toleranceVano', typeDefinition: 'decimal(5, 2) NOT NULL DEFAULT 2.0', after: 'percentVano' },
  { name: 'showToleranceVano', typeDefinition: 'boolean NOT NULL DEFAULT true', after: 'toleranceVano' },
  { name: 'groupToleranceVano', typeDefinition: 'boolean NOT NULL DEFAULT false', after: 'showToleranceVano' },

  { name: 'availableHualcacho', typeDefinition: 'boolean NOT NULL DEFAULT true', after: 'groupToleranceVano' },
  { name: 'percentHualcacho', typeDefinition: 'decimal(5, 2) NOT NULL DEFAULT 0', after: 'availableHualcacho' },
  { name: 'toleranceHualcacho', typeDefinition: 'decimal(5, 2) NOT NULL DEFAULT 2.0', after: 'percentHualcacho' },
  { name: 'showToleranceHualcacho', typeDefinition: 'boolean NOT NULL DEFAULT true', after: 'toleranceHualcacho' },
  { name: 'groupToleranceHualcacho', typeDefinition: 'boolean NOT NULL DEFAULT false', after: 'showToleranceHualcacho' },

  { name: 'availableGranosManchados', typeDefinition: 'boolean NOT NULL DEFAULT true', after: 'groupToleranceHualcacho' },
  { name: 'percentGranosManchados', typeDefinition: 'decimal(5, 2) NOT NULL DEFAULT 0', after: 'availableGranosManchados' },
  { name: 'toleranceGranosManchados', typeDefinition: 'decimal(5, 2) NOT NULL DEFAULT 2.0', after: 'percentGranosManchados' },
  { name: 'showToleranceGranosManchados', typeDefinition: 'boolean NOT NULL DEFAULT true', after: 'toleranceGranosManchados' },
  { name: 'groupToleranceGranosManchados', typeDefinition: 'boolean NOT NULL DEFAULT false', after: 'showToleranceGranosManchados' },

  { name: 'availableGranosPelados', typeDefinition: 'boolean NOT NULL DEFAULT true', after: 'groupToleranceGranosManchados' },
  { name: 'percentGranosPelados', typeDefinition: 'decimal(5, 2) NOT NULL DEFAULT 0', after: 'availableGranosPelados' },
  { name: 'toleranceGranosPelados', typeDefinition: 'decimal(5, 2) NOT NULL DEFAULT 2.0', after: 'percentGranosPelados' },
  { name: 'showToleranceGranosPelados', typeDefinition: 'boolean NOT NULL DEFAULT true', after: 'toleranceGranosPelados' },
  { name: 'groupToleranceGranosPelados', typeDefinition: 'boolean NOT NULL DEFAULT false', after: 'showToleranceGranosPelados' },

  { name: 'availableGranosYesosos', typeDefinition: 'boolean NOT NULL DEFAULT true', after: 'groupToleranceGranosPelados' },
  { name: 'percentGranosYesosos', typeDefinition: 'decimal(5, 2) NOT NULL DEFAULT 0', after: 'availableGranosYesosos' },
  { name: 'toleranceGranosYesosos', typeDefinition: 'decimal(5, 2) NOT NULL DEFAULT 2.0', after: 'percentGranosYesosos' },
  { name: 'showToleranceGranosYesosos', typeDefinition: 'boolean NOT NULL DEFAULT true', after: 'toleranceGranosYesosos' },
  { name: 'groupToleranceGranosYesosos', typeDefinition: 'boolean NOT NULL DEFAULT false', after: 'showToleranceGranosYesosos' },
];

export class AddAllParametersToTemplate1741689000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const column of TEMPLATE_COLUMNS) {
      if (!(await queryRunner.hasColumn('templates', column.name))) {
        await queryRunner.query(
          `ALTER TABLE \`templates\` ADD COLUMN \`${column.name}\` ${column.typeDefinition} AFTER \`${column.after}\``,
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const column of [...TEMPLATE_COLUMNS].reverse()) {
      if (await queryRunner.hasColumn('templates', column.name)) {
        await queryRunner.query(
          `ALTER TABLE \`templates\` DROP COLUMN \`${column.name}\``,
        );
      }
    }
  }
}
