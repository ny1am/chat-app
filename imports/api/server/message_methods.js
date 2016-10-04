import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// API
import { Chats } from '/imports/api/chats.js';
import { Messages } from '/imports/api/messages.js';

Meteor.methods({
  newMessage(message) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in', 'Must be logged in to send message.');
    }
    check(message, {
      text: String,
      chatId: String,
      type: String,
    });

    const params = {
      timestamp: new Date(),
      userId: this.userId,
    };

    const messageId = Messages.insert(Object.assign(message, params));
    Chats.update(message.chatId, { $set: { lastMessage: message } });

    return messageId;
  },
  newChat(otherId) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in', 'Must be logged to create a chat.');
    }
  
    check(otherId, String);
    const otherUser = Meteor.users.findOne(otherId);

    if (!otherUser){
      throw new Meteor.Error('user-not-exists', 'Chat\'s user not exists');
    }

    const chat = {
      userIds: [this.userId, otherId],
      createdAt: new Date(),
    };

    const chatId = Chats.insert(chat);

    const message = {
      text: 'Hey there!',
      type: 'initial',
      chatId,
      timestamp: new Date(),
      userId: this.userId,
    };

    Messages.insert(message);
    Chats.update(message.chatId, { $set: { lastMessage: message } });

    return chatId;
  },
});