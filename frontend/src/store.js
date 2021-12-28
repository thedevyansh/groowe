import { configureStore } from '@reduxjs/toolkit';
import userReducer from 'slices/userSlice';
import roomsReducer from 'slices/roomsSlice';
import currentRoomReducer from 'slices/currentRoomSlice';
import queueReducer from 'slices/queueSlice';
import youtubeReducer from 'slices/youtubeSlice';
import playlistsReducer from 'slices/playlistsSlice';
import voteReducer from 'slices/voteSlice';
import songSearchReducer from 'slices/songSearchSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    rooms: roomsReducer,
    currentRoom: currentRoomReducer,
    queue: queueReducer,
    youtube: youtubeReducer,
    playlists: playlistsReducer,
    vote: voteReducer,
    songSearch: songSearchReducer,
  },
});
