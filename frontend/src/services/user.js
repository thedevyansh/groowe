import axios from 'axios';

export const auth = () => {
  return axios.get('/api/auth');
};

export const login = request => {
  return axios.post('/api/auth/login', request);
};

export const register = request => {
  return axios.post('/api/auth/register', request);
};

export const logout = () => {
  return axios.post('/api/auth/logout');
};

export const update = request => {
  return axios.put('/api/auth/update', request);
};
