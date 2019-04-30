import React, { Component } from 'react';

import PlaylistView from './Playlist.view';


class PlaylistsList extends Component {
    constructor(props){
        super(props);
        this.state = {
        errorMessage: null
        }
    }

  render() {
    const { playlists, groups} = this.props;

    const myPlaylistsByGroup = groups.map((group,idx) => 
        {

            const groupPlaylists = playlists.map((item) => 
            {
                if (item.deviceGroupId === group.id)
                    return(
                        <div className="item" key={item.deviceGroupId+"_"+item.playlistID}>
                            <PlaylistView 
                                key={item.deviceGroupName+"_"+item.playlistID} 
                                item={item} 
                                userID={this.props.userID} 
                                deletePlaylist={
                                    (e, whichPlaylist, deviceGroupId) => 
                                        this.props.deletePlaylist(e, whichPlaylist, deviceGroupId)
                                }
                            />
                        </div>
                    )
                else
                    return null;
            });

            return (
            <div className="ui animated relaxed divided list" key={idx+"_group"}>
                <div className="disabled item" key={group.id+"_item"}>
                    {/*<i className="left floated icons">
                      <i className="blue stop icon"></i>
                      <i className="top right corner teal stop icon"></i>
                    </i>*/}                
                    <div className="divided content" key={group.id}>
                        <div key={group.id+"_title"} className="ui left aligned tiny grey sub header">{group.name}</div>
                    </div>
                </div>
                {groupPlaylists}
                <div className="ui divider hidden"/>
            </div>
            )          
        });
    // const myPlaylists = playlists.map((item) => 
    //     {
    //         // const groupTitle = (item.deviceGroupName !== deviceGroupName ?
    //         //     <div className="item" key={item.deviceGroupId}>
    //         //         <div key={item.deviceGroupId+"_title"} className="ui left aligned tiny blue sub header">{item.deviceGroupName}</div>
    //         //     </div>
    //         //    : null);

    //         // if (item.deviceGroupName !== deviceGroupName)
    //         // {
    //         //     deviceGroupName = item.deviceGroupName;
    //         // }
    //         return(
    //             // {/*groupTitle*/}
    //             <div className="item" key={item.deviceGroupId+"_"+item.playlistID}>
    //                 <PlaylistView key={item.deviceGroupName+"_"+item.playlistID} item={item} userID={this.props.userID} deletePlaylist={(e, whichPlaylist, deviceGroupId) => this.props.deletePlaylist(e, whichPlaylist, deviceGroupId)}/>
    //             </div>
    //         );
    //     });

    return (
        // {/*<div className="ui animated relaxed divided list">*/
        <div>
            {myPlaylistsByGroup}
        </div>
        // {/*</div>*/}
    );
  }
}

export default PlaylistsList;
