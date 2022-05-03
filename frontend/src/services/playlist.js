import axios from 'axios';

const instance = axios.create({
  baseURL:
    !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
      ? 'http://localhost:5000'
      : 'https://groowe.herokuapp.com',
  withCredentials: true,
});

export const create = request => {
  return instance.post('/api/playlist/create', request);
};

export const addSong = (playlistId, request) => {
  return instance.put(`/api/playlist/add/${playlistId}`, request);
};

export const removeSong = (playlistId, request) => {
  return instance.delete(`/api/playlist/remove/${playlistId}`, {
    data: request,
  });
};

export const deletePlaylist = playlistId => {
  return instance.delete(`/api/playlist/delete/${playlistId}`);
};

export const update = (playlistId, request) => {
  return instance.put(`/api/playlist/update/${playlistId}`, {
    playlist: request,
  });
};

export const get = playlistId => {
  return instance.get(`/api/playlist/get/${playlistId}`);
};

export const select = playlistId => {
  return instance.post(`/api/playlist/select/${playlistId}`);
};

export const list = () => {
  return instance.get(`/api/playlist/list`);
};
