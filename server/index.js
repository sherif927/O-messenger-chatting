//Library Imports
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const HashMap = require('hashmap');

//Util Imports
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');

//Application Config & Initialization
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var map = new HashMap();


io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.');
    }

    socket.join(params.room);
    map.remove(socket.id);
    map.set(socket.id, params.conversation)

    callback();
  });

  socket.on('createMessage', (message, callback) => {
    var conv = map.get(socket.id);

    if (isRealString(message.text)) {
      io.to(conv._id).emit('newMessage', generateMessage(message.senderName, message.text));
    }
    callback();
  });

  socket.on('disconnect', () => {
    map.remove(socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
