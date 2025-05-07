import { DataSource, Repository } from 'typeorm';
import { ConditionalSeeder } from '@modules/common/lib/ConditionalSeeder';
import { Role } from '../entities/Role';
import { Permission } from '../entities/Permission';
import { RolePermission } from '../entities/RolePermission';
import { SYSTEM_PERMISSIONS } from '@modules/common/constants/system-permissions';
import { SYSTEM_ROLES } from '@modules/common/constants/system-role';
import { waitForEntity } from '@modules/common/utils/waitForEntity';
import { buildRolePermissionName } from '@modules/common/utils/buildRolePermissionName';

/**
 * Seeder: RolePermissionProdSeed
 *
 * Grants the `admin` role the `*:*:*:*` permission.
 */
export default class RolePermissionProdSeed implements ConditionalSeeder {
  private readonly roleName = SYSTEM_ROLES.ADMIN.name;
  private readonly permissionName = SYSTEM_PERMISSIONS.ALL.name;

  private role: Role | null = null;
  private permission: Permission | null = null;
  private shouldInsert = false;

  private getRepository(dataSource: DataSource): Repository<RolePermission> {
    return dataSource.getRepository(RolePermission);
  }

  async shouldRun(dataSource: DataSource): Promise<boolean> {
    console.log('\n[Seeder][RolePermissionProdSeed] ▶️ Checking if role-permission link exists...');

    const roleRepo = dataSource.getRepository(Role);
    const permRepo = dataSource.getRepository(Permission);
    const rpRepo = this.getRepository(dataSource);

    this.role = await waitForEntity(roleRepo, { name: this.roleName }, `role "${this.roleName}"`);
    this.permission = await waitForEntity(
      permRepo,
      { name: this.permissionName },
      `permission "${this.permissionName}"`
    );

    if (!this.role || !this.permission) return false;

    const exists = await rpRepo.exists({
      where: {
        role: { id: this.role.id },
        permission: { id: this.permission.id },
      },
    });

    if (exists) {
      console.log('[Seeder][RolePermissionProdSeed] ✅ Link already exists. Skipping.\n');
      return false;
    }

    this.shouldInsert = true;
    console.log(
      `[Seeder][RolePermissionProdSeed] ❌ Missing link: ${this.roleName} → ${this.permissionName}`
    );
    return true;
  }

  async run(dataSource: DataSource): Promise<void> {
    if (!this.shouldInsert || !this.role || !this.permission) return;

    console.log('\n[Seeder][RolePermissionProdSeed] 🚀 Running role-permission seeder...');
    const rpRepo = this.getRepository(dataSource);

    await rpRepo.insert({
      role: { id: this.role.id },
      permission: { id: this.permission.id },
      isActive: true,
      name: buildRolePermissionName(this.roleName, this.permissionName),
    });

    console.log(
      `[Seeder][RolePermissionProdSeed] ✅ Granted "${this.permissionName}" to role "${this.roleName}"`
    );
    console.log('[Seeder][RolePermissionProdSeed] 🎉 Role-permission seeding completed.\n');
  }
}
