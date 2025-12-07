import express, { Express } from 'express';
import { injectable, inject } from 'inversify';
import { ILogger } from '../shared/libs/logger/index.js';
import { Component } from '../shared/types/component.enum.js';
import { Config } from '../shared/libs/config/config.js';
import { ExceptionFilter } from '../rest/exception-filter.js';
import { Controller } from '../rest/controller.interface.js';
import { IDatabaseClient } from '../shared/libs/database-client/database-client.interface.js';

@injectable()
export class Application {
  private express: Express;

  constructor(
    @inject(Component.Logger) private logger: ILogger,
    @inject(Component.Config) private config: Config,
    @inject(Component.DatabaseClient) private databaseClient: IDatabaseClient
  ) {
    this.express = express();
  }

  private registerMiddleware(): void {
    this.express.use(express.json());
    this.express.use('/upload', express.static(this.config.uploadDirectory));
  }

  private registerRoutes(controllers: Controller[]): void {
    controllers.forEach((controller) => {
      this.express.use(`/api${controller.basePath}`, controller.router);
    });
  }

  private registerExceptionFilter(exceptionFilter: ExceptionFilter): void {
    this.express.use((error: Error, _req: express.Request, res: express.Response, next: express.NextFunction) => {
      exceptionFilter.catch(error, _req, res, next);
    });
  }

  async init(controllers: Controller[]): Promise<void> {
    this.logger.info('Application initialization');

    await this.databaseClient.connect();
    this.logger.info('Database connection established');

    this.registerMiddleware();
    this.logger.info('Middleware initialized');

    this.registerRoutes(controllers);
    this.logger.info('Routes initialized');

    const exceptionFilter = new ExceptionFilter(this.logger);
    this.registerExceptionFilter(exceptionFilter);
    this.logger.info('Exception filter initialized');

    this.express.listen(this.config.port, () => {
      this.logger.info(`Server started on http://localhost:${this.config.port}`);
    });
  }
}
