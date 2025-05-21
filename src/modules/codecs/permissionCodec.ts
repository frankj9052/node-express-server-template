// 它不是通用工具，而是一个DSL 构造器（领域专用语言的编码器）
// src/modules/rbac/utils/permissionCodec.ts

/** -----------------------------
 * Permission Name <==> Parsed Form
 * ------------------------------ */
export interface ParsedPermission {
  resource: string;
  actions: string[] | '*';
  fields?: string[] | '*';
  conditions?: Record<string, string>;
}

/**
 * 构建权限字符串
 * @param resource - 资源名称，例如 'user'
 * @param actions - 动作数组或通配符 '*'，例如 ['read', 'update'] 或 '*'
 * @param fields - 可选字段数组或通配符 '*'，例如 ['name', 'email'] 或 '*'
 * @param conditions - 可选条件对象，例如 { orgId: '123' }
 * @returns 构建后的权限字符串
 *
 * @example
 * buildPermissionName('user', ['read'], ['name'], { orgId: '123' })
 * // => 'user:[read]@name?orgId=123'
 */
export const buildPermissionName = (
  resource: string,
  actions: string[] | '*',
  fields?: string[] | '*',
  conditions?: Record<string, unknown>
): string => {
  const actionPart = Array.isArray(actions) ? `[${actions.join(',')}]` : '[*]';

  const fieldPart =
    fields === undefined || (Array.isArray(fields) && fields.length === 0)
      ? ''
      : `@${Array.isArray(fields) ? fields.join(',') : '*'}`;

  const conditionPart =
    conditions && Object.keys(conditions).length > 0
      ? '?' +
        Object.entries(conditions)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, value]) => `${key}=${String(value)}`)
          .join('&')
      : '';

  return `${resource}:${actionPart}${fieldPart}${conditionPart}`;
};

/**
 * 解析权限字符串为结构化对象
 * @param permissionName - 权限字符串
 * @returns 结构化的权限对象
 *
 * @example
 * parsePermissionName('user:[read,update]@name,email?orgId=123')
 * // =>
 * // {
 * //   resource: 'user',
 * //   actions: ['read', 'update'],
 * //   fields: ['name', 'email'],
 * //   conditions: { orgId: '123' }
 * // }
 */
export const parsePermissionName = (permissionName: string): ParsedPermission => {
  const match = permissionName.match(/^([^:]+):\[(.*?)\](?:@([^?]+))?(?:\?(.*))?$/);

  if (!match) {
    throw new Error(`Invalid permission string format: ${permissionName}`);
  }

  const [, resource, actionStr, fieldStr, conditionStr] = match;

  const actions: string[] | '*' =
    actionStr.trim() === '*' ? '*' : actionStr.split(',').map(s => s.trim());

  const fields: string[] | '*' | undefined =
    fieldStr === undefined
      ? undefined
      : fieldStr.trim() === '*'
        ? '*'
        : fieldStr.split(',').map(s => s.trim());

  const conditions: Record<string, string> = {};
  if (conditionStr) {
    conditionStr.split('&').forEach(part => {
      const [key, value] = part.split('=');
      if (key && value !== undefined) {
        conditions[key.trim()] = value.trim();
      }
    });
  }

  return {
    resource,
    actions,
    ...(fields !== undefined && { fields }),
    ...(Object.keys(conditions).length > 0 && { conditions }),
  };
};

/** -----------------------------
 * Role Code <==> Parsed Form
 * ------------------------------ */
export interface ParsedRoleCode {
  orgId: string;
  roleName: string;
}

/**
 * 构建角色编码
 * @param orgId - 组织 ID，例如 'org123'
 * @param roleName - 角色名称，例如 'admin'
 * @returns 构建后的角色编码，例如 'org123::admin'
 */
export const buildRoleCode = (orgId: string, roleName: string): string => `${orgId}::${roleName}`;

/**
 * 解析角色编码
 * @param roleCode - 角色编码字符串，例如 'org123::admin'
 * @returns 解析后的对象 { orgId, roleName }
 */
export const parseRoleCode = (roleCode: string): ParsedRoleCode => {
  const parts = roleCode.split('::');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new Error(`Invalid roleCode format: ${roleCode}`);
  }

  return {
    orgId: parts[0],
    roleName: parts[1],
  };
};

/** -----------------------------
 * RolePermission Name <==> Parsed
 * ------------------------------ */
export interface ParsedRolePermissionName {
  roleCode: string;
  permissionName: string;
}

/**
 * 构建角色权限关联标识
 * @param roleCode - 角色编码，例如 'org123::admin'
 * @param permissionName - 权限字符串
 * @returns 构建后的标识，例如 'org123::admin=>user:[read]'
 */
export const buildRolePermissionName = (roleCode: string, permissionName: string): string =>
  `${roleCode}=>${permissionName}`;

/**
 * 解析角色权限关联标识
 * @param name - 组合字符串，例如 'org123::admin=>user:[read]'
 * @returns 解析后的对象 { roleCode, permissionName }
 */
export const parseRolePermissionName = (name: string): ParsedRolePermissionName => {
  const separatorIndex = name.indexOf('=>');

  if (separatorIndex === -1) {
    throw new Error(`Invalid rolePermission name format: ${name}`);
  }

  const roleCode = name.slice(0, separatorIndex).trim();
  const permissionName = name.slice(separatorIndex + 2).trim();

  if (!roleCode || !permissionName) {
    throw new Error(`Incomplete rolePermission name: ${name}`);
  }

  return { roleCode, permissionName };
};

/** -----------------------------
 * UserOrgRole Name <==> Parsed
 * ------------------------------ */
export interface ParsedFullUserOrgRoleName {
  userId: string;
  orgId: string;
  roleCode: string;
}

/**
 * 构建用户-组织-角色标识
 * @param userId - 用户 ID
 * @param orgId - 组织 ID
 * @param roleCode - 角色编码
 * @returns 构建后的标识字符串，例如 'user456@org123#org123::admin'
 */
export const buildFullUserOrgRoleName = (userId: string, orgId: string, roleCode: string): string =>
  `${userId}@${orgId}#${roleCode}`;

/**
 * 解析用户-组织-角色标识
 * @param name - 复合字符串，例如 'user456@org123#org123::admin'
 * @returns 结构化对象 { userId, orgId, roleCode }
 */
export const parseFullUserOrgRoleName = (name: string): ParsedFullUserOrgRoleName => {
  const [userAndOrg, roleCode] = name.split('#');
  if (!userAndOrg || !roleCode) {
    throw new Error(`Invalid fullUserOrgRole name format: ${name}`);
  }

  const [userId, orgId] = userAndOrg.split('@');
  if (!userId || !orgId) {
    throw new Error(`Invalid user@org format in fullUserOrgRole: ${name}`);
  }

  return {
    userId: userId.trim(),
    orgId: orgId.trim(),
    roleCode: roleCode.trim(),
  };
};
