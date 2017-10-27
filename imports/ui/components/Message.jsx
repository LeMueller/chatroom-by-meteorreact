import React, {Component} from 'react';

const util=require('util');

export default class Message extends Component{
	constructor(props){
		super(props);

		this.showDate=this.showDate.bind(this);
	}

	showDate(){
		let message=this.props.message;
		let date = message.createAt;

		let hours=date.getHours();
		let minutes = date.getMinutes();
		if(minutes<10){
			minutes='0'+minutes;
		}

		date='('+hours+':'+minutes+')';

		return date;
	}

	render(){
		let message=this.props.message;

		let className;

		//console.log("in message render(message):::"+util.inspect(message, false,null));

		//console.log("in message render(author.id):::"+message.author.id);
		//console.log("in message render(currentUser._id):::"+this.props.currentUser._id);


		if(message.author.id===this.props.currentUser._id){
			className='messages-item owner';
		}else{
			className='messages-item others';
		}

		return(
			<div className={className}>
				<p className="message-info">{this.showDate()}</p>
				<p className="message-text">{this.props.message.text}</p>
			</div>
		)
	}
}