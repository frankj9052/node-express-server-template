// src/modules/common/constants/system-roles.ts

export const SYSTEM_ROLES = {
  ADMIN: {
    name: 'admin',
    description: 'Administrator with full access',
  },
} as const;

export type SystemRoleName = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES]['name'];
