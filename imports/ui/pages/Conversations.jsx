import { createContainer } from 'meteor/react-meteor-data';
import Conversations from '/imports/ui/chats/Conversations.jsx';

// API
import { Chats } from '/imports/api/chats.js';

export default createContainer(() => {
  return {
    chats: Chats.find({}).fetch(),
  };
}, Conversations);