import redisClient from '../redis_client.js';
import { promisify } from 'util';

const hsetAsync = promisify(redisClient.hset).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

const socketPrefix = 'socket:';

function getSocketKey(socketId) {
  return socketPrefix + socketId;
}

async function getConnectedRoomId(socketId) {
  return await getAsync(getSocketKey(socketId));
}

export default { getConnectedRoomId };
