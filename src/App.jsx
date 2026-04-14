import { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeSentiment = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setResult("");

    try {
      // ОБРАТИТЕ ВНИМАНИЕ: порт изменен на 8080
      const response = await fetch("http://localhost:8080/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (response.ok && data[0]) {
        const { label, score } = data[0][0];
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
      setResult("Error: Backend server is not responding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "550px", margin: "auto", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h1 style={{ color: "#2c3e50" }}>AI Sentiment Analysis</h1>
      <p>Analyze the emotion of your English text via secure backend.</p>
      
      <textarea
        rows="5"
        style={{ width: "100%", padding: "12px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ddd" }}
        placeholder="How are you feeling today? (in English)"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button 
        onClick={analyzeSentiment} 
        disabled={loading}
        style={{ 
          marginTop: "15px", 
          padding: "12px 25px", 
          fontSize: "16px", 
          cursor: loading ? "default" : "pointer",
          backgroundColor: loading ? "#bdc3c7" : "#3498db",
          color: "white",
          border: "none",
          borderRadius: "5px",
          width: "100%"
        }}
      >
        {loading ? "Processing AI logic..." : "Analyze Mood"}
      </button>

      {result && (
        <div style={{ 
          marginTop: "25px", 
          padding: "20px", 
          borderRadius: "8px", 
          backgroundColor: "#f1f2f6",
          borderLeft: "6px solid #3498db"
        }}>
          <strong style={{ display: "block", marginBottom: "5px" }}>Analysis Result:</strong>
          <span style={{ fontSize: "18px" }}>{result}</span>
        </div>
      )}
    </div>
  );
}

export default App;