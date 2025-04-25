// src/database/seeds/user.seeder.ts
import { Seeder } from 'typeorm-extension';

export default class DummySeeder implements Seeder {
  public async run(): Promise<void> {
    console.log('🧪 Dummy seeder executed (no real data).');
  }
}
