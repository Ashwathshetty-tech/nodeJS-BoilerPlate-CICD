import redis from 'redis';
import { logger } from './logger.js';

class RedisClient {
  constructor() {
    if (!RedisClient.instance) {
      this.client = redis.createClient({
        url: process.env.REDIS_URL,
      });

      this.client.on('connect', () => {
        logger.info('Redis connected successfully');
      });

      this.client.on('error', (err) => {
        logger.error(`Redis Error: ${err.message}`);
      });

      this.client.on('end', () => {
        logger.info('Redis client disconnected');
      });

      RedisClient.instance = this;
    }
    return RedisClient.instance;
  }

  async connect() {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  async end() {
    if (!this.client.isOpen) {
      await this.client.quit();
    }
  }

  getClient() {
    return this.client;
  }
}

const redisInstance = new RedisClient();
export { redisInstance };
