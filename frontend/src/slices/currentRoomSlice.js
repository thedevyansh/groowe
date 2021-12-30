import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {
    id: null,
    name: null,
    description: null,
    privateRoom: null,
    genres: [],
    host: {
      username: null,
      profilePicture: null,
    },
    numMembers: 0,
    members: null,
    currentSong: null,
    messages: [],
  },
  // needed to replay the same song twice, we increment this when a new song plays and attach it to currentSong
  currentSongNumber: 0,
  status: 'idle',
  isGuest: null,
};

export const currentRoomSlice = createSlice({
  name: 'currentRoom',
  initialState: initialState,
  reducers: {
    createRoom: (state, { payload }) => {
      const {
        id,
        name,
        description,
        privateRoom,
        genres,
        host,
        numMembers,
        members,
        currentSong,
      } = payload.room;

      state.data.id = id;
      state.data.name = name;
      state.data.description = description;
      state.data.privateRoom = privateRoom;
      state.data.genres = genres;
      state.data.host = host;
      state.data.numMembers = parseInt(numMembers);
      state.data.members = members;
      state.data.currentSong = currentSong;
      state.status = 'success';
      state.isGuest = false;
    },
    joinRoom: (state, { payload }) => {
      if (payload.success) {
        const {
          id,
          name,
          description,
          privateRoom,
          genres,
          host,
          numMembers,
          members,
          currentSong,
          messages,
        } = payload.room;

        state.data.id = id;
        state.data.name = name;
        state.data.description = description;
        state.data.privateRoom = privateRoom;
        state.data.genres = genres;
        state.data.host = host;
        state.data.numMembers = parseInt(numMembers);
        state.data.members = members;
        state.data.currentSong = currentSong;
        state.data.messages = messages ?? [];
        state.status = 'success';
        state.isGuest = payload.guest;
      } else {
        state.status = 'failed';
      }
    },
    playSong: (state, { payload }) => {
      const { song } = payload;

      state.data.currentSong = song;

      if (state.data?.currentSong) {
        state.data.currentSong.songNum = state.currentSongNumber++;
      }
    },
    leaveRoom: state => {
      state = Object.assign(state, initialState);
    },
    userJoinRoom: state => {
      state.data.numMembers += 1;
    },
    userLeaveRoom: state => {
      state.data.numMembers -= 1;
    },
  },
});

export const {
  createRoom,
  joinRoom,
  leaveRoom,
  playSong,
  userJoinRoom,
  userLeaveRoom,
} = currentRoomSlice.actions;

export default currentRoomSlice.reducer;
