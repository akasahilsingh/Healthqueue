import { isRedisReady } from "../config/redis.js";

// Fixed-window rate limiter backed by Redis when REDIS_URL is configured.
const createRateLimiter = ({ keyGenerator, prefix, windowSeconds, maxRequests }) => {
  return async (req, res, next) => {
    try {
      if (!isRedisReady()) {
        return next();
      }

      const identifier = keyGenerator(req);

      if (!identifier) {
        return res.status(400).json({
          success: false,
          message: "Unable to identify request",
        });
      }

      const key = `rate-limit:${prefix}:${identifier}`;
      const requests = await redis.incr(key);

      if (requests === 1) {
        await redis.expire(key, windowSeconds);
      }

      if (requests > maxRequests) {
        return res.status(429).json({
          success: false,
          message: "Too many requests. Try again later.",
        });
      }

      return next();
    } catch (error) {
      console.error("Rate limiter error:", error.message);
      return next();
    }
  };
};

export default createRateLimiter;
