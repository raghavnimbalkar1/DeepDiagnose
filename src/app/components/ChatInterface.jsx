"use client";
import { useState } from 'react';
import styles from './ChatInterface.module.css';

export default function ChatInterface({ reportContext, chatHistory, setChatHistory }) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatHistory(prev => [...prev, { role: 'assistant', content: 'Error: ' + error.message }]);
    } finally {
      setIsLoading(false);
      setMessage('');
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <h3>Ask About This Report</h3>
      </div>
      
      <div className={styles.chatContent}>
        <div className={styles.messagesContainer}>
          {chatHistory.map((msg, i) => (
            <div 
              key={i} 
              className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.aiMessage}`}
            >
              <p className={styles.messageRole}>{msg.role === 'user' ? 'You:' : 'Doctor AI:'}</p>
              <p className={styles.messageText}>{msg.content}</p>
            </div>
          ))}
        </div>
        
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about any findings..."
            className={styles.messageInput}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !message.trim()}
            className={`${styles.sendButton} ${(isLoading || !message.trim()) ? styles.disabledButton : ''}`}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}