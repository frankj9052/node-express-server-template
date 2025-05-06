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

  let seedFiles: string[];
  try {
    seedFiles = await fg(seedPatterns, { cwd, absolute: true });
  } catch (e) {
    throw new Error(
      `Failed to find seed files in ${cwd} using patterns ${seedPatterns}: ${(e as Error).message}`
    );
  }

  const modules = await Promise.all(
    seedFiles.map(async file => {
      try {
        const mod = await import(pathToFileURL(file).href);
        if (!mod.default) {
          console.warn(`[loadSeeders] No default export found in ${file}, skipping.`);
        }
        return mod.default;
      } catch (e) {
        throw new Error(`Failed to import seed file: ${file}\n${(e as Error).stack}`);
      }
    })
  );

  return modules.filter(Boolean);
}
