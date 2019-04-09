import React, { Component } from 'react';
import {Link} from '@reach/router';

class Navigation extends Component {
  render() {
    // const { style } = this.props;

    return (

      <div className="ui large secondary pointing menu" style={{marginTop: 4 + 'em'}}>
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
                My Device Groups
              </Link>
               <Link className="item" to="/usergroups">
                My User Groups
              </Link>
        </div>
      </div>

     );
  }
}

export default Navigation;
