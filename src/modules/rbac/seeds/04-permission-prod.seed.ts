// src/modules/rbac/seeds/permission-prod.seed.ts
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Permission } from '../entities/Permission';
import { Resource } from '../entities/Resource';
import { Action } from '../entities/Action';

export default class PermissionProdSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const permissionRepo = dataSource.getRepository(Permission);
    const resourceRepo = dataSource.getRepository(Resource);
    const actionRepo = dataSource.getRepository(Action);

    // 获取相关的 resource 和 action
    const resource = await resourceRepo.findOneByOrFail({ name: 'all' }); // 你可以用 'all' 表示通配资源
    const action = await actionRepo.findOneByOrFail({ name: 'all' }); // 'all' 表示所有操作

    const name = 'all.all.*.*'; // 全权限标识符

    const exists = await permissionRepo.exists({ where: { name } });
    if (exists) return;

    const newPermission: Partial<Permission> = {
      name,
      description: 'Grant all permissions to super admin',
      fields: undefined,
      condition: undefined,
      resource,
      action,
      isActive: true,
    };

    await permissionRepo.save(newPermission);
  }
}
