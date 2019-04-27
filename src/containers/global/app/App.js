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
// import CheckIn from '../../../CheckIn';
import URLs from '../../routes/urls/URLs';
import URLDetails from '../../routes/urls/URLDetails';
// import EditURL from '../../routes/urls/EditURL';
// import Filteredlist from '../filterBase';
// import PlaylistsList from '../../routes/playlists/PlaylistsList';

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

    // this.playlistsRef = '';
    // this.ref = '';
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
/* getData(){
    this.userRef = db.collection('users').doc(this.state.userID);
    this.userRef
      .onSnapshot( snapshot => {
        if (snapshot.name === null)
        {
          console.log("in App.js - getData - user not exists in users table, "+this.state.userID );

        }
        else
        {
          console.log("in App.js - getData - user exists "+this.state.userID);

          this.setState({
              userName: snapshot.name
          });
          this.userDeviceGroupsRef = this.userRef.collection('user_device_groups');
          this.userUserGroupsRef = this.userRef.collection('user_user_groups');
          this.userDeviceGroupsRef
            // .orderBy("name", "asc")
            .onSnapshot( snapshot => {
              let deviceGroupsList = []; //Helper Array

              snapshot.forEach( doc => {

                 deviceGroupsList.push({
                    deviceGroupsID: doc //.data()
                  });
              });

              this.setState({
                  deviceGroups: deviceGroupsList,
                  howManyDeviceGroups: deviceGroupsList.length
              });
          });
          this.userUserGroupsRef
            // .orderBy("name", "asc")
            .onSnapshot( snapshot => {
              let userGroupsList = []; //Helper Array

              snapshot.forEach( doc => {

                 userGroupsList.push({
                    userGroupsID: doc //.data
                  });
              });

              this.setState({
                  userGroups: userGroupsList,
                  howManyUserGroups: userGroupsList.length
              });
          });
        }
      })
}*/

  componentDidMount() {
    this._isMounted = true;
    this.listener = firebase.auth().onAuthStateChanged(FBUser => {
      if (FBUser) {
        console.log("in App.js - componentDidMount, " + FBUser.displayName);      

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
    // this.ref.off();
    // this.playlistsRef.off();
  }

  render() {
    const { user, userID, displayName, photo} = this.state;

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
                <img className="ui mini circular image" src={photo} style={{marginRight: 1 + 'em'}} alt="profile"/>
                {/*<i className="ui circular icon user"></i>*/}
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
          <div className="ui vertical masthead center aligned segment" style={{marginTop: 3+'em'}}>

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
