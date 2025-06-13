import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './styles.css';

const socket = io('http://localhost:5000');

function App() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    socket.on('receiveMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('receiveMessage');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      socket.emit('join', username);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('sendMessage', message);
      setMessage('');
    }
  };

  if (!isConnected) {
    return (
      <div className="join-container">
        <form onSubmit={handleJoin}>
          <h1>Join Chat</h1>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <button type="submit">Join</button>
        </form>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className="message">
            <strong>{msg.user}: </strong>
            {msg.text}
            <small>{new Date(msg.time).toLocaleTimeString()}</small>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;