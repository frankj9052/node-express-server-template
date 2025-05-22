// src/modules/service-auth/seeds/09-service-prod.seed.ts
import { DataSource } from 'typeorm';
import { BaseSeeder } from '@modules/common/lib/BaseSeeder';
import { SYSTEM_SERVICES } from '@modules/common/constants/system-services';
import { Organization } from '@modules/organization/entities/Organization';
import { Role } from '@modules/rbac/entities/Role';
import { Service } from '../entities/Service';

export default class ServiceProdSeed extends BaseSeeder {
  private servicesToInsert: Service[] = [];

  async shouldRun(dataSource: DataSource): Promise<boolean> {
    this.logger.info('🔍 Checking for system services...');

    const serviceRepo = dataSource.getRepository(Service);
    const orgRepo = dataSource.getRepository(Organization);
    const roleRepo = dataSource.getRepository(Role);

    for (const key of Object.keys(SYSTEM_SERVICES)) {
      const config = SYSTEM_SERVICES[key as keyof typeof SYSTEM_SERVICES];

      const organization = await orgRepo.findOne({ where: { name: config.role.organizationName } });

      if (!organization) {
        this.logger.error(
          `❌ Organization "${config.role.organizationName}" not found. Skipping service "${config.serviceId}".`
        );
        continue;
      }

      const role = await roleRepo.findOne({
        where: {
          name: config.role.name,
          organization: { id: organization.id },
        },
        relations: ['organization'],
      });

      if (!role) {
        this.logger.error(
          `❌ Role "${config.role.name}" not found in org "${organization.name}". Skipping service "${config.serviceId}".`
        );
        continue;
      }

      const exists = await serviceRepo.exists({ where: { serviceId: config.serviceId } });

      if (exists) {
        this.logger.info(`✅ Service "${config.serviceId}" already exists. Skipping.`);
        continue;
      }

      const service = serviceRepo.create({
        serviceId: config.serviceId,
        serviceSecret: config.secret, // will be hashed via @BeforeInsert()
        role,
        description: config.description,
        isActive: true,
      });

      this.servicesToInsert.push(service);
    }

    return this.servicesToInsert.length > 0;
  }

  async run(dataSource: DataSource): Promise<void> {
    if (this.servicesToInsert.length === 0) {
      this.logger.warn('⚠️ No services to insert. Skipping.');
      return;
    }

    this.logger.info('🚀 Inserting missing services...');

    const serviceRepo = dataSource.getRepository(Service);
    await serviceRepo.save(this.servicesToInsert);

    for (const service of this.servicesToInsert) {
      this.logger.info(
        `✅ Inserted service: "${service.serviceId}" with role "${service.role.name}"`
      );
    }

    this.logger.info(
      `🎉 Service seeding completed. Total inserted: ${this.servicesToInsert.length}`
    );
  }
}
