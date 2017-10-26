import React, {Component} from 'react';
import Message from '../components/Message';

export default class MessagesContainer extends Component{
	constructor(props){
		super(props);
	}

	render(){

		//console.log("MessagesContainer:::this.props.renderMessages"+this.props.renderMessages);

		return(
			<div className="MessagesContainer-container">
				{this.props.renderMessages}
			</div>
		)
	}
}