// Import React
import React, { Component } from 'react';
import { Router, navigate } from '@reach/router';
import firebase from './Firebase';

import Home from './Home';
import Welcome from './Welcome';
import Navigation from './Navigation';
import Login from './Login';
import Register from './Register';
import Playlists from './Playlists';
import CheckIn from './CheckIn';
import URLs from './URLs';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null, 
      displayName : null,
      userID: null
    };
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

  addPlaylist = playlistName => {
    const ref = firebase
      .database()
      .ref(`playlists/${this.state.user.uid}`);
    ref.push({ playlistName: playlistName });
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(FBUser => {
      if (FBUser) {
        this.setState({
          user: FBUser,
          displayName: FBUser.displayName,
          userID: FBUser.uid
        });

        const playlistsRef = firebase
          .database()
          .ref('playlists/' + FBUser.uid);

        playlistsRef.on('value', snapshot => {
          let playlists = snapshot.val();
          let playlistsList = []; //Helper Array

          for (let item in playlists) {
            playlistsList.push({
              playlistID: item,
              playlistName: playlists[item].playlistName
            });
          }

          this.setState({
            playlists: playlistsList,
            howManyPlaylists: playlistsList.length
          });
        });
      } else {
        this.setState({ user: null });
      }
    });
  }

  render() {
    return (
      <div>
        <Navigation user={this.state.user} logOutUser={this.logOutUser} />
        {this.state.user && <Welcome userName={this.state.displayName}  logOutUser={this.logOutUser} />}

        <Router>
          <Home path="/" user={this.state.user} />
          <Login path="/login" />
          <Playlists
            path="/playlists"
            playlists={this.state.playlists}
            addPlaylist={this.addPlaylist}
            userID={this.state.userID}
          />
          <URLs
            path="/URLs/:userID/:playlistID"
            adminUser={this.state.userID}
            userID={this.state.userID}
          />
          <CheckIn 
            path="/checkin/:userId/:playlistID" 
            userID={this.state.userID}
            />
          <Register path="/register" registerUser={this.registerUser} />
        </Router>
      </div>
    );
  }
}

export default App;
