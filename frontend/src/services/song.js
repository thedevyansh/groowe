import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

export const search = async search => {
  return await instance.get('/api/song/search', { params: { search } });
};
