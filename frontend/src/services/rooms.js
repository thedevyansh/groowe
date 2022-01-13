import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://temporaldj.herokuapp.com',
});

export const get = params => {
  return instance.get('/api/rooms', { params });
};

export const update = (roomId, request) => {
  return instance.put(`/api/rooms/update/${roomId}`, request);
};
