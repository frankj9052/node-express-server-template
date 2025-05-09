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
