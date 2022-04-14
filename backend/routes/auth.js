import express from 'express';
import passport from 'passport';
import redisClient from '../redis_client.js';
import { promisify } from 'util';
import bcrypt from 'bcrypt';
import 'dotenv/config.js';

const router = express.Router();

const usersPrefix = 'user:';

const jsonSetAsync = promisify(redisClient.json_set).bind(redisClient);
const existsAsync = promisify(redisClient.exists).bind(redisClient);

const getUserKey = username => usersPrefix + username;

const redirect_uri =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://temporaldj.netlify.app';

router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user;
    delete user.password;
    return res.status(200).json(user);
  }

  res.status(401).send();
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.status(200).send();
});

router.post('/logout', (req, res) => {
  req.logout();
  res.status(200).json();
});

router.post('/register', async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username.length < 3 || username.length > 16) {
    return res.status(400).send();
  }

  if (password.length < 6 || password.length > 64) {
    return res.status(400).send();
  }

  if (!/^\w+$/.test(username)) {
    return res.status(400).send();
  }

  const userExists = await existsAsync(getUserKey(username));
  if (userExists) {
    return res.status(401).send();
  }

  const passwordHash = await bcrypt.hash(
    password,
    parseInt(process.env.SALT_ROUNDS)
  );
  const user = {
    username: username,
    password: passwordHash,
    profilePicture: `https://avatars.dicebear.com/api/human/${username}.svg?width=64&height=64`,
    playlist: {},
  };

  await jsonSetAsync(getUserKey(username), '.', JSON.stringify(user));

  // Login after registration
  req.login(user, err => {
    if (err) {
      return next(err);
    }
  });

  res.status(200).send();
});

router.put('/update', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send();
  }

  const profilePicture = req.body.profilePicture;

  if (
    profilePicture.match(
      /^http[^?]*.(jpg|jpeg|gif|png|tiff|bmp|webp|svg)(\?(.*))?$/gim
    ) == null
  ) {
    return res.status(400).send();
  }

  const updatedUser = {
    username: req.user.username,
    password: req.user.password,
    profilePicture: profilePicture,
    playlist: req.user.playlist,
    selectedPlaylist: req.user.selectedPlaylist,
  };

  await jsonSetAsync(
    getUserKey(req.user.username),
    '.',
    JSON.stringify(updatedUser)
  );

  res.status(200).send();
});

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${redirect_uri}/login`,
  }),
  (req, res) => {
    res.redirect(redirect_uri);
  }
);

export { router as authRouter, getUserKey };
