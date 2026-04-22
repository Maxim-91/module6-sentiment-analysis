import { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Define the base URL for the backend server
  const API_BASE_URL = "https://backend-sentiment-analysis-ai-sentiment-analysis.2.rahtiapp.fi";
  //const API_BASE_URL = "http://localhost:8080";

  // --- Sends text to the backend for AI sentiment analysis ---
  const analyzeSentiment = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setResult("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (response.ok && data[0]) {
        // Extract label and score from the Hugging Face response structure
        const { label, score } = data[0][0];
        
        // Map API labels to user-friendly emojis
        const sentimentMap = {
          "positive": "Positive 😊",
          "neutral": "Neutral 😐",
          "negative": "Negative 😞"
        };
        
        setResult(`${sentimentMap[label] || label} (Accuracy: ${(score * 100).toFixed(1)}%)`);
      } else {
        setResult("Status: " + (data.error || "Check server logs"));
      }
    } catch (error) {
      console.error("Analysis error:", error);
      setResult("Error: Backend server is not responding");
    } finally {
      setLoading(false);
    }
  };

// --- Requests a presigned S3 URL from the backend and triggers the download ---
  const downloadFile = async () => {
    try {
      // The filename must match the key stored in your Allas bucket
      const fileName = "Module 6 - Learning Diary - Maksym.pdf";
      const response = await fetch(`${API_BASE_URL}/api/download/${encodeURIComponent(fileName)}`);
      const data = await response.json();
      
      if (data.url) {
        // Redirect the user to the temporary signed S3 URL to start the download
        window.location.href = data.url;
      } else {
        alert("Download failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("Error: Could not reach the server for download.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "block", padding: "40px", maxWidth: "550px", margin: "0", textAlign: "left", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h1 style={{ color: "#3498db", marginTop: "0" }}>AI Sentiment Analysis</h1>
      <p>Emotion analysis by lxyuan/distilbert-base-multilingual-cased-sentiments-student</p>
      
      {/* Input area for user text */}
      <textarea
        rows="5"
        style={{ width: "100%", padding: "12px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ddd" }}
        placeholder="How are you feeling today? (in English)"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* Button to trigger AI analysis */}
      <button 
        onClick={analyzeSentiment} 
        disabled={loading}
        style={{ 
          marginTop: "15px", 
          padding: "12px 25px", 
          fontSize: "16px", 
          cursor: loading ? "default" : "pointer",
          backgroundColor: loading ? "#95a5a6" : "#3498db",
          color: "white",
          border: "none",
          borderRadius: "5px",
          width: "100%"
        }}
      >
        {loading ? "Processing AI logic..." : "Analyze Mood"}
      </button>

      {/* Button to download the learning diary from Allas S3 */}
      <button 
        onClick={downloadFile}
        style={{ 
          marginTop: "10px", 
          padding: "10px 25px", 
          fontSize: "14px", 
          cursor: "pointer",
          backgroundColor: "#2ecc71",
          color: "white",
          border: "none",
          borderRadius: "5px",
          width: "100%"
        }}
      >
        Download Learning Diary (PDF)
      </button>

      {/* Display result section if available */}
      {result && (
        <div style={{ 
          marginTop: "25px", 
          padding: "20px", 
          borderRadius: "8px", 
          backgroundColor: "#f8f9fa",
          border: "1px solid #eee",
          color: "#333"
        }}>
          <strong style={{ display: "block", marginBottom: "5px" }}>Analysis Result:</strong>
          <span style={{ fontSize: "18px" }}>{result}</span>
        </div>
      )}
    </div>
  );
}

export default App;
