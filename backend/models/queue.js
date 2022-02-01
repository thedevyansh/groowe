import redisClient from '../redis_client.js';
import { promisify } from 'util';
import { getUserKey } from '../routes/auth.js';
import io from '../socketio_server.js';

const delAsync = promisify(redisClient.del).bind(redisClient);
const lrangeAsync = promisify(redisClient.lrange).bind(redisClient);
const lremAsync = promisify(redisClient.lrem).bind(redisClient);
const rpushAsync = promisify(redisClient.rpush).bind(redisClient);
const lpopAsync = promisify(redisClient.lpop).bind(redisClient);
const rpopAsync = promisify(redisClient.rpop).bind(redisClient);
const lposAsync = promisify(redisClient.lpos).bind(redisClient);
const llenAsync = promisify(redisClient.llen).bind(redisClient);

const jsonGetAsync = promisify(redisClient.json_get).bind(redisClient);
const jsonArrPopAsync = promisify(redisClient.json_arrpop).bind(redisClient);
const jsonArrAppendAsync = promisify(redisClient.json_arrappend).bind(redisClient);

const queuePrefix = 'queue:';
const timers = new Map();

function getQueueKey(roomId) {
  return queuePrefix + roomId;
}

async function deleteQueue(roomId) {
  await delAsync(getQueueKey(roomId));

  if (timers.has(roomId)) {
    const { queueTimer, syncTimer } = timers.get(roomId);

    clearTimeout(queueTimer);
    clearTimeout(syncTimer);
    timers.delete(roomId);
  }
}

async function isInQueue(roomId, user) {
  return (await lposAsync(getQueueKey(roomId), user.username)) !== null;
}

async function addToQueue(roomId, user) {
  // check if user is already in queue
  if ((await lposAsync(getQueueKey(roomId), user.username)) != null) {
    return null;
  }

  return (await rpushAsync(getQueueKey(roomId), user.username)) - 1;
}

async function getQueue(roomId) {
  // get all items from first item (0) in queue to last (-1)
  return await lrangeAsync(getQueueKey(roomId), 0, -1);
}

async function removeFromQueue(roomId, user) {
  await lremAsync(getQueueKey(roomId), -1, user.username);
}

async function skipSong(roomId) {
  if (!timers.has(roomId)) {
    return;
  }

  const { queueTimer, syncTimer } = timers.get(roomId);

  // cancel current timers
  clearTimeout(queueTimer);
  clearTimeout(syncTimer);
}

async function getNextSong(roomId) {
  // Returns the id of the next song to be played.
  // If the next user doesn't have a selectedPlaylist, or if the selectedPlaylist
  // is empty, they'll be removed from the queue.

  const queueKey = getQueueKey(roomId);
  let song = null;

  while ((await llenAsync(queueKey)) > 0) {
    // move first user in queue to last in queue
    const username = await lpopAsync(queueKey);
    if (!username) {
      return null;
    }
    await rpushAsync(queueKey, username);

    const userKey = getUserKey(username);
    let selectedPlaylist = null;

    try {
      selectedPlaylist = JSON.parse(
        await jsonGetAsync(userKey, '.selectedPlaylist')
      );
    } catch (err) {
      // path does not exist
    }

    if (!selectedPlaylist) {
      await rpopAsync(queueKey);
      io.to(roomId).emit('dequeued', username);
      continue;
    }

    let nextSong = null;

    try {
      nextSong = await jsonArrPopAsync(
        userKey,
        `playlist["${selectedPlaylist}"]["queue"]`,
        0
      );
    } catch (error) {
      // no songs in playlist
    }

    if (!nextSong) {
      await rpopAsync(queueKey);
      io.to(roomId).emit('dequeued', username);
      continue;
    }

    await jsonArrAppendAsync(
      userKey,
      `playlist["${selectedPlaylist}"]["queue"]`,
      nextSong
    );
    song = JSON.parse(nextSong);
    // attach username to song to send to client later
    song.username = username;

    // update the queue on frontend to show whose song will be played next
    io.to(roomId).emit(
      'update_queue',
      await lrangeAsync(getQueueKey(roomId), 0, -1)
    );

    break;
  }

  return song;
}

export {
  getQueueKey,
  deleteQueue,
  isInQueue,
  addToQueue,
  getQueue,
  removeFromQueue,
  getNextSong,
  skipSong,
  timers,
};