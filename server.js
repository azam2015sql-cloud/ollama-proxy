const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// نقطة النهاية للتوليد
app.post('/generate', async (req, res) => {
  const { model, prompt } = req.body;
  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model,
      prompt
    }, { responseType: 'stream' });

    // إعادة تمرير الاستجابة كما هي
    response.data.pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Ollama proxy running on port ${PORT}`));
