import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { promisify } from 'util';
import redisClient from '../redis_client.js';
import { getUserKey } from './auth.js';
import { getVideoDuration } from '../models/youtube.js';

const router = express.Router();

const jsonSetAsync = promisify(redisClient.json_set).bind(redisClient);
const jsonGetAsync = promisify(redisClient.json_get).bind(redisClient);
const jsonDelAsync = promisify(redisClient.json_del).bind(redisClient);
const jsonArrAppendAsync = promisify(redisClient.json_arrappend).bind(redisClient);
const jsonObjKeysAsync = promisify(redisClient.json_objkeys).bind(redisClient);

router.post('/create', async (req, res) => {
  if (req.isUnauthenticated()) {
    return res.status(401).json();
  }

  const name = req.body.name ?? 'New playlist';
  const playlistId = uuidv4();

  const playlist = {
    id: playlistId,
    name: name,
    user: req.user.username,
    queue: [],
  };

  try {
    await jsonSetAsync(
      getUserKey(req.user.username),
      `playlist["${playlistId}"]`,
      JSON.stringify(playlist)
    );
  } catch (error) {
    return res.status(400).json(error);
  }

  res.status(200).json({
    success: true,
    playlist: playlist,
  });
});

router.put('/add/:playlistId', async (req, res) => {
  if (req.isUnauthenticated()) {
    return res.status(401).json();
  }

  const playlistId = req.params.playlistId;
  const song = req.body.song;
  const username = req.user.username;
  const duration = await getVideoDuration(song.videoId);

  if (duration == null) {
    // invalid video id
    return res.status(400).json({ success: false });
  }

  song.id = uuidv4();
  song.duration = duration;

  try {
    await jsonArrAppendAsync(
      getUserKey(username),
      `playlist["${playlistId}"]["queue"]`,
      JSON.stringify(song)
    );
  } catch (error) {
    return res.status(400).json(error);
  }

  res.status(200).json({
    success: true,
    song: song,
  });
});

router.delete('/remove/:playlistId', async (req, res) => {
  if (req.isUnauthenticated()) {
    return res.status(401).json();
  }

  const playlistId = req.params.playlistId;
  const songId = req.body.id;
  const username = req.user.username;

  const songs = JSON.parse(
    await jsonGetAsync(
      getUserKey(username),
      `playlist["${playlistId}"]["queue"]`
    )
  );
  const songIndex = songs.findIndex(song => song.id === songId);
  const success = songIndex !== -1;

  if (success) {
    songs.splice(songIndex, 1);
  }

  try {
    await jsonSetAsync(
      getUserKey(username),
      `playlist["${playlistId}"]["queue"]`,
      JSON.stringify(songs)
    );
  } catch (error) {
    return res.status(400).json(error);
  }

  res.status(200).json({
    success: success,
  });
});

router.delete('/delete/:playlistId', async (req, res) => {
  if (req.isUnauthenticated()) {
    return res.status(401).json();
  }

  const playlistId = req.params.playlistId;
  const username = req.user.username;

  const success = await jsonDelAsync(
    getUserKey(username),
    `playlist["${playlistId}"]`
  );

  if (
    (await jsonGetAsync(getUserKey(username), '.selectedPlaylist')) ===
    playlistId
  ) {
    // deleted playlist is selected playlist
    await jsonSetAsync(getUserKey(username), '.selectedPlaylist', 'null');
  }

  res.status(200).json({
    success: Boolean(success),
  });
});

router.put('/update/:playlistId', async (req, res) => {
  if (req.isUnauthenticated()) {
    return res.status(401).json();
  }

  const playlistId = req.params.playlistId;
  const username = req.user.username;
  const playlist = req.body.playlist;

  const success = await jsonSetAsync(
    getUserKey(username),
    `playlist["${playlistId}"]`,
    JSON.stringify(playlist),
    'XX'
  );

  res.status(200).json({
    success: Boolean(success),
  });
});

router.get('/get/:playlistId', async (req, res) => {
  if (req.isUnauthenticated()) {
    return res.status(401).json();
  }

  const playlistId = req.params.playlistId;
  const username = req.user.username;

  try {
    const songs = await jsonGetAsync(
      getUserKey(username),
      `playlist["${playlistId}"]["queue"]`
    );

    res.status(200).json({
      success: true,
      playlist: {
        id: playlistId,
        songs: songs,
      },
    });
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.post('/select/:playlistId', async (req, res) => {
  if (req.isUnauthenticated()) {
    return res.status(401).json();
  }

  const playlistId = req.params.playlistId;
  const username = req.user.username;
  let success = false;

  try {
    const playlistKeys = await jsonObjKeysAsync(
      getUserKey(username),
      '.playlist'
    );

    if (playlistKeys.includes(playlistId)) {
      await jsonSetAsync(
        getUserKey(username),
        '.selectedPlaylist',
        JSON.stringify(playlistId)
      );
      success = true;
    }
  } catch (error) {
    return res.status(400).json(error);
  }

  res.status(200).json({
    success: success,
  });
});

router.get('/list', async (req, res) => {
  if (req.isUnauthenticated()) {
    return res.status(401).json();
  }

  const username = req.user.username;

  const playlist = JSON.parse(
    await jsonGetAsync(getUserKey(username), '.playlist')
  );

  res.status(200).json({
    playlist: Object.values(playlist),
  });
});

export { router as playlistRouter };
