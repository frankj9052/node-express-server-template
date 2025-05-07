import { DataSource, Repository } from 'typeorm';
import { Organization } from '../entities/Organization';
import { ConditionalSeeder } from '@modules/common/lib/ConditionalSeeder';
import { SYSTEM_ORGANIZATIONS } from '@modules/common/constants/system-organizations';

/**
 * Seeder: OrganizationProdSeed
 *
 * Inserts essential organizations used by the platform.
 * Only inserts missing ones (ensures idempotency).
 */
export default class OrganizationProdSeed implements ConditionalSeeder {
  private getRepository(dataSource: DataSource): Repository<Organization> {
    return dataSource.getRepository(Organization);
  }

  private readonly organizations: Array<Pick<Organization, 'name' | 'description'>> = [
    SYSTEM_ORGANIZATIONS.PUBLIC,
    SYSTEM_ORGANIZATIONS.PLATFORM,
  ];

  private missingOrganizations: Array<Pick<Organization, 'name' | 'description'>> = [];

  async shouldRun(dataSource: DataSource): Promise<boolean> {
    console.log('\n[Seeder][OrganizationProdSeed] ▶️ Checking for required organizations...');
    const repo = this.getRepository(dataSource);
    this.missingOrganizations = [];

    for (const org of this.organizations) {
      const exists = await repo.exists({ where: { name: org.name } });
      if (!exists) {
        this.missingOrganizations.push(org);
        console.log(`[Seeder][OrganizationProdSeed] ❌ Missing organization: "${org.name}"`);
      }
    }

    if (this.missingOrganizations.length > 0) {
      return true;
    }

    console.log('[Seeder][OrganizationProdSeed] ✅ All organizations already exist. Skipping.\n');
    return false;
  }

  async run(dataSource: DataSource): Promise<void> {
    console.log('\n[Seeder][OrganizationProdSeed] 🚀 Running organization seeder...');
    const repo = this.getRepository(dataSource);

    for (const org of this.missingOrganizations) {
      await repo.insert(org);
      console.log(`[Seeder][OrganizationProdSeed] ✅ Inserted organization: "${org.name}"`);
    }

    console.log('[Seeder][OrganizationProdSeed] 🎉 Organization seeding completed.\n');
  }
}
