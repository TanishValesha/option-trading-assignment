
const { createClient } = require('redis');
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';


const redisClient = createClient({
  url: REDIS_URL,
  decodeResponses: true,
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));

async function connectRedis() {
  if (!redisClient.isOpen) {
    try {
      await redisClient.connect();
      console.log('Connected to Redis');
    } catch (err) {
      console.error('Failed to connect to Redis:', err);
      throw err;
    }
  }
}

module.exports = {
  redisClient,
  connectRedis,
};