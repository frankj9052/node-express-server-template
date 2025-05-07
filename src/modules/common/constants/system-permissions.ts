import { buildPermissionName } from '../utils/buildPermissionName';

export const SYSTEM_PERMISSIONS = {
  ALL: {
    name: buildPermissionName('*', '*', null, null),
    description: 'Grant all permissions',
  },
} as const;

export type SystemPermissionName =
  (typeof SYSTEM_PERMISSIONS)[keyof typeof SYSTEM_PERMISSIONS]['name'];
