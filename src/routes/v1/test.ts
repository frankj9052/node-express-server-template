import { Router } from 'express';
import { connectionTest } from '../../controllers/test.controller';

const testRouter = Router();

/**
 * @openapi
 * /api/v1test:
 *   get:
 *     tags:
 *       - Test
 *     summary: 测试api是否有效
 *     responses:
 *       200:
 *         description: 成功返回状态
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
testRouter.get('/', connectionTest);

export default testRouter;
