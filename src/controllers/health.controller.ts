import { Request, Response } from "express";

// 处理controller
export const healthCheck = (req: Request, res: Response) => {
    res.json({ status: 'ok' })
}