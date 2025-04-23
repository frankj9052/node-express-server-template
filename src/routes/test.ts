import { Router } from "express";
import { connectionTest } from "../controllers/test.controller";

const testRouter = Router();
testRouter.get('/', connectionTest);

export default testRouter;