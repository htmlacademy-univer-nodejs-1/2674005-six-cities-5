import { City } from '../../types/city.enum.js';
import { HousingType } from '../../types/housing-type.enum.js';

export class CreateOfferDTO {
  public title!: string;
  public description!: string;
  public city!: City;
  public previewImage!: string;
  public images!: string[];
  public isPremium!: boolean;
  public type!: HousingType;
  public rooms!: number;
  public guests!: number;
  public price!: number;
  public amenities!: string[];
  public userId!: string;
  public location!: {
    latitude: number;
    longitude: number;
  };
}
