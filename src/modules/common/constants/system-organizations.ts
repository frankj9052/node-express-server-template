// src/modules/common/constants/system-organizations.ts

export const SYSTEM_ORGANIZATIONS = {
  PUBLIC: {
    name: 'public',
    description: 'Shared organization for unscoped data',
  },
  PLATFORM: {
    name: 'platform',
    description: 'Platform organization with global system authority',
  },
} as const;

export type SystemOrganizationName =
  (typeof SYSTEM_ORGANIZATIONS)[keyof typeof SYSTEM_ORGANIZATIONS]['name'];
