import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

export const PublicKeys = new Mongo.Collection('publickeys');

Meteor.methods({
	'publicKeys.insert'(key){
		check(key, String);

		if(! this.userId){
			console.log("not-authorized!");
		}

		PublicKeys.insert({
      userId:this.userId,
			publicKey:key,
		})
	},
})
