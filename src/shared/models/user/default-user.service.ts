import { injectable, inject } from 'inversify';
import { getModelForClass } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose';
import { IUserService } from './user-service.interface.js';
import { UserEntity } from './user.entity.js';
import { CreateUserDTO } from './create-user.dto.js';
import { UpdateUserDTO } from './update-user.dto.js';
import { Component } from '../../types/component.enum.js';
import { ILogger } from '../../libs/logger/index.js';

@injectable()
export class DefaultUserService implements IUserService {
  private userModel = getModelForClass(UserEntity);

  constructor(
    @inject(Component.Logger) private logger: ILogger
  ) {}

  async create(dto: CreateUserDTO): Promise<DocumentType<UserEntity>> {
    const user = await this.userModel.create(dto);
    this.logger.info(`User created: ${user.email}`);
    return user;
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
}
