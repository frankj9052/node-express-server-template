import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Gender } from '@modules/common/enums/gender.enum';
import { Honorific } from '@modules/common/enums/honorific.enum';
import { env } from 'config/env';
import { BaseSeeder } from '@modules/common/lib/BaseSeeder';

export default class UserProdSeed extends BaseSeeder {
  private readonly email = env.SUPER_ADMIN_EMAIL;
  private readonly password = env.SUPER_ADMIN_PASSWORD;

  async shouldRun(dataSource: DataSource): Promise<boolean> {
    this.logger.info('🔍 Checking if super admin user exists...');
    const userRepo = dataSource.getRepository(User);
    const exists = await userRepo.exists({ where: { email: this.email } });
    if (exists) {
      this.logger.info(`✅ Super admin user "${this.email}" already exists. Skipping.`);
      return false;
    }
    return true;
  }

  async run(dataSource: DataSource): Promise<void> {
    this.logger.info('🚀 Creating super admin user...');

    const userRepo = dataSource.getRepository(User);

    const user = userRepo.create({
      userName: 'Frank',
      email: this.email,
      password: this.password,
      lastName: 'Jia',
      firstName: 'Frank',
      gender: Gender.MALE,
      honorific: Honorific.MR,
      dateOfBirth: new Date('1970-01-01'),
      emailVerified: true,
      profileCompleted: true,
      isActive: true,
    });

    await userRepo.save(user);

    this.logger.info(`✅ Super admin user created: ${this.email}`);
  }
}
