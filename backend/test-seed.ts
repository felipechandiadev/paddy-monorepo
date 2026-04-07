import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { User } from './src/modules/users/domain/user.entity';
import { RoleEnum } from './src/shared/enums';

dotenv.config();

async function seed() {
  console.log('Starting seed...');
  
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '3306') || 3306,
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || 'redbull90',
    database: process.env.DATABASE_NAME || 'paddy',
    entities: ['src/modules/**/*.entity.ts'],
    synchronize: true,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Connected to database');
    
    const usersRepository = dataSource.getRepository(User);
    const admin = usersRepository.create({
      email: 'admin@ayg.cl',
      password: await bcrypt.hash('098098', 10),
      name: 'Administrador',
      role: RoleEnum.ADMIN,
      isActive: true,
    });
    
    const saved = await usersRepository.save(admin);
    console.log('✅ User saved:', saved);
    
    const users = await usersRepository.find();
    console.log('Seeded users:', users);
    
    await dataSource.destroy();
    console.log('✅ Seed completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
