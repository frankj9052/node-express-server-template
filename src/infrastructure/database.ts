import { loadSeeders } from '@modules/common/utils/loadSeeders';
import { createDatabase, setDataSource } from 'typeorm-extension';
import type { DataSource } from 'typeorm';
import { runSeedersInOrder } from '@modules/common/utils/runSeedersInOrder';
import { createLoggerWithContext, logger } from '@modules/common/lib/logger';

interface ConnectDatabaseOptions {
  dataSource: DataSource;
  initialDatabaseName?: string;
  enableSeeders?: boolean;
  skipCreateDatabase?: boolean;
}

const dbLogger = createLoggerWithContext('Database');
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
    dbLogger.info('🔧 Step 1: Preparing database...');
    if (skipCreateDatabase && initialDatabaseName) {
      await createDatabase({
        options: dataSource.options,
        initialDatabase: initialDatabaseName,
        ifNotExist: true,
      });
      dbLogger.info('✅ Database existence verified.');
    } else {
      dbLogger.info('⚡ Skipping database creation (assumed already exists).');
    }

    // STEP 2: Connect
    dbLogger.info('🔌 Step 2: Connecting to database...');
    await dataSource.initialize();
    setDataSource(dataSource); // Set global reference for extension tools
    dbLogger.info('✅ Database connection established.');

    // STEP 3: Seeders
    if (!enableSeeders) {
      dbLogger.info('🚫 Step 3: Seeder execution disabled by config.');
      return;
    }

    dbLogger.info('🌱 Step 3: Running seeders in order...');
    const seeders = await loadSeeders();
    await runSeedersInOrder(dataSource, seeders);
    dbLogger.info('✅ All seeders executed successfully.');
  } catch (error) {
    dbLogger.error('❌ Database setup failed:', error);
    throw error;
  }
}
