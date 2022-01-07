import io from '../socketio_server.js';
import { getRoomById, getRoomKey } from '../models/room.js';
import redisClient from '../redis_client.js';
import socketsRoom from './room.js';
import { promisify } from 'util';
import { skipSong } from '../models/queue.js';
import { startPlayingQueue } from './room_queue.js';

const { getConnectedRoomId } = socketsRoom;
const hsetAsync = promisify(redisClient.hset).bind(redisClient);

const voteType = {
  LIKE: 'like',
  DISLIKE: 'dislike',
  NONE: 'none',
};

function onNewSocketConnection(socket) {
  const req = socket.request;

  socket.on('vote', async type => {
    if (req.isUnauthenticated()) {
      return;
    }

    const { user } = req;
    const roomId = await getConnectedRoomId(socket.id);

    // user not connected to room
    if (!roomId) {
      return;
    }

    // invalid vote type
    if (
      type !== voteType.LIKE &&
      type !== voteType.DISLIKE &&
      type !== voteType.NONE
    ) {
      return;
    }

    const room = await getRoomById(roomId);

    if (!room) {
      return;
    }

    if (!room.votes) {
      return;
    }

    if (room.votes[user.username] === type) {
      // vote type is same as before, remove user's vote
      delete room.votes[user.username];
    } else if (type === voteType.NONE) {
      delete room.votes[user.username];
    } else if (type === voteType.DISLIKE) {
      room.votes[user.username] = type;

      const numMembers = room.numMembers;
      const numDislikes = Object.keys(room.votes).filter(
        username => room.votes[username] === voteType.DISLIKE
      ).length;

      // If dislikes >= 50% of the people in the room, skip song
      if (numDislikes >= Math.ceil(numMembers / 2)) {
        skipSong(roomId);
        await startPlayingQueue(roomId);
        return;
      }
    } else {
      room.votes[user.username] = type;
    }

    io.to(roomId).emit('user_vote', room.votes);
    await hsetAsync(getRoomKey(roomId), 'json', JSON.stringify(room));
  });
}

export default { onNewSocketConnection };
