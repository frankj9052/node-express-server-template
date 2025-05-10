import session from 'express-session';
import { getSessionOptions } from '../config/sessionOptions';

export const sessionMiddleware = session(getSessionOptions());
