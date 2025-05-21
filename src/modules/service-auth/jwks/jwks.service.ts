// 生成和提供 JWKS JSON 格式的公钥
// src/modules/service-auth/jwks/jwks.service.ts
import fs from 'fs';
import path from 'path';
import { exportJWK, importSPKI } from 'jose';
import { env } from 'config/env';

let cachedJwks: any | null = null;

export async function getJWKS(): Promise<{ keys: any[] }> {
  if (cachedJwks) return cachedJwks;

  const publicKeyPath = path.resolve(env.JWT_SERVICE_PUBLIC_KEY_PATH);
  const pem = fs.readFileSync(publicKeyPath, 'utf8');

  const key = await importSPKI(pem, 'RS256');
  const jwk = await exportJWK(key);

  const jwks = {
    keys: [
      {
        ...jwk,
        use: 'sig',
        kid: 'main-key',
        alg: 'RS256',
      },
    ],
  };

  cachedJwks = jwks;
  return jwks;
}
