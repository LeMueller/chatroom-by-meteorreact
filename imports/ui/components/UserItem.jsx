import React, {Component} from 'react';

export default class UserItem extends Component{
	constructor(props){
		super(props);

		this.selectUser = this.selectUser.bind(this);
	}

	selectUser(event){
		event.preventDefault();
		this.props.onSelectUser(this.props.user);//不太懂

		let selectedUser = document.querySelectorAll(".selected-user");

		for(var i=0; i<selectedUser.length; i++){
			selectedUser[i].classList.remove("selected-user");
		}

		event.target.classList.add("selected-user");
	}

	render(){
		return(
			<li key={this.props.user._id} onClick={this.selectUser}>{this.props.user.username}</li>
		)
	}
}