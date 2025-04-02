export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  },
  airKorea: {
    apiKey: process.env.AIR_KOREA_API_KEY,
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL, 10) || 900, // 15 minutes
  },
});
