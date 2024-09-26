const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// To serve static files
app.use(express.static(path.join(__dirname, 'public')));

// To track the number of connections
let userCount = 0;

io.on('connection', (socket) => {
    userCount++;
    console.log('New user connected. Total users:', userCount);

    // Send updated user count to all users
    io.emit('userCount', userCount);

    socket.on('chat', (data) => {
        io.emit('chat', data);
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
    });

    socket.on('disconnect', () => {
        userCount--;
        console.log('User disconnected. Total users:', userCount);
        io.emit('userCount', userCount);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

