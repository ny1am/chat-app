import React, { Component, PropTypes } from 'react';

import { Card, CardHeader, CardActions } from 'material-ui/Card';

import FlatButton from 'material-ui/FlatButton';

import { FlowRouter } from 'meteor/kadira:flow-router';

// Helpers
import { getTime } from '/imports/ui/shared/getTime.js';

export default class Chat extends Component {
  renderSubtitle() {
    //todo fix error here
    const time = getTime(this.props.chat.lastMessage.timestamp);
    const chat = this.props.chat;
    if (chat.getStatus() === 'success') {
      return <p>{this.props.chat.lastMessage.text} <b>{time}</b></p>;
    } else if (chat.getStatus() === 'pending') {
      return <p className='chat-pending'>Invitation has been sent</p>;
    } else if (chat.getStatus() === 'none') {
      return <p className='chat-none'>Invitation has been received</p>;
    }  else if (chat.getStatus() === 'declined') {
      return <p className='chat-declined'>You have declined the invitation</p>;
    }
  }

  render() {
    let cardStyle = {
      borderRadius: 0,
      boxShadow: 0,
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
    };
    if (this.props.chat.isActive) {
      cardStyle.backgroundColor = 'rgba(0, 188, 212, 0.1)';
    }
    return (
      <Card style={cardStyle}>
        <CardHeader
          title={this.props.chat.getName()}
          subtitle={this.renderSubtitle()}
          avatar={this.props.chat.picture || '/images/default-avatar.jpg'}
        />
        <CardActions>
          <FlatButton
            label="View"
            onClick={() => FlowRouter.go('chat', { chatId: this.props.chat._id })}
          />
        </CardActions>
      </Card>
    );
  }
}

Chat.propTypes = {
  chat: PropTypes.object.isRequired
};