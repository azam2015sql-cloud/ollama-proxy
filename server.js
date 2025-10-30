const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// قراءة عنوان Ollama من متغير البيئة أو استخدام localhost كافتراضي
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';

// نقطة النهاية للتوليد
app.post('/generate', async (req, res) => {
  const { model, prompt } = req.body;

  try {
    const response = await axios.post(
      `${OLLAMA_HOST}/api/generate`,
      { model, prompt },
      { responseType: 'stream' } // تمرير الاستجابة كسلسلة (stream)
    );

    // إعادة تمرير الاستجابة مباشرة للعميل
    response.data.pipe(res);
  } catch (err) {
  console.error('Error connecting to Ollama:', err.response?.status, err.response?.data || err.message);
  res.status(500).json({ error: 'Failed to connect to Ollama service', details: err.message });
}

});

// تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Ollama proxy running on port ${PORT}`);
  console.log(`Forwarding requests to: ${OLLAMA_HOST}`);
});
