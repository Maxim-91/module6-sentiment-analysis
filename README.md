# 🤖 AI Sentiment Analysis App

A modern full-stack web application that uses Artificial Intelligence to analyze the emotional tone of text. The app categorizes input into **Positive**, **Neutral**, or **Negative** sentiments with a confidence score.

The project follows a secure architecture: **User** ↔️ **Frontend (React)** ↔️ **Backend (Node.js)** ↔️ **AI API (Hugging Face)**.

## 🚀 Key Features
* **Multilingual Support:** Powered by a DistilBERT multilingual model, supporting 60+ languages including English and Russian.
* **Secure Architecture:** API keys are stored on the server side in a `.env` file, keeping them hidden from the browser.
* **Three-Way Classification:** Unlike basic models, this app accurately identifies neutral context in addition to positive and negative.

## 🧠 The AI Model
This project utilizes a state-of-the-art transformer model:
**[lxyuan/distilbert-base-multilingual-cased-sentiments-student](https://huggingface.co/lxyuan/distilbert-base-multilingual-cased-sentiments-student)**

## 🛠 Tech Stack
* **Frontend:** React (Vite)
* **Backend:** Node.js, Express, CORS
* **API:** Hugging Face Inference API
* **Styling:** Custom CSS with modern UI/UX principles

---

## ⚙️ Setup and Installation

### 1. Get Your API Token
1.  Create a free account at [Hugging Face](https://huggingface.co/).
2.  Go to **Settings -> Access Tokens**.
3.  Generate a new **Read** token and copy it.

### 2. Configure the Backend
1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `server` folder:
    ```env
    HF_TOKEN=your_hugging_face_token_here
    PORT=8080
    ```
4.  Start the server:
    ```bash
    node index.js
    ```

### 3. Configure the Frontend
1.  Open a new terminal in the project root.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Launch the app:
    ```bash
    npm run dev
    ```
4.  Open your browser at `http://localhost:5173` (or the port shown in your terminal).

---

## 📂 Project Structure
* `/src` — React frontend logic and UI components.
* `/server` — Express backend serving as a secure proxy to the AI model.
* `.gitignore` — Configured to exclude `node_modules` and sensitive `.env` files.

---

## ⚠️ Security Note
**Never commit your `.env` file to GitHub.** The repository is pre-configured with a `.gitignore` file to prevent this. When deploying to production (e.g., Render, Vercel, or Heroku), remember to add your `HF_TOKEN` as an Environment Variable in the hosting provider's dashboard.
