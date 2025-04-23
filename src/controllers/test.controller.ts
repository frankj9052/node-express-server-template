import { Request, Response } from 'express';

export const connectionTest = (req: Request, res: Response) => {
  res.json({ status: 'ok' });
};
