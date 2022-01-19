import redis, { createClient } from 'redis';
import rejson from 'redis-rejson';
import redisearch from 'redis-redisearch';
import { promisify } from 'util';
import 'dotenv/config.js';

rejson(redis);
redisearch(redis);

redis.addCommand('ft.aggregate');

const redisClient = createClient({
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
  port: parseInt(process.env.REDIS_PORT),
});

const ftcreateAsync = promisify(redisClient.ft_create).bind(redisClient);
const ftInfoAsync = promisify(redisClient.ft_info).bind(redisClient);
const keysAsync = promisify(redisClient.keys).bind(redisClient);
const del = promisify(redisClient.del).bind(redisClient);

export const roomsIndex = 'roomsIndex';

redisClient.on('ready', async () => {
  console.log(`Connected to Redis on ${process.env.REDIS_HOST}.`);
  // Delete stale data
  const roomKeys = await keysAsync('room:*');
  const queueKeys = await keysAsync('queue:*');
  const socketKeys = await keysAsync('socket:*');

  if (roomKeys?.length) {
    await del(roomKeys);
  }

  if (queueKeys?.length) {
    await del(queueKeys);
  }

  if (socketKeys?.length) {
    await del(socketKeys);
  }

  let indexExists = false;

  try {
    await ftInfoAsync(roomsIndex);
    indexExists = true;
  } catch (err) {
    console.log('Rooms index does not exist. Creating index...');
  }

  try {
    if (!indexExists) {
      // Create secondary index on fields for efficient searching
      await ftcreateAsync(roomsIndex,
        'PREFIX', '1', 'room:',
        'SCHEMA',
        'name', 'TEXT', 'SORTABLE',
        'description', 'TEXT', 'SORTABLE',
        'genres', 'TAG', 'SORTABLE',
        'numMembers', 'NUMERIC', 'SORTABLE',
        'private', 'TAG', 'SORTABLE'
      )
    }
  } catch (err) {
    console.log(err);
  }
});

redisClient.on('error', err => {
  console.error(err);
});

export default redisClient;
