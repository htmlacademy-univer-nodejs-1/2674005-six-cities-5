import { injectable, inject } from 'inversify';
import { SignJWT, jwtVerify } from 'jose';
import { Component } from '../../types/component.enum.js';
import { ILogger } from '../logger/index.js';
import { Config } from '../config/config.js';
import { AuthService } from './auth-service.interface.js';
import { IUserService } from '../../models/user/user-service.interface.js';
import * as crypto from 'node:crypto';

@injectable()
export class DefaultAuthService implements AuthService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.UserService) private readonly userService: IUserService,
    @inject(Component.Config) private readonly config: Config
  ) {}

  async authenticate(email: string, password: string): Promise<string | null> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      this.logger.warn(`User with email ${email} not found`);
      return null;
    }

    if (!user.verifyPassword(password, this.config.salt)) {
      this.logger.warn(`Incorrect password for user ${email}`);
      return null;
    }

    const algorithm = 'HS256';
    const jwtSecret = this.config.jwtSecret;
    const secretKey = crypto.createSecretKey(jwtSecret, 'utf-8');

    const jwt = await new SignJWT({ email: user.email, id: user._id.toString() })
      .setProtectedHeader({ alg: algorithm })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secretKey);

    return jwt;
  }

  async verify(token: string): Promise<{ email: string; id: string } | null> {
    try {
      const jwtSecret = this.config.jwtSecret;
      const secretKey = crypto.createSecretKey(jwtSecret, 'utf-8');
      const { payload } = await jwtVerify(token, secretKey);

      return {
        email: payload.email as string,
        id: payload.id as string
      };
    } catch (error) {
      this.logger.warn(`Invalid token: ${error}`);
      return null;
    }
  }
}
