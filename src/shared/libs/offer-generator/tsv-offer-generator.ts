import { MockServerData, UserType } from '../../types/index.js';
import { getRandomInt, getRandomFloat, getRandomItem, getRandomItems, getRandomBoolean } from '../../helpers/random.js';

const MIN_PRICE = 100;
const MAX_PRICE = 100000;
const MIN_RATING = 1;
const MAX_RATING = 5;
const MIN_ROOMS = 1;
const MAX_ROOMS = 8;
const MIN_GUESTS = 1;
const MAX_GUESTS = 10;
const MIN_COMMENTS = 0;
const MAX_COMMENTS = 100;

export class TSVOfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  generate(): string {
    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItem(this.mockData.descriptions);
    const publishDate = new Date().toISOString();
    const city = getRandomItem(this.mockData.cities);
    const previewImage = getRandomItem(this.mockData.previewImages);
    const images = getRandomItem(this.mockData.images).join(';');
    const isPremium = getRandomBoolean();
    const isFavorite = getRandomBoolean();
    const rating = getRandomFloat(MIN_RATING, MAX_RATING, 1);
    const type = getRandomItem(this.mockData.types);
    const rooms = getRandomInt(MIN_ROOMS, MAX_ROOMS);
    const guests = getRandomInt(MIN_GUESTS, MAX_GUESTS);
    const price = getRandomInt(MIN_PRICE, MAX_PRICE);
    const amenities = getRandomItems(getRandomItem(this.mockData.amenities)).join(';');

    const user = getRandomItem(this.mockData.users);
    const userType = getRandomBoolean() ? UserType.Pro : UserType.Standard;

    const commentsCount = getRandomInt(MIN_COMMENTS, MAX_COMMENTS);
    const location = getRandomItem(this.mockData.locations);
    const locationStr = `${location.latitude};${location.longitude}`;

    return [
      title,
      description,
      publishDate,
      city,
      previewImage,
      images,
      isPremium,
      isFavorite,
      rating,
      type,
      rooms,
      guests,
      price,
      amenities,
      user.email,
      user.name,
      user.lastName,
      user.password,
      user.avatar,
      userType,
      commentsCount,
      locationStr
    ].join('\t');
  }
}
