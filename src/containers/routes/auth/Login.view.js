import React, {Component} from 'react';
import firebase /*, {provider}*/ from '../../../utils/Firebase';
import StyledFirebaseAuth from'react-firebaseui/StyledFirebaseAuth';
import {navigate} from '@reach/router';

class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
        signInSuccessWithAuthResult :() => navigate('/playlists')
      }
    }
  };

  // Listen to the Firebase Auth state and set the local state.
  componentDidMount() {
    this._isMounted = true;
    firebase.auth().onAuthStateChanged(
        (user) => {
          if(this._isMounted){
            this.setState({isSignedIn: !!user})
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
        <div>
          <div className="ui vertical segment container">
              <div className="ui header">
                Playlist Manager
              </div>
              <p className="ui sub header" >
                Manage your Raspberry Pi URL playlists from this app. 
              </p>
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