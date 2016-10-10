import { Meteor } from 'meteor/meteor';

// React Dependencies
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Conversations from '/imports/ui/chats/Conversations.jsx';
import Conversation from '/imports/ui/chats/Conversation.jsx';
import CreateConversation from '/imports/ui/chats/CreateConversation.jsx';

// API
import { Chats } from '/imports/api/chats.js';
import { Messages } from '/imports/api/messages.js';

export default class EnhancedChat extends Component {
	render() {
		return (
			<div className="chats-holder">
				<div className="chats-aside">
					<Conversations chats={this.props.chats}/>
					<CreateConversation />
				</div>
				<div className="chats-container">
					<Conversation 
						chat={this.props.chat} 
						messages={this.props.messages} 
						currentUser={this.props.currentUser}/>
				</div>
			</div>
		);
	}
}

export default createContainer(() => {
	const currentUser = Meteor.user() || {};
	const chatId = FlowRouter.current().params.chatId;
	let chats = [];
	let chat = {};
	let messages = [];
	if (currentUser._id) {
		if (chatId && Chats.findOne({'users.userId': currentUser._id, _id: chatId}) === undefined) {
			throw new Meteor.Error('not-allowed', 'You are not allowed to see the chat.');
		}
		chats = Chats.find({'users.userId': currentUser._id}).fetch();
		chats.map(function(obj) {
			if (obj._id === chatId) {
				obj.isActive = true;
			}
		});
		if (chatId) {
			chat = Chats.findOne({_id: chatId});
			messages = Messages.find({ chatId }).fetch();
		}
	}
	return {
		chats: chats,
		chat: chat,
		messages: messages,
		currentUser: currentUser
	};
}, EnhancedChat);