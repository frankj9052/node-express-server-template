import { FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';
import { createLoggerWithContext } from '../lib/logger';

const logger = createLoggerWithContext('waitForEntity');
export async function waitForEntity<T extends ObjectLiteral>(
  repo: Repository<T>,
  where: FindOptionsWhere<T>,
  label: string
): Promise<T | null> {
  const found = await repo.findOneBy(where);
  if (!found) {
    logger.warn(`⚠️ Dependency not ready: "${label}"`, { where });
    return null;
  }
  return found;
}
