const express = require('express');
const socket = require('socket.io');

const app = express();
const server = app.listen(3000);
const io = socket(server);
app.use(express.static('public'));

io.on('connection', (socket) => {
    socket.on('chat', (data) => {
        io.sockets.emit('chat', data);
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
    });
});

