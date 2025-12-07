import { NextFunction, Request, Response } from 'express';
import { Middleware } from './middleware/middleware.interface.js';

export interface Route {
  path: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  handler: (req: Request, res: Response, next: NextFunction) => void;
  middlewares?: Middleware[];
}
