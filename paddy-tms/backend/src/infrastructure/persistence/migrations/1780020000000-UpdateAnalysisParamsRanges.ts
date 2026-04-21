import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAnalysisParamsRanges1780020000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. HUMEDAD (discountCode = 1)
    // Delete existing ranges for humedad
    await queryRunner.query(
      `DELETE FROM analysis_params WHERE discountCode = 1`
    );

    // Insert new humedad ranges
    const humedadRanges = [
      [15.01, 15.50, 1.00],
      [15.51, 16.00, 1.50],
      [16.01, 16.50, 2.00],
      [16.51, 17.00, 2.50],
      [17.01, 17.50, 3.00],
      [17.51, 18.00, 4.03],
      [18.01, 18.50, 4.62],
      [18.51, 19.00, 5.21],
      [19.01, 19.50, 5.79],
      [19.51, 20.00, 6.38],
      [20.01, 20.50, 6.97],
      [20.51, 21.00, 7.56],
      [21.01, 21.50, 8.15],
      [21.51, 22.00, 8.74],
      [22.01, 22.50, 9.32],
      [22.51, 23.00, 9.91],
      [23.01, 23.50, 10.50],
      [23.51, 24.00, 11.09],
      [24.01, 24.50, 11.68],
      [24.51, 25.00, 12.26],
      [25.51, 100.00, 100.00],
    ];

    for (let i = 0; i < humedadRanges.length; i++) {
      const [rangeStart, rangeEnd, discountPercent] = humedadRanges[i];
      await queryRunner.query(
        `INSERT INTO analysis_params (discountCode, discountName, unit, rangeStart, rangeEnd, discountPercent, priority, isActive, createdAt, updatedAt)
         VALUES (1, 'Humedad', '%', ${rangeStart}, ${rangeEnd}, ${discountPercent}, ${i}, true, NOW(), NOW())`
      );
    }

    // 2. GRANOS VERDES (discountCode = 2)
    await queryRunner.query(
      `DELETE FROM analysis_params WHERE discountCode = 2`
    );

    const granosVerdesRanges = [
      [0.00, 2.00, 0.00],
      [2.01, 2.50, 0.25],
      [2.51, 3.00, 0.50],
      [3.01, 3.50, 0.75],
      [3.51, 4.00, 1.00],
      [4.01, 4.50, 1.25],
      [4.51, 5.00, 1.50],
      [5.01, 5.50, 1.75],
      [5.51, 6.00, 2.00],
      [6.01, 6.50, 2.25],
      [6.51, 7.00, 2.50],
      [7.01, 7.50, 2.75],
      [7.51, 8.00, 3.00],
      [8.01, 8.50, 3.25],
      [8.51, 9.00, 3.50],
      [9.01, 9.50, 3.75],
      [9.51, 10.00, 4.00],
      [10.01, 100.00, 100.00],
    ];

    for (let i = 0; i < granosVerdesRanges.length; i++) {
      const [rangeStart, rangeEnd, discountPercent] = granosVerdesRanges[i];
      await queryRunner.query(
        `INSERT INTO analysis_params (discountCode, discountName, unit, rangeStart, rangeEnd, discountPercent, priority, isActive, createdAt, updatedAt)
         VALUES (2, 'Granos Verdes', '%', ${rangeStart}, ${rangeEnd}, ${discountPercent}, ${i}, true, NOW(), NOW())`
      );
    }

    // 3. IMPUREZAS (discountCode = 3)
    await queryRunner.query(
      `DELETE FROM analysis_params WHERE discountCode = 3`
    );

    const impurezasRanges = [
      [0.00, 0.50, 0.00],
      [0.51, 1.00, 0.00],
      [1.01, 1.50, 0.00],
      [1.51, 1.99, 0.00],
      [2.00, 2.00, 0.00],
      [2.01, 2.50, 0.50],
      [2.51, 3.00, 1.00],
      [3.01, 3.50, 1.50],
      [3.51, 4.00, 2.00],
      [4.01, 4.50, 2.50],
      [4.51, 5.00, 3.00],
      [5.01, 5.50, 3.50],
      [5.51, 6.00, 4.00],
      [6.01, 6.50, 4.50],
      [6.51, 7.00, 5.00],
      [7.01, 7.50, 5.50],
      [7.51, 8.00, 6.00],
      [8.01, 8.50, 6.50],
      [8.51, 9.00, 7.00],
      [9.01, 9.50, 7.50],
      [9.51, 10.00, 8.00],
      [10.00, 100.00, 8.00],
    ];

    for (let i = 0; i < impurezasRanges.length; i++) {
      const [rangeStart, rangeEnd, discountPercent] = impurezasRanges[i];
      await queryRunner.query(
        `INSERT INTO analysis_params (discountCode, discountName, unit, rangeStart, rangeEnd, discountPercent, priority, isActive, createdAt, updatedAt)
         VALUES (3, 'Impurezas', '%', ${rangeStart}, ${rangeEnd}, ${discountPercent}, ${i}, true, NOW(), NOW())`
      );
    }

    // 4. GRANOS PELADOS Y PARTIDOS (discountCode = 4)
    await queryRunner.query(
      `DELETE FROM analysis_params WHERE discountCode = 4`
    );

    const granosPeladosRanges = [
      [0.00, 1.00, 0.00],
      [1.01, 2.00, 1.00],
      [2.01, 3.00, 2.00],
      [3.01, 4.00, 3.00],
      [4.01, 5.00, 4.00],
      [5.01, 6.00, 5.00],
      [6.01, 7.00, 6.00],
      [7.01, 8.00, 7.00],
      [8.01, 9.00, 8.00],
      [9.01, 10.00, 9.00],
      [10.01, 100.00, 100.00],
    ];

    for (let i = 0; i < granosPeladosRanges.length; i++) {
      const [rangeStart, rangeEnd, discountPercent] = granosPeladosRanges[i];
      await queryRunner.query(
        `INSERT INTO analysis_params (discountCode, discountName, unit, rangeStart, rangeEnd, discountPercent, priority, isActive, createdAt, updatedAt)
         VALUES (4, 'Granos Pelados y Partidos', '%', ${rangeStart}, ${rangeEnd}, ${discountPercent}, ${i}, true, NOW(), NOW())`
      );
    }

    // 5. SECADO (discountCode = 5)
    await queryRunner.query(
      `DELETE FROM analysis_params WHERE discountCode = 5`
    );

    const secadoRanges = [
      [15.01, 17.00, 1.50],
      [17.01, 20.00, 2.50],
      [20.01, 22.50, 3.50],
      [22.51, 100.00, 4.50],
    ];

    for (let i = 0; i < secadoRanges.length; i++) {
      const [rangeStart, rangeEnd, discountPercent] = secadoRanges[i];
      await queryRunner.query(
        `INSERT INTO analysis_params (discountCode, discountName, unit, rangeStart, rangeEnd, discountPercent, priority, isActive, createdAt, updatedAt)
         VALUES (5, 'Secado', '%', ${rangeStart}, ${rangeEnd}, ${discountPercent}, ${i}, true, NOW(), NOW())`
      );
    }

    // 6. GRANOS YESOSOS Y YESADOS (discountCode = 6)
    await queryRunner.query(
      `DELETE FROM analysis_params WHERE discountCode = 6`
    );

    const granosYesososRanges = [
      [0.00, 1.00, 0.00],
      [1.01, 1.50, 0.50],
      [1.51, 2.00, 1.00],
      [2.01, 2.50, 1.50],
      [2.51, 3.00, 2.00],
      [3.01, 3.50, 2.50],
      [3.51, 4.00, 3.00],
      [4.01, 4.50, 3.50],
      [4.51, 5.00, 4.00],
      [5.01, 100.00, 100.00],
    ];

    for (let i = 0; i < granosYesososRanges.length; i++) {
      const [rangeStart, rangeEnd, discountPercent] = granosYesososRanges[i];
      await queryRunner.query(
        `INSERT INTO analysis_params (discountCode, discountName, unit, rangeStart, rangeEnd, discountPercent, priority, isActive, createdAt, updatedAt)
         VALUES (6, 'Granos Yesosos y Yesados', '%', ${rangeStart}, ${rangeEnd}, ${discountPercent}, ${i}, true, NOW(), NOW())`
      );
    }

    // 7. HUALCACHO (discountCode = 7)
    await queryRunner.query(
      `DELETE FROM analysis_params WHERE discountCode = 7`
    );

    const hualcachoRanges = [
      [0.01, 0.50, 0.75],
      [0.51, 1.00, 1.50],
      [1.01, 1.50, 2.25],
      [1.51, 2.00, 3.00],
      [2.01, 2.50, 3.75],
      [2.51, 3.00, 4.50],
      [3.01, 3.50, 5.25],
      [3.51, 4.00, 6.00],
      [4.01, 4.50, 6.75],
      [4.51, 5.00, 7.50],
    ];

    for (let i = 0; i < hualcachoRanges.length; i++) {
      const [rangeStart, rangeEnd, discountPercent] = hualcachoRanges[i];
      await queryRunner.query(
        `INSERT INTO analysis_params (discountCode, discountName, unit, rangeStart, rangeEnd, discountPercent, priority, isActive, createdAt, updatedAt)
         VALUES (7, 'Hualcacho', '%', ${rangeStart}, ${rangeEnd}, ${discountPercent}, ${i}, true, NOW(), NOW())`
      );
    }

    // 8. Delete old codes (8 and others) if they still exist
    await queryRunner.query(
      `DELETE FROM analysis_params WHERE discountCode > 7`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert by deleting all analysis params
    await queryRunner.query(`DELETE FROM analysis_params`);
  }
}
