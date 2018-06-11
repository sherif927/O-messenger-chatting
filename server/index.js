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
const { ObjectID } = require('mongodb');

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
  socket.on('join', async (params) => {
    console.log(`Incoming parameters is ${params}`);
    console.log(`Socket Identifier ${socket.id}`)
    socket.join(params);
    //map.remove(socket.id);
    try {
      var conversation = await Conversation.findOne({ _id: new ObjectID(params) });
      map.set(socket.id, conversation);      
    } catch (err) {
      console.log(err);
    }
  });

  socket.on('createMessage', async (message) => {
      var conv= map.get(socket.id);
      var msg = generateMessage(message);
      var conv= map.get(socket.id);
      conv.messages.push(msg);
      try{
        await conv.save();
      }catch(e){
        console.log(`error ${e}`);
      }
      
      io.to(conv._id).emit('newMessage', JSON.stringify(msg));
  });

  socket.on('disconnect', () => {
    map.remove(socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
