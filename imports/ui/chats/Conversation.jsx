import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
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

  renderMessages() {
    return this.props.messages.map((message) => (
      <Message
        key={message._id}
        message={message}
        currentUser={this.props.currentUser} />
    ));
  }

  componentDidUpdate() {
    this.refs.textInput.getInputNode().scrollIntoView();
  }

  render() {
    if (_.isEmpty(this.props.chat)) return null; // this is important for page reloads

    const textFieldStyles = {
      display: 'block',
      marginBottom: 10,
      textAlign: 'left',
      width: 330
    };

    const cardActionsStyles = {
      borderTop: '1px solid #dddddd'
    };

    const cardStyle = {
      boxShadow: 0,
      borderRadius: 0
    };

    const time = getTime(this.props.chat.lastMessage.timestamp);

    return (
      <div className="container">
        <Card style={cardStyle}>
          <CardHeader
            title={this.props.chat.name}
            subtitle={<b>{time}</b>}
            avatar={this.props.chat.picture || '/images/default-avatar.jpg'}
          />
          <CardText>
            <div className='message-wrapper'>
              {this.renderMessages()}
            </div>
          </CardText>
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