import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {createContainer} from 'meteor/react-meteor-data';

import {Messages} from '../api/messagesserver.js';

import AccountsUIWrapper from './AccountsUIWrapper.jsx';

class App extends Component{

	constructor(props){
		super(props);
	}

	renderMessages(){
		return this.props.messages.map((message, index)=>(
			<div key={index}>{message.text}</div>
		));
	}

	getCurrentUser(){

		let cUser= this.props.currentUser;

		if(cUser){
			return(
			<div key={1}> {cUser.username} </div>
		)
		}
		
	}

	getAllUsers(){
		let aUsers=this.props.allUsers;

		let aUsersItem;

		if(aUsers){
			aUsersItem=aUsers.map((item,index)=>{
				console.log(item);
				return(
					<div key={index}>{item._id}</div>
				)
			}
			)
		}

		return aUsersItem;
	}

	render(){
		return (
			<div>

				<AccountsUIWrapper />

				<div>Heollo messages!</div>
				
				<div>{this.renderMessages()}</div>
				<div>{this.getCurrentUser()}</div>
				<div>{this.getAllUsers()}</div>
			</div>
		)
	}
}

export default createContainer(()=>{
	
	//console.log("in createContainer"+this.props.currentUser);

	return{
		messages: Messages.find({}).fetch(),
		currentUser: Meteor.user(),
		allUsers: Meteor.users.find({}).fetch(),
	};
},App);