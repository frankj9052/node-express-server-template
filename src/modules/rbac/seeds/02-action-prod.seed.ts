import { DataSource, Repository } from 'typeorm';
import { Action } from '../entities/Action';
import { SYSTEM_ACTIONS } from '@modules/common/constants/system-actions';
import { BaseSeeder } from '@modules/common/lib/BaseSeeder';

/**
 * Seeder: ActionProdSeed
 *
 * Inserts essential actions (CRUD + all) used for permission control.
 * Only inserts missing ones (ensures idempotency).
 */
export default class ActionProdSeed extends BaseSeeder {
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
    this.logger.info('🔍 Checking for required actions...');
    const repo = this.getRepository(dataSource);
    this.missingActions = [];

    for (const action of this.actions) {
      const exists = await repo.exists({ where: { name: action.name } });
      if (!exists) {
        this.missingActions.push(action);
        this.logger.warn(`❌ Missing action: "${action.name}"`);
      }
    }

    if (this.missingActions.length > 0) {
      this.logger.info(`🚨 ${this.missingActions.length} actions will be inserted.`);
      return true;
    }

    this.logger.info('✅ All actions already exist. Skipping.');
    return false;
  }

  async run(dataSource: DataSource): Promise<void> {
    this.logger.info('🚀 Running action seeder...');
    const repo = this.getRepository(dataSource);

    for (const action of this.missingActions) {
      await repo.insert(action);
      this.logger.info(`✅ Inserted action: "${action.name}"`);
    }

    this.logger.info(`🎉 Action seeding completed. Total inserted: ${this.missingActions.length}`);
  }
}
