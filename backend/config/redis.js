import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;
const redis = redisUrl
  ? new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      connectTimeout: 1000,
    })
  : null;

export const isRedisReady = () => redis?.status === "ready";

if (redis) {
  redis.on("ready", () => {
    console.log("Redis connected successfully");
  });

  redis.on("error", (error) => {
    console.error("Redis error", error.message);
  });
}

export default redis;
