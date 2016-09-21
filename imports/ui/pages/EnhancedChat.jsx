import { Meteor } from 'meteor/meteor';

// React Dependencies
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Conversations from '/imports/ui/chats/Conversations.jsx';
import Conversation from '/imports/ui/chats/Conversation.jsx';

// API
import { Chats } from '/imports/api/chats.js';
import { Messages } from '/imports/api/messages.js';

export default class EnhancedChat extends Component {
	render() {
		return (
			<div>
				<h1>EnhancedChat Page</h1>
				<Conversations chats={this.props.chats} route='enhancedChat'/>
				<Conversation 
					chat={this.props.chat} 
					messages={this.props.messages} 
					currentUser={this.props.currentUser}/>
			</div>
		);
	}
}

export default createContainer(() => {
	const chatId = FlowRouter.current().params.chatId;
	let chat = {};
	let messages = [];
	if (chatId) {
		chat = Chats.findOne(chatId) || {};
		messages = Messages.find({ chatId }).fetch();
	}
	return {
		chats: Chats.find({}).fetch(),
		chat: chat,
		messages: messages,
		currentUser: Meteor.user() || {}
	};
}, EnhancedChat);