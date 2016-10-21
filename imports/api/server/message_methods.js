import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// API
import { Chats } from '/imports/api/chats.js';
import { Messages } from '/imports/api/messages.js';

Meteor.methods({
  newMessage(message) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in', 'Must be logged in to send a message.');
    }
    check(message, {
      text: String,
      chatId: String,
      type: String,
    });
    if (Chats.findOne({'users.userId': this.userId, _id: message.chatId, 'users.status': 'success'}) === undefined) {
      throw new Meteor.Error('not-allowed', 'You are not allowed to send a message.');
    }

    const params = {
      timestamp: new Date(),
      userId: this.userId,
    };

    const messageId = Messages.insert(Object.assign(message, params));
    Chats.update(message.chatId, { $set: { lastMessage: message } });

    return messageId;
  },
  newChat(otherId, messageText) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in', 'Must be logged to create a chat.');
    }
  
    check(otherId, String);
    check(messageText, String);
    const otherUser = Meteor.users.findOne(otherId);
    const currentUser = Meteor.users.findOne(this.userId);

    if (!otherUser){
      throw new Meteor.Error('user-not-exists', 'Chat\'s user not exists');
    }

    const dbChat = Chats.findOne({$and: [{'users.userId': currentUser._id}, {'users.userId': otherUser._id}]});
    if (dbChat) {
      //todo duplication
      const userId = this.userId;
      dbChat.users.forEach(function(user) {
        if (user.userId === userId) {
          user.hidden = false;
        }
      });
      Chats.update(dbChat._id, dbChat);
      return dbChat._id;
    }

    const chat = {
      users: [
        {
          userId: currentUser._id, 
          name: otherUser.username,
          status: 'pending',
          hidden: false
        }, 
        {
          userId: otherUser._id, 
          name: currentUser.username,
          status: 'none',
          hidden: false
        }
      ],
      createdAt: new Date(),
    };

    const chatId = Chats.insert(chat);

    const message = {
      text: messageText,
      type: 'initial',
      chatId,
      timestamp: new Date(),
      userId: currentUser._id,
    };

    Messages.insert(message);
    Chats.update(message.chatId, { $set: { lastMessage: message } });

    return chatId;
  },
  acceptInvitation(chatId) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error('not-logged-in', 'Must be logged to create a chat.');
    }
    check(chatId, String);
    let chat = Chats.findOne({_id: chatId, 'users.userId': userId, 'users.status': {$in: ['none', 'declined']}});
    if (chat) {
      chat.users.forEach(user => {user.status = 'success'});
      Chats.update(chat._id, chat);
    }
  },
  declineInvitation(chatId) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error('not-logged-in', 'Must be logged to create a chat.');
    }
    check(chatId, String);
    let chat = Chats.findOne({_id: chatId, 'users.userId': userId, 'users.status': 'none'});
    if (chat) {
      chat.users.forEach(user => {
        if (user.userId === userId) {
          user.status = 'declined';
          user.hidden = true;
        }
      });
      Chats.update(chat._id, chat);
    }
  },
  hideChat(chatId) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error('not-logged-in', 'Must be logged to create a chat.');
    }
    check(chatId, String);
    let chat = Chats.findOne({_id: chatId, 'users.userId': userId});
    chat.users.forEach(function(user) {
      if (user.userId === userId) {
        user.hidden = true;
      }
    });
    Chats.update(chat._id, chat);
  },
});