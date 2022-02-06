import axios from 'axios';

const instance = axios.create({
  baseURL:
    !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
      ? 'http://localhost:5000'
      : ['https://temporaldj.netlify.app', 'https://temporaldj.tech'],
  withCredentials: true,
});

export const search = async search => {
  return await instance.get('/api/song/search', { params: { search } });
};
