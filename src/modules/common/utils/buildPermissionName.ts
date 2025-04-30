export const buildPermissionName = (
  resource: string,
  action: string,
  fields: string[] | null = null,
  conditionKey: string | null = null
) => [resource, action, fields?.length ? fields.join('_') : '*', conditionKey ?? '*'].join('.');
