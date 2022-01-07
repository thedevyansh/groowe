import express from 'express';
import { searchVideos } from '../models/youtube.js';

const router = express.Router();

router.get('/search', async (req, res) => {
  const query = req.query.search;
  const videos = await searchVideos(query);

  res.status(200).json({ success: true, videos });
});

export default router;
