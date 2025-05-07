import { env } from 'config/env';
import path from 'path';
import { SeederConstructor } from 'typeorm-extension';
import { pathToFileURL } from 'url';
import fg from 'fast-glob';
import { getCurrentDirname } from './path';

export async function loadSeeders(): Promise<SeederConstructor[]> {
  const isProd = env.NODE_ENV === 'production';
  const __dirname = getCurrentDirname(import.meta.url);
  const cwd = path.resolve(__dirname, isProd ? '../../../modules' : '../..');
  const seedPatterns = isProd ? ['**/seeds/*-prod.seed.js'] : ['**/seeds/*.seed.ts'];

  const seedFiles = (await fg(seedPatterns, { cwd, absolute: true })).sort((a, b) =>
    path.basename(a).localeCompare(path.basename(b))
  );

  const seeders: SeederConstructor[] = [];

  for (const file of seedFiles) {
    try {
      const mod = await import(pathToFileURL(file).href);
      const SeederClass = mod.default;
      if (typeof SeederClass === 'function') {
        seeders.push(SeederClass);
      }
    } catch (err) {
      console.warn(`❌ Failed to load seeder from "${file}"`, err);
    }
  }

  return seeders;
}
