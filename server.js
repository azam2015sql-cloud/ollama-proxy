// server.js (fixed)
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// ضع هنا عنوان Ollama الحقيقي الذي تريد إعادة توجيه الطلبات إليه.
// لو Ollama يعمل على نفس الخادم على البورت 11434 فضع:
// const OLLAMA_TARGET = 'http://localhost:11434/api/generate';
// لو تريد أن توجه إلى مكان آخر ضع الرابط الصحيح في المتغير ENV OLLAMA_URL
const OLLAMA_TARGET = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';

app.post('/generate', async (req, res) => {
  try {
    // تمرير نفس الجسم الذي استقبلناه إلى خدمة Ollama
    const response = await axios.post(OLLAMA_TARGET, req.body, {
      responseType: 'stream',
      timeout: 120000, // وقت كافٍ للردود الطويلة
      headers: {
        // إن احتجت تضع header معين هنا، أضفه. عادة Content-Type يضبطه axios تلقائياً.
      },
    });

    // إعادة تمرير الاستجابة كسيريف (stream) إلى العميل
    response.data.pipe(res);
  } catch (err) {
    console.error('Proxy error:', err.message);
    // لو كان هناك رد من الخادم الخلفي احصل على الـ status و data إن وجد
    if (err.response) {
      res.status(err.response.status).send(err.response.data);
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Ollama proxy running on port ${PORT}`));
