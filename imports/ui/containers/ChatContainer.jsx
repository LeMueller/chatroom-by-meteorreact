import React, {Component} from 'react';
import MessagesContainer from './MessagesContainer';
import MessageInput from '../components/MessageInput';

export default class ChatContainer extends Component{
	constructor(props){
		super(props);
	}

	render(){
		return(
			<div className="chat-container-container">
				<div className="current-chat-name">
					<h2>{this.props.currentChat.username}</h2>
				</div>
				<MessagesContainer
					renderMessages={this.props.renderMessages}
					currentChat={this.props.currentChat}
				/>
				<MessageInput
					onSubmit={this.props.onSubmit}
				/>
			</div>
		)
	}
}