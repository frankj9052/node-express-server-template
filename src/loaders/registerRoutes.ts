import type { Router } from 'express';
import path from 'path';
import fg from 'fast-glob';
import { getCurrentDirname } from '@modules/common/utils/path';
import { pathToFileURL } from 'url';
import { NotFoundError } from '@modules/common/errors/NotFoundError';
import { createLoggerWithContext } from '@modules/common/lib/logger';

const logger = createLoggerWithContext('Router');
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
  logger.info(`🔍 Found ${files.length} route files`);

  // 顺序无所谓，用 for-of 可保证 await 按次序执行
  for (const file of files) {
    try {
      const mod = await import(pathToFileURL(file).href);
      if (typeof mod.register === 'function') {
        mod.register(parent);
        logger.info(`✅ Registered routes from: ${path.basename(file)}`);
      } else {
        logger.warn(`⚠️ No register(app) export in: ${path.basename(file)} — skipped`);
      }
    } catch (error) {
      logger.error(`❌ Error registering route from: ${path.basename(file)}`, error);
    }
  }

  // 添加局部 404 捕获路由
  parent.all(/.*/, () => {
    throw new NotFoundError();
  });
  logger.info(`🛣️ Route registration complete: ${files.length} files processed`);
}
