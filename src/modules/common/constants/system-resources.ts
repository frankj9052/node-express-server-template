export const SYSTEM_RESOURCES = {
  ALL: {
    name: '*',
    description: 'All resources',
  },
  ORGANIZATION: {
    name: 'organization',
    description: 'Manage platform-level organizations or tenants',
  },
  USER_ORG_ROLE: {
    name: 'userOrganizationRole',
    description: 'Assign users to organizations and roles',
  },
  ACTION: {
    name: 'action',
    description: 'Define available system actions (e.g., CREATE, READ)',
  },
  PERMISSION: {
    name: 'permission',
    description: 'Grant or restrict access to resource-action pairs',
  },
  PERMISSION_ACTION: {
    name: 'permissionAction',
    description: 'Link permissions to their allowed actions',
  },
  RESOURCE: {
    name: 'resource',
    description: 'Define system-level entities that can be protected',
  },
  ROLE: {
    name: 'role',
    description: 'User role definitions and metadata',
  },
  ROLE_PERMISSION: {
    name: 'rolePermission',
    description: 'Link roles to their allowed permissions',
  },
} as const;

export type SystemResourceName = (typeof SYSTEM_RESOURCES)[keyof typeof SYSTEM_RESOURCES]['name'];
