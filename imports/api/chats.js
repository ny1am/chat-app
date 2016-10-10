import { Mongo } from 'meteor/mongo';

const Collection = new Mongo.Collection('chats');
Collection.helpers({
	getName() {
		const currentUser = Meteor.user();
		if (currentUser) {
			return this.users.filter(value => (value.userId === currentUser._id))[0].name;
		}
	}
});

//rename 'names' field to 'users'
Collection.find({}).fetch().forEach(function(element) {
	Collection.update({_id: element._id}, {$rename:{"names":"users"}}, false, true);
});

export const Chats = Collection;