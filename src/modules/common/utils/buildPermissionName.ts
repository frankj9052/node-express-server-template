/**
 * 构建结构化的权限名称字符串，用于 RBAC / ABAC 权限系统。
 * 命名格式示例：
 *   - "user:[edit,delete]@email,phone?ownerOnly=true&orgId=abc123"
 *   - "appointment:[*]@*"
 *
 * 结构说明：
 *   - resource: 权限所作用的资源名（如 'user'、'appointment'）
 *   - [actions]: 中括号包裹的动作数组，如 [view,edit]，* 表示所有动作
 *   - @fields: 可选字段控制，如 @email,phone，* 表示所有字段
 *   - ?conditions: 可选条件控制，如 ?ownerOnly=true&orgId=abc，顺序会自动按 key 排序以确保一致性
 *
 * @param resource - 权限作用的资源名（例如 "user", "appointment"）
 * @param actions - 动作数组（如 ['view', 'edit']）或 '*' 表示所有动作
 * @param fields - 限定字段数组（如 ['email', 'phone']）或 '*' 表示所有字段，可省略
 * @param conditions - 条件对象（如 { ownerOnly: true, orgId: 'abc123' }），可省略
 * @returns 构建出的结构化权限名字符串
 */
export const buildPermissionName = (
  resource: string,
  actions: string[] | '*',
  fields?: string[] | '*',
  conditions?: Record<string, unknown>
): string => {
  const actionPart = Array.isArray(actions) ? `[${actions.join(',')}]` : '[*]';

  const fieldPart =
    fields !== undefined ? `@${Array.isArray(fields) ? fields.join(',') : '*'}` : '';

  const conditionPart = conditions
    ? '?' +
      Object.entries(conditions)
        .sort(([a], [b]) => a.localeCompare(b)) // 保证顺序一致，避免相同条件不同顺序导致的重复
        .map(([key, value]) => `${key}=${String(value)}`)
        .join('&')
    : '';

  return `${resource}:${actionPart}${fieldPart}${conditionPart}`;
};
