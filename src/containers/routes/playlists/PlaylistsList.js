import React, { Component } from 'react';
import firebase from '../../../utils/Firebase';

import PlaylistView from './Playlist.view';


class PlaylistsList extends Component {
    constructor(props){
        super(props);
        this.state = {
        errorMessage: null
        }
        this.ref = '';
    }

  render() {
    const { playlists } = this.props;
    const myPlaylists = playlists.map((item) => 
        {
            let URLsCount=0;
            this.URLs = firebase
                .database()
                .ref(`playlists/${this.props.userID}/${item.playlistID}/URLs`)
                .on('value', snapshot => {
                    const arrObj = snapshot? snapshot.val(): {};
                    URLsCount = Object.keys(arrObj? arrObj: {}).length;
                });

            return(
                <PlaylistView key={item.playlistID} item={item} userID={this.props.userID} URLsCount={URLsCount}/>

            );
        });

    return (
        <div className="ui animated relaxed divided list">
            {myPlaylists}
        </div>
    );
  }
}

export default PlaylistsList;
