import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import Chat from './Chat.jsx';

// API
import { Chats } from '/imports/api/chats.js';

export default class Conversations extends Component {
  deleteChat(chat) {
    console.log(chat._id);
    Chats.remove(chat._id);
  }

  renderChats() {
    return this.props.chats.map((chat) => (
      <Chat
        key={chat._id}
        chat={chat}
        route={this.props.route}
        deleteChat={this.deleteChat.bind(this)} />
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
  route: PropTypes.string.isRequired
};