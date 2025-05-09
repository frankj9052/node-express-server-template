import { DataSource, Repository } from 'typeorm';
import { ConditionalSeeder } from '@modules/common/lib/ConditionalSeeder';
import { Role } from '../entities/Role';
import { SYSTEM_ROLES } from '@modules/common/constants/system-role';
import { SYSTEM_ORGANIZATIONS } from '@modules/common/constants/system-organizations';
import { Organization } from '@modules/organization/entities/Organization';

/**
 * Seeder: RoleProdSeed
 *
 * Ensures the `admin` role exists in the `platform` organization.
 */
export default class RoleProdSeed implements ConditionalSeeder {
  private readonly role = SYSTEM_ROLES.ADMIN;
  private shouldInsert = false;
  private platformOrg: Organization | null = null;

  private getRepository(dataSource: DataSource): Repository<Role> {
    return dataSource.getRepository(Role);
  }

  async shouldRun(dataSource: DataSource): Promise<boolean> {
    console.log('\n[Seeder][RoleProdSeed] ▶️ Checking if platform admin role exists...');

    const roleRepo = this.getRepository(dataSource);
    const organizationRepo = dataSource.getRepository(Organization);

    this.platformOrg = await organizationRepo.findOne({
      where: { name: SYSTEM_ORGANIZATIONS.PLATFORM.name },
    });

    if (!this.platformOrg) {
      console.log('[Seeder][RoleProdSeed] ❌ PLATFORM organization not found!');
      return false;
    }
    const exists = await roleRepo.exists({
      where: {
        name: this.role.name,
        organization: { id: this.platformOrg.id },
      },
    });

    if (exists) {
      console.log('[Seeder][RoleProdSeed] ✅ Admin role for platform already exists. Skipping.\n');
      return false;
    }

    this.shouldInsert = true;
    console.log('[Seeder][RoleProdSeed] ❌ Admin role missing.');
    return true;
  }

  async run(dataSource: DataSource): Promise<void> {
    if (!this.shouldInsert) return;

    console.log('\n[Seeder][RoleProdSeed] 🚀 Running role seeder...');
    const roleRepo = this.getRepository(dataSource);

    const role = roleRepo.create({
      name: this.role.name,
      description: this.role.description,
      isActive: true,
      organization: this.platformOrg!,
    });

    await roleRepo.save(role); // ✅ 会触发 setCode()

    console.log(`[Seeder][RoleProdSeed] ✅ Inserted role: "${this.role.name}"`);
    console.log('[Seeder][RoleProdSeed] 🎉 Role seeding completed.\n');
  }
}
