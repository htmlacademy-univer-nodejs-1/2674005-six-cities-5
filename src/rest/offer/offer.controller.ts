import { Router, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import asyncHandler from 'express-async-handler';
import { plainToInstance } from 'class-transformer';
import { BaseController } from '../base-controller.js';
import { IOfferService } from '../../shared/models/offer/offer-service.interface.js';
import { CreateOfferDTO } from '../../shared/models/offer/create-offer.dto.js';
import { UpdateOfferDTO } from '../../shared/models/offer/update-offer.dto.js';
import { Component } from '../../shared/types/component.enum.js';
import { Controller } from '../controller.interface.js';

@injectable()
export class OfferController extends BaseController implements Controller {
  public router: Router;

  constructor(
    @inject(Component.OfferService) private offerService: IOfferService
  ) {
    super();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', asyncHandler((req: Request, res: Response) => this.index(req, res)));
    this.router.post('/', asyncHandler((req: Request, res: Response) => this.create(req, res)));
    this.router.get('/:offerId', asyncHandler((req: Request, res: Response) => this.show(req, res)));
    this.router.put('/:offerId', asyncHandler((req: Request, res: Response) => this.update(req, res)));
    this.router.delete('/:offerId', asyncHandler((req: Request, res: Response) => this.delete(req, res)));
  }

  private async index(req: Request, res: Response): Promise<void> {
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

  private async create(req: Request, res: Response): Promise<void> {
    const dto = plainToInstance(CreateOfferDTO, req.body);
    const offer = await this.offerService.create(dto);
    this.sendCreated(res, offer);
  }

  private async show(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    const offer = await this.offerService.findById(offerId);

    if (!offer) {
      this.sendNotFound(res, `Offer with id ${offerId} not found`);
      return;
    }

    this.sendOk(res, offer);
  }

  private async update(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    const dto = plainToInstance(UpdateOfferDTO, req.body);
    const offer = await this.offerService.updateById(offerId, dto);

    if (!offer) {
      this.sendNotFound(res, `Offer with id ${offerId} not found`);
      return;
    }

    this.sendOk(res, offer);
  }

  private async delete(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    await this.offerService.deleteById(offerId);
    this.sendNoContent(res);
  }
}
