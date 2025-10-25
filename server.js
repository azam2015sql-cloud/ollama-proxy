const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.post('/generate', async (req, res) => {
  const { model, prompt } = req.body;
  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model,
      prompt
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Proxy running on port 3000'));
