// src/modules/auth/dto/login.dto.ts
import { registry } from 'config/openapiRegistry';
import { z } from 'zod';

export const loginSchema = registry.register(
  'LoginRequest',
  z.object({
    email: z.string().email().openapi({ example: 'test@example.com' }),
    password: z.string().min(6).openapi({ example: 'password123' }),
  })
);
