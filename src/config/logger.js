import winston from 'winston';
import ElasticsearchTransport  from 'winston-elasticsearch';
import dotenv from 'dotenv';

dotenv.config();

// const esTransport = new ElasticsearchTransport({
//   level: 'info',
//   clientOpts: {
//     node: process.env.ELK_URL,
//     auth: {
//       username: process.env.ELK_USERNAME,
//       password: process.env.ELK_PASSWORD,
//     },
//   },
// });

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    // esTransport,
  ],
});

// export default logger;
