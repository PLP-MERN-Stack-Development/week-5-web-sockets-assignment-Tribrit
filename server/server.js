require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const socketConfig = require('./config/socketConfig');
const chatController = require('./controllers/chatController');

const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Configure Socket.IO
const io = socketIO(server, socketConfig);

// Initialize chat controller
chatController(io);

// Basic route
app.get('/', (req, res) => {
  res.send('Chat Server is running');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});