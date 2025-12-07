import { injectable, inject } from 'inversify';
import { getModelForClass } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose';
import { IUserService } from './user-service.interface.js';
import { UserEntity } from './user.entity.js';
import { CreateUserDTO } from './create-user.dto.js';
import { UpdateUserDTO } from './update-user.dto.js';
import { Component } from '../../types/component.enum.js';
import { ILogger } from '../../libs/logger/index.js';
import { Config } from '../../libs/config/config.js';

@injectable()
export class DefaultUserService implements IUserService {
  private userModel = getModelForClass(UserEntity);

  constructor(
    @inject(Component.Logger) private logger: ILogger,
    @inject(Component.Config) private config: Config
  ) {}

  async create(dto: CreateUserDTO): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity();
    Object.assign(user, dto);
    user.setPassword(dto.password, this.config.salt);

    const newUser = await this.userModel.create(user);
    this.logger.info(`User created: ${newUser.email}`);
    return newUser;
  }

  async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email });
  }

  async findById(userId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findById(userId);
  }

  async findOrCreate(email: string, dto: CreateUserDTO): Promise<DocumentType<UserEntity>> {
    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      return existingUser;
    }

    return this.create(dto);
  }

  async updateById(userId: string, dto: UpdateUserDTO): Promise<DocumentType<UserEntity> | null> {
    const user = await this.userModel.findByIdAndUpdate(userId, dto, { new: true });

    if (user) {
      this.logger.info(`User updated: ${userId}`);
    }

    return user;
  }

  async exists(documentId: string): Promise<boolean> {
    return (await this.userModel.exists({ _id: documentId })) !== null;
  }

  async addToFavorites(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { favoriteOffers: offerId } },
      { new: true }
    );

    if (user) {
      this.logger.info(`Offer ${offerId} added to favorites for user ${userId}`);
    }

    return user;
  }

  async removeFromFavorites(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { favoriteOffers: offerId } },
      { new: true }
    );

    if (user) {
      this.logger.info(`Offer ${offerId} removed from favorites for user ${userId}`);
    }

    return user;
  }

  async getFavoriteOffers(userId: string): Promise<string[]> {
    const user = await this.userModel.findById(userId);
    return user?.favoriteOffers || [];
  }
}
