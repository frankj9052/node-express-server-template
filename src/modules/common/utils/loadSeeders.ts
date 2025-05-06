import fg from 'fast-glob';
import path from 'path';
import { pathToFileURL } from 'url';
import { getCurrentDirname } from './path';
import { env } from 'config/env';

const __dirname = getCurrentDirname(import.meta.url);
// 种子明明规范：NN-<module>.seed.ts   // NN 是 2位数字前缀
export async function loadSeeders(): Promise<any[]> {
  const isProd = env.NODE_ENV === 'production';
  const cwd = path.resolve(__dirname, isProd ? '../../../modules' : '../..');
  const seedPatterns = isProd ? ['**/seeds/*-prod.seed.js'] : ['**/seeds/*.seed.ts'];

  let seedFiles: string[];
  try {
    seedFiles = await fg(seedPatterns, { cwd, absolute: true });
    // ✅ 主动按文件名排序，确保种子执行顺序
    seedFiles.sort((a, b) => path.basename(a).localeCompare(path.basename(b)));
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
