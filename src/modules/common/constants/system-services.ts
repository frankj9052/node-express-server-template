// src/modules/common/constants/system-services.ts

import { SYSTEM_ROLES } from './system-role';

export const SYSTEM_SERVICES = {
  MAIN_SERVER: {
    serviceId: 'main-server',
    secret: 'abc123', // 初始明文（用于种子脚本 bcrypt hash）
    role: {
      name: SYSTEM_ROLES.ADMIN.name,
      organizationName: SYSTEM_ROLES.ADMIN.organizationName,
    },
    description: 'Core backend server for platform ops',
  },
  BILLING_SERVICE: {
    serviceId: 'billing-service',
    secret: 'xyz456',
    role: {
      name: SYSTEM_ROLES.ADMIN.name,
      organizationName: SYSTEM_ROLES.ADMIN.organizationName,
    },
    description: 'Handles billing and payment workflows',
  },
  BOOKING_SERVICE: {
    serviceId: 'booking-service',
    secret: 'booking789',
    role: {
      name: SYSTEM_ROLES.ADMIN.name,
      organizationName: SYSTEM_ROLES.ADMIN.organizationName,
    },
    description: 'Handles appointment booking logic',
  },
} as const;

export type SystemServiceId = (typeof SYSTEM_SERVICES)[keyof typeof SYSTEM_SERVICES]['serviceId'];
