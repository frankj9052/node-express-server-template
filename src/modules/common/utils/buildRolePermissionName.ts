/**
 * 生成 RolePermission.name，例如：admin:user:read:*:*
 */
export const buildRolePermissionName = (roleName: string, permissionName: string): string =>
  `${roleName}:${permissionName}`;
