import convict from 'convict';
import 'convict-format-with-validator';

export type Config = {
  port: number;
  db: {
    host: string;
  };
  salt: string;
  uploadDirectory: string;
};

export function getConfig(): Config {
  const config = convict<Config>({
    port: {
      format: 'port',
      env: 'PORT',
      default: 3001,
    },
    db: {
      host: {
        format: String,
        env: 'DB_HOST',
        default: '127.0.0.1',
      },
    },
    salt: {
      format: String,
      env: 'SALT',
      default: '',
    },
    uploadDirectory: {
      format: String,
      env: 'UPLOAD_DIRECTORY',
      default: 'upload',
    },
  });

  config.load({
    port: process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3001,
    db: {
      host: process.env.DB_HOST || '127.0.0.1',
    },
    salt: process.env.SALT || '',
    uploadDirectory: process.env.UPLOAD_DIRECTORY || 'upload',
  });

  config.validate({ allowed: 'strict' });

  return config.getProperties();
}
