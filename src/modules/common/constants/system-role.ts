// src/modules/common/constants/system-roles.ts

import { SYSTEM_ORGANIZATIONS } from './system-organizations';

export const SYSTEM_ROLES = {
  ADMIN: {
    name: 'admin',
    description: 'Administrator with full access',
    organizationName: SYSTEM_ORGANIZATIONS.PLATFORM.name,
  },
  CLIENT: {
    name: 'client',
    description: 'Client with limited access',
    organizationName: SYSTEM_ORGANIZATIONS.PUBLIC.name,
  },
} as const;

export type SystemRoleName = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES]['name'];
