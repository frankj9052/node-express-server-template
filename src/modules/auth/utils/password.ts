// src/modules/auth/utils/password.ts
import * as argon2 from 'argon2';

export async function verifyPassword(hashed: string, plain: string): Promise<boolean> {
  return await argon2.verify(hashed, plain);
}
