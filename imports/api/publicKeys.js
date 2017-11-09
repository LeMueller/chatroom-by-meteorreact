import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

export const PublicKeys = new Mongo.Collection('publickeys');
