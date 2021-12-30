import axios from 'axios';

export const get = params => {
  return axios.get('/api/rooms', { params });
};

export const update = (roomId, request) => {
  return axios.put(`/api/rooms/update/${roomId}`, request);
};
