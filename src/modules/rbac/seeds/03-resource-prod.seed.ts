import { DataSource, Repository } from 'typeorm';
import { ConditionalSeeder } from '@modules/common/lib/ConditionalSeeder';
import { Resource } from '../entities/Resource';
import { SYSTEM_RESOURCES } from '@modules/common/constants/system-resources';

/**
 * Seeder: ResourceProdSeed
 *
 * Inserts essential resources used for permission control.
 * Only inserts missing ones (ensures idempotency).
 */
export default class ResourceProdSeed implements ConditionalSeeder {
  private getRepository(dataSource: DataSource): Repository<Resource> {
    return dataSource.getRepository(Resource);
  }

  private readonly resources: Array<Pick<Resource, 'name' | 'description'>> = [
    SYSTEM_RESOURCES.ALL,
    SYSTEM_RESOURCES.ORGANIZATION,
    SYSTEM_RESOURCES.USER_ORG_ROLE,
    SYSTEM_RESOURCES.ACTION,
    SYSTEM_RESOURCES.PERMISSION,
    SYSTEM_RESOURCES.PERMISSION_ACTION,
    SYSTEM_RESOURCES.RESOURCE,
    SYSTEM_RESOURCES.ROLE,
    SYSTEM_RESOURCES.ROLE_PERMISSION,
  ];

  private missingResources: Array<Pick<Resource, 'name' | 'description'>> = [];

  async shouldRun(dataSource: DataSource): Promise<boolean> {
    console.log('\n[Seeder][ResourceProdSeed] ▶️ Checking for required resources...');
    const repo = this.getRepository(dataSource);
    this.missingResources = [];

    for (const resource of this.resources) {
      const exists = await repo.exists({ where: { name: resource.name } });
      if (!exists) {
        this.missingResources.push(resource);
        console.log(`[Seeder][ResourceProdSeed] ❌ Missing resource: "${resource.name}"`);
      }
    }

    if (this.missingResources.length > 0) {
      return true;
    }

    console.log('[Seeder][ResourceProdSeed] ✅ All resources already exist. Skipping seeder.\n');
    return false;
  }

  async run(dataSource: DataSource): Promise<void> {
    console.log('\n[Seeder][ResourceProdSeed] 🚀 Running resource seeder...');
    const repo = this.getRepository(dataSource);

    for (const resource of this.missingResources) {
      await repo.insert(resource);
      console.log(`[Seeder][ResourceProdSeed] ✅ Inserted resource: "${resource.name}"`);
    }

    console.log('[Seeder][ResourceProdSeed] 🎉 Resource seeding completed.\n');
  }
}
