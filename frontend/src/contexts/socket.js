import { createContext } from 'react';
import io from 'socket.io-client';
const SOCKET_URL =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : ['https://temporaldj.netlify.app', 'https://temporaldj.tech'];

export const socket = io(SOCKET_URL, {
  withCredentials: true,
});

export const SocketContext = createContext();
