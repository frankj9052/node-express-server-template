import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export interface ConditionalSeeder extends Seeder {
  shouldRun?: (dataSource: DataSource) => Promise<boolean>;
}
