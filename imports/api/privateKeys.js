import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

export const PrivateKeys = new Mongo.Collection('privateKeys');
