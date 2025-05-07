import { DataSource, Repository } from 'typeorm';
import { ConditionalSeeder } from '@modules/common/lib/ConditionalSeeder';
import { Action } from '../entities/Action';
import { SYSTEM_ACTIONS } from '@modules/common/constants/system-actions';

/**
 * Seeder: ActionProdSeed
 *
 * Inserts essential actions (CRUD + all) used for permission control.
 * Only inserts missing ones (ensures idempotency).
 */
export default class ActionProdSeed implements ConditionalSeeder {
  private getRepository(dataSource: DataSource): Repository<Action> {
    return dataSource.getRepository(Action);
  }

  private readonly actions: Array<Pick<Action, 'name' | 'description'>> = [
    SYSTEM_ACTIONS.ALL,
    SYSTEM_ACTIONS.CREATE,
    SYSTEM_ACTIONS.READ,
    SYSTEM_ACTIONS.UPDATE,
    SYSTEM_ACTIONS.DELETE,
  ];

  private missingActions: Array<Pick<Action, 'name' | 'description'>> = [];

  async shouldRun(dataSource: DataSource): Promise<boolean> {
    console.log('\n[Seeder][ActionProdSeed] ▶️ Checking for required actions...');
    const repo = this.getRepository(dataSource);
    this.missingActions = [];

    for (const action of this.actions) {
      const exists = await repo.exists({ where: { name: action.name } });
      if (!exists) {
        this.missingActions.push(action);
        console.log(`[Seeder][ActionProdSeed] ❌ Missing action: "${action.name}"`);
      }
    }

    if (this.missingActions.length > 0) {
      return true;
    }

    console.log('[Seeder][ActionProdSeed] ✅ All actions already exist. Skipping seeder.\n');
    return false;
  }

  async run(dataSource: DataSource): Promise<void> {
    console.log('\n[Seeder][ActionProdSeed] 🚀 Running action seeder...');
    const repo = this.getRepository(dataSource);

    for (const action of this.missingActions) {
      await repo.insert(action);
      console.log(`[Seeder][ActionProdSeed] ✅ Inserted action: "${action.name}"`);
    }

    console.log('[Seeder][ActionProdSeed] 🎉 Action seeding completed.\n');
  }
}
