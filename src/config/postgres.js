import pg from 'pg';
import { logger } from './logger.js';

const { Pool } = pg;

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    port: process.env.POSTGRES_PORT,
    max: 5,
    idleTimeoutMillis: 100000,
    // connectionTimeoutMillis: config.get('CONNECTIONTIMEOUT'),
    // application_name: 'retail_backend',
});

export const connectPostgres = async () => {
  try {
    await pool.connect();
    logger.info('PostgreSQL Connected');
  } catch (error) {
    logger.error('PostgreSQL Connection Failed', error);
    process.exit(1);
  }
};

export default pool;
