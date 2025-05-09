/**
 * 构建 RolePermission 的唯一标识名，用于表达“某角色拥有某权限”。
 * 命名格式示例：
 *   orgId::admin=>user:[read]@*?*
 *
 * @param roleCode - 角色的 code（如 'admin'、'provider'）
 * @param permissionName - 已生成好的 permission.name 字符串
 * @returns 构建出的 rolePermission.name
 */
export const buildRolePermissionName = (roleCode: string, permissionName: string): string =>
  `${roleCode}=>${permissionName}`;
