// src/modules/common/constants/system-actions.ts

export const SYSTEM_ACTIONS = {
  ALL: {
    name: '*',
    description: 'All actions',
  },
  CREATE: {
    name: 'create',
    description: 'Create new resource',
  },
  READ: {
    name: 'read',
    description: 'Read resource data',
  },
  UPDATE: {
    name: 'update',
    description: 'Update existing resource',
  },
  DELETE: {
    name: 'delete',
    description: 'Delete resource',
  },
} as const;

export type SystemActionName = (typeof SYSTEM_ACTIONS)[keyof typeof SYSTEM_ACTIONS]['name'];
