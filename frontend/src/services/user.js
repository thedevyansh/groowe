import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

export const auth = () => {
  return instance.get('/api/auth');
};

export const login = request => {
  return instance.post('/api/auth/login', request);
};

export const register = request => {
  return instance.post('/api/auth/register', request);
};

export const logout = () => {
  return instance.post('/api/auth/logout');
};

export const update = request => {
  return instance.put('/api/auth/update', request);
};
