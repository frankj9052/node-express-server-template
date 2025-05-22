import { DataSource, Repository } from 'typeorm';
import { Role } from '../entities/Role';
import { SYSTEM_ROLES } from '@modules/common/constants/system-role';
import { Organization } from '@modules/organization/entities/Organization';
import { BaseSeeder } from '@modules/common/lib/BaseSeeder';

export default class RoleProdSeed extends BaseSeeder {
  private rolesToInsert: Role[] = [];

  private getRepository(dataSource: DataSource): Repository<Role> {
    return dataSource.getRepository(Role);
  }

  async shouldRun(dataSource: DataSource): Promise<boolean> {
    this.logger.info('🔍 Checking for system roles in their respective organizations...');

    const roleRepo = this.getRepository(dataSource);
    const organizationRepo = dataSource.getRepository(Organization);

    for (const roleKey of Object.keys(SYSTEM_ROLES)) {
      const systemRole = SYSTEM_ROLES[roleKey as keyof typeof SYSTEM_ROLES];

      const organization = await organizationRepo.findOne({
        where: { name: systemRole.organizationName },
      });

      if (!organization) {
        this.logger.error(
          `❌ Organization "${systemRole.organizationName}" not found. Skipping role "${systemRole.name}".`
        );
        continue;
      }

      const exists = await roleRepo.exists({
        where: {
          name: systemRole.name,
          organization: { id: organization.id },
        },
      });

      if (exists) {
        this.logger.info(`✅ Role "${systemRole.name}" already exists in "${organization.name}"`);
        continue;
      }

      this.logger.warn(`❌ Missing role "${systemRole.name}" in "${organization.name}"`);

      const role = roleRepo.create({
        name: systemRole.name,
        description: systemRole.description,
        isActive: true,
        organization,
      });

      this.rolesToInsert.push(role);
    }

    return this.rolesToInsert.length > 0;
  }

  async run(dataSource: DataSource): Promise<void> {
    if (this.rolesToInsert.length === 0) {
      this.logger.warn('⚠️ No roles to insert. Skipping.');
      return;
    }

    this.logger.info('🚀 Inserting missing roles...');

    const roleRepo = this.getRepository(dataSource);
    await roleRepo.save(this.rolesToInsert);

    for (const role of this.rolesToInsert) {
      this.logger.info(
        `✅ Inserted role: "${role.name}" for organization "${role.organization.name}"`
      );
    }

    this.logger.info(`🎉 Role seeding completed. Total inserted: ${this.rolesToInsert.length}`);
  }
}
