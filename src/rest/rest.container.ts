import { Container } from 'inversify';
import { PinoLogger, ILogger } from '../shared/libs/logger/index.js';
import { Component } from '../shared/types/component.enum.js';
import { MongoDatabaseClient, IDatabaseClient } from '../shared/libs/database-client/index.js';
import { DefaultUserService, IUserService } from '../shared/models/user/index.js';
import { DefaultOfferService, IOfferService } from '../shared/models/offer/index.js';
import { DefaultCommentService, ICommentService } from '../shared/models/comment/index.js';
import { UserController } from './user/user.controller.js';
import { OfferController } from './offer/offer.controller.js';
import { CommentController } from './comment/comment.controller.js';

export function initContainer(): Container {
  const container = new Container();

  container.bind<ILogger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<IDatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
  container.bind<ICommentService>(Component.CommentService).to(DefaultCommentService).inSingletonScope();
  container.bind<IUserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
  container.bind<IOfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();
  container.bind<UserController>(UserController).to(UserController).inSingletonScope();
  container.bind<OfferController>(OfferController).to(OfferController).inSingletonScope();
  container.bind<CommentController>(CommentController).to(CommentController).inSingletonScope();

  return container;
}
