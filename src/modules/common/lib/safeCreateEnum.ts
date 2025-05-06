import { QueryRunner } from 'typeorm';

/**
 * 安全创建 PostgreSQL ENUM 类型（如果不存在再创建）
 *
 * @param queryRunner - TypeORM 的 QueryRunner 实例
 * @param typeName - 要创建的 enum 类型名称（不带 schema，如 'action_scope_enum'）
 * @param values - enum 值列表，如 ['GLOBAL', 'TENANT', 'ORGANIZATION']
 */
export async function safeCreateEnum(
  queryRunner: QueryRunner,
  typeName: string,
  values: string[]
): Promise<void> {
  const enumValues = values.map(v => `'${v}'`).join(', ');
  const sql = `
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = '${typeName}'
      ) THEN
        CREATE TYPE "public"."${typeName}" AS ENUM(${enumValues});
      END IF;
    END
    $$;
  `;

  await queryRunner.query(sql);
}
