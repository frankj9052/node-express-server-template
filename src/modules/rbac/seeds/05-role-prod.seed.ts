// src/modules/rbac/seeds/role-prod.seed.ts
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Role } from '../entities/Role';
import { Organization } from '@modules/organization/entities/Organization';

export default class RoleProdSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const roleRepo = dataSource.getRepository(Role);
    const orgRepo = dataSource.getRepository(Organization);

    // 获取 Root 组织
    const rootOrg = await orgRepo.findOneByOrFail({ name: 'root' });

    const name = 'super-admin';

    const exists = await roleRepo.findOne({
      where: { name, organization: { id: rootOrg.id } },
      relations: ['organization'],
    });

    if (exists) return;

    const role = roleRepo.create({
      name,
      description: 'Full access to the entire platform',
      organization: rootOrg,
      isActive: true,
    });

    await roleRepo.save(role);
  }
}
