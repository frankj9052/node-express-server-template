import { DataSource } from 'typeorm';
import { ConditionalSeeder } from '@modules/common/lib/ConditionalSeeder';
import { User } from '../entities/User';
import { Gender } from '@modules/common/enums/gender.enum';
import { Honorific } from '@modules/common/enums/honorific.enum';
import { env } from 'config/env';

export default class UserProdSeed implements ConditionalSeeder {
  private readonly email = env.SUPER_ADMIN_EMAIL;
  private readonly password = env.SUPER_ADMIN_PASSWORD;

  async shouldRun(dataSource: DataSource): Promise<boolean> {
    const userRepo = dataSource.getRepository(User);
    const exists = await userRepo.exists({ where: { email: this.email } });
    return !exists;
  }

  async run(dataSource: DataSource): Promise<void> {
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
      profileComplete: true,
      isActive: true,
    });

    await userRepo.save(user);

    console.log(`[Seeder][UserProdSeed] ✅ Inserted super admin user: ${this.email}`);
  }
}
