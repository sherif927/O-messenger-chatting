//Importing Application Configuration
require('./config/config');

//Library Imports
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const HashMap = require('hashmap');
const mongoose = require('../db/mongoose');

//Util Imports
const { generateMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');

//Model Imports
const Conversation = require('../models/conversation');
const Message = require('../models/message');

//Application Config & Initialization
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var map = new HashMap();


io.on('connection', (socket) => {
  socket.on('join', async (params, callback) => {
    if (!isRealString(params.conversationId)) {
      return callback('Missing Values');
    }

    socket.join(params.conversationId);
    //map.remove(socket.id);
    try {
      var conversation = await Conversation.findOne({ _id: new ObjectID(params.conversationId) });
      console.log(conversation);
      console.log('---------------------------------');
      map.set(socket.id, conversation);
      console.log(map.get(socket.id));
      callback();
      
    } catch (err) {
      callback(err);
    }


  });

  socket.on('createMessage', (message, callback) => {
    if (isRealString(message.payload)) {
      var msg = generateMessage(message);
      /* var mMsg=new Message(msg);
      var conv= map.get(socket.id);
      conv.messages.push(mMsg);
      await conv.save(); */
      io.to(convId).emit('newMessage', msg);
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
