import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as roomsApi from '../services/rooms';

const initialState = {
  data: [],
  searchQuery: '*',
  limit: 10,
  skip: 0,
  filters: [],
  status: 'idle',
  getMoreStatus: 'idle',
  hasMore: true,
};

export const get = createAsyncThunk('rooms/get', async (params, thunkAPI) => {
  // If params didn't include a searchQuery, add current searchQuery to it
  if (params.searchQuery === undefined) {
    const searchQuery = thunkAPI.getState().rooms.searchQuery;
    params.searchQuery = searchQuery;
  }
  const response = await roomsApi.get(params);
  return response.data;
});

// infinite scroll
export const getMore = createAsyncThunk('rooms/getMore', async params => {
  const response = await roomsApi.get(params);
  return response.data;
});

export const update = createAsyncThunk(
  'rooms/update',
  async (roomId, request) => {
    const response = await roomsApi.update(roomId, request);
    return response.data;
  }
);

export const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: {
    [get.pending]: state => {
      state.status = 'loading';
    },
    [get.fulfilled]: (state, { payload, meta }) => {
      state.status = 'success';
      state.data = payload;
      state.searchQuery = meta.arg.searchQuery;
      state.limit = meta.arg.limit;
      state.skip = meta.arg.skip;
      state.filters = meta.arg.filters;
    },
    [get.rejected]: state => {
      state.status = 'failed';
    },
    [getMore.pending]: state => {
      state.getMoreStatus = 'loading';
    },
    [getMore.fulfilled]: (state, { payload, meta }) => {
      state.getMoreStatus = 'success';
      state.data.push(...payload);
      state.searchQuery = meta.arg.searchQuery;
      state.limit = meta.arg.limit;
      state.skip = meta.arg.skip;
      state.filters = meta.arg.filters;
      // if results returned is < limit, there are no more rooms
      state.hasMore = payload.length !== 0 && payload.length === state.limit;
    },
    [getMore.rejected]: state => {
      state.getMoreStatus = 'failed';
    },
    [update.pending]: state => {
      state.status = 'loading';
    },
    [update.fulfilled]: state => {
      state.status = 'success';
    },
    [update.rejected]: state => {
      state.status = 'failed';
    },
  },
});

export const { reset } = roomsSlice.actions;

export default roomsSlice.reducer;
