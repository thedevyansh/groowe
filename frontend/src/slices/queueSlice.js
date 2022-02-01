import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  queue: [],
  currentSong: null,
  inQueue: false,
  status: 'idle',
};

export const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    populate: (state, { payload }) => {
      if (payload.success) {
        const { queue, currentSong, inQueue } = payload;
        state.queue = queue;
        state.currentSong = currentSong ?? null;
        state.inQueue = inQueue;
        state.status = 'success';
      } else {
        state.status = 'failed';
      }
    },
    // Handles client join/leave queue
    joinQueue: (state, { payload }) => {
      state.inQueue = true;
      state.queue.push(payload);
    },
    leaveQueue: (state, { payload }) => {
      state.inQueue = false;
      state.queue = state.queue.filter(username => username !== payload);
    },
    // Handles other users join/leave queue
    enqueue: (state, { payload }) => {
      state.queue.push(payload);
    },
    dequeue: (state, { payload }) => {
      state.queue = state.queue.filter(username => username !== payload);
    },
    updateQueue: (state, { payload }) => {
      state.queue = payload;
    },
    changeCurrentSong: (state, { payload }) => {
      state.currentSong = payload;
    },
    reset: state => {
      state = Object.assign(state, initialState);
    },
  },
});

export const {
  populate,
  joinQueue,
  leaveQueue,
  enqueue,
  dequeue,
  updateQueue,
  changeCurrentSong,
  reset,
} = queueSlice.actions;

export default queueSlice.reducer;