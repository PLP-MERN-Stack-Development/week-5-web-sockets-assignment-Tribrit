import React from 'react';
import styled from 'styled-components';

const JoinForm = ({ username, room, setUsername, setRoom, handleJoin, error }) => {
  return (
    <FormContainer onSubmit={handleJoin}>
      <h1>Join Chat</h1>
      {error && <ErrorText>{error}</ErrorText>}
      <Input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Select value={room} onChange={(e) => setRoom(e.target.value)}>
        <option value="general">General</option>
        <option value="random">Random</option>
        <option value="help">Help</option>
      </Select>
      <Button type="submit">Join Chat</Button>
    </FormContainer>
  );
};

// Styled components
const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 300px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;

const ErrorText = styled.p`
  color: #f44336;
  margin: 0;
  font-size: 14px;
`;

export default JoinForm;