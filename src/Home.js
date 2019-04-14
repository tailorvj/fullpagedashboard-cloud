import React, { Component } from 'react';
import {Link} from '@reach/router';

class Home extends Component {
  render() {
    const { user } = this.props;

    return (
    <div className="pusher" style={{ marginTop: 4 + 'em' }}>
      <div className="ui inverted vertical masthead center aligned segment">

        <div className="ui container">Home.js

            <div className="">
              Playlist Manager
            </div>
            <p className="ui header" >
              Manage your Raspberry Pi URL playlists from this app. 
            </p>

            {user == null && (
              <span>
               <Link
                  to="/login"
                  className="btn btn-outline-primary mr-2"
                >
                  Log In
                </Link>
              </span>
            )}
            {user && (
             <Link to="/playlists" className="btn btn-primary">
                Playlists
              </Link>
            )}
          </div>{' '}
          {/* columns */}
        </div>
      </div>
    );
  }
}

export default Home;
