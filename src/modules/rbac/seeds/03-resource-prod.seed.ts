import { DataSource, Repository } from 'typeorm';
import { Resource } from '../entities/Resource';
import { SYSTEM_RESOURCES } from '@modules/common/constants/system-resources';
import { BaseSeeder } from '@modules/common/lib/BaseSeeder';

/**
 * Seeder: ResourceProdSeed
 *
 * Inserts essential resources used for permission control.
 * Only inserts missing ones (ensures idempotency).
 */
export default class ResourceProdSeed extends BaseSeeder {
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
    this.logger.info('🔍 Checking for required resources...');
    const repo = this.getRepository(dataSource);
    this.missingResources = [];

    for (const resource of this.resources) {
      const exists = await repo.exists({ where: { name: resource.name } });
      if (!exists) {
        this.missingResources.push(resource);
        this.logger.warn(`❌ Missing resource: "${resource.name}"`);
      }
    }

    if (this.missingResources.length > 0) {
      this.logger.info(`🚨 ${this.missingResources.length} resource(s) will be inserted.`);
      return true;
    }

    this.logger.info('✅ All resources already exist. Skipping.');
    return false;
  }

  async run(dataSource: DataSource): Promise<void> {
    this.logger.info('🚀 Running resource seeder...');
    const repo = this.getRepository(dataSource);

    for (const resource of this.missingResources) {
      await repo.insert(resource);
      this.logger.info(`✅ Inserted resource: "${resource.name}"`);
    }

    this.logger.info(
      `🎉 Resource Seeding Completed. Total inserted: ${this.missingResources.length}`
    );
  }
}
