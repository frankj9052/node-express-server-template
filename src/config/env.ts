import dotenvFlow from 'dotenv-flow';
import { z } from 'zod';

dotenvFlow.config();

const baseSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('4000'),
  JWT_SECRET: z.string(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  DATABASE_URL: z.string().optional(), // SaaS URL，如 Neon
  ENABLE_SEEDERS: z.string().default('true'),
});

// 如果没有 DATABASE_URL，就强制要求 host + user + db
const extendedSchema = baseSchema
  .extend({
    DB_HOST: z.string().optional(),
    DB_PORT: z.string().default('5432').optional(),
    DB_USER: z.string().optional(),
    DB_PASSWORD: z.string().optional(),
    DB_NAME: z.string().optional(),
  })
  .superRefine((env, ctx) => {
    const usingUrl = !!env.DATABASE_URL;
    const requiredIfNoUrl = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];

    if (!usingUrl) {
      for (const key of requiredIfNoUrl) {
        if (!env[key as keyof typeof env]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${key} is required if DATABASE_URL is not provided`,
            path: [key],
          });
        }
      }
    }
  });

const _env = extendedSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables! Please check below for details:');
  console.error(_env.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = _env.data;
