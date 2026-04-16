import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import pg from 'pg';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Налаштування підключення (Pool дозволяє тримати кілька з'єднань відкритими)
const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false } // Обов'язково для хмари CSC Pukki
});

const HF_MODEL = "https://api-inference.huggingface.co/models/lxyuan/distilbert-base-multilingual-cased-sentiments-student";

// --- Ендпоінт для аналізу та збереження ---
app.post("/api/analyze", async (req, res) => {
  try {
    const { text } = req.body;

    const hfResponse = await fetch(HF_MODEL, {
      headers: { Authorization: 'Bearer ${process.env.HF_TOKEN}' },
      method: "POST",
      body: JSON.stringify({ inputs: text }),
    });

    const data = await hfResponse.json();

    if (hfResponse.ok && data[0]) {
      const { label, score } = data[0][0];

      // ЗБЕРЕЖЕННЯ В БД: Використовуємо $1 та $2 для безпеки (параметризація)
      const queryText = "INSERT INTO sentiment_results (input_text, sentiment_label) VALUES ($1, $2)";
      await pool.query(queryText, [text, label]);

      res.json(data);
    } else {
      res.status(500).json({ error: "AI Model error" });
    }
  } catch (error) {
    console.error("DB or Server Error:", error);
    res.status(500).json({ error: "Server internal error" });
  }
});

// --- Ендпоінт для вчителя (GET /api/results) ---
app.get("/api/results", async (req, res) => {
  const { api_key } = req.query;

  // Перевірка API ключа з вашого .env
  if (!api_key || api_key !== process.env.TEACHER_API_KEY) {
    return res.status(403).json({ error: "Forbidden: Invalid API Key" });
  }

  try {
    const result = await pool.query("SELECT * FROM sentiment_results ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Database fetch error" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Server running on http://localhost:${PORT}'));
