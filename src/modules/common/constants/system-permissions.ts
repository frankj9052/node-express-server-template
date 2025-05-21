import { buildPermissionName } from '@modules/codecs/permissionCodec';
import { SYSTEM_ACTIONS } from './system-actions';
import { SYSTEM_RESOURCES } from './system-resources';

export const SYSTEM_PERMISSIONS = {
  ALL: {
    name: buildPermissionName(SYSTEM_RESOURCES.ALL.name, SYSTEM_ACTIONS.ALL.name),
    description: 'Grant all permissions',
  },
} as const;

export type SystemPermissionName =
  (typeof SYSTEM_PERMISSIONS)[keyof typeof SYSTEM_PERMISSIONS]['name'];
