import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import roomsReducer from './slices/roomsSlice';
import currentRoomReducer from './slices/currentRoomSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    rooms: roomsReducer,
    currentRoom: currentRoomReducer,
  },
});
