import React, {Component} from 'react';
// import firebase /*, {provider}*/ from '../../../utils/Firebase';
import firebase,{db}/*, {auth, db}*/ from '../../../utils/Firebase';

import StyledFirebaseAuth from'react-firebaseui/StyledFirebaseAuth';
import {navigate} from '@reach/router';

class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      debug: false,
      email: '',
      isSignedIn: false // Local signed-in state.
    }

    // Configure FirebaseUI.
    this.uiConfig={
      // Popup signin flow rather than redirect flow for now
      signInFlow:'popup',
      // We will display Github login only for now.
      signInOptions:[
        // firebase.auth.GoogleAuthProvider.PROVIDER_ID ,
        // firebase.auth.FacebookAuthProvider.PROVIDER_ID ,
        // firebase.auth.TwitterAuthProvider.PROVIDER_ID ,
        // firebase.auth.EmailAuthProvider.PROVIDER_ID ,
        firebase.auth.GithubAuthProvider.PROVIDER_ID
      ],
      callbacks:{
        // Avoid redirects after sign-in.
        signInSuccessWithAuthResult :(authObj) => {
          this.setState({uid : authObj.user.uid});
          navigate('/playlists/')
        }
      }
    }
  };

  // Listen to the Firebase Auth state and set the local state.
  componentDidMount() {
    this._isMounted = true;
    firebase.auth().onAuthStateChanged(
        (user) => {
          const {debug} = this.state;
          if(debug) console.log("in Login.view.js - componentDidMount, " + user.displayName + " db:"+db)
          var userRef = db.collection('users').doc(user.uid);
          userRef.get().then(function(doc) {
              if (doc.exists) {
                  if(debug) console.log("User data:", doc.data());
              } else {
                  // doc.data() will be undefined in this case
                  if(debug) console.log("New user! - creating default data");

                  userRef.set({
                     name: user.name
                  });

                  //add default user group for this user
                  userRef.collection('user_user_groups').add(user.id);

                  db.collection('user_groups').doc(user.id).set({
                    name: "default user group"
                  });
                  db.collection('user_groups').doc(user.id).collection("users").doc(user.id).set({isAdmin:true});

                  //add default device group
                  userRef.collection('user_device_groups').add(user.id);
                  db.collection('device_groups').doc(user.id).set({
                    name: "default device group",
                    userGroupId: user.id
                  });
                  db.collection('device_groups').doc(user.id)
                    .collection("playlists").add(user.id);

                  db.collection("playlists").doc(user.id).set({
                    description: "default playlist",
                    deviceGroupId: user.id,
                    isActive: true,
                    name: "default device group"
                  })

                  db.collection("URLs").add({
                    description: "Otot",
                    duration: 5000,
                    playlistId: user.id,
                    star: false,
                    url: "http://dev.otot.tv"
                  })
                  this.setState({newUser:true});
              }
          }).catch(function(error) {
              console.log("Error getting user:", error);
          });  

          if(this._isMounted){
            this.setState({isSignedIn: !!user});
            if (user) this.setState({uid: user.uid});
            // if (this.state.isSignedIn)
              // this.getData();
          }
        }
    );
    // firebase.auth().getRedirectResult().then(function(result) {
    //   if (result.credential) {
    //     // This gives you a GitHub Access Token. You can use it to access the GitHub API.
    //     var token = result.credential.accessToken;
    //     // ...
    //   }
    //   // The signed-in user info.
    //   var user = result.user;
    // }).catch(function(error) {
    //   // Handle Errors here.
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   // The email of the user's account used.
    //   var email = error.email;
    //   // The firebase.auth.AuthCredential type that was used.
    //   var credential = error.credential;
    //   // ...
    // });

  }
  
  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    this._isMounted = false;
    // this.unregisterAuthObserver();
  }

  render() {
    if (!this.state.isSignedIn) {
      // firebase.auth().signInWithRedirect(provider);
      //display login button
      return (
        <div style={{marginTop: 3+'em'}}>
          <div className="ui vertical segment container">
              <div className="ui header">
                Playlist Manager
              </div>
              <p className="ui sub header" >
                Manage your Raspberry Pi URL playlists from this app. 
              </p>
              {this.state.newUser ?
                <p>
                Welcome to OTOT.
                you can now<br/>
                Register a new device 
                <hr> OR</hr>
                Buy a new device 
                </p>
                : null
              }
          </div>
          {!this.state.isSignedIn ?
            <StyledFirebaseAuth className="ui very padded basic segment"
              uiConfig={this.uiConfig} 
              firebaseAuth={firebase.auth()}
              /> : null
              }
        </div>
      );
    }
    return (
      <div className="container">
        &nbsp;
      </div>
    );
  }
}

export default LoginView;