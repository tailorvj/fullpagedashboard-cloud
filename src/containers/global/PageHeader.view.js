import React, { Component } from 'react';
import {Link} from '@reach/router';

class PageHeader extends Component {
  render() {
  	const {user, displayName, photo} = this.props;
    return (
      <div className="ui borderless large inverted blue menu ">
	    {/*<div className="item toc">
	     	<i className="bars icon"></i>
	    </div>*/}
        <div className="ui blue label item">
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
              <Link to="/login" onClick={e => this.logOutUser(e)} style={{color: '#C0CBDD'}}>Log out</Link>
            </div>
          </div>  
        :
          <Link className="item active dropdown" to="/login">
            Log in / Sign up
          </Link>
    	}
      	</div>
      </div>
     )
  }
}

export default PageHeader
