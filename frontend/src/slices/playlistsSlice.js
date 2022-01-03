import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  playlists: {},
  selectedPlaylist: null,
};

export const playlistsSlice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {
    populate: (state, { payload }) => {
      const { playlists, selectedPlaylist } = payload;

      state.playlists = playlists;
      state.selectedPlaylist = selectedPlaylist ?? null;
    },
    createPlaylist: (state, { payload }) => {
      const { playlist } = payload;

      state.playlists[playlist.id] = playlist;
    },
    updatePlaylist: (state, { payload }) => {
      const { playlist } = payload;

      state.playlists[playlist.id] = playlist;
    },
    deletePlaylist: (state, { payload }) => {
      const { playlistId } = payload;

      state.selectedPlaylist = null;
      delete state.playlists[playlistId];
    },
    selectPlaylist: (state, { payload }) => {
      const { playlistId } = payload;

      state.selectedPlaylist = playlistId;
    },
    cycleSelectedPlaylist: state => {
      const playlist = state.playlists[state.selectedPlaylist].queue;

      playlist.push(playlist.shift());
    },
    addSong: (state, { payload }) => {
      const { playlistId, song } = payload;

      state.playlists[playlistId].queue.push(song);
    },
    removeSong: (state, { payload }) => {
      const { songId, playlistId } = payload;
      const playlist = state.playlists[playlistId];
      const index = playlist.queue.findIndex(song => song.id === songId);

      playlist.queue.splice(index, 1);
    },
  },
});

export const {
  populate,
  updatePlaylist,
  createPlaylist,
  deletePlaylist,
  selectPlaylist,
  addSong,
  removeSong,
  cycleSelectedPlaylist,
} = playlistsSlice.actions;

export default playlistsSlice.reducer;
