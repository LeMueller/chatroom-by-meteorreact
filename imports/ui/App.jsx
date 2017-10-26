import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {createContainer} from 'meteor/react-meteor-data';

import Sidebar from './containers/Sidebar.jsx';

import {Messages} from '../api/messagesserver.js';



import AccountsUIWrapper from './AccountsUIWrapper.jsx';



class App extends Component{

	constructor(props){
		super(props);
		this.state={
			currentUser: this.props.currentUser,
			currentChat: {
				username:'',
				id:''
			}
		}
	}

	componentWillReceiveProps(nextProps){

	}
	
	handleSelectUser(user){
		if(user){
			this.setState({
				currentChat:user
			})
		}else{
			console.log("handleSelectUser::: user undefined")
		}
	}

	handleSubmit(event){
		event.perventDefault();
		const text=decument.getElementById('message-input').value;
		const recipient=this.state.currentChat;

		if(text){
			Meteor.call('message.insert',text,recipient);
		}

		document.getElementById('message-input').value='';
	}

	renderMessages(){
		var messages=this.props.messages;

		let selectedMessages=messages.filter(message=>{
			if(message.author.id===this.props.currentUser._id && message.recipient._id === this.state.currentChat._id){
				return message;
			}
		})

		return selectedMessages.map((message,index)=>(
			<Message
				key={index}
				message={message}
				currentUser={this.props.currentUser}/>
		))
	}

	/**
	getCurrentUser(){

		let cUser= this.props.currentUser;

		if(cUser){
			return(
			<div key={1}> {cUser.username} </div>
		)
		}
		
	}

	renderMessages2(){
		return this.props.messages.map((message, index)=>(
			<div key={index}>{message.text}</div>
		));
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
				
				<div>{this.renderMessages2()}</div>
				<div>{this.getCurrentUser()}</div>
				<div>{this.getAllUsers()}</div>
			</div>
		)
	}
	**/

	render(){
		return(
			<div className="container">
				<AccountsUIWrapper />
				<Sidebar
					currentUser={this.props.currentUser}
					currentChat={this.state.currentChat}
					allUsers={this.props.allUsers}
					onSelectUser={this.handleSelectUser}/>
				
			</div>
		)
	}
}

export default createContainer(()=>{
	
	Meteor.subscribe('messages');
	Meteor.subscribe('all_users');

	return{
		messages: Messages.find({}).fetch(),
		currentUser: Meteor.user(),
		allUsers: Meteor.users.find({}).fetch(),
	};
},App);