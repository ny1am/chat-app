import React, { Component, PropTypes } from 'react';

import { Card, CardHeader, CardActions } from 'material-ui/Card';

import FlatButton from 'material-ui/FlatButton';

import { FlowRouter } from 'meteor/kadira:flow-router';

// Helpers
import { getTime } from '/imports/ui/shared/getTime.js';

export default class Chat extends Component {
  render() {
    const cardStyles = {
      marginBottom: 10
    };
    const time = getTime(this.props.chat.lastMessage.timestamp);
    return (
      <Card style={cardStyles}>
        <CardHeader
          title={this.props.chat.name}
          subtitle={<p>{this.props.chat.lastMessage.text} <b>{time}</b></p>}
          avatar={this.props.chat.picture || '/images/default-avatar.jpg'}
        />
        <CardActions>
          <FlatButton
            label="View"
            onClick={() => FlowRouter.go(this.props.route, { chatId: this.props.chat._id })}
          />
          <FlatButton
            label="Remove"
            onClick={() => this.props.deleteChat(this.props.chat)}
          />
        </CardActions>
      </Card>
    );
  }
}

Chat.propTypes = {
  chat: PropTypes.object.isRequired,
  deleteChat: PropTypes.func.isRequired,
  route: PropTypes.string.isRequired
};