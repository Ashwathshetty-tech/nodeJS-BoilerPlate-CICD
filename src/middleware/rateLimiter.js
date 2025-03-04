import rateLimit from 'express-rate-limit';
import rateLimitObj from '../constants/rateLimiter.js';

const { RATE_LIMITER_MAX_REQ, RATE_LIMITER_MESSAGE, RATE_LIMITER_WINDOWMS } = rateLimitObj;

export const apiLimiter = rateLimit({
  windowMs: RATE_LIMITER_WINDOWMS,
  max: RATE_LIMITER_MAX_REQ,
  message: RATE_LIMITER_MESSAGE,
});

// module.exports = {
//   apiLimiter
// }