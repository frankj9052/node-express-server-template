import { Router } from 'express';
import publicRoute from './public';
import testRouter from './test';

const v1Router = Router();

v1Router.use('/public', publicRoute);
v1Router.use('/test', testRouter);

export default v1Router;
