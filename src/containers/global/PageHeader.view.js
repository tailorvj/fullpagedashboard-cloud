import React, { Component } from 'react';
import { Link, navigate } from '@reach/router';
import firebase from '../../utils/Firebase';

class PageHeader extends Component {

  logOutUser = (e) => {
    e.preventDefault();
    this.setState({
      user: null,
      displayName: null,
      userID: null,
      photo:null,
      playlists: []
    });
    firebase.auth().signOut().then(()=>{
      navigate('/');
    });
  };

  render() {
  	const {user, displayName, photo} = this.props;
    return (
      <div className="ui borderless large inverted red menu " style={{backgroundColor: '#C21E4A'}}>
	    {/*<div className="item toc">
	     	<i className="bars icon"></i>
	    </div>*/}
        <div className="ui label item">
            <img alt="logo" className="logo" src="Logo%20white.svg"/>
            {/*<div style={{width: 'min-content',marginLeft: 1+'em'}}>
            	Full Page Dashboard (Cloud)
            </div>*/}
        </div>  
      	<div className="right menu">
        {user ?              
          <div className="item active">
            <img className="ui mini circular image" src={photo} style={{marginRight: 1 + 'em'}} alt="profile"/>
            <div className="content">
              <div className="ui sub header inverted">{displayName}</div>
              <Link to="/" onClick={e => this.logOutUser(e)} style={{color: '#C0CBDD'}}>Log out</Link>
            </div>
          </div>  
        : ''
          // <Link className="item active dropdown" to="/" onClick={e => this.logInUser(e)}>
          //   Log in / Sign up
          // </Link>
    	}
      	</div>
      </div>
     )
  }
}

export default PageHeader
