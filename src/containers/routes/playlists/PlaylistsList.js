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
            // const titleSpaceBefore = deviceGroupName !== ''? 
            //     <div className="ui hidden divider"/>
            //     :null;

            const groupTitle = (item.deviceGroupName !== deviceGroupName ?
                <div className="item" key={item.deviceGroupId}>
                    {/*titleSpaceBefore*/}
                    <div className="ui hidden divider"/>
                    <span key={item.deviceGroupId+"_title"} className="ui tiny grey sub header">{item.deviceGroupName}</span>
                </div>
               : null);

            if (item.deviceGroupName !== deviceGroupName)
            {
                deviceGroupName = item.deviceGroupName;
            }
            return(
                <div className="item" key={item.deviceGroupId+"_"+item.playlistID}>
                    {groupTitle}
                    <div className="ui hidden divider"/>
                    <PlaylistView key={item.deviceGroupName+"_"+item.playlistID} item={item} userID={this.props.userID} deletePlaylist={(e, whichPlaylist, deviceGroupId) => this.props.deletePlaylist(e, whichPlaylist, deviceGroupId)}/>
                </div>
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
