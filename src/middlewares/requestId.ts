// 请求追踪 ID 中间件
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export function requestId(req: Request, res: Response, next: NextFunction) {
  const incomingId = req.headers['x-request-id'];
  const requestId = Array.isArray(incomingId) ? incomingId[0] : incomingId || uuidv4();

  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
}
