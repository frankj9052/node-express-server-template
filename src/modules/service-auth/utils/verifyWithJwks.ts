// src/modules/service-auth/utils/verifyWithJwks.ts
import { BadRequestError } from '@modules/common/errors/BadRequestError';
import { env } from 'config/env';
import { jwtVerify, createRemoteJWKSet, JWTVerifyOptions } from 'jose';
import { z } from 'zod';

const JWKS = createRemoteJWKSet(new URL(env.SERVICE_AUTH_JWKS_URL));

const ServiceJwtPayloadSchema = z.object({
  serviceId: z.string(),
  scopes: z.array(z.string()),
  iss: z.string(),
  aud: z.string(),
  iat: z.number(),
  exp: z.number(),
});

export type ServiceJwtPayload = z.infer<typeof ServiceJwtPayloadSchema>;

export async function verifyServiceJwt(
  token: string,
  expectedAudience: string
): Promise<ServiceJwtPayload> {
  const { payload } = await jwtVerify(token, JWKS, {
    algorithms: ['RS256'],
    issuer: env.SERVICE_AUTH_ISSUER,
    audience: expectedAudience,
  } satisfies JWTVerifyOptions);

  const result = ServiceJwtPayloadSchema.safeParse(payload);
  if (!result.success) {
    throw new BadRequestError('Invalid JWT payload structure', result.error.format());
  }

  return payload as ServiceJwtPayload;
}
