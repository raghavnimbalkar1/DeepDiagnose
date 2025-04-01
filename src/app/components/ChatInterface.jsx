"use client";
import { useState } from 'react';
import styles from './ChatInterface.module.css';

export default function ChatInterface({ reportContext, chatHistory, setChatHistory }) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Function to render text with bold formatting
  const renderWithBold = (text) => {
    const parts = text.split('**');
    return parts.map((part, index) => {
      return index % 2 === 1 ? (
        <span key={index} className={styles.boldText}>
          {part}
        </span>
      ) : (
        part
      );
    });
  };

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;
    
    setIsLoading(true);
    const userMessage = { role: 'user', content: message };
    setChatHistory([...chatHistory, userMessage]);
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message,
          context: reportContext 
        }),
      });

      if (!res.ok) throw new Error('Failed to get response');
      
      const data = await res.json();
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: data.response 
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error: ' + error.message 
      }]);
    } finally {
      setIsLoading(false);
      setMessage('');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Report Analysis Assistant</h3>
      </div>
      
      <div className={styles.messages}>
        {chatHistory.length > 0 ? (
          chatHistory.map((msg, i) => (
            <div 
              key={i} 
              className={`${styles.message} ${
                msg.role === 'user' ? styles.userMessage : styles.aiMessage
              }`}
            >
              <div className={styles.role}>
                {msg.role === 'user' ? 'You' : 'Doctor AI'}
              </div>
              <div className={styles.text}>
                {msg.content.split('\n').map((paragraph, idx) => (
                  <p key={idx}>{renderWithBold(paragraph)}</p>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.welcomeMessage}>
            <p>Ask me anything about this medical report.</p>
            <p>I can explain findings, suggest next steps, or clarify terminology.</p>
          </div>
        )}
      </div>
        
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Example: What does the elevated CRP level mean?"
          className={styles.input}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !message.trim()}
          className={styles.button}
        >
          {isLoading ? (
            <span className={styles.spinner}></span>
          ) : (
            <span>Send</span>
          )}
        </button>
      </div>
    </div>
  );
}