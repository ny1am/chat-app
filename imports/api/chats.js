import { Mongo } from 'meteor/mongo';

const Collection = new Mongo.Collection('chats');
Collection.helpers({
	name() {
		const currentUser = Meteor.user();
		if (currentUser) {
			return this.names.filter(value => (value.userId === currentUser._id))[0].name;
		}
	}
});

export const Chats = Collection;