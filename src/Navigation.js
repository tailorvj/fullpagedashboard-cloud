import React, { Component } from 'react';
import {Link} from '@reach/router';

class Navigation extends Component {
  render() {
    // const { style } = this.props;

    return (
       <div style={{marginTop: -2+'em'}}>
          <div className="ui vertical segment container">
 
            <div className="ui large secondary pointing menu">
             <div className="ui container">
                  {/*!user && (
                    <Link to="/" className="item">
                      Playlist Manager
                    </Link>
                  )*/}

                     <Link className="item active" to="/playlists">
                      Playlists
                    </Link>
                     <Link className="item" to="/devicegroups">
                     Devices
                    </Link>
                     <Link className="item" to="/usergroups">
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
