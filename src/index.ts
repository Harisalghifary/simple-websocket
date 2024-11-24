import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Initialize Express app and HTTP server
const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Allow all origins for development
  },
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join a channel
  socket.on('join-channel', (channel) => {
    console.log(`${socket.id} joined channel: ${channel}`);
    socket.join(channel);
  });

  // Handle incoming messages
  socket.on('chat-message', ({ channel, message }) => {
    console.log(`Message in ${channel} from ${socket.id}: ${message}`);
    // Broadcast the message only to the users in the same channel
    io.to(channel).emit('chat-message', { message, sender: socket.id });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Run the server
const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
