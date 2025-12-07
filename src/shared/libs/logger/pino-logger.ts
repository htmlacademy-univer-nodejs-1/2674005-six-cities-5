import pino from 'pino';
import { injectable } from 'inversify';

export interface ILogger {
  info(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  debug(message: string, ...args: unknown[]): void;
}

@injectable()
export class PinoLogger implements ILogger {
  private logger = pino();

  info(message: string, ...args: unknown[]): void {
    this.logger.info({ args }, message);
  }

  error(message: string, ...args: unknown[]): void {
    this.logger.error({ args }, message);
  }

  warn(message: string, ...args: unknown[]): void {
    this.logger.warn({ args }, message);
  }

  debug(message: string, ...args: unknown[]): void {
    this.logger.debug({ args }, message);
  }
}
