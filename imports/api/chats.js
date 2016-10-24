import { Mongo } from 'meteor/mongo';

const Collection = new Mongo.Collection('chats');
Collection.helpers({
	getName() {
		const currentUser = Meteor.user();
		if (currentUser) {
			return this.users.filter(user => (user.userId === currentUser._id))[0].name;
		}
	},
	getStatus() {
		const currentUser = Meteor.user();
		if (currentUser) {
			return this.users.filter(user => (user.userId === currentUser._id))[0].status;
		}
	}
});

Collection.find({'users.hidden': {$exists: false}}).fetch().forEach(function(chat) {
	if (chat.users) {
		chat.users.forEach(function(user) {
			user.hidden = false;
		});
		Collection.update(chat._id, chat);
	}
});

export default Chats = Collection;