import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from './middleware.interface.js';
import { Types } from 'mongoose';

export class ValidateObjectIdMiddleware implements Middleware {
  constructor(private param: string) {}

  execute(req: Request, res: Response, next: NextFunction): void {
    const objectId = req.params[this.param];

    if (!Types.ObjectId.isValid(objectId)) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: `${this.param} is invalid ObjectID` });
      return;
    }

    next();
  }
}
