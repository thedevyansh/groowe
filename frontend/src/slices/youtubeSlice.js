import { createSlice } from '@reduxjs/toolkit';
import { X_OFFSET, Y_OFFSET } from '../constants/youtube';
import calculateVolume from '../utils/calculateVolume';

const initialState = {
  boundingBox: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  volume: 0,
  videoId: null,
  status: 'unstarted',
  errorCode: null,
  isYouTubeApiReady: false,
};

export const youtubeSlice = createSlice({
  name: 'youtube',
  initialState,
  reducers: {
    updateBoundingBox: (state, { payload }) => {
      state.boundingBox = payload;
    },
    changeVolume: (state, { payload }) => {
      state.volume = payload;
    },
    changeVolumeOnMove: (state, { payload }) => {
      // calculateVolume computes the volume based on the position of client bubble
      // from the youtube embed
      const volume = calculateVolume(state.boundingBox, {
        x: payload.x + X_OFFSET,
        y: payload.y + Y_OFFSET,
      });
      state.volume = volume;
    },
    muteVideo: state => {
      state.volume = 0;
    },
    playSong: state => {
      state.status = 'playing';
      state.errorCode = null;
    },
    stopSong: state => {
      state.status = 'stopped';
    },
    endSong: state => {
      state.status = 'ended';
    },
    changeVideoId: (state, { payload }) => {
      state.videoId = payload;
    },
    reportError: (state, { payload }) => {
      state.errorCode = payload;
    },
    clearError: state => {
      state.errorCode = null;
    },
    reset: state => {
      const { isYouTubeApiReady } = state;
      state = Object.assign(state, initialState);
      state.isYouTubeApiReady = isYouTubeApiReady;
    },
    youtubeApiReady: state => {
      state.isYouTubeApiReady = true;
    },
  },
});

export const {
  updateBoundingBox,
  changeVolume,
  changeVolumeOnMove,
  muteVideo,
  playSong,
  stopSong,
  endSong,
  changeVideoId,
  reportError,
  clearError,
  reset,
  youtubeApiReady,
} = youtubeSlice.actions;

export default youtubeSlice.reducer;
