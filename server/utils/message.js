const { ObjectID } = require('mongodb');

var generateMessage = (messageObject) => {
  return {
    senderId: new ObjectID(messageObject.senderId),
    senderName: messageObject.senderName,
    type: messageObject.type,
    payload: messageObject.payload,
    conversationId: new ObjectID(messageObject.conversationId),
    sentAt: new Date()
  };
};

module.exports = { generateMessage };
