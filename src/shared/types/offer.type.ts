import { City } from './city.enum.js';
import { HousingType } from './housing-type.enum.js';
import { Amenity } from './amenity.enum.js';
import { User } from './user.type.js';
import { Location } from './location.type.js';

export type Offer = {
  title: string;
  description: string;
  publishDate: Date;
  city: City;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: HousingType;
  rooms: number;
  guests: number;
  price: number;
  amenities: Amenity[];
  author: User;
  commentsCount: number;
  location: Location;
};
