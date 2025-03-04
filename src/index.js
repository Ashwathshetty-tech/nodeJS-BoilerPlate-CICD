import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { connectToMongo } from './config/mongodb.js';
import { connectPostgres } from './config/postgres.js';
import { redisInstance } from './config/redis.js';
import userRoutes from './routes/useRoutes.js';
import actorRoutes from './routes/actorRoutes.js';
import { logger } from './config/logger.js';
import { requestLogger } from './middleware/apiLogger.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(helmet());
// app.use(compression());
app.use(express.json());

app.use(requestLogger)



app.use('/api/', apiLimiter);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/actors', actorRoutes);

// Error Handling Middleware
app.use(errorHandler);


// Start Server
Promise.all([connectToMongo(), connectPostgres(), redisInstance.connect()])
  .then(() => {
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    logger.error('Failed to start server', err);
    process.exit(1);
  });

// Graceful Shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down gracefully...');
  await redisInstance.end();
  process.exit(0);
});
