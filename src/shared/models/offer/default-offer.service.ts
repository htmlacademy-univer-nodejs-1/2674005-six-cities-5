import { injectable, inject } from 'inversify';
import { getModelForClass } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose';
import { IOfferService } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDTO } from './create-offer.dto.js';
import { UpdateOfferDTO } from './update-offer.dto.js';
import { Component } from '../../types/component.enum.js';
import { ILogger } from '../../libs/logger/index.js';
import { ICommentService } from '../comment/comment-service.interface.js';

const DEFAULT_OFFER_COUNT = 60;
const PREMIUM_OFFERS_COUNT = 3;

@injectable()
export class DefaultOfferService implements IOfferService {
  private offerModel = getModelForClass(OfferEntity);

  constructor(
    @inject(Component.Logger) private logger: ILogger,
    @inject(Component.CommentService) private commentService: ICommentService
  ) {}

  async create(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity>> {
    const offer = await this.offerModel.create(dto);
    this.logger.info(`Offer created: ${offer._id}`);
    return offer;
  }

  async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel
      .findById(offerId)
      .populate('userId');

    if (offer) {
      const commentsCount = (await this.commentService.findByOfferId(offerId)).length;
      offer.commentsCount = commentsCount;
      await offer.save();
    }

    return offer;
  }

  async find(limit: number = DEFAULT_OFFER_COUNT): Promise<DocumentType<OfferEntity>[]> {
    const offers = await this.offerModel
      .find()
      .limit(limit)
      .sort({ publishDate: -1 })
      .populate('userId');

    return offers;
  }

  async updateById(offerId: string, dto: UpdateOfferDTO): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate('userId');

    if (offer) {
      this.logger.info(`Offer updated: ${offerId}`);
    }

    return offer;
  }

  async deleteById(offerId: string): Promise<void> {
    await this.offerModel.findByIdAndDelete(offerId);
    await this.commentService.deleteByOfferId(offerId);
    this.logger.info(`Offer deleted: ${offerId}`);
  }

  async findByCity(city: string, limit: number = DEFAULT_OFFER_COUNT): Promise<DocumentType<OfferEntity>[]> {
    const offers = await this.offerModel
      .find({ city })
      .limit(limit)
      .sort({ publishDate: -1 })
      .populate('userId');

    return offers;
  }

  async findPremiumByCity(city: string): Promise<DocumentType<OfferEntity>[]> {
    const offers = await this.offerModel
      .find({ city, isPremium: true })
      .limit(PREMIUM_OFFERS_COUNT)
      .sort({ publishDate: -1 })
      .populate('userId');

    return offers;
  }

  async incCommentCount(offerId: string): Promise<void> {
    await this.offerModel.findByIdAndUpdate(
      offerId,
      { $inc: { commentsCount: 1 } },
      { new: true }
    );
  }

  async getAverageRating(offerId: string): Promise<number> {
    const comments = await this.commentService.findByOfferId(offerId);

    if (comments.length === 0) {
      return 0;
    }

    const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
    return Math.round((totalRating / comments.length) * 10) / 10;
  }

  async setAverageRating(offerId: string, rating: number): Promise<void> {
    await this.offerModel.findByIdAndUpdate(
      offerId,
      { rating },
      { new: true }
    );
  }

  async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId })) !== null;
  }
}
