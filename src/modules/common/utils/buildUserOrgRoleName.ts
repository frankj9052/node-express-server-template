/**
 * 构建用户-组织-角色的唯一标识符。
 *
 * 格式为：`{userId}@{orgId}#{roleCode}`
 * 例如：`USR123@ORG456#ORG456::ADMIN`
 *
 * 用途：
 * - 唯一标识某用户在某组织下所持有的角色
 * - 可用于权限缓存、审计日志、RBAC 显示字段等
 *
 * @param userId - 用户唯一标识（建议为 UUID 或短码，如 USR123）
 * @param orgId - 组织唯一标识（如 ORG456）
 * @param roleCode - 角色唯一标识（如 ORG456::ADMIN）
 * @returns 构建后的唯一标识字符串
 */
export const buildFullUserOrgRoleName = (userId: string, orgId: string, roleCode: string): string =>
  `${userId}@${orgId}#${roleCode}`;
