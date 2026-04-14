import { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");

  const analyzeSentiment = () => {
    const sentiments = ["Positive 😊", "Negative 😞", "Neutral 😐"];
    const random = sentiments[Math.floor(Math.random() * sentiments.length)];
    setResult(random);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h1>Sentiment Analysis</h1>

      <textarea
        rows="4"
        style={{ width: "100%" }}
        placeholder="Enter text..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={analyzeSentiment} style={{ marginTop: "10px" }}>
        Analyze
      </button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <strong>Result:</strong> {result}
        </div>
      )}
    </div>
  );
}

export default App;
