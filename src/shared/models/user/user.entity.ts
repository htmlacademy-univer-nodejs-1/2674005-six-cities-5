import { prop, modelOptions } from '@typegoose/typegoose';
import { UserType } from '../../types/index.js';

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
    type: String,
    minlength: 6,
    maxlength: 12
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
}
