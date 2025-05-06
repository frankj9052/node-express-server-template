// src/lib/connectDatabaseSafely.ts
import { loadSeeders } from '@modules/common/utils/loadSeeders';
import { DataSource } from 'typeorm';
import { createDatabase, runSeeders, useDataSource } from 'typeorm-extension';
import { setDataSource } from 'typeorm-extension';

interface ConnectDatabaseOptions {
  dataSource: DataSource;
  initialDatabaseName?: string;
  enableSeeders?: boolean;
  skipCreateDatabase?: boolean;
}

export async function connectDatabase({
  dataSource,
  initialDatabaseName,
  enableSeeders = false,
  skipCreateDatabase = false,
}: ConnectDatabaseOptions): Promise<void> {
  try {
    console.log('🔧 Step 1: (Optional) Creating database if not exists...');
    if (skipCreateDatabase && initialDatabaseName) {
      await createDatabase({
        options: dataSource.options,
        initialDatabase: initialDatabaseName,
        ifNotExist: true,
      });
      console.log('✅ Database check completed.');
    } else {
      console.log('⚡ Skipping database creation step.');
    }

    console.log('🔌 Step 2: Connecting to database...');
    await dataSource.initialize();
    console.log('✅ Database connection established.');

    setDataSource(dataSource);

    if (enableSeeders) {
      console.log('🌱 Step 3: Running seeders...');
      const ds = await useDataSource();

      const seeds = await loadSeeders();
      const seedsResult = await runSeeders(ds, { seeds });
      console.log(
        '🧪 Executed Seeders:',
        seedsResult.map(s => s.name)
      );
      console.log('✅ Seeders executed.');
    } else {
      console.log('🚫 Step 3: Skipping seeders.');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}
