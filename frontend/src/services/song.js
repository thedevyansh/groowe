import axios from 'axios';

export const search = async search => {
  return await axios.get('/api/song/search', { params: { search } });
};
