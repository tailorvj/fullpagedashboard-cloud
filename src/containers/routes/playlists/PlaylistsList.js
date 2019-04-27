import React, { Component } from 'react';
// import firebase from '../../../utils/Firebase';
// import {db} from '../../../utils/Firebase';

import PlaylistView from './Playlist.view';


class PlaylistsList extends Component {
    constructor(props){
        super(props);
        this.state = {
        errorMessage: null
        }
        // this.ref = '';
    }

  render() {
    const { playlists, /*distinctDeviceGroups */} = this.props;
    let deviceGroupName='';
    const myPlaylists = playlists.map((item) => 
        {
            // const changedGroup = item.deviceGroupName !== deviceGroupName;
            if (item.deviceGroupName !== deviceGroupName)
            {
                deviceGroupName = item.deviceGroupName;
            }
//             {/*<div key={item.deviceGroupId+'_'+item.playlistID}>*/}
//               {changedGroup ?
//                  <div className="item header" key={item.deviceGroupId+'_header'}>Device Group: {item.deviceGroupName}</div>
//                :null
//               }
//             {/*</div>*/}
            return(
                    <PlaylistView key={item.deviceGroupName+"_"+item.playlistID} item={item} userID={this.props.userID} deletePlaylist={(e, whichPlaylist, deviceGroupId) => this.props.deletePlaylist(e, whichPlaylist, deviceGroupId)}/>
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
