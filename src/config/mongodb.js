import mongoose from 'mongoose';
import { logger } from './logger.js';

export const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('MongoDB Connected');
  } catch (error) {
    logger.error('MongoDB Connection Failed', error);
    process.exit(1);
  }
};
