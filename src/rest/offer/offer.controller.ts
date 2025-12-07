import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { BaseController } from '../base-controller.js';
import { IOfferService } from '../../shared/models/offer/offer-service.interface.js';
import { CreateOfferDTO } from '../../shared/models/offer/create-offer.dto.js';
import { UpdateOfferDTO } from '../../shared/models/offer/update-offer.dto.js';
import { Component } from '../../shared/types/component.enum.js';
import { Controller } from '../controller.interface.js';
import { HttpMethod } from '../http-method.enum.js';
import { ValidateObjectIdMiddleware } from '../middleware/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../middleware/validate-dto.middleware.js';

@injectable()
export class OfferController extends BaseController implements Controller {
  constructor(
    @inject(Component.OfferService) private offerService: IOfferService
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
      middlewares: [new ValidateDtoMiddleware(CreateOfferDTO)]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [new ValidateObjectIdMiddleware('offerId')]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Put,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDTO)
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [new ValidateObjectIdMiddleware('offerId')]
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
    const offer = await this.offerService.create(req.body);
    this.sendCreated(res, offer);
  }

  async show(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    const offer = await this.offerService.findById(offerId);

    if (!offer) {
      this.sendNotFound(res, `Offer with id ${offerId} not found`);
      return;
    }

    this.sendOk(res, offer);
  }

  async update(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    const offer = await this.offerService.updateById(offerId, req.body);

    if (!offer) {
      this.sendNotFound(res, `Offer with id ${offerId} not found`);
      return;
    }

    this.sendOk(res, offer);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    await this.offerService.deleteById(offerId);
    this.sendNoContent(res);
  }
}
