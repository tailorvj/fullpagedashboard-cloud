// Import React
import React, { Component } from 'react';
import { Router, navigate } from '@reach/router';
import firebase from '../../../utils/Firebase';
import {Link} from '@reach/router';

//import Home from '../../../Home';
// import Welcome from '../../../Welcome';
import Navigation from '../../../Navigation';
import LoginView from '../../routes/auth/Login.view';
import Register from '../../../Register';
import Playlists from '../../routes/playlists/Playlists';
import CheckIn from '../../../CheckIn';
import URLs from '../../routes/urls/URLs';
import AddURL from '../../routes/urls/AddURL';
// import EditURL from '../../routes/urls/EditURL';
// import Filteredlist from '../filterBase';
// import PlaylistsList from '../../routes/playlists/PlaylistsList';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null, 
      displayName : null,
      userID: null
    };
    // this.playlistsRef = '';
    // this.ref = '';
  }

  registerUser = (userName) => {
    firebase.auth().onAuthStateChanged(FBUser => {
      FBUser.updateProfile({
        displayName: userName
      }).then(()=>{
        this.setState({
          user: FBUser,
          displayName: FBUser.displayName,
          userID: FBUser.uid
        });
        navigate('/playlists');
      });
    });
  };

  logOutUser = (e) => {
    e.preventDefault();
    this.setState({
      user: null,
      displayName: null,
      userID: null,
      playlists: []
    });
    firebase.auth().signOut().then(()=>{
      navigate('/login');
    });
  };

  componentDidMount() {
    this._isMounted = true;
    this.listener = firebase.auth().onAuthStateChanged(FBUser => {
      if (FBUser) {
        if(this._isMounted){
          this.setState({
            user: FBUser,
            displayName: FBUser.displayName,
            userID: FBUser.uid
          });
        }

      } else {
        this.setState({ user: null });
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
    // this.ref.off();
    // this.playlistsRef.off();
  }

  render() {
    const { user, userID, displayName} = this.state;

    user ? navigate('/playlists') : navigate('/login');

    return (

      <div>
    {/* top header */}
      <div className="ui large inverted blue top fixed menu blue ">
         <div className="ui blue label item">
            <img alt="logo" className="logo" src="Logo%20white.svg"/>&nbsp;&nbsp;&nbsp;
            Full Page Dashboard (Cloud)
        </div>  
          <div className="right menu">
            {!user && (
              <Link className="item active dropdown" to="/login">
                Log in / Sign up
              </Link>
            )}
            {user && (              
              <div className="item active">
                {/*<img className="ui mini circular image" src="/images/avatar2/small/molly.png"/>*/}
                <i className="ui circular icon user"></i>
                <div className="content">
                  <div className="ui sub header inverted">{displayName}</div>
                  <Link to="/login" onClick={e => this.logOutUser(e)} style={{color: '#C0CBDD'}}>Log out</Link>
                </div>
              </div>              
            )}
          </div>
      </div>
      {user && (  
        <Navigation/>
      )}
        {/*
          <!-- Sidebar Menu -->
          <div className="ui vertical inverted sidebar menu">
            <a className="active item">Home</a>
            <a className="item">Work</a>
            <a className="item">Company</a>
            <a className="item">Careers</a>
            <a className="item">Login</a>
            <a className="item">Signup</a>
          </div>
        */}
        <div className="pusher">
          <div className="ui vertical masthead center aligned segment">

        <Router>
          {/* <Home path="/" user={this.state.user} />*/}

          {user == null && (
          <LoginView className="ui fluid popup bottom left transition hidden" path="/login" />
          )}

           {/*
          <Filteredlist 
              path="/playlists"
              userID={userID}

              pageTitle="Add a Playlist"
              listTitle="Your Playlists"
              collectionURL="playlists/:userID"
              sortFieldName="playlistName">
              <PlaylistsList path="/playlist"/>        
          </Filteredlist>
          */}

          {user && (
            <Playlists
              path="/playlists"
              // playlists={this.state.playlists}
              userID={userID}
            />
          )}

          <URLs
            path="/URLs/:userID/:playlistID"
            // URLs = {this.state.URLs}
            adminUser={userID}
            userID={userID}
          />
          <AddURL 
            path="/URL/:userId/:playlistID" 
            userID={userID}
            />
{/*          <EditURL 
            path="/editURL/:userId/:playlistID/URLs/:URLID" 
            userID={userID}
            />*/}
          <CheckIn 
            path="/checkin/:userId/:playlistID" 
            userID={userID}
            />
          <Register path="/register" registerUser={this.registerUser} />
        </Router>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
