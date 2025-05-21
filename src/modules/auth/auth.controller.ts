import { NextFunction, Request, RequestHandler, Response } from 'express';
import { AuthService } from './auth.service';

const authService = new AuthService();

export const loginController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const userPayload = await authService.login(email, password);

    // 保存用户信息到 session
    req.session.user = {
      id: userPayload.id,
      email: userPayload.email,
      userName: userPayload.userName!,
      roleCodes: userPayload.orgRoles.map(role => role.roleCode),
      sessionVersion: userPayload.sessionVersion, // 可用于强制刷新机制
    };

    // currentUser 立即挂载用于响应/中间件使用
    req.currentUser = userPayload;

    res.status(200).json({
      status: 'success',
      data: userPayload,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutController: RequestHandler = (req: Request, res: Response) => {
  req.session.destroy(err => {
    if (err) res.status(500).json({ status: 'error', message: 'Logout failed' });

    res.clearCookie('connect.sid');
    res.status(200).json({ status: 'success', message: 'Logout successful' });
  });
};

export const currentUserController: RequestHandler = (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', data: req.currentUser });
};
