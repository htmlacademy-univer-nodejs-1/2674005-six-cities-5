import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { BaseController } from '../base-controller.js';
import { IOfferService } from '../../shared/models/offer/offer-service.interface.js';
import { IUserService } from '../../shared/models/user/user-service.interface.js';
import { CreateOfferDTO } from '../../shared/models/offer/create-offer.dto.js';
import { UpdateOfferDTO } from '../../shared/models/offer/update-offer.dto.js';
import { Component } from '../../shared/types/component.enum.js';
import { Controller } from '../controller.interface.js';
import { HttpMethod } from '../http-method.enum.js';
import { ValidateObjectIdMiddleware } from '../middleware/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../middleware/validate-dto.middleware.js';
import { DocumentExistsMiddleware } from '../middleware/document-exists.middleware.js';
import { PrivateRouteMiddleware } from '../middleware/private-route.middleware.js';
import { AuthService } from '../../shared/libs/auth/auth-service.interface.js';

@injectable()
export class OfferController extends BaseController implements Controller {
  constructor(
    @inject(Component.OfferService) private offerService: IOfferService,
    @inject(Component.AuthService) private authService: AuthService,
    @inject(Component.UserService) private userService: IUserService
  ) {
    super('/offers');
    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(this.authService),
        new ValidateDtoMiddleware(CreateOfferDTO)
      ]
    });
    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavorites,
      middlewares: [new PrivateRouteMiddleware(this.authService)]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Put,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(this.authService),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDTO),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(this.authService),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId/favorite',
      method: HttpMethod.Post,
      handler: this.addToFavorites,
      middlewares: [
        new PrivateRouteMiddleware(this.authService),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId/favorite',
      method: HttpMethod.Delete,
      handler: this.removeFromFavorites,
      middlewares: [
        new PrivateRouteMiddleware(this.authService),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
  }

  async index(req: Request, res: Response): Promise<void> {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const city = req.query.city as string | undefined;

    let offers;
    if (city) {
      offers = await this.offerService.findByCity(city, limit);
    } else {
      offers = await this.offerService.find(limit);
    }

    this.sendOk(res, offers);
  }

  async create(req: Request, res: Response): Promise<void> {
    const dto: CreateOfferDTO = req.body;
    dto.userId = req.tokenPayload!.id;
    const offer = await this.offerService.create(dto);
    this.sendCreated(res, offer);
  }

  async show(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    const offer = await this.offerService.findById(offerId);
    this.sendOk(res, offer!);
  }

  async update(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    const offer = await this.offerService.updateById(offerId, req.body);
    this.sendOk(res, offer!);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    await this.offerService.deleteById(offerId);
    this.sendNoContent(res);
  }

  async getFavorites(req: Request, res: Response): Promise<void> {
    const userId = req.tokenPayload!.id;
    const favoriteOffers = await this.userService.getFavoriteOffers(userId);
    this.sendOk(res, favoriteOffers);
  }

  async addToFavorites(req: Request, res: Response): Promise<void> {
    const userId = req.tokenPayload!.id;
    const { offerId } = req.params;
    await this.userService.addToFavorites(userId, offerId);
    const offer = await this.offerService.findById(offerId);
    this.sendOk(res, offer!);
  }

  async removeFromFavorites(req: Request, res: Response): Promise<void> {
    const userId = req.tokenPayload!.id;
    const { offerId } = req.params;
    await this.userService.removeFromFavorites(userId, offerId);
    const offer = await this.offerService.findById(offerId);
    this.sendOk(res, offer!);
  }
}
