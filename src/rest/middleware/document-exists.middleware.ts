import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from './middleware.interface.js';
import { DocumentExists } from '../../shared/libs/database-client/document-exists.interface.js';

export class DocumentExistsMiddleware implements Middleware {
  constructor(
    private readonly service: DocumentExists,
    private readonly entityName: string,
    private readonly paramName: string
  ) {}

  async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const documentId = req.params[this.paramName];

    if (!await this.service.exists(documentId)) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `${this.entityName} with id ${documentId} not found` });
      return;
    }

    next();
  }
}
