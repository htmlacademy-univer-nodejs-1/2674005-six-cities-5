import { City, HousingType, Amenity, UserType, Offer, User, Location } from '../../types/index.js';

export type RawOffer = {
  title: string;
  description: string;
  publishDate: string;
  city: string;
  previewImage: string;
  images: string;
  isPremium: string;
  isFavorite: string;
  rating: string;
  type: string;
  rooms: string;
  guests: string;
  price: string;
  amenities: string;
  userEmail: string;
  userName: string;
  userLastName: string;
  userPassword: string;
  userAvatar: string;
  userType: string;
  commentsCount: string;
  location: string;
};

const MIN_TITLE_LENGTH = 10;
const MAX_TITLE_LENGTH = 100;
const MIN_DESCRIPTION_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 1024;
const MIN_RATING = 1;
const MAX_RATING = 5;
const MIN_ROOMS = 1;
const MAX_ROOMS = 8;
const MIN_GUESTS = 1;
const MAX_GUESTS = 10;
const MIN_PRICE = 100;
const MAX_PRICE = 100000;
const IMAGES_COUNT = 6;

export function createOffer(offerData: RawOffer): Offer | null {
  const {
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
    userEmail,
    userName,
    userLastName,
    userPassword,
    userAvatar,
    userType,
    commentsCount,
    location,
  } = offerData;

  // Валидация title
  if (title.length < MIN_TITLE_LENGTH || title.length > MAX_TITLE_LENGTH) {
    console.error(`Title must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters`);
    return null;
  }

  // Валидация description
  if (description.length < MIN_DESCRIPTION_LENGTH || description.length > MAX_DESCRIPTION_LENGTH) {
    console.error(`Description must be between ${MIN_DESCRIPTION_LENGTH} and ${MAX_DESCRIPTION_LENGTH} characters`);
    return null;
  }

  // Валидация города
  if (!Object.values(City).includes(city as City)) {
    console.error(`Invalid city: ${city}`);
    return null;
  }

  // Парсинг и валидация изображений
  const imageArray = images.split(';');
  if (imageArray.length !== IMAGES_COUNT) {
    console.error(`Must have exactly ${IMAGES_COUNT} images`);
    return null;
  }

  // Парсинг и валидация рейтинга
  const ratingValue = Number(rating);
  if (isNaN(ratingValue) || ratingValue < MIN_RATING || ratingValue > MAX_RATING) {
    console.error(`Rating must be between ${MIN_RATING} and ${MAX_RATING}`);
    return null;
  }

  // Валидация типа жилья
  if (!Object.values(HousingType).includes(type as HousingType)) {
    console.error(`Invalid housing type: ${type}`);
    return null;
  }

  // Парсинг и валидация комнат
  const roomsValue = Number(rooms);
  if (isNaN(roomsValue) || roomsValue < MIN_ROOMS || roomsValue > MAX_ROOMS) {
    console.error(`Rooms must be between ${MIN_ROOMS} and ${MAX_ROOMS}`);
    return null;
  }

  // Парсинг и валидация гостей
  const guestsValue = Number(guests);
  if (isNaN(guestsValue) || guestsValue < MIN_GUESTS || guestsValue > MAX_GUESTS) {
    console.error(`Guests must be between ${MIN_GUESTS} and ${MAX_GUESTS}`);
    return null;
  }

  // Парсинг и валидация цены
  const priceValue = Number(price);
  if (isNaN(priceValue) || priceValue < MIN_PRICE || priceValue > MAX_PRICE) {
    console.error(`Price must be between ${MIN_PRICE} and ${MAX_PRICE}`);
    return null;
  }

  // Парсинг удобств
  const amenitiesArray = amenities.split(';').filter((amenity) => {
    if (!Object.values(Amenity).includes(amenity as Amenity)) {
      console.warn(`Unknown amenity: ${amenity}`);
      return false;
    }
    return true;
  }) as Amenity[];

  // Валидация типа пользователя
  if (!Object.values(UserType).includes(userType as UserType)) {
    console.error(`Invalid user type: ${userType}`);
    return null;
  }

  // Парсинг локации
  const [latitude, longitude] = location.split(';').map(Number);
  if (isNaN(latitude) || isNaN(longitude)) {
    console.error('Invalid location coordinates');
    return null;
  }

  const locationValue: Location = {
    latitude,
    longitude,
  };

  // Создание пользователя
  const user: User = {
    email: userEmail,
    name: userName,
    lastName: userLastName,
    password: userPassword,
    avatarUrl: userAvatar,
    type: userType as UserType,
  };

  // Создание предложения
  return {
    title,
    description,
    publishDate: new Date(publishDate),
    city: city as City,
    previewImage,
    images: imageArray,
    isPremium: isPremium === 'true',
    isFavorite: isFavorite === 'true',
    rating: ratingValue,
    type: type as HousingType,
    rooms: roomsValue,
    guests: guestsValue,
    price: priceValue,
    amenities: amenitiesArray,
    author: user,
    commentsCount: Number(commentsCount),
    location: locationValue,
  };
}
