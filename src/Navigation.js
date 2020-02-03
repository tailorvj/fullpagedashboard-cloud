import React, { Component } from 'react';
import {Link} from '@reach/router';
import $ from 'jquery';

class Navigation extends Component {
  constructor(props) {
    super(props);
    
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    if (e.currentTarget.classList.contains('disabled')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    $('.navigation .item').removeClass('active');
    $(e.currentTarget).addClass('active');
  }
  render() {
    // const { style } = this.props;
    const loc = window.location.pathname;
    const playlistClasses = "blue item " + (loc === "/playlists" ? 'active': '');
    const devicesClasess = "teal item " + (loc === "/devices" ? 'active': '');
    const usersClasess = "green disabled item " + (loc === "/users" ? 'active': '');
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

                    <Link className={playlistClasses} to="/playlists" data-tab="playlists" onClick={this.handleClick}>
                      Playlists
                    </Link>
                     <Link className={devicesClasess} to="/devices" data-tab="devicegroups" onClick={this.handleClick}>
                     Devices
                    </Link>
                     <Link disabled={true} className={usersClasess} to="/users" data-tab="usergroups" onClick={this.handleClick}>
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
