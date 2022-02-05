import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

export const get = params => {
  return instance.get('/api/rooms', { params });
};

export const update = (roomId, request) => {
  return instance.put(`/api/rooms/update/${roomId}`, request);
};
