import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  mongoUri: string;
  nodeEnv: string;
}

export const config: Config = {
  port: parseInt(process.env.PORT || '4000', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/seethenumbers',
  nodeEnv: process.env.NODE_ENV || 'development',
};
