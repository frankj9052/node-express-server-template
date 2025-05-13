import { DataSource, Repository } from 'typeorm';
import { Role } from '../entities/Role';
import { Permission } from '../entities/Permission';
import { RolePermission } from '../entities/RolePermission';
import { SYSTEM_PERMISSIONS } from '@modules/common/constants/system-permissions';
import { SYSTEM_ROLES } from '@modules/common/constants/system-role';
import { waitForEntity } from '@modules/common/utils/waitForEntity';
import { BaseSeeder } from '@modules/common/lib/BaseSeeder';

/**
 * Seeder: RolePermissionProdSeed
 *
 * Grants the `admin` role the `*:*:*:*` permission.
 */
export default class RolePermissionProdSeed extends BaseSeeder {
  private readonly roleName = SYSTEM_ROLES.ADMIN.name;
  private readonly permissionName = SYSTEM_PERMISSIONS.ALL.name;

  private role: Role | null = null;
  private permission: Permission | null = null;
  private shouldInsert = false;

  private getRepository(dataSource: DataSource): Repository<RolePermission> {
    return dataSource.getRepository(RolePermission);
  }

  async shouldRun(dataSource: DataSource): Promise<boolean> {
    this.logger.info('🔍 Checking if role-permission link exists...');

    const roleRepo = dataSource.getRepository(Role);
    const permRepo = dataSource.getRepository(Permission);
    const rpRepo = this.getRepository(dataSource);

    this.role = await waitForEntity(roleRepo, { name: this.roleName }, `role "${this.roleName}"`);
    this.permission = await waitForEntity(
      permRepo,
      { name: this.permissionName },
      `permission "${this.permissionName}"`
    );

    if (!this.role || !this.permission) {
      this.logger.warn('⚠️ Required role or permission not found. Skipping.');
      return false;
    }

    const exists = await rpRepo.exists({
      where: {
        role: { id: this.role.id },
        permission: { id: this.permission.id },
      },
    });

    if (exists) {
      this.logger.info('✅ Link already exists. Skipping.');
      return false;
    }

    this.shouldInsert = true;
    this.logger.warn(`❌ Missing link: ${this.roleName} → ${this.permissionName}`);
    return true;
  }

  async run(dataSource: DataSource): Promise<void> {
    if (!this.shouldInsert || !this.role || !this.permission) {
      this.logger.warn('⚠️ Skip run(): missing data or already satisfied.');
      return;
    }

    this.logger.info('🚀 Creating role-permission link...');
    const rpRepo = this.getRepository(dataSource);

    const rolePermission = rpRepo.create({
      role: this.role,
      permission: this.permission,
      isActive: true,
    });

    // ✅ 会触发 @BeforeInsert() 自动生成 name 字段
    await rpRepo.save(rolePermission);

    this.logger.info(`✅ Granted "${this.permissionName}" to role "${this.roleName}"`);
    this.logger.info('🎉 Role-permission seeding completed.');
  }
}
