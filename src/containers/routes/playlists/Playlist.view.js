import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import {Card,Image,Icon, Label} from 'semantic-ui-react'
// import cn from 'classnames'
import { navigate } from '@reach/router';
import {db} from '../../../utils/Firebase';

class PlaylistView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isHeader: props.mode === "header",
      errorMessage: null,
      whichPlaylist: null , 
      playlistName: null
    }

    // this.deletePlaylist = this.props.deletePlaylist.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updatePlaylistName=this.updatePlaylistName.bind(this);
    this.getData=this.getData.bind(this);

    this.ref = '';
    this.URLs = '';
  }
  // deletePlaylist = (e, whichPlaylist, deviceGroupId) => {
  //     e.preventDefault();
  //     try{
  //       //need to delete this playlist URLs -> 
  //       //TODO: it is recomended to do this via a cloud function !!!
  //       //https://firebase.google.com/docs/firestore/solutions/delete-collections
  //       db.collection('URLs').where("playlistId", "==", whichPlaylist)
  //         .get()
  //         .then( snapshot => {
  //         snapshot.forEach( doc => {
  //           if (doc)
  //           {
  //             console.log("deleteing URL: "+doc.id+ ' ' + JSON.stringify(doc.data()));
  //             db.collection('URLs').doc(doc.id).delete();
  //           }
  //         });
  //       });
  //       db.doc(`playlists/${whichPlaylist}`).delete();
  //       // delete this playlist from the device group
  //       db.collection('device_groups').doc(deviceGroupId).collection('playlists').doc(whichPlaylist).delete();

  //       //temporary until we keep the data on app state (redux):
  //       // navigate('/login');
  //     }
  //     catch(e) {
  //         this.setState({errorMessage: e});
  //     }
  // }
  handleChange(e, whichPlaylist) {
      const itemName = e.target.name;
      const itemValue = e.target.value;

      this.setState({'whichPlaylist': whichPlaylist, [itemName]: itemValue });
  }

  handleSubmit(e){
      e.preventDefault();
      this.updatePlaylistName(this.state.whichPlaylist,this.state.playlistName);
      this.setState({whichPlaylist: null , playlistName: null});
  }    
  updatePlaylistName = (playlistId, playlistName) => {
      db.doc('playlists/'+playlistId).update({ playlistName: playlistName });
      // this.setState({ playlistName : playlistName });
 }
 componentDidMount(){
    this._isMounted = true;
    this.getData();

  }
  getData(){
    const {item} = this.props;

    this.URLs = db.collection('/URLs/').where("playlistId", "==", item.playlistID);

    this.URLs
        // .orderBy("URLDescription", "asc")
        .onSnapshot( snapshot => {
          this.setState({URLsCount : snapshot.size});
          // snapshot.forEach( doc => {
          //   console.log("URL: "+doc.id+ ' ' + JSON.stringify(doc.data()));
          // });
    });

  }
  componentWillUnmount() {
    this._isMounted = false;
    // this.playlistRef.off();
  }

  render() {
    const { item, userID/*, URLsCount*/ } = this.props
    // const {URLsCount} = item;
    const playlistID = item.id;
    const canEdit = false;//this.state.whichPlaylist == null;
    return (
    <div className="item" key={playlistID}>
        <div className="right floated content ui basic icon buttons">
            {/*edit button - temp. hidden on header */}
            {!this.state.isHeader?
              <button className="ui link button" href="#"
                  onClick={() => {
                    navigate(`/URL/${userID}/${playlistID}`,{state: { playlist:item}})
                  }}>
                  <i className="large icons">
                      <i className="fitted link  linkify icon"></i>
                      <i className="plus corner icon"></i>
                  </i>
              </button>
            :''}

            {/*view list button - hidden on header */}
            {!this.state.isHeader?
              <button className="ui link button" href="#"
                  onClick={() => {
                    navigate(`/URLs/${userID}/${item.playlistID}`,{state: {playlistID:item.playlistID, playlist:item}})
                  }}>
                  <i className="icon eye large"></i>
              </button>
            :''}

            {/*delete button - temp. hidden on header */}
            {!this.state.isHeader?
              <button className="ui link button" href="#"
                  onClick={e => this.deletePlaylist(e, item.playlistID, item.deviceGroupId)}>
                  <i className="icon trash large"></i>
              </button>
            :''}
        </div>
        <div className="content">
             <form className="ui form" onSubmit={this.handleSubmit}>
                {playlistID === this.state.whichPlaylist ? 
                    <div className="ui action input">
                        <input type="text" 
                            placeholder="Playlist name..." 
                            name="playlistName"
                            aria-describedby="buttonUpdate"
                            value={item.playlistName }
                            onChange={(e) => this.handleChange(e,playlistID)}
                        />
                        <button className="ui green basic icon button" type="submit" id="buttonUpdate">
                            <i className="check icon"></i>
                        </button>
                        <button className="ui red cancel basic icon button" href="#" type="cancel" id="buttonCancel"
                            onClick={(e) => this.setState({'whichPlaylist': null, 'playlistName': null})}>
                            <i className="icon delete"></i>
                        </button>
                    </div>
                :
                    <div >
                        <h2 className="header">
                            {item.deviceGroupName} / {item.playlistName}&nbsp;&nbsp;
                            {canEdit ?
                            <a className="ui basic edit" href="edit" 
                                onClick={(e) => { 
                                                    e.preventDefault();
                                                    this.setState({'whichPlaylist': playlistID})
                                                }
                                        }>
                                <i className="icon pencil alternate small"></i>
                            </a>
                            : ''}
                        </h2>
                        {!this.state.isHeader?
                          <h5 className="ui grey left aligned header">&nbsp;({this.state.URLsCount} URLs)</h5>
                        :''}
                    </div>
                }      
            </form>

        </div>
        {
            this.state.errorMessage !== null ?
                <div className="ui error message">{this.state.errorMessage}</div> 
            : null
        }

     </div>

    )
  }
}

PlaylistView.propTypes = {
  userID: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired/*,
  URLsCount: PropTypes.number.isRequired,*/
}

export default PlaylistView
