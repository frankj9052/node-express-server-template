import type { DataSource } from 'typeorm';
import { useSeederFactoryManager, type SeederConstructor } from 'typeorm-extension';
import { ConditionalSeeder } from '../lib/ConditionalSeeder';

export async function runSeedersInOrder(dataSource: DataSource, seeders: SeederConstructor[]) {
  const executed: string[] = [];
  const factoryManager = useSeederFactoryManager();

  for (const SeederClass of seeders) {
    const instance = new SeederClass() as ConditionalSeeder;

    try {
      if (typeof instance.shouldRun === 'function') {
        const shouldRun = await instance.shouldRun(dataSource);
        if (!shouldRun) {
          console.log(`⏭️ Skipped: ${SeederClass.name}`);
          continue;
        }
      }

      if (typeof instance.run === 'function') {
        console.log(`🚀 Running: ${SeederClass.name}`);
        await instance.run(dataSource, factoryManager);
        executed.push(SeederClass.name);
      }
    } catch (error) {
      console.error(`❌ Failed seeder: ${SeederClass.name}`);
      console.error(error);
      throw error; // 如果你想继续执行其它种子，可以选择不抛出
    }
  }

  console.log('🧪 Executed Seeders:', executed);
}
