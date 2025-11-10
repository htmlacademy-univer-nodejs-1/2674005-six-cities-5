import { injectable, inject } from 'inversify';
import { connect, disconnect } from 'mongoose';
import { IDatabaseClient } from './database-client.interface.js';
import { ILogger } from '../logger/index.js';
import { Component } from '../../types/component.enum.js';

@injectable()
export class MongoDatabaseClient implements IDatabaseClient {
  private isConnected = false;

  constructor(
    @inject(Component.Logger) private logger: ILogger
  ) {}

  async connect(): Promise<void> {
    if (this.isConnected) {
      this.logger.info('MongoDB is already connected');
      return;
    }

    const mongoUrl = process.env.MONGO_URL || 'mongodb://admin:test@localhost:27017/six-cities?authSource=admin';

    try {
      await connect(mongoUrl);
      this.isConnected = true;
      this.logger.info('Connected to MongoDB');
    } catch (error) {
      this.logger.error(`Failed to connect to MongoDB: ${error}`);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      this.logger.info('MongoDB is already disconnected');
      return;
    }

    try {
      await disconnect();
      this.isConnected = false;
      this.logger.info('Disconnected from MongoDB');
    } catch (error) {
      this.logger.error(`Failed to disconnect from MongoDB: ${error}`);
      throw error;
    }
  }
}
