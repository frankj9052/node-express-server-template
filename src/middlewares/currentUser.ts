import { AuthService } from '@modules/auth/auth.service';
import { NotAuthorizedError } from '@modules/common/errors/NotAuthorizedError';
import { UnauthorizedError } from '@modules/common/errors/UnauthorizedError';
import { createLoggerWithContext } from '@modules/common/lib/logger';
import { NextFunction, Request, Response } from 'express';

const logger = createLoggerWithContext('CurrentUserMiddleware');
const authService = new AuthService();
/**
 * currentUser 中间件
 *
 * 功能：
 * - 将 req.session.user 中的用户信息解析为 req.currentUser
 * - 用于后续业务逻辑读取用户上下文
 *
 * ⚠️ 注意：必须在 sessionMiddleware 之后注册本中间件！
 */
export const currentUser = async (req: Request, res: Response, next: NextFunction) => {
  const sessionUser = req.session?.user as
    | {
        id: string;
        sessionVersion: string;
      }
    | undefined;

  if (!sessionUser?.id || !sessionUser?.sessionVersion) {
    logger.debug('No session user found. Skipping currentUser injection.');
    return next(); // 用户未登录，不挂载 currentUser
  }

  try {
    // 从数据库中查完整用户上下文（使用 authService 内部逻辑）
    const fullUser = await authService.getUserPayloadById(sessionUser.id);

    // 检查 sessionVersion 是否匹配（防止用旧权限）
    if (fullUser.sessionVersion !== sessionUser.sessionVersion) {
      logger.warn(`Session version mismatch for user ${sessionUser.id}`);
      throw new UnauthorizedError('Session expired. Please log in again.');
    }

    req.currentUser = fullUser;
    return next();
  } catch (error) {
    // 若用户不存在或查失败，仍继续流程（req.currentUser 保持 undefined）
    logger.warn(`Failed to build currentUser: ${error instanceof Error ? error.message : error}`);
    // 无法解析用户（如用户被删），抛出错误
    return next(
      error instanceof UnauthorizedError || error instanceof NotAuthorizedError
        ? error
        : new NotAuthorizedError('currentUser', { cause: error })
    );
  }
};
