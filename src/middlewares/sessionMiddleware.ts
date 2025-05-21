import session from 'express-session';
import { buildSessionOptions } from '../config/sessionOptions';

export const sessionMiddleware = session(buildSessionOptions());
