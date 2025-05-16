import { NotAuthorizedError } from '@modules/common/errors/NotAuthorizedError';
import { createLoggerWithContext } from '@modules/common/lib/logger';
import { User } from '@modules/user/entities/User';
import AppDataSource from 'config/data-source';
import { verifyPassword } from './utils/password';
import { UnauthorizedError } from '@modules/common/errors/UnauthorizedError';

const logger = createLoggerWithContext('Login');
export class AuthService {
  private userRepo = AppDataSource.getRepository(User);

  async login(email: string, password: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user || !user.password) {
      logger.warn(`User ${email} not exist`);
      throw new NotAuthorizedError('login', { email });
    }

    const isMatch = await verifyPassword(user.password, password);

    if (!isMatch) {
      logger.warn(`User ${email} password not match`);
      throw new UnauthorizedError();
    }

    if (!user.isActive) {
      logger.warn(`User ${email} is disabled`);
      throw new UnauthorizedError('Account is disabled');
    }

    if (!user.emailVerified) {
      logger.warn(`User ${email} email not verified`);
      throw new UnauthorizedError('Email not verified');
    }

    logger.info(`User ${email} login successfully`);
    return user;
  }
}
