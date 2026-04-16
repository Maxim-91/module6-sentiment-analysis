# 🤖 AI Sentiment Analysis App (Full-Stack)

A modern full-stack web application that uses Artificial Intelligence to analyze the emotional tone of text. The application categorizes inputs into **Positive**, **Neutral**, or **Negative** sentiments and securely stores every result in a cloud database.

The project follows a secure production architecture: 
**User** ↔️ **Frontend (React/Vite)** ↔️ **Backend (Node.js)** ↔️ **Database (PostgreSQL Pukki)** & **AI API (Hugging Face)**.

## 🚀 Key Features
* **Data Persistence:** Automatically saves every analysis (text, label, and timestamp) to a **CSC Pukki (PostgreSQL)** database.
* **Teacher Access Endpoint:** Includes a secured `GET /api/results` endpoint protected by an API key for data verification.
* **Multilingual AI:** Powered by a DistilBERT model, supporting 60+ languages.
* **Cloud Native:** Fully containerized with Docker and deployed on **CSC Rahti**.
* **Secure Architecture:** Sensitive credentials (DB passwords, API tokens) are managed via environment variables, never exposed to the frontend.

## 🛠 Tech Stack
* **Frontend:** React 19, Vite, Axios
* **Backend:** Node.js, Express, node-fetch
* **Database:** PostgreSQL (CSC Pukki DBaaS)
* **Infrastructure:** Docker, Docker Compose, CSC Rahti (OpenShift)
* **AI Model:** [distilbert-base-multilingual-cased-sentiments-student](https://huggingface.co/lxyuan/distilbert-base-multilingual-cased-sentiments-student)

---

## ⚙️ Environment Variables

To run this project, you need to configure the following variables in your `.env` file (for local dev) or Rahti Dashboard (for production):

| Variable | Description |
|----------|-------------|
| `DB_HOST` | Hostname of your Pukki PostgreSQL instance |
| `DB_USER` | Database username |
| `DB_PASSWORD` | Database password |
| `DB_NAME` | Database name |
| `HF_TOKEN` | Hugging Face Access Token (Read) |
| `TEACHER_API_KEY` | Custom string to protect the `/api/results` endpoint |
| `PORT` | Server port (default: 8080) |

---

## 🚀 Setup and Installation

### 1. Database Setup
1. Create a table in your Pukki database using pgAdmin or any SQL client:
```sql
CREATE TABLE sentiment_results (
    id SERIAL PRIMARY KEY,
    input_text TEXT NOT NULL,
    sentiment_label VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
