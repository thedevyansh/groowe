import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import roomsReducer from './slices/roomsSlice';
import currentRoomReducer from './slices/currentRoomSlice';
import playlistsReducer from './slices/playlistsSlice';
import queueReducer from './slices/queueSlice';
import voteReducer from './slices/voteSlice';
import songSearchReducer from './slices/songSearchSlice';
import youtubeReducer from './slices/youtubeSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    rooms: roomsReducer,
    currentRoom: currentRoomReducer,
    playlists: playlistsReducer,
    queue: queueReducer,
    vote: voteReducer,
    songSearch: songSearchReducer,
    youtube: youtubeReducer,
  },
});
