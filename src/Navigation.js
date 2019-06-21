import React, { Component } from 'react';
import {Link} from '@reach/router';
import $ from 'jquery';

class Navigation extends Component {
  constructor(props) {
    super(props);
    
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    $('.navigation .item').removeClass('active');
    $(e.currentTarget).addClass('active');
  }
  render() {
    // const { style } = this.props;

    return (
       <div style={{marginTop: -2+'em'}}>
          <div className="ui vertical segment container">
 
            <div className="ui secondary pointing menu">
             <div className="ui container navigation">
                  {/*!user && (
                    <Link to="/" className="item">
                      Playlist Manager
                    </Link>
                  )*/}

                    <Link className="blue item active" to="/playlists" data-tab="playlists" onClick={this.handleClick}>
                      Playlists
                    </Link>
                     <Link className="teal item" to="/devicegroups" data-tab="devicegroups" onClick={this.handleClick}>
                     Devices
                    </Link>
                     <Link className="green item" to="/usergroups" data-tab="usergroups" onClick={this.handleClick}>
                     Users
                    </Link>
              </div>
            </div>
          </div>
        </div>
     );
  }
}

export default Navigation;
