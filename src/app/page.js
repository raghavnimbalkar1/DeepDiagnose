"use client";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [message, setMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file!");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
  
      // Handle non-JSON responses (HTML errors)
      if (!res.ok) {
        const errorText = await res.text(); // Try reading error message
        throw new Error(errorText);
      }
  
      const data = await res.json(); // Convert response to JSON
  
      if (data.error) {
        alert("Error: " + data.error);
      } else {
        setAnalysis(data.analysis);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Something went wrong: " + error.message);
    }
  };
  
  const handleChat = async () => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    setChatResponse(data.response);
  };

  return (
    <div className="container">
      <h1>Medical Chatbot</h1>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload Report</button>

      <div className="output">
        <h2>Analysis</h2>
        <pre>{analysis}</pre>
      </div>

      <input
        type="text"
        placeholder="Ask anything..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleChat}>Send</button>

      <div className="chat-response">
        <h2>Response</h2>
        <p>{chatResponse}</p>
      </div>
    </div>
  );
}