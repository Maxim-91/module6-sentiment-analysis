import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(cors()); // Позволяет фронтенду делать запросы к бэкенду
app.use(express.json());

const HF_MODEL = "https://api-inference.huggingface.co/models/lxyuan/distilbert-base-multilingual-cased-sentiments-student";

app.post('/api/analyze', async (req, res) => {
  try {
    const { text } = req.body;

    const response = await fetch(HF_MODEL, {
      headers: { 
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ inputs: text }),
    });

    const data = await response.json();

    if (response.ok) {
      res.json(data);
    } else {
      res.status(response.status).json({ error: "Model is starting up, please wait..." });
    }
  } catch (error) {
    res.status(500).json({ error: "Server internal error" });
  }
});

// Используем порт 8080 из .env
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server is running on http://localhost:${PORT}`));