import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import pg from 'pg';
// Import AWS SDK for S3 integration (Allas storage)
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Enable CORS for cross-origin requests from your frontend
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());

// --- Database Configuration ---
// Database connection configuration using PostgreSQL Pool
const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // SSL is required for secure cloud database connections (e.g., CSC Pukki)
  ssl: { rejectUnauthorized: false }
});

// Test database connection on startup
pool.connect((err, client, release) => {
  if (err) {
    return console.error('ERROR: Database connection failed:', err.stack);
  }
  console.log('SUCCESS: Connected to PostgreSQL database');
  release();
});

// --- S3 / Allas Storage Configuration ---
// Initialize S3 client for CSC Allas object storage
const s3Client = new S3Client({
  endpoint: "https://a3s.fi",
  region: "helsinki",
  credentials: {
    accessKeyId: process.env.ALLAS_ACCESS_KEY,
    secretAccessKey: process.env.ALLAS_SECRET_KEY,
  },
});

const HF_MODEL = "https://api-inference.huggingface.co/models/lxyuan/distilbert-base-multilingual-cased-sentiments-student";

// --- Endpoint: Analyze text and save result to Database ---
app.post("/api/analyze", async (req, res) => {
  try {
    const { text } = req.body;

    // Basic validation to ensure text is provided
    if (!text) {
      console.warn("WARNING: Analysis attempted with empty text");
      return res.status(400).json({ error: "Text is required for analysis" });
    }

    console.log(`INFO: Analyzing text: "${text.substring(0, 50)}..."`);

    // Request to Hugging Face Inference API
    const hfResponse = await fetch(HF_MODEL, {
      headers: { 
        // IMPORTANT: Use backticks for template literals to inject the token correctly
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ inputs: text }),
    });

    // Handle case where the AI model is still loading in the cloud
    if (hfResponse.status === 503) {
      console.warn("INFO: Hugging Face model is currently loading (503)");
      return res.status(503).json({ error: "AI Model is loading, please try again in a few seconds" });
    }

    // Capture the raw response to debug non-JSON outputs
    const rawData = await hfResponse.text();
    
    let data;
    try {
      data = JSON.parse(rawData);
    } catch (e) {
      console.error("ERROR: Failed to parse Hugging Face response as JSON. Raw output:", rawData);
      return res.status(500).json({ error: "AI Model sent an invalid (non-JSON) response" });
    }

    // Check if the API request was successful and contains expected data structure
    if (hfResponse.ok && data[0] && data[0][0]) {
      const { label, score } = data[0][0];
      console.log(`INFO: Analysis successful. Label: ${label}, Score: ${score}`);

      // DATABASE INSERTION: Using parameterized queries ($1, $2) to prevent SQL Injection
      const queryText = "INSERT INTO sentiment_results (input_text, sentiment_label) VALUES ($1, $2)";
      try {
        await pool.query(queryText, [text, label]);
        console.log("SUCCESS: Result saved to database");
        res.json(data);
      } catch (dbError) {
        console.error("ERROR: Failed to save result to Database:", dbError.message);
        res.status(500).json({ error: "Analysis succeeded but saving to DB failed", details: data });
      }
    } else {
      console.error("ERROR: Hugging Face API returned an error:", data.error || "Unknown error");
      res.status(hfResponse.status || 500).json({ error: data.error || "AI Model error" });
    }
  } catch (error) {
    console.error("CRITICAL ERROR in /api/analyze:", error);
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
});

// --- Endpoint: Fetch all results (Protected by Teacher API Key) ---
app.get("/api/results", async (req, res) => {
  const { api_key } = req.query;

  // Security check: Compare provided key with the one in environment variables
  if (!api_key || api_key !== process.env.TEACHER_API_KEY) {
    console.warn(`WARNING: Unauthorized access attempt with API Key: ${api_key}`);
    return res.status(403).json({ error: "Forbidden: Invalid or missing API Key" });
  }

  try {
    const result = await pool.query("SELECT * FROM sentiment_results ORDER BY created_at DESC");
    console.log(`INFO: Fetched ${result.rows.length} results from database`);
    res.json(result.rows);
  } catch (err) {
    console.error("ERROR: Database fetch failed:", err.message);
    res.status(500).json({ error: "Could not retrieve data from database" });
  }
});

// --- Endpoint: Generate a presigned URL for downloading files from Allas ---
app.get('/api/download/:key', async (req, res) => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.ALLAS_BUCKET_NAME,
      Key: req.params.key, // File name example: "Module 6 - Learning Diary - Maksym.pdf"
    });

    // Generate a signed URL that expires in 15 minutes (900 seconds)
    const url = await getSignedUrl(s3Client, command, { expiresIn: 900 });
    
    console.log(`INFO: Generated download link for file: ${req.params.key}`);
    // Return the signed URL to the frontend
    res.json({ url });
  } catch (err) {
    console.error("ERROR: Failed to generate signed URL:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Start the server on the port provided by environment or default to 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
