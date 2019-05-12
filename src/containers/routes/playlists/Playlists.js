import React, {Component} from 'react';
import {db} from '../../../utils/Firebase';
import PlaylistsList from './PlaylistsList';

class Playlists extends Component {
    constructor(props) {
        super(props);
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addPlaylist = this.addPlaylist.bind(this);
        this.resetQuery = this.resetQuery.bind(this);
        this.getData = this.getData.bind(this);
        this.addPlaylist = this.addPlaylist.bind(this);
        this.deletePlaylist = this.deletePlaylist.bind(this);
        this.getPlaylists = this.getPlaylists.bind(this);

        this.state ={
            debug:false,
            searchQuery: '',
            playlistName: '',
            playlists: [],
            howManyPlaylists: 0,
            refreshReq: false
        };
        
     }
     getData()
     {

        //get user user groups

        this.userUserGroupsRef = db.collection('users/'+this.props.userID+'/user_user_groups');
        this.userUserGroupsRef.onSnapshot( UGsnapshot => 
        {
            let userGroupsList = this.state.userGroups || []; //Helper Array

            UGsnapshot.forEach( doc => 
            {
                const userGroupId = doc.id;
                if(this.state.debug) console.log("in Playlists.js - getData - user group "+doc.id);
                //get user device groups

                this.userDeviceGroupsRef = db.collection('/device_groups/').where("userGroupId", "==", userGroupId);
                this.userDeviceGroupsRef
                    .onSnapshot( DGsnapshot => 
                // db.collection('/device_groups/')
                //     .where("userGroupId", "==", userGroupId)
                //     .get()
                //     .then( DGsnapshot =>
                {
                    let deviceGroupsList = []; //Helper Array

                    if(this.state.debug) {
                        if(DGsnapshot)
                            if(this.state.debug) console.log("in Playlists.js - getData - user group "+doc.id + " size:"+DGsnapshot.size);
                        else
                            if(this.state.debug) console.log("in Playlists.js - getData - user group "+doc.id + " size:0");
                    }

                    DGsnapshot.forEach( doc => 
                    {
                        const deviceGroupId = doc.id;
                        const deviceGroupName = doc.data().name;
                        if(this.state.debug) console.log("user group id:" + userGroupId + ", device group id:" + deviceGroupId);

                       // get device group playlists

                       var playlistsList = this.getPlaylists(deviceGroupId, deviceGroupName);

                       deviceGroupsList.push({
                          deviceGroupsID: deviceGroupId, //.data()
                          deviceGroupName: deviceGroupName,
                          playlists: playlistsList,
                          howManyPlaylists: playlistsList.length

                        });
                    });

                    userGroupsList.push({
                        userGroupsID: userGroupId, //.data
                        deviceGroups: deviceGroupsList,
                        howManyDeviceGroups: deviceGroupsList.length                        
                    });

                    this.setState({
                        userGroups: userGroupsList,
                        howManyUserGroups: userGroupsList.length
                    });

                  });

            });

        });
     }
     getPlaylists(deviceGroupId, deviceGroupName)
     {
        let playlistsList = this.state.playlists || []; //Helper Array

        this.playlistsRef = 
            db.collection('/playlists')
            ;
        this.playlistsRef
            .where("deviceGroupId", "==", deviceGroupId)
            .orderBy("name", "asc")
            .onSnapshot( snapshot => 
        {

            snapshot.forEach( doc => {
                const playlistID = doc.id;
                if(this.state.debug) console.log("device group:"+deviceGroupId+" playlist: ("+playlistID+ ') ' + doc.data().name);

                // if (playlistsList.includes())
                if (playlistsList.filter(
                    function(e) { 
                        return  e.deviceGroupId === deviceGroupId && 
                                e.playlistID === playlistID; 
                    }
                ).length === 0) {
                  /* playlistsList doesn't contain the element we're looking for */
                    playlistsList.push({
                      deviceGroupId: deviceGroupId,
                      deviceGroupName: deviceGroupName,
                      playlistID: playlistID,
                      playlistName: doc.data().name
                    });
                }

            });
            this.setState({
                playlistName: '',
                playlists: playlistsList,
                howManyPlaylists: playlistsList.length
            });
        });
        return playlistsList;

     }
    componentDidMount(){
        this._isMounted = true;
        this.getData();
    }       

    componentWillUnmount() {
        this._isMounted = false;
        try{
            this.userUserGroupsRef();
            this.userDeviceGroupsRef();
            this.playlistsRef();
        }
        catch(e) {};
    }

    handleChange(e) {
        const itemName = e.target.name;
        const itemValue = e.target.value;

        this.setState({ [itemName]: itemValue });
    }

    handleSubmit(e){
        e.preventDefault();

        this.addPlaylist(
            document.getElementsByName("deviceGroupId")[0].value,
            document.getElementsByName("playlistName")[0].value
            ); //this.state.playlistName
        this.setState({playlistName: ''});
    }    
    addPlaylist = (deviceGroupId, playlistName) => {
        let that=this;
        var devGroupRef = db.collection('/device_groups/'+deviceGroupId+'/playlists');
        db.collection('/playlists/')
            .add({ name: playlistName, description: '', isActive:false , deviceGroupId: deviceGroupId })
            .then(function(docRef) {
                devGroupRef.doc(docRef.id).set({});
                // Force a render with a simulated state change
                that.setState(that.state);
                that.forceUpdate();
            });

    };
    deletePlaylist = (e, whichPlaylist, deviceGroupId) => {
      if(this.state.debug) console.log("delete playlist "+whichPlaylist+" of device-group "+deviceGroupId);
      e.preventDefault();
      let that=this;
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

    resetQuery() {
        this.setState({
          searchQuery: ''
        });
    }

    render(){
        const {playlistName, playlists, searchQuery} = this.state;
        let filteredList = [];
        let groups = [];

        let distinctDeviceGroups = [];
        const deviceGroupsList = playlists.map((item) => 
            {
                if (!distinctDeviceGroups.includes(item.deviceGroupId))
                {
                    distinctDeviceGroups.push(item.deviceGroupId);
                    groups.push({id: item.deviceGroupId, name: item.deviceGroupName});

                    return(
                        <option key={item.deviceGroupId} value={item.deviceGroupId}>{item.deviceGroupName}</option>
                    );
                }
                else
                    return null;
            });

        const dataFilter = item =>
            (item.playlistName || '')
            .toLowerCase()
            .match(searchQuery.toLowerCase()) && true;

        if (playlists)
            filteredList = playlists.filter(
                dataFilter
            );

        return (
            <div className="ui tab basic segment active" data-tab="playlists">
                <div className="ui basic segment silver-card">
                    <h4 className="ui grey header">
                        Add a Playlist
                    </h4>

                    <form className="ui form" onSubmit={this.handleSubmit}>
                        <div className="ui text container">
                          <select 
                            className="ui sub header dropdown"
                            name="deviceGroupId" 
                            onChange={this.handleChange}>
                          {deviceGroupsList}
                          </select>
                            <div className="ui basic field">
                                <div className="ui action input">
                                    <input type="text" 
                                        placeholder="New playlist name..." 
                                        name="playlistName"
                                        aria-describedby="buttonAdd"
                                        value={playlistName}
                                        onChange={this.handleChange}
                                        style={{paddingRight: 1+'em'}}
                                    />
                                    <button className="ui icon button" 
                                        type="submit" id="buttonAdd"
                                        style={{marginLeft: -1+'em'}}>
                                        <i className="plus icon"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

 
                <div className="ui basic segment ">
                    <div className="ui header">
                        <span className="ui blue header">Playlists</span>
                        <span className="header">&nbsp;&nbsp;(
                                        {filteredList && filteredList.length && filteredList.length < this.state.howManyPlaylists ? 
                                            filteredList.length + ' of '
                                        :''}
                                        {this.state.howManyPlaylists} items)
                        </span>
                    </div>
                    <form className="ui form">
                        <div className="ui basic field">
                            <div className={ (searchQuery.length? 'action':'icon') + ' ui input'}>
                                {!searchQuery.length?
                                <i className="filter disabled icon"></i>
                                :null}
                                <input type="text"
                                    name="searchQuery"
                                    value={searchQuery}
                                    placeholder="Filter..."
                                    onChange={this.handleChange}
                                    style={{paddingRight: 1 + 'em!important'}}
                                />
                                {searchQuery.length?
                                <button className="ui icon button "  style={{marginLeft: -1 + 'em'}}
                                    onClick={this.resetQuery}>
                                    <i className="close icon"></i>
                                </button> 
                                :null}
                            </div>
                        </div>
                    </form>
                </div>

                <div className="ui divider hidden"/>
                <div>
                    <PlaylistsList deletePlaylist={(e, whichPlaylist, deviceGroupId)=>this.deletePlaylist(e, whichPlaylist, deviceGroupId)}
                        distinctDeviceGroups = {distinctDeviceGroups}
                        playlists={filteredList} 
                        groups={groups}
                        userID={this.props.userID}
                    />
                </div>

            </div>
        );
    }
}

export default Playlists;