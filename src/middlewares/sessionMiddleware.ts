import session from 'express-session';
import { sessionOptions } from '../config/sessionOptions';

export const sessionMiddleware = session(sessionOptions);
