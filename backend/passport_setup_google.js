import passport from 'passport';
import passportGoogle from 'passport-google-oauth20';
import 'dotenv/config.js';
import bcrypt from 'bcrypt';
import { promisify } from 'util';
import redisClient from './redis_client.js';

const usersPrefix = 'user:';
const jsonGetAsync = promisify(redisClient.json_get).bind(redisClient);
const jsonSetAsync = promisify(redisClient.json_set).bind(redisClient);
const existsAsync = promisify(redisClient.exists).bind(redisClient);
const getUserKey = username => usersPrefix + username;

const GoogleStrategy = passportGoogle.Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async function (accessToken, refreshToken, profile, done) {
      const profileId = profile.id;
      const username =
        profile.name.givenName + profileId.substring(profileId.length - 5);
      const password = profile.id;
      const pfp = profile.photos[0].value;

      try {
        const userExists = await existsAsync(getUserKey(username));

        if (!userExists) {
          const passwordHash = await bcrypt.hash(
            password,
            parseInt(process.env.SALT_ROUNDS)
          );

          const user = {
            username: username,
            password: passwordHash,
            profilePicture: pfp,
            playlist: {},
          };

          await jsonSetAsync(getUserKey(username), '.', JSON.stringify(user));
          return done(null, user);
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
  return done(null, user);
});

passport.deserializeUser(async (username, done) => {
  try {
    const user = await jsonGetAsync(getUserKey(username));
    return done(null, JSON.parse(user));
  } catch (err) {
    done(err);
  }
});
