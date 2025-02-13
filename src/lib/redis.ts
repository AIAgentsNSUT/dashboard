// lib/redis.ts
import { createClient } from "redis";

if (!process.env.REDIS_URL) {
  throw new Error("Redis URL is not set");
}

const redis = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redis.on("error", (err) => console.error("Redis Client Error", err));

// Connect to Redis
await redis.connect();

export default redis;
