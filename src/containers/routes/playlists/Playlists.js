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
        this.getPlaylists = this.getPlaylists.bind(this);

        this.userRef='';
        this.userUserGroupsRef='';
        this.userDeviceGroupsRef='';
        this.playlistsRef = '';
        this.URLs='';

        this.state ={
            searchQuery: '',
            playlistName: '',
            playlists: [],
            howManyPlaylists: 0
        };
        
     }
     getData()
     {

        //get user user groups

        this.userUserGroupsRef = db.collection('users/'+this.props.userID+'/user_user_groups');
        this.userUserGroupsRef.onSnapshot( snapshot => 
        {
            let userGroupsList = []; //Helper Array

            snapshot.forEach( doc => 
            {
                const userGroupId = doc.id;

                //get user device groups

                this.userDeviceGroupsRef = db.collection('/device_groups/');
                this.userDeviceGroupsRef
                    .where("userGroupId", "==", userGroupId)
                    .onSnapshot( snapshot => 
                {
                    let deviceGroupsList = []; //Helper Array

                    snapshot.forEach( doc => 
                    {
                        const deviceGroupId = doc.id;
                        const deviceGroupName = doc.data().name;
                        console.log("user group id:" + userGroupId + ", device group id:" + deviceGroupId);

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
            .where("deviceGroupId", "==", deviceGroupId);
        this.playlistsRef
            .orderBy("name", "asc")
            .onSnapshot( snapshot => 
        {

            snapshot.forEach( doc => {
                const playlistID = doc.id;
                console.log("playlist: "+playlistID+ ' ' + doc.data().name);

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
        // this.playlistsRef.off();
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
        // this.ref = firebase
        //   .database()
        //   .ref(`playlists/${this.props.userID}`);
        // this.ref.push({ playlistName: playlistName });
        // this.playlistsRef = 
        //     db.collection('/playlists/');
            /*.where("deviceGroupId", "==", deviceGroupId);*/

        db.collection('/playlists/')
            .add({ name: playlistName, description: '', isActive:false , deviceGroupId: deviceGroupId })
            .then(function(docRef) {
                db.collection('/device_groups/'+deviceGroupId+'/playlists').doc(docRef.id);
            });

    };
    resetQuery() {
        this.setState({
          searchQuery: ''
        });
    }

    render(){
        const {playlistName, playlists, searchQuery} = this.state;
        let filteredList = [];

        let distinctDeviceGroups = [];
        const deviceGroupsList = playlists.map((item) => 
            {
                if (!distinctDeviceGroups.includes(item.deviceGroupId))
                {
                    distinctDeviceGroups.push(item.deviceGroupId);
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
            <div className="ui container">
                <div className="ui header">
                    Add a Playlist
                </div>
                <div className="ui basic segment">

                    <form className="ui form" onSubmit={this.handleSubmit}>
                        <div className="fields">
                            <div className="field">
                              <label>Device Group</label>
                              <select 
                                className="ui fluid dropdown"
                                name="deviceGroupId" 
                                onChange={this.handleChange}>
                              {deviceGroupsList}
                              </select>
                            </div>
                            <div className="field">
                                {/*<div className="ui action input">*/}
                                    <label>Playlist Name</label>
                                    <input type="text" 
                                        placeholder="New playlist name..." 
                                        name="playlistName"
                                        aria-describedby="buttonAdd"
                                        value={playlistName}
                                        onChange={this.handleChange}
                                    />
                            </div>
                            <div className="field">
                                <label>&nbsp;</label>
                                <button className="ui icon button" type="submit" id="buttonAdd">
                                    <i className="plus icon"></i>
                                </button>
                            </div>
                        </div>
                    </form>

                    {/*{filteredList && filteredList.length ?*/}
                    <div className="ui very padded basic segment left aligned">
                        <div className="ui inverted red segment" style={{display: 'flex',alignItems: 'center'}}>
                            <span className="ui content header huge" 
                                style={{marginBottom: 0}}>Your Playlists&nbsp;</span>
                            <span className="ui {searchQuery.length? 'action':''} input icon right floated content">
                                 <input type="text"
                                    name="searchQuery"
                                    value={searchQuery}
                                    placeholder="Filter..."
                                    onChange={this.handleChange}
                                />
                                {!searchQuery.length?
                                <i className="filter disabled icon"></i>
                                :
                                <button className="ui basic inverted  white button icon"  
                                    onClick={this.resetQuery}><i className="close icon"></i></button>                                
                                }
                            </span>
                            <span className="ui header content"
                                style={{marginTop: 0}}>&nbsp;&nbsp;(
                                    {filteredList && filteredList.length && filteredList.length < this.state.howManyPlaylists ? 
                                        filteredList.length + ' of '
                                    :''}
                                    {this.state.howManyPlaylists} Playlists)</span>
    
                        </div>
                        <PlaylistsList 
                            distinctDeviceGroups = {distinctDeviceGroups}
                            playlists={filteredList} 
                            userID={this.props.userID}
                        />
                    </div>
                    {/*: null}*/}

                </div>
            </div>
        );
    }
}

export default Playlists;