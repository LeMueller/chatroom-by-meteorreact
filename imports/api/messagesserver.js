import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

export const Messages = new Mongo.Collection('messages');

if (Meteor.isServer){
	Meteor.publish('messages', function messagesPublication(){
		return Messages.find();
	});
	Meteor.publish('all_users', function getUsers(){
		return Meteor.users.find();
	});
}

Meteor.methods({
	'messages.insert'(text, recipient){
		check(text, String);

		if(! this.userId){
			console.log("not-authorized!");
		}

		Messages.insert({
			text,
			createAt: new Date(),
			author: {
				id:this.userId,
				username: Meteor.users.findOne(this.userId).username,
			},
			recipient:recipient,
			read:false,
		})
	},

	'messages.markRead'(messageId){
		check(messageId, String);

		//这好想写错了update里应该是message

		//const message = Messages.findOne(messageId);

		//Messages.update(messageId, {$set: {read:true}});
	}
})