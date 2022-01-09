import io from '../socketio_server.js';
import {
  addToQueue,
  removeFromQueue,
  getNextSong,
  timers as queueTimers,
} from '../models/queue.js';
import { setSong, getRoomById } from '../models/room.js';
import socketsRoom from './room.js';

const { getConnectedRoomId } = socketsRoom;

const QUEUE_BUFFER_MS = 2000;
const SYNC_INTERVAL_MS = 2000;

const playQueueReqs = new Set();

async function startPlayingQueue(roomId) {
  // do not let this function run multiple times at once for the same room
  if (playQueueReqs.has(roomId)) {
    return;
  }

  playQueueReqs.add(roomId);

  if (queueTimers.has(roomId)) {
    clearTimeout(queueTimers.get(roomId).syncTimer);
  }

  const song = await getNextSong(roomId);

  if (song === null) {
    // no one is in queue, stop
    io.to(roomId).emit('stop_song');
    await setSong(roomId, null);

    queueTimers.delete(roomId);
    playQueueReqs.delete(roomId);
    return;
  }

  const startTime = Date.now();

  // set song in room
  await setSong(roomId, song);

  io.to(roomId).emit('play_song', song);

  const queueTimer = setTimeout(async () => {
    await startPlayingQueue(roomId);
  }, song.duration + QUEUE_BUFFER_MS);

  const syncTimer = setInterval(async () => {
    // take difference for current duration
    io.to(roomId).emit('sync_song', { seekTime: Date.now() - startTime });
  }, SYNC_INTERVAL_MS);

  queueTimers.set(roomId, { queueTimer, syncTimer });
  playQueueReqs.delete(roomId);
}

function onNewSocketConnection(socket) {
  const req = socket.request;

  socket.on('join_queue', async () => {
    if (req.isUnauthenticated()) {
      return;
    }

    const { user } = req;
    const roomId = await getConnectedRoomId(socket.id);

    // user not connected to room
    if (!roomId) {
      return;
    }

    const room = await getRoomById(roomId);

    if (!room) {
      return;
    }

    const position = await addToQueue(roomId, user);
    const userFragment = {
      username: user.username,
      profilePicture: user.profilePicture,
    };

    io.to(roomId).emit('user_join_queue', position, userFragment);

    if (room.currentSong == null && position === 0) {
      // play the user's song since it's the first in queue
      await startPlayingQueue(roomId);
    }
  });

  socket.on('leave_queue', async () => {
    if (req.isUnauthenticated()) {
      return;
    }

    const roomId = await getConnectedRoomId(socket.id);

    // user not connected to room
    if (!roomId) {
      return;
    }

    io.to(roomId).emit('user_leave_queue', req.user.username);
    await removeFromQueue(roomId, req.user);
  });
}

export { onNewSocketConnection, startPlayingQueue };
