const { ObjectID } = require('mongodb');
const MessageSchema = require('../../models/message');

var generateMessage = (message) => {
  console.log(`Incoming message object is ${messageObject}`);
  var messageObject=JSON.parse(message);
  console.log('-----------------------');
  var msg= {
    senderId: new ObjectID(messageObject.senderId),
    senderName: messageObject.senderName,
    type: messageObject.type,
    payload: messageObject.payload,
    conversationId: new ObjectID(messageObject.conversationId),
    sentAt: new Date()
  };
  console.log(`Generated message is ${JSON.stringify(msg,undefined,2)}`);
  return msg;
};

module.exports = { generateMessage };
