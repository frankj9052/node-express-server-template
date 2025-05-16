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
    const user = await authService.login(email, password);

    res.status(200).json({
      status: 'success',
      data: {
        id: user.id,
        email: user.email,
        userName: user.userName,
      },
    });
  } catch (error) {
    next(error);
  }
};
