import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as songApi from '../services/song';

const initialState = {
  results: [],
  query: '',
  status: 'idle',
};

export const search = createAsyncThunk('songSearch/search', async request => {
  const response = await songApi.search(request);
  return { query: request, videos: response?.data?.videos ?? [] };
});

export const songSearchSlice = createSlice({
  name: 'songSearch',
  initialState,
  reducers: {
    clearSearch: state => {
      state.results = [];
      state.query = '';
      state.status = 'idle';
    },
  },
  extraReducers: {
    [search.pending]: state => {
      state.status = 'loading';
    },
    [search.fulfilled]: (state, { payload }) => {
      state.results = payload.videos;
      state.query = payload.query;
      state.status = 'success';
    },
    [search.rejected]: state => {
      state.status = 'failed';
    },
  },
});

export const { clearSearch } = songSearchSlice.actions;

export default songSearchSlice.reducer;
