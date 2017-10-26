import React, {Component} from 'react';
import UserItem from './UserItem';

export default class UserLsit extends Component{
	constructor(props){
		super(props);
	}

	renderUserList(){
		let users = this.props.allUsers;
		let list;

		if(this.props.currentUser){

			let filteredList = users.filter(user=>{
				//console.log("user.username:::"+user.username);
				//console.log("this.props.currentUser.username:::"+this.props.currentUser.username);
				if(user.username !== this.props.currentUser.username){
					return user;
				}
			});

			console.log("filteredList"+filteredList)

			list = filteredList.map((user, index)=>{

				//console.log("user in list"+user);
				return(
					<UserItem
						key={index}
						user={user}
						onSelectUser={this.props.onSelectUser}
						currentChat={this.props.currentChat}/>
				)
			});
		}

		console.log("list:"+list);

		return(
			<ul className="user-list">
				{list}
			</ul>
		)
	}

	render(){
		return(
			<div className="user-list-container">
				{this.renderUserList()}
			</div>
		)
	}
}