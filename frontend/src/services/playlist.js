import axios from 'axios';

export const create = request => {
  return axios.post('/api/playlist/create', request);
};

export const addSong = (playlistId, request) => {
  return axios.put(`/api/playlist/add/${playlistId}`, request);
};

export const removeSong = (playlistId, request) => {
  return axios.delete(`/api/playlist/remove/${playlistId}`, { data: request });
};

export const deletePlaylist = playlistId => {
  return axios.delete(`/api/playlist/delete/${playlistId}`);
};

export const update = (playlistId, request) => {
  return axios.put(`/api/playlist/update/${playlistId}`, { playlist: request });
};

export const get = playlistId => {
  return axios.get(`/api/playlist/get/${playlistId}`);
};

export const select = playlistId => {
  return axios.post(`/api/playlist/select/${playlistId}`);
};

export const list = () => {
  return axios.get(`/api/playlist/list`);
};
