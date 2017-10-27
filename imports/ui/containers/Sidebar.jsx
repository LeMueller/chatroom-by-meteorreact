import React, {Component} from 'react';
import UserList from '../components/UserList';

export default class Sidebar extends Component{
	constructor(props){
		super(props);
	}

	render(){
		return(
			<div className="sidebar-container">
				<div className="filter">
					<input type="text" spaceholder="search" id="searchbar"/>
				</div>
				<UserList
					onSelectUser={this.props.onSelectUser}
					currentUser={this.props.currentUser}
					currentChat={this.props.currentChat}
					allUsers={this.props.allUsers}/>
			</div>
		)
	}
}

