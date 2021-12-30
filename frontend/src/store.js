import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import currentRoomReducer from './slices/currentRoomSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    currentRoom: currentRoomReducer,
  },
});
