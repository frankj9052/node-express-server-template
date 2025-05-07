import { DataSource, Repository } from 'typeorm';
import { ConditionalSeeder } from '@modules/common/lib/ConditionalSeeder';
import { Role } from '../entities/Role';
import { Organization } from '@modules/organization/entities/Organization';
import { SYSTEM_ORGANIZATIONS } from '@modules/common/constants/system-organizations';
import { SYSTEM_ROLES } from '@modules/common/constants/system-role';
import { waitForEntity } from '@modules/common/utils/waitForEntity';

/**
 * Seeder: RoleProdSeed
 *
 * Ensures the `admin` role exists in the `platform` organization.
 */
export default class RoleProdSeed implements ConditionalSeeder {
  private readonly role = SYSTEM_ROLES.ADMIN;
  private platformOrg: Organization | null = null;
  private shouldInsert = false;

  private getRepository(dataSource: DataSource): Repository<Role> {
    return dataSource.getRepository(Role);
  }

  async shouldRun(dataSource: DataSource): Promise<boolean> {
    console.log('\n[Seeder][RoleProdSeed] ▶️ Checking if platform admin role exists...');

    const roleRepo = this.getRepository(dataSource);
    const orgRepo = dataSource.getRepository(Organization);

    this.platformOrg = await waitForEntity(
      orgRepo,
      { name: SYSTEM_ORGANIZATIONS.PLATFORM.name },
      'platform organization'
    );

    if (!this.platformOrg) return false;

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
    if (!this.shouldInsert || !this.platformOrg) return;

    console.log('\n[Seeder][RoleProdSeed] 🚀 Running role seeder...');
    const roleRepo = this.getRepository(dataSource);

    await roleRepo.insert({
      name: this.role.name,
      description: this.role.description,
      organization: { id: this.platformOrg.id },
      isActive: true,
    });

    console.log(`[Seeder][RoleProdSeed] ✅ Inserted role: "${this.role.name}"`);
    console.log('[Seeder][RoleProdSeed] 🎉 Role seeding completed.\n');
  }
}
