import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import Dialog from 'material-ui/Dialog';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';

// API
import {Chats} from '/imports/api/chats.js';

export default class CreateConversation extends Component {
  constructor(props) {
    super(props);

    this.state = { open: false };
  }

  handleModalOpen() {
    this.setState({open: true});
  }

  handleModalClose() {
    this.setState({open: false});
  }

  newChat(userId) {
    const chat = Chats.findOne({ userIds: { $all: [this.props.currentUser._id, userId] } });

    if (chat) {
      this.handleModalClose();
      return FlowRouter.go('enhancedChat', { chatId: chat._id })
    }

    Meteor.call('newChat', userId, (err, chatId) => {
      this.handleModalClose();
      FlowRouter.go('enhancedChat', { chatId })
    });
  }

  renderUsers() {
    return this.props.users.map( (user) => {
      return (
        <ListItem
          key={user._id}
          primaryText={
            <span>
              <b>{user.username}</b>
              <i> Hey there!</i>
            </span>
          }
          leftAvatar={<Avatar src={user.avatar || '/images/default-avatar.jpg'} />}
          rightIcon={
            <CommunicationChatBubble
              onTouchTap={() => this.newChat(user._id) }
            />
          }
        />
      )
    });
  }

  render() {
    const actionContainerStyles = {
      position: 'fixed',
      bottom: '0',
      right: '0',
      width: '280px',
      height: '100px',
      textAlign: 'center',
      backgroundColor: 'white',
    };

    const floatingActionButtonStyles = {
      margin: '0 auto',
    };

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleModalClose.bind(this)}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleModalClose.bind(this)}
      />,
    ];

    return (
      <div style={actionContainerStyles}>
        <FloatingActionButton
          style={floatingActionButtonStyles}
          onTouchTap={this.handleModalOpen.bind(this)}
        >
          <ContentAdd />
        </FloatingActionButton>

        <Dialog
          title="New Chat"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleModalClose.bind(this)}
        >
          <List>
            { this.renderUsers() }
          </List>
        </Dialog>
      </div>
    )
  }
}

CreateConversation.propTypes = {
  users: PropTypes.array.isRequired,
  currentUser: PropTypes.object.isRequired,
};

export default createContainer(() => {
  let users = Meteor.users.find({ _id: { $ne: Meteor.userId() } }).fetch();
  return {
    users,
    currentUser: Meteor.user() || {},
  };
}, CreateConversation);