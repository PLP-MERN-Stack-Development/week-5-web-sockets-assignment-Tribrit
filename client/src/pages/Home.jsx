import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import JoinForm from '../components/JoinForm';
import Chat from '../components/Chat';
import UserList from '../components/UserList';

const Home = () => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('general');
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = (e) => {
    e.preventDefault();
    if (!username.trim() || !room.trim()) {
      setError('Please enter a username and room');
      return;
    }
    setJoined(true);
    setError('');
  };

  return (
    <Container>
      {!joined ? (
        <JoinForm
          username={username}
          room={room}
          setUsername={setUsername}
          setRoom={setRoom}
          handleJoin={handleJoin}
          error={error}
        />
      ) : (
        <ChatContainer>
          <Sidebar>
            <UserList room={room} username={username} />
          </Sidebar>
          <MainChat>
            <Chat username={username} room={room} />
          </MainChat>
        </ChatContainer>
      )}
    </Container>
  );
};

// Styled components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const ChatContainer = styled.div`
  display: flex;
  width: 90%;
  max-width: 1200px;
  height: 80vh;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  overflow-y: auto;
`;

const MainChat = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export default Home;