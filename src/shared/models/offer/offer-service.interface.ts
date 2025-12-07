import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDTO } from './create-offer.dto.js';
import { UpdateOfferDTO } from './update-offer.dto.js';
import { DocumentExists } from '../../libs/database-client/document-exists.interface.js';

export interface IOfferService extends DocumentExists {
  create(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  find(limit?: number): Promise<DocumentType<OfferEntity>[]>;
  updateById(offerId: string, dto: UpdateOfferDTO): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string): Promise<void>;
  findByCity(city: string, limit?: number): Promise<DocumentType<OfferEntity>[]>;
  findPremiumByCity(city: string): Promise<DocumentType<OfferEntity>[]>;
  incCommentCount(offerId: string): Promise<void>;
  getAverageRating(offerId: string): Promise<number>;
  setAverageRating(offerId: string, rating: number): Promise<void>;
}
