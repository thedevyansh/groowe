import io from '../socketio_server.js';
import { nanoid } from 'nanoid';
import { promisify } from 'util';
import redisClient from '../redis_client.js';
import {
  getQueueKey,
  removeFromQueue,
  getQueue,
  deleteQueue,
} from '../models/queue.js';
import {
  getRoomKey,
  isRoomValid,
  addUserToRoom,
  removeUserFromRoom,
  getRoomById,
  getMessageRange,
} from '../models/room.js';

const hsetAsync = promisify(redisClient.hset).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);
const lrangeAsync = promisify(redisClient.lrange).bind(redisClient);

const socketPrefix = 'socket:';

function getSocketKey(socketId) {
  return socketPrefix + socketId;
}

async function getConnectedRoomId(socketId) {
  return await getAsync(getSocketKey(socketId));
}

function onJoin(user, roomId, position) {
  io.to(roomId).emit('user_join', {
    user: {
      username: user.username,
      profilePicture: user.profilePicture,
    },
    position,
  });
}

function onLeave(user, roomId) {
  io.to(roomId).emit('user_leave', user.username);
}

async function onRoomClose(roomId) {
  io.to(roomId).emit('room_closed');
  await deleteQueue(roomId);

  const sockets = await io.to(roomId).fetchSockets();

  sockets.forEach(function (socket) {
    socket.leave(roomId);
  });
}

function onRoomChange(roomId) {
  return async (room, isRoomOpen, newHost, userLeft) => {
    if (!isRoomOpen) {
      return await onRoomClose(roomId);
    }

    if (userLeft) {
      onLeave(userLeft, roomId);

      console.log('user left');
      await removeFromQueue(roomId, userLeft);

      // update the queue on frontend to reflect the user is no longer in queue if he has left the room
      io.to(roomId).emit(
        'update_queue',
        await lrangeAsync(getQueueKey(roomId), 0, -1)
      );
    }

    if (newHost) {
      io.to(roomId).emit('new_host', newHost);
    }
  };
}

function getRandomScaledNum() {
  return Math.round(Math.random() * 100) / 100;
}

function onNewSocketConnection(socket) {
  const req = socket.request;

  socket.on('create_room', async (data, ackcb) => {
    if (req.isUnauthenticated()) {
      console.log('FAIL create_room', 'Unauthorized user');
      return ackcb({ success: false });
    }

    const id = nanoid(10);

    const { name, description, private: privateRoom, genres } = data;

    const host = {
      username: req.user.username,
      profilePicture: req.user.profilePicture,
    };
    const numMembers = '1';
    const members = {};
    const queue = [];
    const currentSong = null;

    // generate random position in range [0, 0.5)
    members[req.user.username] = {
      joined: 1,
      username: req.user.username,
      profilePicture: req.user.profilePicture,
      position: {
        x: getRandomScaledNum() / 2,
        y: getRandomScaledNum() / 2,
      },
    };

    const room = {
      id,
      name,
      description,
      privateRoom: privateRoom,
      genres,
      host,
      numMembers,
      members,
      queue,
      currentSong,
    };

    await hsetAsync(
      getRoomKey(id),
      'id', id,
      'name', name,
      'description', description,
      'private', privateRoom,
      'genres', genres.join(),
      'numMembers', numMembers,
      'json', JSON.stringify(room)
    );

    socket.join(id);
    await setAsync(getSocketKey(socket.id), id);

    console.log(`create_room: ${room.id}`, req.user.username);

    ackcb({ success: true, room });
  });

  socket.on('join_room', async (roomId, ackcb) => {
    if (!(await isRoomValid(roomId))) {
      return ackcb({ success: false });
    }

    const connectedRoomId = await getConnectedRoomId(socket.id);

    // probably the host joining the room after creation, do not do anything
    if (connectedRoomId) {
      const room = await getRoomById(connectedRoomId);
      room.queue = await getQueue(roomId);
      return ackcb({ success: true, guest: false, room: room });
    }

    await setAsync(getSocketKey(socket.id), roomId);

    socket.join(roomId);

    if (req.isUnauthenticated()) {
      const room = await getRoomById(roomId);
      room.queue = await getQueue(roomId);
      return ackcb({ success: true, guest: true, room: room });
    }

    const updatedRoom = await addUserToRoom(req.user, roomId, onJoin);
    console.log(`join_room: ${roomId}`, req.user.username);

    updatedRoom.queue = await getQueue(roomId);
    updatedRoom.messages = await getMessageRange(0, -1, roomId);

    ackcb({ success: true, guest: false, room: updatedRoom });
  });

  socket.on('pos_change', async position => {
    if (req.isUnauthenticated()) {
      return;
    }

    const roomId = await getConnectedRoomId(socket.id);

    if (!roomId) {
      return;
    }

    const room = await getRoomById(roomId);
    const { members } = room;
    const { user } = req;

    // user not in room
    if (!Object.prototype.hasOwnProperty.call(members, user.username)) {
      return;
    }

    room.members[user.username].position = position;
    await hsetAsync(getRoomKey(room.id), 'json', JSON.stringify(room));

    io.to(room.id).emit('pos_change', user.username, position);
  });

  socket.on('leave_room', async () => {
    const roomId = await getConnectedRoomId(socket.id);

    // never joined room
    if (!roomId) {
      console.log('FAIL leave_room', 'Invalid roomId');
      return;
    }

    socket.leave(roomId);

    await delAsync(getSocketKey(socket.id));
    await removeUserFromRoom(req.user, roomId, onRoomChange(roomId));

    console.log(
      `leave_room: ${roomId}`,
      req?.user?.username ?? 'Unauthorized user'
    );
  });

  socket.on('disconnecting', async () => {
    const roomId = await getConnectedRoomId(socket.id);

    if (!roomId) {
      console.log('FAIL disconnecting', 'Invalid roomId');
      return;
    }

    await delAsync(getSocketKey(socket.id));
    await removeUserFromRoom(req.user, roomId, onRoomChange(roomId));
    console.log(
      `disconnecting: ${roomId}`,
      req?.user?.username ?? 'Unauthorized user'
    );
  });
}

export default { onNewSocketConnection, getConnectedRoomId };
