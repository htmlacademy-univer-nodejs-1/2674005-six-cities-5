import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { CreateUserDTO } from './create-user.dto.js';
import { UpdateUserDTO } from './update-user.dto.js';
import { DocumentExists } from '../../libs/database-client/document-exists.interface.js';

export interface IUserService extends DocumentExists {
  create(dto: CreateUserDTO): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findById(userId: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(email: string, dto: CreateUserDTO): Promise<DocumentType<UserEntity>>;
  updateById(userId: string, dto: UpdateUserDTO): Promise<DocumentType<UserEntity> | null>;
  addToFavorites(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null>;
  removeFromFavorites(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null>;
  getFavoriteOffers(userId: string): Promise<string[]>;
}
