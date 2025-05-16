import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '../errors/ValidationError';

type SchemaMap = {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
};

export function validateRequest(schemas: SchemaMap): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const allErrors: Record<string, string> = {};

    // 校验 body/query/params（如果提供）
    for (const key of ['body', 'query', 'params'] as const) {
      const schema = schemas[key];
      if (!schema) continue;

      const parsed = schema.safeParse(req[key]);

      if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        for (const field in fieldErrors) {
          if (fieldErrors[field]?.[0]) {
            allErrors[`${key}.${field}`] = fieldErrors[field][0];
          }
        }
      } else {
        // ✅ 替换成解析后内容（支持 .transform）
        req[key] = parsed.data;
      }
    }

    if (Object.keys(allErrors).length > 0) {
      return next(new ValidationError(allErrors));
    }

    return next();
  };
}
