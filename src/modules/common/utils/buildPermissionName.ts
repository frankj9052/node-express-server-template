/**
 * 构建权限名称，格式示例：resource:action:fields:condition
 *
 * @param resource - 资源名，例如 'user'
 * @param action - 动作名，例如 'read'
 * @param fields - 可选字段数组，如 ['name', 'email']
 * @param conditionKey - 可选条件名，如 'own'、'department'
 * @returns 标准化权限名字符串
 */
export const buildPermissionName = (
  resource: string,
  action: string,
  fields: string[] | null = null,
  conditionKey: string | null = null
): string => {
  const parts = [resource, action, fields?.length ? fields.join('_') : '*', conditionKey ?? '*'];

  return parts.join(':'); // 格式：resource:action:fields:condition
};
