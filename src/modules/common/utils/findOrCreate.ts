import { DataSource, DeepPartial, EntityTarget, FindOptionsWhere, ObjectLiteral } from 'typeorm';

/**
 * 通用幂等插入工具函数
 * @param dataSource 数据源
 * @param entity 实体类
 * @param where 查找条件（确保唯一）
 * @param createPayload 创建所需的字段
 */
export async function findOrCreate<Entity extends ObjectLiteral>(
  dataSource: DataSource,
  entity: EntityTarget<Entity>,
  where: FindOptionsWhere<Entity>,
  createPayload: DeepPartial<Entity>
): Promise<Entity> {
  const repo = dataSource.getRepository(entity);

  const existing = await repo.findOne({ where });
  if (existing) return existing;

  const created = repo.create(createPayload);
  return repo.save(created);
}
