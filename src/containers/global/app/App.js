// Import React
import React, { Component } from 'react';
import { Router, navigate } from '@reach/router';
import firebase from '../../../utils/Firebase';

import Navigation from '../../../Navigation';
import LoginView from '../../routes/auth/Login.view';
import Register from '../../../Register';
import Playlists from '../../routes/playlists/Playlists';
// import CheckIn from '../../../CheckIn';
import URLs from '../../routes/urls/URLs';
import URLDetails from '../../routes/urls/URLDetails';

import PageHeader from '../PageHeader.view';
// import Tab from '../Tab.view';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null, 
      displayName : null,
      userID: null,
      photo: null
    };
    this.userRef='';
    this.userUserGroupsRef='';
    this.userDeviceGroupsRef='';
  }

  registerUser = (userName) => {
    firebase.auth().onAuthStateChanged(FBUser => {
      console.log("in App.js - registerUser, "+userName + JSON.stringify(FBUser));
      FBUser.updateProfile({
        displayName: userName
      }).then(()=>{
        this.setState({
          user: FBUser,
          displayName: FBUser.displayName,
          userID: FBUser.uid,
          photo: FBUser.photoURL
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
      photo:null,
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
        // console.log("in App.js - componentDidMount, " + FBUser.displayName);      

        if(this._isMounted){
          this.setState({
            user: FBUser,
            displayName: FBUser.displayName,
            userID: FBUser.uid,
            photo: FBUser.photoURL
          });
          // this.getData();

        }

      } else {
        this.setState({ user: null });
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { user, userID, displayName, photo} = this.state;

    user ? navigate('/playlists') : navigate('/login');

    return (

      <div>
    {/* top header */}
      <PageHeader user={user} photo={photo} displayName={displayName}/>
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
        <div >
          {/*<div className="ui hidden divider"></div> */}
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
              // userGroups={this.state.userGroups}
              // deviceGroups={this.state.deviceGroups}
              // playlists={this.state.playlists}
              userID={userID}
            />

          )}
          {/*user && (
            <Tab path="/devicegroups" data-tab="devicegroups">
                <h4 className="ui grey header">
                    Device Groups
                </h4>
            </Tab>
          )*/}

          <URLs
            path="/URLs/:userID/:playlistID"
            // URLs = {this.state.URLs}
            adminUser={userID}
            userID={userID}
          />
          <URLDetails 
            path="/URL/:userId/:playlistID" 
            userID={userID}
            />
{/*          <EditURL 
            path="/editURL/:userId/:playlistID/URLs/:URLID" 
            userID={userID}
            />
          <CheckIn 
            path="/checkin/:userId/:playlistID" 
            userID={userID}
            />*/}
          <Register path="/register" registerUser={this.registerUser} />
        </Router>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
