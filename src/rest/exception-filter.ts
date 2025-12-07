import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ILogger } from '../shared/libs/logger/index.js';

export class HttpError extends Error {
  constructor(
    public httpStatus: number,
    message: string
  ) {
    super(message);
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export class ExceptionFilter {
  constructor(private logger: ILogger) {}

  catch(error: Error | HttpError, _req: Request, res: Response, _next: NextFunction): void {
    if (error instanceof HttpError) {
      this.logger.error(`[HttpException]: ${error.httpStatus} ${error.message}`);
      res.status(error.httpStatus).json({ message: error.message });
    } else {
      this.logger.error(`[InternalException]: ${error.message}`);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }
}
