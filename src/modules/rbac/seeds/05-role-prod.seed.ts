import { DataSource, Repository } from 'typeorm';
import { Role } from '../entities/Role';
import { SYSTEM_ROLES } from '@modules/common/constants/system-role';
import { SYSTEM_ORGANIZATIONS } from '@modules/common/constants/system-organizations';
import { Organization } from '@modules/organization/entities/Organization';
import { BaseSeeder } from '@modules/common/lib/BaseSeeder';

/**
 * Seeder: RoleProdSeed
 *
 * Ensures the `admin` role exists in the `platform` organization.
 */
export default class RoleProdSeed extends BaseSeeder {
  // private readonly role = SYSTEM_ROLES.ADMIN;
  private platformOrg: Organization | null = null;
  private rolesToInsert: Role[] = [];

  private getRepository(dataSource: DataSource): Repository<Role> {
    return dataSource.getRepository(Role);
  }

  async shouldRun(dataSource: DataSource): Promise<boolean> {
    this.logger.info('🔍 Checking for platform roles...');

    const roleRepo = this.getRepository(dataSource);
    const organizationRepo = dataSource.getRepository(Organization);

    this.platformOrg = await organizationRepo.findOne({
      where: { name: SYSTEM_ORGANIZATIONS.PLATFORM.name },
    });

    if (!this.platformOrg) {
      this.logger.error('❌ PLATFORM organization not found!');
      return false;
    }

    for (const roleKey of Object.keys(SYSTEM_ROLES)) {
      const systemRole = SYSTEM_ROLES[roleKey as keyof typeof SYSTEM_ROLES];
      const exists = await roleRepo.exists({
        where: {
          name: systemRole.name,
          organization: { id: this.platformOrg.id },
        },
      });

      if (!exists) {
        this.logger.warn(`❌ Missing role: "${systemRole.name}"`);

        const role = roleRepo.create({
          name: systemRole.name,
          description: systemRole.description,
          isActive: true,
          organization: this.platformOrg,
        });
        this.rolesToInsert.push(role);
      } else {
        this.logger.info(`✅ Role exists: "${systemRole.name}"`);
      }
    }

    return this.rolesToInsert.length > 0;
  }

  async run(dataSource: DataSource): Promise<void> {
    if (this.rolesToInsert.length === 0 || !this.platformOrg) {
      this.logger.warn('⚠️ No roles to insert or organization not found. Skipping.');
      return;
    }

    this.logger.info('🚀 Inserting missing roles...');

    const roleRepo = this.getRepository(dataSource);
    await roleRepo.save(this.rolesToInsert);

    for (const role of this.rolesToInsert) {
      this.logger.info(`✅ Inserted role: "${role.name}"`);
    }

    this.logger.info(`🎉 Role seeding completed. Total inserted: ${this.rolesToInsert.length}`);
  }
}
