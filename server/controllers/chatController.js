const User = require('../models/User');
const { formatMessage } = require('../utils/helpers');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);

    // When user joins
    socket.on('join', async ({ username, room }, callback) => {
      try {
        const { user, error } = await User.join(socket.id, username, room);
        
        if (error) return callback(error);
        
        socket.join(user.room);
        
        // Welcome current user
        socket.emit('message', formatMessage('System', `Welcome to ${user.room}!`));
        
        // Broadcast when a user connects
        socket.broadcast.to(user.room).emit(
          'message',
          formatMessage('System', `${user.username} has joined the chat`)
        );
        
        // Send users and room info
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: await User.getRoomUsers(user.room)
        });
        
        callback();
      } catch (err) {
        callback('Server error');
      }
    });

    // Listen for chatMessage
    socket.on('chatMessage', async (msg, callback) => {
      try {
        const user = await User.getUser(socket.id);
        
        if (!user) return callback('User not found');
        
        io.to(user.room).emit('message', formatMessage(user.username, msg));
        callback();
      } catch (err) {
        callback('Server error');
      }
    });

    // Typing indicator
    socket.on('typing', async () => {
      const user = await User.getUser(socket.id);
      if (user) {
        socket.broadcast.to(user.room).emit('typing', user.username);
      }
    });

    // When client disconnects
    socket.on('disconnect', async () => {
      try {
        const user = await User.leave(socket.id);
        
        if (user) {
          io.to(user.room).emit(
            'message',
            formatMessage('System', `${user.username} has left the chat`)
          );
          
          // Send updated users list
          io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: await User.getRoomUsers(user.room)
          });
        }
      } catch (err) {
        console.error('Disconnect error:', err);
      }
    });
  });
};