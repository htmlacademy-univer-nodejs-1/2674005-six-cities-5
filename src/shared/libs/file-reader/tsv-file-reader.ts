import { createReadStream } from 'node:fs';
import { EventEmitter } from 'node:events';
import { createOffer, RawOffer } from './offer.factory.js';

const CHUNK_SIZE = 65536;

export class TSVFileReader extends EventEmitter {
  constructor(
    public readonly filename: string
  ) {
    super();
  }

  private parseLineToOffer(line: string): void {
    const parts = line.split('\t');
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

    const rawOffer: RawOffer = {
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
    };

    const offer = createOffer(rawOffer);
    if (offer) {
      this.emit('line', offer);
    }
  }

  async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      highWaterMark: CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    return new Promise((resolve, reject) => {
      readStream.on('data', (chunk: string) => {
        remainingData += chunk.toString();

        while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
          const completeRow = remainingData.slice(0, nextLinePosition + 1);
          remainingData = remainingData.slice(nextLinePosition + 1);
          importedRowCount++;

          const line = completeRow.replace(/\n/, '').trim();
          if (line.length > 0) {
            this.parseLineToOffer(line);
          }
        }
      });

      readStream.on('end', () => {
        if (remainingData.trim().length > 0) {
          this.parseLineToOffer(remainingData.trim());
          importedRowCount++;
        }

        this.emit('end', importedRowCount);
        resolve();
      });

      readStream.on('error', (err) => {
        this.emit('error', err);
        reject(err);
      });
    });
  }
}
