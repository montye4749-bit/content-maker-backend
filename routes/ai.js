const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai');
const config = require('../config');

const configuration = new Configuration({ apiKey: config.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

router.post('/analyze', async (req, res) => {
  const { text } = req.body;
  if(!text) return res.status(400).json({ error: 'text required' });
  try{
    const prompt = `Extract 8 short keywords or short phrases (comma separated) from the following script. Keep them concise:\n\n${text}\n\nKeywords:`; 
    const r = await openai.createCompletion({ model: 'text-davinci-003', prompt, max_tokens: 60 });
    const out = r.data.choices[0].text || '';
    const keywords = out.split(/[\n,]+/).map(s=>s.trim()).filter(Boolean).slice(0,8);
    res.json({ keywords });
  }catch(e){
    console.error(e.response ? e.response.data : e.message);
    res.status(500).json({ error: 'AI error' });
  }
});

module.exports = router;
