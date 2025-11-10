import { Container } from 'inversify';
import { Component } from '../types/component.enum.js';
import { PinoLogger, ILogger } from '../shared/libs/logger/index.js';
import { Application } from './application.js';

export function initContainer(): Container {
  const container = new Container();

  container.bind<ILogger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Application>(Application).toSelf().inSingletonScope();

  return container;
}
