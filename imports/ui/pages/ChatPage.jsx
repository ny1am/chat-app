import { Meteor } from 'meteor/meteor';

// React Dependencies
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Conversations from '/imports/ui/chats/Conversations.jsx';
import Conversation from '/imports/ui/chats/Conversation.jsx';
import CreateConversation from '/imports/ui/chats/CreateConversation.jsx';

// API
import Chats from '/imports/api/chats.js';
import { Messages } from '/imports/api/messages.js';

export default class ChatPage extends Component {
	render() {
		return (
			<div className="chats-holder">
				<div className="chats-aside">
					<Conversations chats={this.props.chats} activeChatId={this.props.activeChatId}/>
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
			FlowRouter.go('chat');
		}
		chats = Chats.find({users: {$elemMatch: {$and: [{userId: currentUser._id}, {hidden: false}]}}}).fetch();
		if (chatId) {
			chat = Chats.findOne({_id: chatId});
			messages = Messages.find({ chatId }).fetch();
		}
	}
	return {
		chats: chats,
		chat: chat,
		messages: messages,
		activeChatId: chatId,
		currentUser: currentUser
	};
}, ChatPage);