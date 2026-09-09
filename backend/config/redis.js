import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;
const redis = redisUrl
  ? new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
    })
  : null;

if (redis) {
  redis.on("error", (error) => {
    console.error("Redis error", error.message);
  });
}

export default redis;
