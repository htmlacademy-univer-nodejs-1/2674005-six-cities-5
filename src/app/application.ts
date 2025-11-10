import { injectable, inject } from 'inversify';
import { ILogger } from '../shared/libs/logger/index.js';
import { Component } from '../shared/types/component.enum.js';

@injectable()
export class Application {
  constructor(
    @inject(Component.Logger) private logger: ILogger
  ) {}

  async init(): Promise<void> {
    this.logger.info('Application initialized');
  }
}
