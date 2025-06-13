import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import socket from '../socket';

const UserList = ({ room, username }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on('roomUsers', ({ users }) => {
      setUsers(users);
    });

    return () => {
      socket.off('roomUsers');
    };
  }, [room]);

  return (
    <div>
      <RoomTitle>{room}</RoomTitle>
      <UserTitle>Users ({users.length})</UserTitle>
      <UsersList>
        {users.map((user, i) => (
          <UserItem key={i} current={user === username}>
            {user}
          </UserItem>
        ))}
      </UsersList>
    </div>
  );
};

// Styled components
const RoomTitle = styled.h2`
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const UserTitle = styled.h3`
  margin-bottom: 10px;
  font-size: 16px;
`;

const UsersList = styled.ul`
  list-style: none;
  padding: 0;
`;

const UserItem = styled.li`
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-weight: ${(props) => (props.current ? 'bold' : 'normal')};
  color: ${(props) => (props.current ? '#4CAF50' : 'inherit')};
`;

export default UserList;