import fg from 'fast-glob';
import path from 'path';
import { pathToFileURL } from 'url';
import { getCurrentDirname } from './path';
import { env } from 'config/env';

const __dirname = getCurrentDirname(import.meta.url);

export async function loadSeeders(): Promise<any[]> {
  const isProd = env.NODE_ENV === 'production';
  const cwd = path.resolve(__dirname, isProd ? '../../../modules' : '../..');

  const seedPatterns = isProd ? ['**/seeds/*-prod.seed.js'] : ['**/seeds/*.seed.ts'];

  const seedFiles = await fg(seedPatterns, { cwd, absolute: true });

  console.log('seedFiles ===> ', seedFiles);
  console.log('cwd ===> ', cwd);

  const modules = await Promise.all(
    seedFiles.map(async file => {
      const mod = await import(pathToFileURL(file).href);
      return mod.default;
    })
  );

  return modules.filter(Boolean);
}
