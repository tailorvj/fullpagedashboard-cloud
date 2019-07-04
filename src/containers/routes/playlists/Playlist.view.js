import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import {Card,Image,Icon, Label} from 'semantic-ui-react'
// import cn from 'classnames'
import { navigate } from '@reach/router';
import {db} from '../../../utils/Firebase';
import { Checkbox } from 'semantic-ui-react';

class PlaylistView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      debug: true,
      isHeader: props.mode === "header",
      errorMessage: null,
      whichPlaylist: null , 
      item: this.props.item,
      playlistName: this.props.item.playlistName
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.updateItemName=this.updateItemName.bind(this);
    this.updateIsActive=this.updateIsActive.bind(this);
    this.getData=this.getData.bind(this);

    this.ref = '';
    this.URLs = '';
  }
  handleChange(e, whichPlaylist) {
      const itemName = e.target.name;
      const itemValue = e.target.value;

      this.setState({'whichPlaylist': whichPlaylist, [itemName]: itemValue });
  }

  handleSubmit(e){
      e.preventDefault();
      this.updateItemName(this.state.whichPlaylist,this.state.playlistName);
      this.setState({whichPlaylist: null});
  }    
  handleCancel(e){
      e.preventDefault();
      this.setState({whichPlaylist: null, playlistName: this.props.item.playlistName});
  }    
  updateItemName = (playlistId, playlistName) => {
    db.doc('playlists/'+playlistId).update({ name: playlistName });
 }

 updateIsActive = (deviceGroupId, playlistID, isChecked) => 
 {
    // const {item} = this.state;
    // const {deviceGroupId, playlistID, isChecked} = item;

    this.props.item.isActive = isChecked;

    this.playlistsRef = db.collection('/playlists');

    if (isChecked) 
    {
      //we need to turn the previous active one to inactive
      this.playlistsRef
        .where("deviceGroupId", "==", deviceGroupId)
        .where("isActive", "==", true)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                console.log("previous active id="+doc.id);
                db.doc('playlists/'+doc.id).update({ isActive: false });
            });
            //we turn this one to active...
            db.doc('playlists/'+playlistID).update({ isActive: true });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });

    }
    else 
    {
      //we turn this one to inactive ...
      console.log("previous active id="+playlistID);
      db.doc('playlists/'+playlistID).update({ isActive: false });

      //...so we need to turn the first one to active
      db.collection('/playlists')
        .where("deviceGroupId", "==", deviceGroupId)
        .limit(1)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                console.log("new active id="+doc.id);
                db.doc('playlists/'+doc.id).update({ isActive: true });
            })
        })
        .catch(function(error) {
                  console.log("Error getting playlist:", error);
              });
    }

    this.setState(this.state);
  }

  deleteItem = (e, itemId, deviceGroupId) => 
  {
      e.preventDefault();
      let that=this;

        //need to delete this playlist URLs -> 
        //TODO: it is recomended to do this via a cloud function !!!
        //https://firebase.google.com/docs/firestore/solutions/delete-collections

        if(this.state.debug) console.log("deleteing URLs of playlist: "+itemId);

        db.collection('URLs').where("playlistId", "==", itemId)
          .get()
          .then( snapshot => {
            snapshot.forEach( doc => {
              if (doc)
              {
                if(this.state.debug) console.log("deleteing URL: "+doc.id+ ' ' + JSON.stringify(doc.data()));
                db.collection('URLs').doc(doc.id)
                  .delete()
                  .then(function() {
                      // Force a render with a simulated state change
                      that.setState(that.state);
                      that.forceUpdate();
                  });
              }
            });
          })
          .then( ()=> {
            if(this.state.debug) console.log("deleteing playlist "+itemId);

            db.doc('playlists/'+itemId)
            .delete()
            .then(function() {
                console.log("Playlist "+itemId+" successfully deleted!");
                that.setState(that.state);
                that.forceUpdate();
                window.location.reload();//temp
            }).catch(function(error) {
                console.error("Error removing playlist: ", error);
            });  
          });

  }
/* Original method from parent of parent :
    deleteItem = (e, whichPlaylist, deviceGroupId) => {
      if(this.state.debug) console.log("delete playlist "+whichPlaylist+" of device-group "+deviceGroupId);
      try{
        //need to delete this playlist URLs -> 
        //TODO: it is recomended to do this via a cloud function !!!
        //https://firebase.google.com/docs/firestore/solutions/delete-collections
        db.collection('URLs').where("playlistId", "==", whichPlaylist)
          .get()
          .then( snapshot => {
          snapshot.forEach( doc => {
            if (doc)
            {
              if(this.state.debug) console.log("deleteing URL: "+doc.id+ ' ' + JSON.stringify(doc.data()));
              db.collection('URLs').doc(doc.id)
                .delete()
                .then(function() {
                    // Force a render with a simulated state change
                    that.setState(that.state);
                    that.forceUpdate();
                });
            }
          });
        });
        this.playlistsRef.doc(whichPlaylist)
            .delete()
            .then(function() {
                // Force a render with a simulated state change
                that.setState(that.state);
                that.forceUpdate();
            });

        // delete this playlist from the device group
        db.collection('device_groups').doc(deviceGroupId)
            .collection('playlists').doc(whichPlaylist)
            .delete()
            .then(function() {
                // Force a render with a simulated state change
                that.setState(that.state);
                that.forceUpdate();
            });

      }
      catch(e) {
          this.setState({errorMessage: e});
      }
    }
*/
 componentDidMount(){
    this._isMounted = true;
    this.getData();
    const activeElements = document.getElementsByName("active");
    if (activeElements.length)
      activeElements[0].checkbox();
  }
  getData(){
    const {item, URLsCount} = this.props;
    if (this.state.isHeader)
    {
      this.setState({URLsCount : URLsCount});
    }
    else
    {
      this.URLs = db.collection('/URLs/').where("playlistId", "==", item.playlistID);

      this.URLs
          .onSnapshot( snapshot => {
            this.setState({URLsCount : snapshot.size});
      });      
    }


  }
  componentWillUnmount() {
    this._isMounted = false;
    try{
      this.playlistsRef();
      this.URLs();
    }
    catch(e) {};
  }

  render() {
    const { item, userID/*, URLsCount*/ } = this.props;

    const { isHeader} = this.state;

    // const {URLsCount} = item;
    const playlistID = item.playlistID;//id;
    const canEdit = this.state.whichPlaylist == null;
    const headerClasses = isHeader? '':'left aligned';
    const headerClasses2 = isHeader? 'ui header':'left floated content';

    // let Active/*, ActiveH*/=false;
    // if (item.isActive && !isHeader) {
    //   Active=true;
    // }

    return (
    <div className="ui basic item" key={playlistID}>
          <span className={headerClasses2}>
              {playlistID === this.state.whichPlaylist ? 
                <form className="ui form" onSubmit={this.handleSubmit}>
                  <button style={{display:'none'}} type="reset" name="buttonReset"/>
                  <div className="ui action input">
                      <input type="text" 
                          placeholder="Playlist name..." 
                          name="playlistName"
                          aria-describedby="buttonUpdate"
                          value={/*item.playlistName*/this.state.playlistName }
                          onChange={(e) => this.handleChange(e,playlistID)}
                          onKeyDown={(e) => {
                              if(e.keyCode===27)
                              {
                                  document.getElementsByName("buttonReset")[0].click();
                                  this.setState({whichPlaylist: null, playlistName: this.props.item.playlistName});
                              }
                          }}

                      />
                      <button className="ui green basic icon button" type="submit" id="buttonUpdate">
                          <i className="check icon"></i>
                      </button>
                      <button className="ui red cancel basic icon button" href="#" type="cancel" id="buttonCancel"
                          onClick={(e) => this.handleCancel(e)}>
                          <i className="icon delete"></i>
                      </button>
                  </div>
                </form>
              :
                  <span >
                      <span className={"ui "+headerClasses+" blue header"}>
                          {/*item.playlistName*/this.state.playlistName}&nbsp;&nbsp;
                          {canEdit ?
                          <a className="ui basic edit" href="edit" 
                              onClick={(e) => { 
                                                  e.preventDefault();
                                                  this.setState({'whichPlaylist': playlistID})
                                              }
                                      }>
                              <i className="icon grey pencil alternate small"></i>
                          </a>
                          : ''}
                      </span>
                      {!isHeader?
                        <h5 className="ui inverted grey left aligned header">&nbsp;({this.state.URLsCount} URLs)</h5>
                      :
                        <span className="header">&nbsp;({this.props.URLsCount || this.state.URLsCount}
                        {isHeader && this.props.URLsCount < this.props.totalCount ? ' of '+this.props.totalCount:''} URLs)</span>
                      }
                  </span>
              }      
          </span>
          
            <span className="ui header left floated content">
            {isHeader?
              <Checkbox toggle label={item.isActive ?'Active': 'Inactive'} checked={item.isActive}
                onChange={(e) => this.updateIsActive (item.deviceGroupId, item.playlistID, !item.isActive)} 
              />
              : item.isActive ?'Active': ''
            }
            </span>

          <span className="right floated content ui basic icon buttons">
            {/*edit button - temp. hidden on header */}
            {true/*!this.state.isHeader*/?
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
                  onClick={e => this.deleteItem(e, item.playlistID, item.deviceGroupId)}>
                  <i className="icon trash large"></i>
              </button>
            :''}
          </span>
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
