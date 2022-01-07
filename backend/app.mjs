import express from 'express';
import helmet from 'helmet';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import passport from 'passport';
import session from 'express-session';
import connectRedis from 'connect-redis';

import { authRouter } from './routes/auth.js';

import redisClient from './redis_client.js';
import config from './config.js';
import './passport_setup.js';
import io from './socketio_server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ['*', "'unsafe-inline'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          'https://www.youtube.com',
        ],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: [
          '*',
          "'unsafe-inline'",
          'http://tinygraphs.com',
          'https://avatars.dicebear.com',
          'https://www.youtube.com',
        ],
        frameSrc: ["'self'", "'unsafe-inline'", 'https://www.youtube.com'],
      },
    },
    referrerPolicy: {
      policy: ['origin', 'unsafe-url'],
    },
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));

const RedisStore = connectRedis(session);
const sessionMiddleware = session({
  store: new RedisStore({ client: redisClient }),
  secret: config.sessionSecret,
  name: 'sessionId',
  resave: false,
  saveUninitialized: false,
});

app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

// convert a connect middleware to a Socket.IO middleware
const wrap = middleware => (socket, next) =>
  middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

app.use('/api/auth', authRouter);

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log(err);

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

app.get('*', function (req, res, next) {
  res.sendFile(join(__dirname, 'public') + '/index.html');
});

export default app;
