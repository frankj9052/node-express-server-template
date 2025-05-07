import { FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';

export async function waitForEntity<T extends ObjectLiteral>(
  repo: Repository<T>,
  where: FindOptionsWhere<T>,
  label: string
): Promise<T | null> {
  const found = await repo.findOneBy(where);
  if (!found) {
    console.log(`[Seeder] ⚠️ Dependency "${label}" not ready. Skipping.`);
    return null;
  }
  return found;
}
