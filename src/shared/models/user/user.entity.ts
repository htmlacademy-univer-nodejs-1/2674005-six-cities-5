import { prop, modelOptions } from '@typegoose/typegoose';
import { UserType } from '../../types/index.js';
import { createHash } from 'node:crypto';

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: 'users'
  }
})
export class UserEntity {
  @prop({
    required: true,
    unique: true,
    type: String,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  })
  public email!: string;

  @prop({
    required: true,
    type: String,
    minlength: 1,
    maxlength: 15
  })
  public name!: string;

  @prop({
    required: true,
    type: String,
    minlength: 1,
    maxlength: 15
  })
  public lastName!: string;

  @prop({
    required: true,
    type: String
  })
  public password!: string;

  @prop({
    required: true,
    type: String
  })
  public avatarUrl!: string;

  @prop({
    required: true,
    enum: UserType,
    type: String,
    default: UserType.Standard
  })
  public type!: UserType;

  @prop({
    default: new Date()
  })
  public createdAt?: Date;

  @prop({
    default: new Date()
  })
  public updatedAt?: Date;

  @prop({
    type: () => [String],
    default: []
  })
  public favoriteOffers!: string[];

  public setPassword(password: string, salt: string): void {
    this.password = createHash('sha256').update(password + salt).digest('hex');
  }

  public verifyPassword(password: string, salt: string): boolean {
    const hashPassword = createHash('sha256').update(password + salt).digest('hex');
    return this.password === hashPassword;
  }
}
