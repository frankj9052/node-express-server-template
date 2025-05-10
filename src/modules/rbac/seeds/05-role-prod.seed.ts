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
  // private readonly role = SYSTEM_ROLES.ADMIN;
  private platformOrg: Organization | null = null;
  private rolesToInsert: Role[] = [];

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

    for (const roleKey of Object.keys(SYSTEM_ROLES)) {
      const systemRole = SYSTEM_ROLES[roleKey as keyof typeof SYSTEM_ROLES];
      const exists = await roleRepo.exists({
        where: {
          name: systemRole.name,
          organization: { id: this.platformOrg.id },
        },
      });

      if (!exists) {
        console.log(`[Seeder][RoleProdSeed] ❌ Missing role: "${systemRole.name}"`);
        const role = roleRepo.create({
          name: systemRole.name,
          description: systemRole.description,
          isActive: true,
          organization: this.platformOrg,
        });
        this.rolesToInsert.push(role);
      } else {
        console.log(`[Seeder][RoleProdSeed] ✅ Role "${systemRole.name}" already exists.`);
      }
    }

    return this.rolesToInsert.length > 0;
  }

  async run(dataSource: DataSource): Promise<void> {
    if (this.rolesToInsert.length === 0) return;

    console.log('\n[Seeder][RoleProdSeed] 🚀 Inserting missing roles...');

    const roleRepo = this.getRepository(dataSource);
    await roleRepo.save(this.rolesToInsert);

    for (const role of this.rolesToInsert) {
      console.log(`[Seeder][RoleProdSeed] ✅ Inserted role: "${role.name}"`);
    }

    console.log('[Seeder][RoleProdSeed] 🎉 Role seeding completed.\n');
  }
}
