import { Container } from 'inversify';
import { Component } from '../shared/types/component.enum.js';
import { PinoLogger, type ILogger } from '../shared/libs/logger/index.js';
import { MongoDatabaseClient, type IDatabaseClient } from '../shared/libs/database-client/index.js';
import { DefaultUserService, type IUserService } from '../shared/models/user/index.js';
import { DefaultOfferService, type IOfferService } from '../shared/models/offer/index.js';
import { DefaultCommentService, type ICommentService } from '../shared/models/comment/index.js';
import { DefaultAuthService, type AuthService } from '../shared/libs/auth/index.js';
import { Application } from './application.js';
import { getConfig, type Config } from '../shared/libs/config/config.js';
import { UserController } from '../rest/user/user.controller.js';
import { OfferController } from '../rest/offer/offer.controller.js';
import { CommentController } from '../rest/comment/comment.controller.js';

export function initContainer(): Container {
  const container = new Container();

  container.bind<ILogger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config>(Component.Config).toConstantValue(getConfig());
  container.bind<IDatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
  container.bind<ICommentService>(Component.CommentService).to(DefaultCommentService).inSingletonScope();
  container.bind<IUserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
  container.bind<IOfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();
  container.bind<AuthService>(Component.AuthService).to(DefaultAuthService).inSingletonScope();
  container.bind<UserController>(UserController).to(UserController).inSingletonScope();
  container.bind<OfferController>(OfferController).to(OfferController).inSingletonScope();
  container.bind<CommentController>(CommentController).to(CommentController).inSingletonScope();
  container.bind<Application>(Application).toSelf().inSingletonScope();

  return container;
}
