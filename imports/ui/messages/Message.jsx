import React, {PropTypes} from 'react';

// Helpers
import { getTime } from '/imports/ui/shared/getTime.js';

export default function Message ({message, currentUser}) {
  const time = getTime(message.timestamp);
  const messageClass = currentUser._id == message.userId ? 'message-mine' : 'message-other';

  if (message.type === 'initial') {
    return (
      <div className='message-initial'>
        <div className='message-initial-info'>
          {time} {message.userId} created this conversation.
        </div>
        <p>
          {message.text}
        </p>
      </div>
    );
  } else {
    return (
      <div className={`message ${messageClass}`}>
        <p className='message-text'>
          {message.text}
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