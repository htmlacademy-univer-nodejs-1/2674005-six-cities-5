import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from './middleware.interface.js';
import { IOfferService } from '../../shared/models/offer/offer-service.interface.js';

export class CheckOwnerMiddleware implements Middleware {
  constructor(
    private offerService: IOfferService,
    private paramName: string,
  ) {}

  async execute(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const offerId = req.params[this.paramName];
    const userId = req.tokenPayload?.id;

    if (!userId) {
      res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized' });
      return;
    }

    const offer = await this.offerService.findById(offerId);

    if (!offer) {
      res.status(StatusCodes.NOT_FOUND).json({ error: 'Offer not found' });
      return;
    }

    const offerUserId =
      typeof offer.userId === 'object' && offer.userId._id
        ? offer.userId._id.toString()
        : offer.userId.toString();

    if (offerUserId !== userId) {
      res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: 'You can only edit or delete your own offers' });
      return;
    }

    next();
  }
}
