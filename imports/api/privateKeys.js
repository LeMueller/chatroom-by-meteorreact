import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

export const PrivateKeys = new Mongo.Collection('privatekeys');

//console.log("privateKeys.js");


Meteor.methods({
	'privateKeys.insert'(key){

    console.log("Meteor.methods.privateKeys.insert");

		check(key, Object);

		if(! this.userId){
			console.log("not-authorized!");
		}

		PrivateKeys.insert({
      userId:this.userId,
			rsaKey:key,
		})
	},
})
