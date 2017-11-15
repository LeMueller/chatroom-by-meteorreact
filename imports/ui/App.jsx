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

		this.testToEncryptText;
		this.testPassPhrase;
		this.testBits=1024;
		this.testRSAKey;
		this.testPublicKeyString;
		this.testPlainText;
		this.testEncryptionResult;
		this.testCipherText;
		this.testDecryptionResult;
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


		//for test begin
		this.testPlainText="text";
		console.log("!!!this.testPlainText:::"+this.testPlainText);
		console.log("!!!this.testPublicKeyString:::"+this.testPublicKeyString);

		this.testEncryptionResult=cryptico.encrypt(this.testPlainText,this.testPublicKeyString);
		this.testCipherText=this.testEncryptionResult.cipher;
		console.log("!!!this.testCipherText:::"+this.testCipherText);
		this.testDecryptionResult=cryptico.decypt(this.testCipherText, this.testRSAKey),
		console.log("!!!this.testDecryptionResult.plaintext:::"+this.testDecryptionResult.plaintext);
		//for test end

		//console.log("in submit recipientId" + recipientId);
		//console.log("in submit this.props.currentUser" + this.props.currentUser);

		//encrytion of text
		if(text){

			let recipientPubKey;
			let encryptionResult;
			let encryptionText;

			this.props.publicKeys.map((item)=>{
				//console.log("in submit publicKey map" + item.userId);
				if(item.userId===recipientId){
					console.log("message encrypted with pubkey of " + item.userId);
					recipientPubKey=item.publicKey;
				}
			})

			console.log("in submit recipientPubKey" + recipientPubKey);

			if(recipientPubKey){
				encryptionResult = cryptico.encrypt(text, recipientPubKey);
			}

			//console.log("in submit encryptionResult" + util.inspect(encryptionResult,false,null));

			encryptionText=encryptionResult.cipher;

			Meteor.call('messages.insert',encryptionText, recipient);
		}

		document.getElementById('message-input').value='';
	}

	generatPubAndPriKeys(nextProps){
		/**
		if(this.props.currentUser){
			return;
		}
		**/

		//for test begin
		this.testPassPhrase="XdX69LTC8d3DvfhHu";
		this.testRSAKey=cryptico.generateRSAKey(this.testPassPhrase,this.testBits);
		this.testPublicKeyString=cryptico.publicKeyString(this.testRSAKey);
		console.log("!!!this.testPublicKeyString:::"+this.testPublicKeyString);
		//for test end

		let publicKeysCollection = this.props.publicKeys;
		let privateKeysCollection = this.props.privateKeys;

		let currentUserHasPubKey=false;
		let currentUserHasPriKey=false;

		let Bits=1024;

		if(nextProps.currentUser){
			if(nextProps.currentUser._id){
				//if(nextProps.currentUser.creatAt){
					let passPhrase = nextProps.currentUser._id;

					publicKeysCollection.map((item)=>{
						if(item.userId===nextProps.currentUser._id){
							currentUserHasPubKey=true;
						}
					})

					privateKeysCollection.map((item)=>{
						if(item.userId===nextProps.currentUser._id){
							currentUserHasPriKey=true;
						}
					})

	 				if(currentUserHasPubKey===false && currentUserHasPriKey===false){

						let userRSAKey= cryptico.generateRSAKey(passPhrase, Bits);

						let userPublicKeyString = cryptico.publicKeyString(userRSAKey);

						Meteor.call('publicKeys.insert',userPublicKeyString);
						currentUserHasPubKey=true;
					  Meteor.call('privateKeys.insert',userRSAKey);
						currentUserHasPriKey=true;
					}
				//}
			}
		}

	}

	renderMessages(){

		let recipientPriKey;
		let decryptedText;
		let encryptedText;
		let decryptedTextArray=[];
		let encryptedTextArray=[];
		let selectedMessages

		console.log("in renderMessage currentUser:::"+this.props.currentUser);

		console.log("in renderMessage currentChat._id:::"+ this.state.currentChat._id);
		this.props.privateKeys.map((item)=>{
			console.log("in renderMessage item.userId:::"+item.userId);

			if(item.userId==this.state.currentChat._id){
				recipientPriKey=item.rsaKey;
			}
		})

		console.log("in renderMessages recipientPrivatKey:::"+recipientPriKey);

		let messages=this.props.messages;

		if(this.props.currentUser && this.state.currentChat){

			selectedMessages=messages.filter(message=>{

				if(message.author.id===this.props.currentUser._id && message.recipient._id === this.state.currentChat._id){

					//console.log("message from me");
					return message;
				} else if (message.author.id===this.state.currentChat._id && message.recipient._id===this.props.currentUser._id){

					//console.log("message from other");

					return message;
				}
			})

			//copy selectedMessages to encryptedTextArray
			selectedMessages.map((item, index)=>{
				console.log("copy "+index);
				encryptedTextArray[index]=item;
			})

			if(encryptedTextArray[0]){
				console.log("in renderMessages encryptedTextArray[0]:::"+util.inspect(encryptedTextArray[0],false,null));
				console.log("encryptedTextArray[0].text:::"+ encryptedTextArray[0].text);
				console.log("this.state.currentChat.username:::"+ this.state.currentChat.username);
				console.log("recipientPriKey:::"+ util.inspect(recipientPriKey,false,null));
				//console.log("plaintext"+ (cryptico.decrypt(encryptedTextArray[0].text, recipientPriKey)));
			}


			/**
			//decryption
			encryptedTextArray.map((item,index)=>{
				console.log("item.text"+ (cryptico.decrypt(item.text, recipientPriKey)).plaintext);
			})
			**/

			//console.log("in renderMessages decryptedTextArray:::"+decryptedTextArray)

			return selectedMessages.map((message,index)=>(
				<Message
					key={index}
					message={message}
					currentUser={this.props.currentUser}/>
			))
		}
	}


	componentWillReceiveProps(nextProps){

	//console.log("nextProps.currentUser in recieve:::"+nextProps.currentUser);
	//console.log("currentUser in recieve:::"+this.props.currentUser);

		if(nextProps.currentUser){
			if(nextProps.currentUser._id){
				if(!this.props.currentUser){
					this.generatPubAndPriKeys(nextProps);
				}
			}
		}
	}

	render(){
		//console.log("currentUser in render:::"+this.props.currentUser);
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

	return{
		messages: Messages.find({}).fetch(),
		currentUser: Meteor.user(),
		allUsers: Meteor.users.find({}).fetch(),
		publicKeys: PublicKeys.find({}).fetch(),
		privateKeys: PrivateKeys.find({}).fetch(),
	};
},App);
