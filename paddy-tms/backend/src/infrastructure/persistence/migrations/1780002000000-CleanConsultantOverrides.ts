import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migración para limpiar los overrides del rol CONSULTANT.
 * 
 * Los overrides anteriores pueden estar conflictuando con los DEFAULTs.
 * Como ahora usamos DEFAULT_ROLE_PERMISSIONS para permisos, 
 * no necesitamos que el CONSULTANT tenga overrides individuales.
 */
export class CleanConsultantOverrides1780002000000 implements MigrationInterface {
  name = 'CleanConsultantOverrides1780002000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('user_permission_overrides');

    if (!hasTable) {
      console.log('⏭️ Tabla user_permission_overrides no existe, saltando migración');
      return;
    }

    try {
      // Obtener IDs de usuarios con rol CONSULTANT
      const consultants = await queryRunner.query(`
        SELECT \`id\` FROM \`users\` 
        WHERE \`role\` = 'CONSULTANT' AND \`deletedAt\` IS NULL
      `);

      if (consultants.length === 0) {
        console.log('✅ No hay usuarios CONSULTANT para limpiar');
        return;
      }

      const consultantIds = consultants.map((c: any) => c.id);
      console.log(`🧹 Limpiando overrides de ${consultantIds.length} usuarios CONSULTANT...`);

      // Obtener los overrides a eliminar (para logging)
      const overridesToDelete = await queryRunner.query(`
        SELECT \`id\`, \`userId\`, \`permissionKey\` FROM \`user_permission_overrides\`
        WHERE \`userId\` IN (${consultantIds.map(() => '?').join(',')})
      `, consultantIds);

      if (overridesToDelete.length > 0) {
        console.log(`📋 Eliminando ${overridesToDelete.length} overrides:`);
        overridesToDelete.forEach((o: any) => {
          console.log(`   - Usuario ${o.userId}: ${o.permissionKey}`);
        });

        // Eliminar todos los overrides de usuarios CONSULTANT
        await queryRunner.query(`
          DELETE FROM \`user_permission_overrides\`
          WHERE \`userId\` IN (${consultantIds.map(() => '?').join(',')})
        `, consultantIds);

        console.log(`✅ Se eliminaron ${overridesToDelete.length} overrides de usuarios CONSULTANT`);
      } else {
        console.log('ℹ️ No hay overrides para limpiar');
      }
    } catch (error) {
      console.error('❌ Error en migración de limpieza:', error);
      throw error;
    }
  }

  public async down(): Promise<void> {
    // No reversible: se trata de limpieza de datos. 
    // Los overrides se recrearán cuando se necesiten.
    console.log('⚠️ No se puede revertir esta migración (limpieza de datos)');
  }
}

