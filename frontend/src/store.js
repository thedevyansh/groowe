import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import roomsReducer from './slices/roomsSlice';
import currentRoomReducer from './slices/currentRoomSlice';
import playlistsReducer from './slices/playlistsSlice';
import queueReducer from './slices/queueSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    rooms: roomsReducer,
    currentRoom: currentRoomReducer,
    playlists: playlistsReducer,
    queue: queueReducer,
  },
});
