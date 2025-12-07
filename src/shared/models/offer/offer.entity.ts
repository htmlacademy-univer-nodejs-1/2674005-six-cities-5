import { prop, modelOptions, Ref, pre } from '@typegoose/typegoose';
import { City } from '../../types/city.enum.js';
import { HousingType } from '../../types/housing-type.enum.js';
import { Amenity } from '../../types/amenity.enum.js';
import { UserEntity } from '../user/user.entity.js';

class LocationData {
  @prop({ required: true, type: Number })
  public latitude!: number;

  @prop({ required: true, type: Number })
  public longitude!: number;
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: 'offers'
  }
})
@pre('findOne', function() {
  (this as any).populate('userId');
})
@pre('find', function() {
  (this as any).populate('userId');
})
export class OfferEntity {
  @prop({
    required: true,
    type: String,
    minlength: 10,
    maxlength: 100
  })
  public title!: string;

  @prop({
    required: true,
    type: String,
    minlength: 20,
    maxlength: 1024
  })
  public description!: string;

  @prop({
    required: true,
    default: new Date(),
    type: Date
  })
  public publishDate!: Date;

  @prop({
    required: true,
    enum: City,
    type: String
  })
  public city!: City;

  @prop({
    required: true,
    type: String
  })
  public previewImage!: string;

  @prop({
    required: true,
    type: () => [String],
    default: []
  })
  public images!: string[];

  @prop({
    required: true,
    type: Boolean,
    default: false
  })
  public isPremium!: boolean;

  @prop({
    required: true,
    type: Boolean,
    default: false
  })
  public isFavorite!: boolean;

  @prop({
    required: false,
    type: Number,
    min: 0,
    max: 5,
    default: 0
  })
  public rating!: number;

  @prop({
    required: true,
    enum: HousingType,
    type: String
  })
  public type!: HousingType;

  @prop({
    required: true,
    type: Number,
    min: 1,
    max: 8
  })
  public rooms!: number;

  @prop({
    required: true,
    type: Number,
    min: 1,
    max: 10
  })
  public guests!: number;

  @prop({
    required: true,
    type: Number,
    min: 100,
    max: 100000
  })
  public price!: number;

  @prop({
    required: true,
    type: () => [String],
    enum: Amenity,
    default: []
  })
  public amenities!: string[];

  @prop({
    required: true,
    ref: () => UserEntity,
    type: () => String
  })
  public userId!: Ref<UserEntity>;

  @prop({
    required: true,
    type: Number,
    default: 0
  })
  public commentsCount!: number;

  @prop({
    required: true,
    type: LocationData
  })
  public location!: LocationData;

  @prop({
    default: new Date()
  })
  public createdAt?: Date;

  @prop({
    default: new Date()
  })
  public updatedAt?: Date;
}
