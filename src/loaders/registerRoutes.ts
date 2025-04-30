import type { Router } from 'express';
import path from 'path';
import fg from 'fast-glob';
import { getCurrentDirname } from '@modules/common/utils/path';
import { pathToFileURL } from 'url';

/**
 * 扫描 src/modules/任意文件夹/routes.ts 并调用其中导出的 register(app) 方法。
 * 每个模块只需在 routes.ts 里写：
 *   export function register(app: Application) { … }
 */
export async function registerRoutes(parent: Router) {
  const __dirname = getCurrentDirname(import.meta.url);

  // dist 环境编译后仍能匹配到正确文件
  const pattern = path.posix.join(
    __dirname.replace(/\\/g, '/'), // ② 把 Windows 反斜杠替换成 /
    '../modules/**/routes.{ts,js}'
  );
  const files = await fg(pattern, { absolute: true });

  // 顺序无所谓，用 for-of 可保证 await 按次序执行
  for (const file of files) {
    const mod = await import(pathToFileURL(file).href);
    if (typeof mod.register === 'function') {
      mod.register(parent);
    } else {
      console.warn(`[router] ${file} does not have a register(app) export —— skipped`);
    }
  }
  console.log(`🛣️  ${files.length} route files registered`);
}
