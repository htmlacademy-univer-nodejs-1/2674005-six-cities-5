import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { BaseController } from '../base-controller.js';
import { ICommentService } from '../../shared/models/comment/comment-service.interface.js';
import { IOfferService } from '../../shared/models/offer/offer-service.interface.js';
import { CreateCommentDTO } from '../../shared/models/comment/create-comment.dto.js';
import { Component } from '../../shared/types/component.enum.js';
import { Controller } from '../controller.interface.js';
import { HttpMethod } from '../http-method.enum.js';
import { ValidateObjectIdMiddleware } from '../middleware/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../middleware/validate-dto.middleware.js';
import { PrivateRouteMiddleware } from '../middleware/private-route.middleware.js';
import { AuthService } from '../../shared/libs/auth/auth-service.interface.js';

@injectable()
export class CommentController extends BaseController implements Controller {
  constructor(
    @inject(Component.CommentService) private commentService: ICommentService,
    @inject(Component.OfferService) private offerService: IOfferService,
    @inject(Component.AuthService) private authService: AuthService,
  ) {
    super('/comments');
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(this.authService),
        new ValidateDtoMiddleware(CreateCommentDTO),
      ],
    });
  }

  async index(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    const comments = await this.commentService.findByOfferId(offerId);
    this.sendOk(res, comments);
  }

  async create(req: Request, res: Response): Promise<void> {
    const dto: CreateCommentDTO = req.body;
    dto.userId = req.tokenPayload!.id;
    const comment = await this.commentService.create(dto);

    await this.offerService.incCommentCount(dto.offerId);
    const averageRating = await this.offerService.getAverageRating(dto.offerId);
    await this.offerService.setAverageRating(dto.offerId, averageRating);

    this.sendCreated(res, comment);
  }
}
