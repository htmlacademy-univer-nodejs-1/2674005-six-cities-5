import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'inversify';

@injectable()
export abstract class BaseController {
  protected sendOk(res: Response, data: object): void {
    res.type('application/json').status(StatusCodes.OK).json(data);
  }

  protected sendCreated(res: Response, data: object): void {
    res.type('application/json').status(StatusCodes.CREATED).json(data);
  }

  protected sendNoContent(res: Response): void {
    res.status(StatusCodes.NO_CONTENT).send();
  }

  protected sendBadRequest(res: Response, message: string): void {
    res.type('application/json').status(StatusCodes.BAD_REQUEST).json({ message });
  }

  protected sendUnauthorized(res: Response, message: string): void {
    res.type('application/json').status(StatusCodes.UNAUTHORIZED).json({ message });
  }

  protected sendForbidden(res: Response, message: string): void {
    res.type('application/json').status(StatusCodes.FORBIDDEN).json({ message });
  }

  protected sendNotFound(res: Response, message: string): void {
    res.type('application/json').status(StatusCodes.NOT_FOUND).json({ message });
  }

  protected sendConflict(res: Response, message: string): void {
    res.type('application/json').status(StatusCodes.CONFLICT).json({ message });
  }

  protected sendInternalServerError(res: Response, message: string): void {
    res.type('application/json').status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
  }
}
