import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlignAnalysisParamsCodesToFrontend1780021000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Los códigos esperados en paramCells.tsx son:
    // 1: Humedad ✅
    // 2: Granos Verdes ✅
    // 3: Impurezas ✅
    // 4: Granos Manchados (nuevo - agregado del sistema anterior)
    // 5: Hualcacho (cambio de 7 a 5)
    // 6: Granos Pelados (cambio de 4 a 6)
    // 7: Granos Yesosos (cambio de 6 a 7)
    // 8: Secado/Dry (cambio de 5 a 8)
    // 9: Vano (nuevo)

    // Usar códigos temporales para evitar conflictos de índice único
    // Paso 1: Cambiar a códigos temporales (100+)
    await queryRunner.query(
      `UPDATE analysis_params SET discountCode = 100 WHERE discountCode = 5`
    );
    await queryRunner.query(
      `UPDATE analysis_params SET discountCode = 101 WHERE discountCode = 6`
    );
    await queryRunner.query(
      `UPDATE analysis_params SET discountCode = 102 WHERE discountCode = 7`
    );
    await queryRunner.query(
      `UPDATE analysis_params SET discountCode = 103 WHERE discountCode = 4`
    );

    // Paso 2: Cambiar a los códigos finales
    // 100 (era 5/Secado) → 8
    await queryRunner.query(
      `UPDATE analysis_params SET discountCode = 8 WHERE discountCode = 100`
    );
    // 101 (era 6/Granos Yesosos) → 7
    await queryRunner.query(
      `UPDATE analysis_params SET discountCode = 7 WHERE discountCode = 101`
    );
    // 102 (era 7/Hualcacho) → 5
    await queryRunner.query(
      `UPDATE analysis_params SET discountCode = 5 WHERE discountCode = 102`
    );
    // 103 (era 4/Granos Pelados) → 6
    await queryRunner.query(
      `UPDATE analysis_params SET discountCode = 6 WHERE discountCode = 103`
    );

    // Paso 3: Insertar Granos Manchados (código 4) - parámetro faltante
    const granosManchadosRanges = [
      [0.01, 0.5, 0.5],
      [0.51, 1.0, 1.0],
      [1.01, 1.5, 1.5],
      [1.51, 2.0, 2.0],
      [2.01, 2.5, 2.5],
      [2.51, 3.0, 3.0],
      [3.01, 3.5, 3.5],
      [3.51, 4.0, 4.0],
      [4.01, 4.5, 4.5],
      [4.51, 5.0, 5.0],
      [5.01, 100.0, 100.0],
    ];

    for (let i = 0; i < granosManchadosRanges.length; i++) {
      const [rangeStart, rangeEnd, discountPercent] = granosManchadosRanges[i];
      await queryRunner.query(
        `INSERT INTO analysis_params (discountCode, discountName, unit, rangeStart, rangeEnd, discountPercent, priority, isActive, createdAt, updatedAt)
         VALUES (4, 'Granos Manchados', '%', ${rangeStart}, ${rangeEnd}, ${discountPercent}, ${i}, true, NOW(), NOW())`
      );
    }

    // Paso 4: Insertar Vano (código 9) - parámetro faltante
    const vanoRanges = [
      [0.0, 0.5, 0.0],
      [0.51, 1.0, 0.5],
      [1.01, 1.5, 1.0],
      [1.51, 2.0, 1.5],
      [2.01, 2.5, 2.0],
      [2.51, 3.0, 2.5],
      [3.01, 3.5, 3.0],
      [3.51, 4.0, 3.5],
      [4.01, 4.5, 4.0],
      [4.51, 5.0, 4.5],
      [5.01, 100.0, 100.0],
    ];

    for (let i = 0; i < vanoRanges.length; i++) {
      const [rangeStart, rangeEnd, discountPercent] = vanoRanges[i];
      await queryRunner.query(
        `INSERT INTO analysis_params (discountCode, discountName, unit, rangeStart, rangeEnd, discountPercent, priority, isActive, createdAt, updatedAt)
         VALUES (9, 'Vano', '%', ${rangeStart}, ${rangeEnd}, ${discountPercent}, ${i}, true, NOW(), NOW())`
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir cambios usando temporales para evitar conflictos
    await queryRunner.query(
      `UPDATE analysis_params SET discountCode = 100 WHERE discountCode = 8`
    );
    await queryRunner.query(
      `UPDATE analysis_params SET discountCode = 101 WHERE discountCode = 7`
    );
    await queryRunner.query(
      `UPDATE analysis_params SET discountCode = 102 WHERE discountCode = 5`
    );
    await queryRunner.query(
      `UPDATE analysis_params SET discountCode = 103 WHERE discountCode = 6`
    );
    
    // Cambiar temporales a originales
    await queryRunner.query(
      `UPDATE analysis_params SET discountCode = 5 WHERE discountCode = 100`
    );
    await queryRunner.query(
      `UPDATE analysis_params SET discountCode = 6 WHERE discountCode = 101`
    );
    await queryRunner.query(
      `UPDATE analysis_params SET discountCode = 7 WHERE discountCode = 102`
    );
    await queryRunner.query(
      `UPDATE analysis_params SET discountCode = 4 WHERE discountCode = 103`
    );
    
    // Eliminar parámetros agregados
    await queryRunner.query(`DELETE FROM analysis_params WHERE discountCode = 4 AND discountName = 'Granos Manchados'`);
    await queryRunner.query(`DELETE FROM analysis_params WHERE discountCode = 9`);
  }
}
