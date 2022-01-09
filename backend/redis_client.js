import redis, { createClient } from 'redis';
import rejson from 'redis-rejson';
import redisearch from 'redis-redisearch';
import { promisify } from 'util';
import config from './config.js';

rejson(redis);
redisearch(redis);

redis.addCommand('ft.aggregate');

const redisClient = createClient({
  host: config.redisHost,
  password: config.redisPassword,
  port: config.redisPort,
});

const ftcreateAsync = promisify(redisClient.ft_create).bind(redisClient);
const keysAsync = promisify(redisClient.keys).bind(redisClient);
const del = promisify(redisClient.del).bind(redisClient);

export const roomsIndex = 'roomsIndex';

redisClient.on('ready', async () => {
  console.log(`Connected to Redis on ${config.redisHost}.`);
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

  try {
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
  } catch(err) {
    console.log(err)
  }
});

redisClient.on('error', err => {
    console.error(err);
  });  

export default redisClient;
