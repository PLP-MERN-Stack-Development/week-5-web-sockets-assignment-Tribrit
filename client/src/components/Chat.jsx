import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import socket from '../socket';

const Chat = ({ username, room }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Join chat room
    socket.emit('join', { username, room }, (error) => {
      if (error) {
        alert(error);
        window.location.reload();
      }
    });

    // Set up event listeners
    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('typing', (username) => {
      setTypingUsers((prev) => {
        if (!prev.includes(username)) {
          return [...prev, username];
        }
        return prev;
      });

      setTimeout(() => {
        setTypingUsers((prev) => prev.filter((user) => user !== username));
      }, 3000);
    });

    // Clean up on unmount
    return () => {
      socket.off('message');
      socket.off('typing');
    };
  }, [username, room]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('chatMessage', message, (error) => {
        if (error) {
          alert(error);
          return;
        }
        setMessage('');
      });
    }
  };

  const handleTyping = () => {
    socket.emit('typing');
  };

  return (
    <ChatContainer>
      <Messages>
        {messages.map((msg, i) => (
          <Message key={i}>
            <MessageHeader>
              <strong>{msg.username}</strong>
              <small>{msg.time}</small>
            </MessageHeader>
            <MessageText>{msg.text}</MessageText>
          </Message>
        ))}
        <div ref={messagesEndRef} />
      </Messages>
      {typingUsers.length > 0 && (
        <TypingIndicator>
          {typingUsers.join(', ')} {typingUsers.length > 1 ? 'are' : 'is'} typing...
        </TypingIndicator>
      )}
      <MessageForm onSubmit={sendMessage}>
        <Input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
        />
        <Button type="submit">Send</Button>
      </MessageForm>
    </ChatContainer>
  );
};

// Styled components
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Messages = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f9f9f9;
`;

const Message = styled.div`
  margin-bottom: 15px;
  padding: 10px;
  background: white;
  border-radius: 5px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 14px;

  small {
    color: #888;
  }
`;

const MessageText = styled.div`
  font-size: 16px;
`;

const TypingIndicator = styled.div`
  padding: 10px 20px;
  font-style: italic;
  color: #888;
`;

const MessageForm = styled.form`
  display: flex;
  padding: 15px;
  border-top: 1px solid #eee;
  background: white;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  margin-left: 10px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;

export default Chat;