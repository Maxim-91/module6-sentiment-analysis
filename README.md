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
Create a table in your Pukki database using pgAdmin or any SQL client:
```sql
CREATE TABLE sentiment_results (
    id SERIAL PRIMARY KEY,
    input_text TEXT NOT NULL,
    sentiment_label VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Local Development (Docker)
1. Clone the repository to your local machine.
2. Create a `.env` file inside the `/server` folder and fill in your credentials (see Environment Variables table above).
3. Run the entire stack using Docker Compose from the root directory:
```bash
docker-compose up --build
```

4. Once the containers are running:
   * Access the **Frontend UI** at: `http://localhost:5173`
   * Access the **Backend API** at: `http://localhost:8080`

### 3. Production Access
* **Frontend UI:** [https://sentiment-analysis-ai-sentiment-analysis2.2.rahtiapp.fi](https://sentiment-analysis-ai-sentiment-analysis2.2.rahtiapp.fi)
* **API Results (JSON):** [https://sentiment-analysis-backend-ai-sentiment-analysis2.2.rahtiapp.fi/api/results?api_key=pukki-2026](https://sentiment-analysis-backend-ai-sentiment-analysis2.2.rahtiapp.fi/api/results?api_key=pukki-2026)

---

## 📂 Project Structure
* `/frontend` — React frontend logic and UI components built with Vite.
* `/server` — Node.js backend handling API routing, AI inference proxy, and DB connection.
* `docker-compose.yml` — Orchestration for local development and multi-container testing.
* `/server/Dockerfile` — Instructions for containerizing the services for deployment on CSC Rahti.

---

## ⚠️ Security Note
**Never commit your `.env` file to GitHub.** The repository is pre-configured with a `.gitignore` file to prevent this. When deploying to **CSC Rahti (OpenShift)**, ensure all sensitive data (DB passwords, API tokens) is injected via the **Environment Variables** section in the deployment configuration dashboard.

