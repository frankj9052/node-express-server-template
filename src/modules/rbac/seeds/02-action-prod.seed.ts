import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Action } from '../entities/Action';

export default class ActionProdSeed implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(Action);
    console.log('ActionProdSeed');

    const actions: Array<Pick<Action, 'name' | 'description'>> = [
      { name: 'all', description: 'All actions' },
      { name: 'create', description: 'Create new resource' },
      { name: 'read', description: 'Read resource data' },
      { name: 'update', description: 'Update existing resource' },
      { name: 'delete', description: 'Delete resource' },
    ];

    for (const action of actions) {
      const exists = await repo.exists({ where: { name: action.name } });
      if (!exists) {
        await repo.insert(action);
      }
    }
  }
}
