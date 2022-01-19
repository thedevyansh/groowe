import { createContext } from 'react';
import io from 'socket.io-client';
const SOCKET_URL = 'https://temporaldj.herokuapp.com';

export const socket = io(SOCKET_URL, {
  withCredentials: true,
});

export const SocketContext = createContext();
