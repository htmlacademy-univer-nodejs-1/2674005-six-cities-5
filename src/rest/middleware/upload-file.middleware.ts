import { Request, Response, NextFunction } from 'express';
import multer, { StorageEngine } from 'multer';
import { nanoid } from 'nanoid';
import { extension } from 'mime-types';
import { Middleware } from './middleware.interface.js';

export class UploadFileMiddleware implements Middleware {
  constructor(
    private uploadDirectory: string,
    private fieldName: string
  ) {}

  async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage: StorageEngine = multer.diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        const fileExtension = extension(file.mimetype);
        const filename = nanoid();
        callback(null, `${filename}.${fileExtension}`);
      }
    });

    const uploadSingleFileMiddleware = multer({ storage }).single(this.fieldName);

    uploadSingleFileMiddleware(req, res, next);
  }
}
