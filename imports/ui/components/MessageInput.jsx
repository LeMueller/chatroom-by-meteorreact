import React, {Component} from 'react';

export default class MessageInput extends Component{
	constructor(props){
		super(props);
	}

	componentDidMount(){
		let messageInput=document.getElementById("message-input");
		let _this=this;
		
		messageInput.addEventListener("keydown", function(event){
			if(event.keyCode==13){
				_this.props.onSubmit(event);
			}
		})
		
		
	}

	render(){

		return(
			<div className="message-form-container">
				<form className="message-form" onSubmit={this.props.onSubmit}>
					<textarea placeholder="Message" id="message-input" ref="messageinput"></textarea>
					<button type="submit" id="submit-button">Send</button>
				</form>
			</div>
		)
	}
}