import { Router } from "express";
import publicRoute from "./public";
import testRouter from "./test";

const router = Router();

router.use('/public', publicRoute);
router.use('/test', testRouter);

export default router;