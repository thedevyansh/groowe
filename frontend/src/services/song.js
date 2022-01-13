import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://temporaldj.herokuapp.com',
});

export const search = async search => {
  return await instance.get('/api/song/search', { params: { search } });
};
