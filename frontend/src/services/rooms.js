import axios from 'axios';

const instance = axios.create({
  baseURL:
    !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
      ? 'http://localhost:5000'
      : ['https://temporaldj.netlify.app', 'https://temporaldj.tech'],
  withCredentials: true,
});

export const get = params => {
  return instance.get('/api/rooms', { params });
};

export const update = (roomId, request) => {
  return instance.put(`/api/rooms/update/${roomId}`, request);
};
