import { io } from 'socket.io-client';

const URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

const socket = io(URL, {
  autoConnect: false,
  withCredentials: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000
});

export default socket;