import { DataSource, Repository } from 'typeorm';
import { Organization } from '../entities/Organization';
import { SYSTEM_ORGANIZATIONS } from '@modules/common/constants/system-organizations';
import { BaseSeeder } from '@modules/common/lib/BaseSeeder';

/**
 * Seeder: OrganizationProdSeed
 *
 * Inserts essential organizations used by the platform.
 * Only inserts missing ones (ensures idempotency).
 */
export default class OrganizationProdSeed extends BaseSeeder {
  private getRepository(dataSource: DataSource): Repository<Organization> {
    return dataSource.getRepository(Organization);
  }

  private readonly organizations: Array<Pick<Organization, 'name' | 'description'>> = [
    SYSTEM_ORGANIZATIONS.PUBLIC,
    SYSTEM_ORGANIZATIONS.PLATFORM,
  ];

  private missingOrganizations: Array<Pick<Organization, 'name' | 'description'>> = [];

  async shouldRun(dataSource: DataSource): Promise<boolean> {
    this.logger.info('🔍 Checking for required organizations...');
    const repo = this.getRepository(dataSource);
    this.missingOrganizations = [];

    for (const org of this.organizations) {
      const exists = await repo.exists({ where: { name: org.name } });
      if (!exists) {
        this.missingOrganizations.push(org);
        this.logger.warn(`❌ Missing: "${org.name}"`);
      }
    }

    if (this.missingOrganizations.length > 0) {
      this.logger.info(
        `🚨 ${this.missingOrganizations.length} missing organizations will be inserted.`
      );
      return true;
    }

    this.logger.info('✅ All required organizations already exist. Skipping.');
    return false;
  }

  async run(dataSource: DataSource): Promise<void> {
    this.logger.info('🚀 Running organization seeder...');
    const repo = this.getRepository(dataSource);

    for (const org of this.missingOrganizations) {
      await repo.insert(org);
      this.logger.info(`✅ Inserted organization: "${org.name}"`);
    }

    this.logger.info(`🎉 Completed. Total inserted: ${this.missingOrganizations.length}`);
  }
}
