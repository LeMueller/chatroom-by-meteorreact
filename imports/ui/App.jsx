import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {createContainer} from 'meteor/react-meteor-data';
import 'cryptico-js';

import Sidebar from './containers/Sidebar.jsx';
import ChatContainer from './containers/ChatContainer.jsx';
import Message from './components/Message.jsx';

import {Messages} from '../api/messagesserver.js';
import {PrivateKeys} from '../api/privateKeys.js';
import {PublicKeys} from '../api/publicKeys.js';

const util=require('util');



import AccountsUIWrapper from './AccountsUIWrapper.jsx';



class App extends Component{

	constructor(props){
		super(props);
		this.state={
			currentUser: this.props.currentUser,
			currentChat: {
				username:'',
				_id:''
			}
		}

		this.handleSelectUser = this.handleSelectUser.bind(this);
		this.handleSubmit=this.handleSubmit.bind(this);
		this.renderMessages = this.renderMessages.bind(this);
		this.generatPubAndPriKeys=this.generatPubAndPriKeys.bind(this);
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
		event.preventDefault();
		const text=document.getElementById('message-input').value;
		const recipient=this.state.currentChat;
		const recipientId= recipient._id;

		//encrytion of text
		if(text){

			let recipientPubKey;
			let encryptionResult;

			this.props.publicKeys.map((item)=>{

				//console.log("item in publicKeys:::" + util.inspect(item,false,null));
				//console.log("recipientId:::" + recipientId);

				if(item.UserId===recipientId){
					recipientPubKey=item.publicKey;
				}
			})

			if(recipientPubKey){
				encryptionResult = cryptico.encrypt(text, recipientPubKey);
			}

			Meteor.call('messages.insert',encryptionResult, recipient);
		}

		document.getElementById('message-input').value='';
	}

	generatPubAndPriKeys(nextProps){

		if(this.props.currentUser){
			return;
		}

		//console.log("in generatPubAndPriKeys()");

		let publicKeysCollection = this.props.publicKeys;
		let privateKeysCollection = this.props.privateKeys;

		let currentUserHasPubKey=false;
		let currentUserHasPriKey=false;

		let Bits=1024;

		if(nextProps.currentUser){
			if(nextProps.currentUser._id){
				//if(nextProps.currentUser.creatAt){

					console.log("generate keys with currentUser._id");

					let passPhrase = nextProps.currentUser._id;

					publicKeysCollection.map((item)=>{
						console.log("publicKeysCollection.map");
						if(item.userId===nextProps.currentUser._id){
							currentUserHasPubKey=true;
							console.log("currentUserHasPubKey=true;");
						}else{
							console.log("currentUserHasPubKey=false;");
						}
					})

					privateKeysCollection.map((item)=>{
						if(item.userId===nextProps.currentUser._id){
							currentUserHasPriKey=true;
							console.log("currentUserHasPriKey=true;");
						}else{
							console.log("currentUserHasRriKey=false;");
						}
					})

	 				if(currentUserHasPubKey===false && currentUserHasPriKey===false){

						let userRSAKey= cryptico.generateRSAKey(passPhrase, Bits);

						//console.log(util.inspect(userRSAKey,false,null));

						let userPublicKeyString = cryptico.publicKeyString(userRSAKey);

						//console.log("publickeys insert");
						Meteor.call('publicKeys.insert',userPublicKeyString);
						currentUserHasPubKey=true;
						//console.log("privatekeys insert");
					  Meteor.call('privateKeys.insert',userRSAKey);
						currentUserHasPriKey=true;
					}
				//}
			}
		}

	}

	renderMessages(){
		let messages=this.props.messages;

		if(this.props.currentUser && this.state.currentChat){

			let selectedMessages=messages.filter(message=>{

				if(message.author.id===this.props.currentUser._id && message.recipient._id === this.state.currentChat._id){

					//console.log("message from me");
					return message;
				} else if (message.author.id===this.state.currentChat._id && message.recipient._id===this.props.currentUser._id){

					//console.log("message from other");

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
	}


	componentWillReceiveProps(nextProps){
		console.log("this.props.currentUser:::"+util.inspect(this.props.currentUser,false,null));
		console.log("nextProps:::"+nextProps);
		console.log("this.props.currentUser:::"+util.inspect(this.props.currentUser,false,null));

		if(nextProps.currentUser){
			if(nextProps.currentUser._id){
				console.log("nextProps.currentUser._id in recieve::: "+ nextProps.currentUser._id);

				this.generatPubAndPriKeys(nextProps);
			}
		}
	}

	render(){
		return(
			<div className="container">
				<AccountsUIWrapper />
				<Sidebar
					currentUser={this.props.currentUser}
					currentChat={this.state.currentChat}
					allUsers={this.props.allUsers}
					onSelectUser={this.handleSelectUser}/>

				<div className="chat-container">
					<ChatContainer
						currentChat={this.state.currentChat}
						renderMessages={this.renderMessages()}
						onSubmit={this.handleSubmit}/>
				</div>

			</div>
		)
	}
}

export default createContainer(()=>{

	Meteor.subscribe('messages');
	Meteor.subscribe('all_users');

	console.log("createContainer");

	return{
		messages: Messages.find({}).fetch(),
		currentUser: Meteor.user(),
		allUsers: Meteor.users.find({}).fetch(),
		publicKeys: PublicKeys.find({}).fetch(),
		privateKeys: PrivateKeys.find({}).fetch(),
	};
},App);
