import { DataSource, In, Repository } from 'typeorm';
import { Permission } from '../entities/Permission';
import { Resource } from '../entities/Resource';
import { Action } from '../entities/Action';
import { SYSTEM_ACTIONS } from '@modules/common/constants/system-actions';
import { SYSTEM_RESOURCES } from '@modules/common/constants/system-resources';
import { SYSTEM_PERMISSIONS } from '@modules/common/constants/system-permissions';
import { PermissionAction } from '../entities/PermissionAction';
import { BaseSeeder } from '@modules/common/lib/BaseSeeder';

/**
 * Seeder: PermissionProdSeed
 *
 * Inserts a full-access permission (e.g., *:*:*:*) used by the admin role.
 */
export default class PermissionProdSeed extends BaseSeeder {
  private readonly permissionDef = SYSTEM_PERMISSIONS.ALL;
  private shouldInsert = false;
  private resourceId: string | null = null;
  private actionIds: string[] = [];

  private getPermissionRepo(dataSource: DataSource): Repository<Permission> {
    return dataSource.getRepository(Permission);
  }

  async shouldRun(dataSource: DataSource): Promise<boolean> {
    this.logger.info('🔍 Checking if full-access permission exists...');

    const repo = this.getPermissionRepo(dataSource);
    const exists = await repo.exists({ where: { name: this.permissionDef.name } });
    if (!exists) {
      const resource = await dataSource.getRepository(Resource).findOneByOrFail({
        name: SYSTEM_RESOURCES.ALL.name,
      });

      const actions = await dataSource.getRepository(Action).findBy({
        name: SYSTEM_ACTIONS.ALL.name,
      });

      this.resourceId = resource.id;
      this.actionIds = actions.map(a => a.id);
      this.shouldInsert = true;

      this.logger.warn(`❌ Missing permission: "${this.permissionDef.name}"`);

      return true;
    }

    this.logger.info(`✅ Permission "${this.permissionDef.name}" already exists. Skipping.`);
    return false;
  }

  async run(dataSource: DataSource): Promise<void> {
    if (!this.shouldInsert || !this.resourceId || !this.actionIds.length) {
      this.logger.warn('⚠️ Required data missing. Skipping run().');
      return;
    }

    this.logger.info('🚀 Running permission seeder...');

    const permissionRepo = this.getPermissionRepo(dataSource);
    const resourceRepo = dataSource.getRepository(Resource);
    const actionRepo = dataSource.getRepository(Action);
    const permissionActionRepo = dataSource.getRepository(PermissionAction);

    const resource = await resourceRepo.findOneByOrFail({ id: this.resourceId });
    const actions = await actionRepo.findBy({ id: In(this.actionIds) }); // 获取 Action 实体

    // 构建 Permission 实体对象（触发生命周期钩子）
    const permission = permissionRepo.create({
      description: this.permissionDef.description,
      isActive: true,
      resource,
      fields: [], // 如果有字段控制，这里填
      condition: {}, // 如果有条件，这里填
    });

    // ⚠️ 必须显式设置动作名，用于 name 构建（这个不会存 DB）
    permission.setActionsForNameBuild(actions.map(a => a.name));

    // 保存 permission（此时 name 会自动生成）
    const savedPermission = await permissionRepo.save(permission);

    // 插入中间表 PermissionAction
    const permissionActions = actions.map(action => ({
      permission: { id: savedPermission.id },
      action: { id: action.id },
      isActive: true,
    }));

    await permissionActionRepo.insert(permissionActions);

    this.logger.info(`✅ Inserted permission: "${savedPermission.name}"`);
    this.logger.info(`🎉 Permission seeding completed. Linked ${actions.length} actions.`);
  }
}
