import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import Chat from './Chat.jsx';

// API
import Chats from '/imports/api/chats.js';

export default class Conversations extends Component {

  renderChats() {
    return this.props.chats.map((chat) => (
      <Chat
        key={chat._id}
        chat={chat} 
        isActive={chat._id === this.props.activeChatId} />
    ));
  }

  render() {
    return (
      <div className="container">
        {this.renderChats()}
      </div>
    );
  }
}

Conversations.propTypes = {
  chats: PropTypes.array.isRequired,
  activeChatId: PropTypes.string
};