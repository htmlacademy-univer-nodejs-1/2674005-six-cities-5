import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from './middleware.interface.js';
import { AuthService } from '../../shared/libs/auth/auth-service.interface.js';

export class PrivateRouteMiddleware implements Middleware {
  constructor(
    private readonly authService: AuthService
  ) {}

  async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const payload = await this.authService.verify(token);

    if (!payload) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
      return;
    }

    req.tokenPayload = payload;
    next();
  }
}
