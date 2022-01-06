import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import redisClient from './redis_client.js';

const server = new Server();

const pubClient = redisClient.duplicate();
const subClient = redisClient.duplicate();

server.adapter(createAdapter(pubClient, subClient));

export default server;
