import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Conversation from '/imports/ui/chats/Conversation.jsx';

// API
import { Chats } from '/imports/api/chats.js';
import { Messages } from '/imports/api/messages.js';

export default createContainer(({params}) => {
  let chatId = FlowRouter.current().params.chatId;
  return {
    chat: Chats.findOne(chatId) || {},
    messages: Messages.find({ chatId }).fetch(),
    currentUser: Meteor.user()
  };
}, Conversation);