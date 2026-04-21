import { DataSource } from 'typeorm';
import { dataSource } from '@infrastructure/database/data-source';
import { Producer } from '@modules/logistics/domain/producer.entity';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  const producerRepository = dataSource.getRepository(Producer);

  console.log('Seeding producers...');

  // Create test producer
  const testProducer = producerRepository.create({
    id: uuidv4(),
    rut: '12345678-9',
    nombre: 'Productor Test',
    contacto: 'Juan Pérez',
    telefono: '+56912345678',
    email: 'producer@example.com',
    direccion: 'Calle Principal 123, Los Ángeles',
    activo: true,
  });

  const existingProducer = await producerRepository.findOne({
    where: { rut: testProducer.rut },
  });

  if (!existingProducer) {
    await producerRepository.save(testProducer);
    console.log('✓ Test producer created successfully');
  } else {
    console.log('✓ Test producer already exists');
  }

  console.log('Seed completed successfully!');
  await dataSource.destroy();
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
