import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Organization } from '../entities/Organization';

export default class OrganizationProdSeed implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(Organization);
    console.log('OrganizationProdSeed');
    /* 幂等性：如果已经插过就跳过 */
    const exists = await repo.exists({ where: { name: 'Public' } });
    if (exists) return;

    await repo.insert([
      {
        name: 'Public',
        description: 'Shared organization for unscoped data',
      },
      {
        name: 'Root',
        description:
          'Root-level organization with full system access for developers and platform administrators',
      },
    ]);
  }
}
