import { prop, modelOptions, Ref, pre } from '@typegoose/typegoose';
import { UserEntity } from '../user/user.entity.js';
import { OfferEntity } from '../offer/offer.entity.js';

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: 'comments'
  }
})
@pre<CommentEntity>('findOne', function() {
  this.populate('userId');
})
@pre<CommentEntity>('find', function() {
  this.populate('userId');
})
export class CommentEntity {
  @prop({
    required: true,
    type: String,
    minlength: 5,
    maxlength: 1024
  })
  public text!: string;

  @prop({
    required: true,
    type: Number,
    min: 1,
    max: 5
  })
  public rating!: number;

  @prop({
    required: true,
    default: new Date(),
    type: Date
  })
  public publishDate!: Date;

  @prop({
    required: true,
    ref: () => UserEntity,
    type: () => String
  })
  public userId!: Ref<UserEntity>;

  @prop({
    required: true,
    ref: () => OfferEntity,
    type: () => String
  })
  public offerId!: Ref<OfferEntity>;

  @prop({
    default: new Date()
  })
  public createdAt?: Date;

  @prop({
    default: new Date()
  })
  public updatedAt?: Date;
}
