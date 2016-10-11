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

export const Chats = Collection;