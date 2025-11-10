export type MockServerData = {
  titles: string[];
  descriptions: string[];
  cities: string[];
  previewImages: string[];
  images: string[][];
  types: string[];
  amenities: string[][];
  users: Array<{
    email: string;
    name: string;
    lastName: string;
    password: string;
    avatar: string;
  }>;
  locations: Array<{
    latitude: number;
    longitude: number;
  }>;
};
