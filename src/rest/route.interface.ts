import { NextFunction, Request, Response } from 'express';

export interface Route {
  path: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  handler: (req: Request, res: Response, next: NextFunction) => void;
}
