import { createReadStream } from 'node:fs';
import { FileReader } from './file-reader.interface.js';
import { Offer } from '../../types/index.js';
import { createOffer, RawOffer } from './offer.factory.js';

const CHUNK_SIZE = 16384; // 16KB

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    public readonly filename: string
  ) {}

  private parseRawDataToOffers(): Offer[] {
    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map((parts) => {
        const [
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
        ] = parts;

        return {
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
        } as RawOffer;
      })
      .map((rawOffer) => createOffer(rawOffer))
      .filter((offer): offer is Offer => offer !== null);
  }

  async read(): Promise<Offer[]> {
    const readStream = createReadStream(this.filename, {
      highWaterMark: CHUNK_SIZE,
      encoding: 'utf-8',
    });

    return new Promise((resolve, reject) => {
      readStream.on('data', (chunk: string) => {
        this.rawData += chunk;
      });

      readStream.on('end', () => {
        const offers = this.parseRawDataToOffers();
        resolve(offers);
      });

      readStream.on('error', (err) => {
        reject(err);
      });
    });
  }
}
