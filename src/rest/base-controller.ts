import { Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'inversify';
import { Route } from './route.interface.js';
import asyncHandler from 'express-async-handler';

@injectable()
export abstract class BaseController {
  private readonly _router: Router;
  public readonly basePath: string;

  constructor(basePath: string) {
    this._router = Router();
    this.basePath = basePath;
  }

  get router() {
    return this._router;
  }

  protected addRoute(route: Route): void {
    const middlewares = route.middlewares?.map(
      (middleware) => asyncHandler(middleware.execute.bind(middleware))
    );
    const handler = asyncHandler(route.handler.bind(this));
    const allHandlers = middlewares ? [...middlewares, handler] : handler;
    this._router[route.method](route.path, allHandlers);
  }

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
