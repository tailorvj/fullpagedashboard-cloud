import React, { Component } from 'react';
import FormError from '../../../FormError';
import { navigate } from '@reach/router';
import firebase from '../../../utils/Firebase';
import URLView from './URL.view'

class URLsList extends Component {
    constructor(props){
        super(props);
        this.state = {
            errorMessage: null
        }
        this.deleteURL = this.deleteURL.bind(this);

        this.ref = '';
    }

    deleteURL = (e, whichURL) => {
        e.preventDefault();
        try{
        this.ref = firebase.database().ref(
            `playlists/${this.props.userID}/${this.props.playlistID}/URLs/${whichURL}`
        );
        this.ref.remove();
        }
        catch(e) {
            this.setState({errorMessage: e});
        }
    }

    componentWillUnmount() {
        // this.ref.off();
    }


  render() {
    // const admin = ((this.props.adminUser === this.props.userID) ? true : false);
    const URLs = this.props.URLs;
    
    const myURLs = URLs.map((item) => {
        return(
            <URLView 
                userID={this.props.userID} 
                playlistID={this.props.playlistID} 
                playlistName={this.props.playlistName}
                item={item} urlID={item.URLID}></URLView>
        );
    });

        return (
            <div>
              {this.state.errorMessage !== null ?
              <FormError 
                  theMessage={this.state.errorMessage}
              /> : null}
      
              {myURLs}
            </div>
          );
        
      
  } //render()

} //componenet class

export default URLsList;
