import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';
import { promisify } from 'util';
import redisClient from './redis_client.js';

const usersPrefix = 'user:';
const jsonGetAsync = promisify(redisClient.json_get).bind(redisClient);
const existsAsync = promisify(redisClient.exists).bind(redisClient);

const LocalStrategy = passportLocal.Strategy;

const getUserKey = username => usersPrefix + username;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, done) => {
      if (username.length < 3 || username.length > 16) {
        return done(null, false);
      }

      if (password.length < 6 || password.length > 64) {
        return done(null, false);
      }

      // Check whether the username only contains word characters
      // (A-Z, a-z, 0-9, _)
      if (!/^\w+$/.test(username)) {
        return done(null, false);
      }

      try {
        const userExists = await existsAsync(getUserKey(username));

        if (!userExists) {
          return done(null, false);
        }

        const user = JSON.parse(await jsonGetAsync(getUserKey(username), '.'));
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          return done(null, false);
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Session for authenticated user
passport.serializeUser((user, done) => {
  return done(null, user.username);
});

passport.deserializeUser(async (username, done) => {
  try {
    const user = await jsonGetAsync(getUserKey(username));
    return done(null, JSON.parse(user));
  } catch (err) {
    done(err);
  }
});
