const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body; // array of {role: 'user'|'assistant', content}
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
      }),
    });
    const data = await response.json();
    const assistantMessage = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message : { role: 'assistant', content: '' };
    res.json(assistantMessage);
  } catch (err) {
    console.error('LLM request error:', err);
    res.status(500).json({ error: 'LLM request failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`LLM proxy listening on http://localhost:${PORT}`));
