import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

// Components
import Message from '/imports/ui/messages/Message.jsx';

// Helpers
import { getTime } from '/imports/ui/shared/getTime.js';

export default class Conversation extends Component {

  sendMessage() {
    Meteor.call('newMessage', {
      text: this.refs.textInput.getValue().trim(),
      type: 'text',
      chatId: FlowRouter.current().params.chatId,
    });

    // Clear form
    this.refs.textInput.getInputNode().value = ''
    this.refs.textInput.setState({isFocused: false, hasValue: false})
  }

  acceptInvitation() {
    Meteor.call('acceptInvitation', FlowRouter.current().params.chatId);
  }

  declineInvitation() {
    Meteor.call('declineInvitation', FlowRouter.current().params.chatId);
    return FlowRouter.go('chat');
  }

  hideChat(chatId) {
    Meteor.call('hideChat', chatId);
    return FlowRouter.go('chat');
  }

  renderMessages() {
    return this.props.messages.map((message) => (
      <Message
        key={message._id}
        message={message}
        currentUser={this.props.currentUser} />
    ));
  }

  renderActions() {
    const cardActionsStyles = {
      borderTop: '1px solid #dddddd'
    };
    const textFieldStyles = {
      display: 'block',
      marginBottom: 10,
      textAlign: 'left',
      width: 330
    };
    const chat = this.props.chat;
    if (chat.getStatus() === 'success') {
      return (
        <CardActions
          style={cardActionsStyles}
        >
          <div className='message-input'>
            <TextField
              style={textFieldStyles}
              floatingLabelText="Message"
              hintText="Type your message here"
              multiLine={true}
              rows={1}
              rowsMax={4}
              ref="textInput"
            />
            <RaisedButton
              label="Send"
              primary={true}
              onClick={this.sendMessage.bind(this)}
            />
          </div>
        </CardActions>
      );
    } else if (chat.getStatus() === 'pending') {
      return (
        <div className='invitation-actions'>
          <p>You have sent chat invitation</p>
        </div>
      );
    } else if (chat.getStatus() === 'none') {
      return (
        <div className='invitation-actions'>
          <p>You have received chat invitation</p>
          <FlatButton label="Accept" primary={true} onClick={this.acceptInvitation.bind(this)} />
          <FlatButton label="Decline" onClick={this.declineInvitation.bind(this)}/>
        </div>
      );
    } else if (chat.getStatus() === 'declined') {
      return (
        <div className='invitation-actions'>
          <p>You have declined chat invitation</p>
          <FlatButton label="Accept" primary={true} onClick={this.acceptInvitation.bind(this)} />
          <FlatButton label="Hide" onClick={() => this.hideChat(chat._id)}/>
        </div>
      );
    }
  }

  componentDidUpdate() {
    if (this.refs.textInput) {
      this.refs.textInput.getInputNode().scrollIntoView();
    }
  }

  render() {
    if (_.isEmpty(this.props.chat)) return null; // this is important for page reloads

    const cardStyle = {
      boxShadow: 0,
      borderRadius: 0
    };

    const time = getTime(this.props.chat.lastMessage.timestamp);

    return (
      <div className="container">
        <Card style={cardStyle}>
          <CardHeader
            title={this.props.chat.getName()}
            subtitle={<b>{time}</b>}
            avatar={this.props.chat.picture || '/images/default-avatar.jpg'}
          />
          <CardText>
            <div className='message-wrapper'>
              {this.renderMessages()}
            </div>
          </CardText>
          {this.renderActions()}
        </Card>
      </div>
    );
  }
}

Conversation.propTypes = {
  chat: PropTypes.object.isRequired,
  messages: PropTypes.array.isRequired,
  currentUser: PropTypes.object.isRequired
};