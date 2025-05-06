// src/modules/rbac/seeds/role-permission-prod.seed.ts
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Role } from '../entities/Role';
import { Permission } from '../entities/Permission';
import { RolePermission } from '../entities/RolePermission';

export default class RolePermissionProdSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const roleRepo = dataSource.getRepository(Role);
    const permRepo = dataSource.getRepository(Permission);
    const rpRepo = dataSource.getRepository(RolePermission);

    // 获取角色和权限
    const role = await roleRepo.findOneByOrFail({ name: 'super-admin' });
    const permission = await permRepo.findOneByOrFail({ name: 'all.all.*.*' });

    // 防止重复插入
    const exists = await rpRepo.findOne({
      where: {
        role,
        permission,
      },
    });

    if (exists) return;

    const rolePermission = rpRepo.create({
      role,
      permission,
      isActive: true,
    });

    await rpRepo.save(rolePermission);
  }
}
