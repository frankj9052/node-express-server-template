import { DataSource } from 'typeorm';
import { ConditionalSeeder } from '@modules/common/lib/ConditionalSeeder';
import { User } from '@modules/user/entities/User';
import { Role } from '@modules/rbac/entities/Role';
import { Organization } from '@modules/organization/entities/Organization';
import { UserOrganizationRole } from '@modules/organization/entities/UserOrganizationRole';
import { SYSTEM_ORGANIZATIONS } from '@modules/common/constants/system-organizations';
import { SYSTEM_ROLES } from '@modules/common/constants/system-role';
import { waitForEntity } from '@modules/common/utils/waitForEntity';
import { buildFullUserOrgRoleName } from '@modules/common/utils/buildUserOrgRoleName';

export default class UserOrganizationRoleProdSeed implements ConditionalSeeder {
  private readonly email = process.env.SUPER_ADMIN_EMAIL!;
  private shouldInsert = false;
  private user: User | null = null;
  private role: Role | null = null;
  private org: Organization | null = null;

  async shouldRun(dataSource: DataSource): Promise<boolean> {
    console.log('\n[Seeder][UserOrganizationRoleProdSeed] ▶️ Checking user-org-role link...');

    const uorRepo = dataSource.getRepository(UserOrganizationRole);
    const userRepo = dataSource.getRepository(User);
    const orgRepo = dataSource.getRepository(Organization);
    const roleRepo = dataSource.getRepository(Role);

    this.user = await waitForEntity(userRepo, { email: this.email }, 'super admin user');
    this.org = await waitForEntity(
      orgRepo,
      { name: SYSTEM_ORGANIZATIONS.PLATFORM.name },
      'platform organization'
    );
    this.role = await waitForEntity(
      roleRepo,
      {
        name: SYSTEM_ROLES.ADMIN.name,
        organization: { id: this.org?.id },
      },
      'admin role in platform'
    );

    if (!this.user || !this.org || !this.role) return false;

    const exists = await uorRepo.exists({
      where: {
        user: { id: this.user.id },
        organization: { id: this.org.id },
        role: { id: this.role.id },
      },
    });

    if (exists) {
      console.log('[Seeder][UserOrganizationRoleProdSeed] ✅ Link already exists. Skipping.\n');
      return false;
    }

    this.shouldInsert = true;
    console.log('[Seeder][UserOrganizationRoleProdSeed] ❌ Link missing. Will insert.');
    return true;
  }

  async run(dataSource: DataSource): Promise<void> {
    if (!this.shouldInsert || !this.user || !this.org || !this.role) return;

    console.log('\n[Seeder][UserOrganizationRoleProdSeed] 🚀 Running UOR seeder...');

    const name = buildFullUserOrgRoleName(this.email, this.org.name, this.role.name);

    await dataSource.getRepository(UserOrganizationRole).insert({
      name,
      user: this.user,
      organization: this.org,
      role: this.role,
      isActive: true,
    });

    console.log('[Seeder][UserOrganizationRoleProdSeed] ✅ Linked user to platform-admin role\n');
  }
}
