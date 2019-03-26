// Import React
import React, { Component } from 'react';
import { Router, navigate } from '@reach/router';
import firebase from '../../../utils/Firebase';

import Home from '../../../Home';
import Welcome from '../../../Welcome';
import Navigation from '../../../Navigation';
import GithubLogin from '../../routes/auth/GithubLogin';
import Register from '../../../Register';
import Playlists from '../../routes/playlists/Playlists';
import CheckIn from '../../../CheckIn';
import URLs from '../../routes/urls/URLs';
import AddURL from '../../routes/urls/AddURL';
import EditURL from '../../routes/urls/EditURL';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null, 
      displayName : null,
      userID: null
    };
    this.playlistsRef = '';
    this.ref = '';
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
    this.ref = firebase
      .database()
      .ref(`playlists/${this.state.user.uid}`);
    this.ref.push({ playlistName: playlistName });
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

        this.playlistsRef = firebase
          .database()
          .ref('playlists/' + FBUser.uid);

        this.playlistsRef.on('value', snapshot => {
          let playlists = snapshot.val();
          let playlistsList = []; //Helper Array

          for (let item in playlists) {
            playlistsList.push({
              playlistID: item,
              playlistName: playlists[item].playlistName
            });
          }
          if(this._isMounted){
            this.setState({
              playlists: playlistsList,
              howManyPlaylists: playlistsList.length
            });
          }
        });
      } else {
        this.setState({ user: null });
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.ref.off();
    this.playlistsRef.off();
  }

  render() {
    return (
      <div>
        <Navigation user={this.state.user} logOutUser={this.logOutUser} />
        {this.state.user && <Welcome userName={this.state.displayName}  logOutUser={this.logOutUser} />}

        <Router>
          <Home path="/" user={this.state.user} />
          <GithubLogin path="/login" />
          <Playlists
            path="/playlists"
            playlists={this.state.playlists}
            addPlaylist={this.addPlaylist}
            userID={this.state.userID}
          />
          <URLs
            path="/URLs/:userID/:playlistID"
            URLs = {this.state.URLs}
            adminUser={this.state.userID}
            userID={this.state.userID}
          />
          <AddURL 
            path="/addURL/:userId/:playlistID" 
            userID={this.state.userID}
            />
          <EditURL 
            path="/editURL/:userId/:playlistID/URLs/:URLID" 
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
