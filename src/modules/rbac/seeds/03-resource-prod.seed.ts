import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Resource } from '../entities/Resource';

export default class ResourceProdSeed implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(Resource);
    console.log('ResourceProdSeed');

    const resources: Array<Pick<Resource, 'name' | 'description'>> = [
      { name: 'all', description: 'All resources' },
      { name: 'organization', description: 'Manage platform-level organizations or tenants' },
      { name: 'userOrganizationRole', description: 'Assign users to organizations and roles' },
      { name: 'action', description: 'Define available system actions (e.g., CREATE, READ)' },
      { name: 'permission', description: 'Grant or restrict access to resource-action pairs' },
      { name: 'resource', description: 'Define system-level entities that can be protected' },
      { name: 'role', description: 'User role definitions and metadata' },
      { name: 'rolePermission', description: 'Link roles to their allowed permissions' },
    ];

    for (const resource of resources) {
      const exists = await repo.exists({ where: { name: resource.name } });
      if (!exists) {
        await repo.insert(resource);
      }
    }
  }
}
