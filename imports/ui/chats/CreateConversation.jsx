  
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

    this.state = { open: false, selectedUserId: undefined};
  }

  handleModalOpen() {
    this.setState({open: true});
  }

  handleModalClose() {
    this.setState({open: false, selectedUserId: undefined});
  }

  selectUser(userId) {
    this.setState({selectedUserId: userId});
  }

  newChat(userId) {
    if (userId) {
      const chat = Chats.findOne({ userIds: { $all: [this.props.currentUser._id, userId] } });

      if (chat) {
        this.handleModalClose();
        return FlowRouter.go('chat', { chatId: chat._id })
      }

      Meteor.call('newChat', userId, (err, chatId) => {
        this.handleModalClose();
        FlowRouter.go('chat', { chatId })
      });
    } else {
      //todo: error message
    }
  }

  renderUsers() {
    return this.props.users.map( (user) => {
      return (
        <ListItem
          key={user._id}
          className={this.state.selectedUserId === user._id ? 'user-selected' : ''}
          primaryText={
            <span>
              <b>{user.username}</b>
            </span>
          }
          leftAvatar={<Avatar src={user.avatar || '/images/default-avatar.jpg'} />}
          rightIcon={
            <CommunicationChatBubble/>
          }
          onTouchTap={() => this.selectUser(user._id)}
        />
      )
    });
  }

  render() {
    const actionContainerStyles = {
      position: 'absolute',
      bottom: 20,
      right: 20
    };

    const floatingActionButtonStyles = {
      margin: '0 auto',
    };

    const actions = [
      <FlatButton
        label="Send"
        primary={true}
        onTouchTap={() => this.newChat(this.state.selectedUserId)}
      />,
      <FlatButton
        label="Cancel"
        primary={false}
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