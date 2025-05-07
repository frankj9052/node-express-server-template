import { loadSeeders } from '@modules/common/utils/loadSeeders';
import { createDatabase, setDataSource } from 'typeorm-extension';
import type { DataSource } from 'typeorm';
import { runSeedersInOrder } from '@modules/common/utils/runSeedersInOrder';

interface ConnectDatabaseOptions {
  dataSource: DataSource;
  initialDatabaseName?: string;
  enableSeeders?: boolean;
  skipCreateDatabase?: boolean;
}

/**
 * Initialize and connect to the database with optional seed execution.
 */
export async function connectDatabase({
  dataSource,
  initialDatabaseName,
  enableSeeders = false,
  skipCreateDatabase = false,
}: ConnectDatabaseOptions): Promise<void> {
  try {
    // STEP 1: Create DB (optional)
    console.log('🔧 Step 1: Preparing database...');
    if (skipCreateDatabase && initialDatabaseName) {
      await createDatabase({
        options: dataSource.options,
        initialDatabase: initialDatabaseName,
        ifNotExist: true,
      });
      console.log('✅ Database existence verified.');
    } else {
      console.log('⚡ Skipping database creation (assumed already exists).');
    }

    // STEP 2: Connect
    console.log('🔌 Step 2: Connecting to database...');
    await dataSource.initialize();
    setDataSource(dataSource); // Set global reference for extension tools
    console.log('✅ Database connection established.');

    // STEP 3: Seeders
    if (!enableSeeders) {
      console.log('🚫 Step 3: Seeder execution disabled by config.');
      return;
    }

    console.log('🌱 Step 3: Running seeders in order...');
    const seeders = await loadSeeders();
    await runSeedersInOrder(dataSource, seeders);
  } catch (error) {
    console.error('❌ Database setup failed:', error instanceof Error ? error.stack : error);
    throw error;
  }
}
