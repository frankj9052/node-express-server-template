import { fileURLToPath } from 'url';
import { dirname } from 'path';

/**
 * 解决 ESM 中无法直接使用 __filename 和 __dirname 的问题
 */
export function getCurrentFilename(metaUrl: string) {
  return fileURLToPath(metaUrl);
}

export function getCurrentDirname(metaUrl: string) {
  return dirname(fileURLToPath(metaUrl));
}

export function getRootDir() {
  const rootDir = dirname(fileURLToPath(import.meta.url)).replace(/\/src\/config$/, ''); // => /项目根
  return rootDir;
}
