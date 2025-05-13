import type { DataSource } from 'typeorm';
import { useSeederFactoryManager } from 'typeorm-extension';
import { createLoggerWithContext } from '../lib/logger';
import { BaseSeeder } from '../lib/BaseSeeder';

const logger = createLoggerWithContext('SeederRunner');
/**
 * 按顺序执行种子文件，支持 ConditionalSeeder.shouldRun()
 */
export async function runSeedersInOrder(
  dataSource: DataSource,
  seeders: Array<new () => BaseSeeder>
) {
  const executed: string[] = [];
  const factoryManager = useSeederFactoryManager();

  for (const SeederClass of seeders) {
    const instance = new SeederClass();
    const startTime = Date.now();
    const name = SeederClass.name;

    try {
      if (typeof instance.shouldRun === 'function') {
        const shouldRun = await instance.shouldRun(dataSource);
        if (!shouldRun) {
          logger.info(`⏭️ Skipped: ${name}`);
          continue;
        }
      }

      logger.info(`🚀 Running: ${name}`);
      await instance.run(dataSource, factoryManager);
      const duration = Date.now() - startTime;
      logger.info(`✅ Completed: ${name}`, { durationMs: duration });
      executed.push(SeederClass.name);
    } catch (error) {
      logger.error(`❌ Failed: ${name}`, error);
      throw error; // 如果你想继续执行其它种子，可以选择不抛出
    }
  }

  logger.info(`🧪 Executed Seeders Summary`, {
    total: seeders.length,
    executed,
    count: executed.length,
  });
  return executed;
}
