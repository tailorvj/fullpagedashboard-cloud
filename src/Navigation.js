import React, { Component } from 'react';
import {Link} from '@reach/router';

class Navigation extends Component {
  render() {
    // const { style } = this.props;

    return (
       <div style={{marginTop: -2+'em'}}>
          <div className="ui vertical segment container">
 
            <div className="ui secondary pointing menu">
             <div className="ui container">
                  {/*!user && (
                    <Link to="/" className="item">
                      Playlist Manager
                    </Link>
                  )*/}

                     <Link className="blue item active" to="/playlists" data-tab="playlists">
                      Playlists
                    </Link>
                     <Link className="teal item" to="/devicegroups" data-tab="devicegroups">
                     Devices
                    </Link>
                     <Link className="green item" to="/usergroups" data-tab="usergroups">
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
