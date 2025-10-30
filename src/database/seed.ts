// src/seeds/user.seed.ts
import { AppDataSource } from '../data-source';
import * as bcrypt from 'bcryptjs';
import { User } from '../modules/user/user.entity';
import { Role } from '../common/enums/role.enum';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    const userRepo = AppDataSource.getRepository(User);

    const existingAdmin = await userRepo.findOne({ where: { username: 'admin' } });
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists, skipping...');
      return;
    }

    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    const adminUser = userRepo.create({
      username: 'admin',
      email: 'admin@system.local',
      password: hashedPassword,
      roles: [Role.Admin],
      firstName: 'Administrator',
      lastName: '',
    });

    await userRepo.save(adminUser);
    console.log('✅ Admin user seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding user:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

export const runSeed = () => seed();
