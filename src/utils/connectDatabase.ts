// src/lib/connectDatabaseSafely.ts
import { DataSource } from 'typeorm';
import { createDatabase, runSeeders, useDataSource } from 'typeorm-extension';
import { env } from '../config/env';
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
  enableSeeders = true,
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

    if (enableSeeders && (env.NODE_ENV !== 'production' || env.ENABLE_SEEDERS !== 'false')) {
      console.log('🌱 Step 3: Running seeders...');
      const ds = await useDataSource();
      await runSeeders(ds);
      console.log('✅ Seeders executed.');
    } else {
      console.log('🚫 Step 3: Skipping seeders.');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}
