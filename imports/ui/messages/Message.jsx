import React, {PropTypes} from 'react';

import { Meteor } from 'meteor/meteor';

// Helpers
import getTime from '/imports/ui/shared/getTime.js';

export default function Message ({message, currentUser}) {
  const time = getTime(message.timestamp);
  const messageClass = currentUser._id == message.userId ? 'message-mine' : 'message-other';
  const messageUser = Meteor.users.findOne(message.userId);

  function process(text) {
    return text.replace(/((http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?)/g,'<a href="$1">$1</a>');
  }

  if (message.type === 'initial') {
    return (
      <div className='message-initial'>
        <div className='message-initial-info'>
          {time} {messageUser.username} created this conversation.
        </div>
        <p>
          <span className='message-body'>
            {message.text}
          </span>
        </p>
      </div>
    );
  } else {
    return (
      <div className={`message ${messageClass}`}>
        <p className='message-text'>
          <span className='message-body' dangerouslySetInnerHTML={{__html: process(message.text)}} />
          <span className='message-timestamp'>{time}</span>
        </p>
      </div>
    );
  }
}

Message.propTypes = {
  message: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
};