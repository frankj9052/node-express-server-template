import { Router } from 'express';
import { connectionTest } from './test.controller';

const router = Router();

/**
 * @openapi
 * /test:
 *   get:
 *     tags: [Test]
 *     summary: 测试 API 是否存活
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
router.get('/test', connectionTest);

export function register(parent: Router) {
  parent.use('/', router);
}
