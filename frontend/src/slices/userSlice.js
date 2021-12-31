import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as userApi from '../services/user';
import { populate } from './playlistsSlice';

const initialState = {
  username: '',
  profilePicture: '',
  authenticated: false,
  status: 'idle',
};

export const authenticate = createAsyncThunk(
  'user/auth',
  async (_, thunkAPI) => {
    const response = await userApi.auth();
    thunkAPI.dispatch(
      populate({
        playlists: response.data.playlist,
        selectedPlaylist: response.data.selectedPlaylist,
      })
    );
    return response.data;
  }
);

export const login = createAsyncThunk('user/login', async request => {
  const response = await userApi.login(request);
  return response.data;
});

export const register = createAsyncThunk('user/register', async request => {
  const response = await userApi.register(request);
  return response.data;
});

export const logout = createAsyncThunk('user/logout', async () => {
  const response = await userApi.logout();
  return response.data;
});

export const update = createAsyncThunk('user/update', async request => {
  const response = await userApi.update(request);
  return response.data;
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: {
    [authenticate.pending]: state => {
      state.state = 'loading';
    },
    [authenticate.fulfilled]: (state, { payload }) => {
      state.status = 'success';
      state.authenticated = true;
      state.username = payload.username;
      state.profilePicture = payload.profilePicture;
    },
    [authenticate.rejected]: state => {
      state.status = 'failed';
    },
    [logout.fulfilled]: state => {
      state.status = 'failed';
      state.authenticated = false;
      state.username = '';
      state.profilePicture = '';
    },
  },
});

export default userSlice.reducer;
