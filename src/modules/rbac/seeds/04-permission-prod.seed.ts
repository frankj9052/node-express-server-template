import { DataSource, Repository } from 'typeorm';
import { ConditionalSeeder } from '@modules/common/lib/ConditionalSeeder';
import { Permission } from '../entities/Permission';
import { Resource } from '../entities/Resource';
import { Action } from '../entities/Action';
import { SYSTEM_ACTIONS } from '@modules/common/constants/system-actions';
import { SYSTEM_RESOURCES } from '@modules/common/constants/system-resources';
import { SYSTEM_PERMISSIONS } from '@modules/common/constants/system-permissions';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

/**
 * Seeder: PermissionProdSeed
 *
 * Inserts a full-access permission (e.g., *:*:*:*) used by the admin role.
 */
export default class PermissionProdSeed implements ConditionalSeeder {
  private readonly permissionDef = SYSTEM_PERMISSIONS.ALL;
  private shouldInsert = false;
  private resourceId: string | null = null;
  private actionId: string | null = null;

  private getPermissionRepo(dataSource: DataSource): Repository<Permission> {
    return dataSource.getRepository(Permission);
  }

  async shouldRun(dataSource: DataSource): Promise<boolean> {
    console.log('\n[Seeder][PermissionProdSeed] ▶️ Checking if full-access permission exists...');

    const repo = this.getPermissionRepo(dataSource);
    const exists = await repo.exists({ where: { name: this.permissionDef.name } });

    if (!exists) {
      const resource = await dataSource.getRepository(Resource).findOneByOrFail({
        name: SYSTEM_RESOURCES.ALL.name,
      });

      const action = await dataSource.getRepository(Action).findOneByOrFail({
        name: SYSTEM_ACTIONS.ALL.name,
      });

      this.resourceId = resource.id;
      this.actionId = action.id;
      this.shouldInsert = true;

      console.log(
        `[Seeder][PermissionProdSeed] ❌ Missing permission: "${this.permissionDef.name}"`
      );
      return true;
    }

    console.log('[Seeder][PermissionProdSeed] ✅ Permission already exists. Skipping.\n');
    return false;
  }

  async run(dataSource: DataSource): Promise<void> {
    if (!this.shouldInsert || !this.resourceId || !this.actionId) return;

    console.log('\n[Seeder][PermissionProdSeed] 🚀 Running permission seeder...');

    const permissionRepo = this.getPermissionRepo(dataSource);

    const newPermission: QueryDeepPartialEntity<Permission> = {
      name: this.permissionDef.name,
      description: this.permissionDef.description,
      isActive: true,
      resource: { id: this.resourceId },
      action: { id: this.actionId },
    };

    await permissionRepo.insert(newPermission);

    console.log(
      `[Seeder][PermissionProdSeed] ✅ Inserted permission: "${this.permissionDef.name}"`
    );
    console.log('[Seeder][PermissionProdSeed] 🎉 Permission seeding completed.\n');
  }
}
