const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('../config');

// Simple aggregator: calls Pexels / Pixabay / Unsplash (if keys provided) and returns combined list.
router.get('/search', async (req, res) => {
  const q = req.query.query || req.query.q || '';
  if(!q) return res.json({ results: [] });
  let results = [];
  try{
    // Pexels
    if(config.PEXELS_API_KEY){
      const pr = await axios.get('https://api.pexels.com/videos/search', {
        params:{ query: q, per_page: 8 },
        headers:{ Authorization: config.PEXELS_API_KEY }
      });
      const items = (pr.data.videos||[]).map(v=>({
        id: 'pexels-'+v.id,
        source: 'pexels',
        thumbnail: v.image,
        url: v.video_files && v.video_files[0] && v.video_files[0].link
      }));
      results = results.concat(items);
    }
    // Pixabay
    if(config.PIXABAY_API_KEY){
      const pr = await axios.get('https://pixabay.com/api/videos/', { params:{ key: config.PIXABAY_API_KEY, q, per_page:8 }});
      const items = (pr.data.hits||[]).map(v=>({
        id: 'pixabay-'+v.id,
        source: 'pixabay',
        thumbnail: v.tiny_thumb || v.userImageURL,
        url: v.videos && v.videos.medium && v.videos.medium.url
      }));
      results = results.concat(items);
    }
    // Unsplash (images)
    if(config.UNSPLASH_ACCESS_KEY){
      const ur = await axios.get('https://api.unsplash.com/search/photos', { params:{ query: q, per_page: 8 }, headers:{ Authorization: `Client-ID ${config.UNSPLASH_ACCESS_KEY}` }});
      const items = (ur.data.results||[]).map((p)=>({
        id: 'unsplash-'+p.id,
        source: 'unsplash',
        thumbnail: p.urls.small,
        url: p.urls.full
      }));
      results = results.concat(items);
    }
    // Note: Freepik optional module is not included here; add it if you have API access.

    res.json({ results });
  }catch(e){
    console.error(e.message || e);
    res.status(500).json({ error: 'media error' });
  }
});

module.exports = router;
