import React, {Component} from 'react';
import firebase from '../../../utils/Firebase';
import StyledFirebaseAuth from'react-firebaseui/StyledFirebaseAuth';
import {navigate} from '@reach/router';

class GithubLogin extends Component {
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
  }
  
  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    this._isMounted = false;
    // this.unregisterAuthObserver();
  }

  render() {
    if (!this.state.isSignedIn) {
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

export default GithubLogin;