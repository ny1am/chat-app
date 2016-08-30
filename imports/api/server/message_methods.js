import { Meteor } from 'meteor/meteor';

// API
import { Chats } from '/imports/api/chats.js';
import { Messages } from '/imports/api/messages.js';

Meteor.methods({
  newMessage(message) {
    check(message, {
      text: String,
      chatId: String,
      type: String,
    });

    message.timestamp = new Date();

    const messageId = Messages.insert(message);
    Chats.update(message.chatId, { $set: { lastMessage: message } });

    return messageId;
  }
});