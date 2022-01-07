import express from 'express';
import redisClient, { roomsIndex } from '../redis_client.js';
import { promisify } from 'util';
import { getRoomKey, getRoomById, isRoomValid } from '../models/room.js';

const router = express.Router();

const ftSearchAsync = promisify(redisClient.ft_search).bind(redisClient);
const hsetAsync = promisify(redisClient.hset).bind(redisClient);

router.get('/', async (req, res) => {
  const searchQuery = req.query.searchQuery ?? '';
  const genres = req.query.filters ?? [];
  const offset = req.query.skip ?? 0;
  const limit = req.query.limit ?? 10;

  let redisQuery = '@private:{false}';

  if (searchQuery !== '*' && searchQuery.length > 0) {
    redisQuery += ` @name|description:(${searchQuery})`;
  }

  if (genres.length > 0) {
    redisQuery += ` @genres:{${genres.join('|')}}`;
  }

  const searchResult = await ftSearchAsync(
    roomsIndex,
    redisQuery,
    'SORTBY',
    'numMembers',
    'DESC',
    'LIMIT',
    offset,
    limit
  );

  res.status(200).json(
    searchResult
      .filter(element => Array.isArray(element))
      .map(arr => {
        for (let i = 0; i < arr.length; i += 2) {
          if (arr[i] === 'json') {
            return JSON.parse(arr[i + 1]);
          }
        }
        // should never happen
        return null;
      })
  );
});

router.put('/update/:roomId', async (req, res) => {
  if (req.isUnauthenticated()) {
    return res.status(401).json();
  }

  const roomId = req.params.roomId;

  if (!(await isRoomValid(roomId))) {
    return res.status(400).json();
  }

  const room = getRoomById(roomId);

  if (room.host.username !== req.user.username) {
    return res.status(401).json();
  }

  const name = req.body.name;
  const description = req.body.description;
  const genres = req.body.genres.join();
  const isPrivate = req.body.private;

  room.name = name;
  room.description = description;
  room.genres = genres;
  room.private = isPrivate;

  await hsetAsync(
    getRoomKey(roomId),
    'name', name,
    'description', description,
    'private', isPrivate,
    'genres', genres,
    'json', JSON.stringify(room)
  );
  res.status(200).json();
});

export default router;
