import React, {Component} from 'react';
import {db} from '../../../utils/Firebase';
import PlaylistsList from './PlaylistsList';

class Playlists extends Component {
    constructor(props) {
        super(props);
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addItem = this.addItem.bind(this);
        this.resetQuery = this.resetQuery.bind(this);
        this.getData = this.getData.bind(this);
        this.addItem = this.addItem.bind(this);
        // this.deleteItem = this.deleteItem.bind(this);
        this.getItems = this.getItems.bind(this);

        this.state ={
            debug:true,
            searchQuery: '',
            playlistName: '',
            playlists: [],
            userGroups: [],
            deviceGroupsList: [], 
            distinctDeviceGroups: [], 
            groups: [],
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
                //get user device groups

                this.userDeviceGroupsRef = db.collection('/device_groups/').where("userGroupId", "==", userGroupId);
                this.userDeviceGroupsRef
                    .onSnapshot( DGsnapshot => 
                {
                    let deviceGroupsList = []; //Helper Array
                    let groups = [];

                    let distinctDeviceGroups = [];
                    let deviceGroupsListStr =[];

                    if(this.state.debug) {
                        if(DGsnapshot)
                            if(this.state.debug) console.log("user group id:" + userGroupId +", "+DGsnapshot.size+" device groups \n========================");
                    }

                    DGsnapshot.forEach( doc => 
                    {
                        const deviceGroupId = doc.id;
                        const deviceGroupName = doc.data().name;

                       // get device group playlists

                       var playlistsList = this.getItems(deviceGroupId, deviceGroupName);
                       deviceGroupsList.push({
                          deviceGroupsID: deviceGroupId, //.data()
                          deviceGroupName: deviceGroupName,
                          playlists: playlistsList,
                          howManyPlaylists: playlistsList.length

                        });
                        if (!distinctDeviceGroups.includes(deviceGroupId))
                        {
                            distinctDeviceGroups.push(deviceGroupId);
                            groups.push({id: deviceGroupId, name: deviceGroupName, count:playlistsList.length});

                            deviceGroupsListStr.push(
                                <option key={deviceGroupId} value={deviceGroupId}>{deviceGroupName}</option>);
                        }

                    });

                    userGroupsList.push({
                        userGroupsID: userGroupId, //.data
                        deviceGroups: deviceGroupsList,//?
                        howManyDeviceGroups: deviceGroupsList.length                        
                    });

                    this.setState({
                        userGroups: userGroupsList,
                        howManyUserGroups: userGroupsList.length,
                        deviceGroupsListStr, 
                        distinctDeviceGroups, 
                        groups
                    });


                });

            });

        });
     }
     getItems(deviceGroupId, deviceGroupName)
     {
        let playlistsList = this.state.playlists || []; //Helper Array

        if(this.state.debug) console.log("  device group:"+deviceGroupId+" - '"+deviceGroupName+"'\n-------------------");
        this.playlistsRef = db.collection('/playlists');
        this.playlistsRef
            .where("deviceGroupId", "==", deviceGroupId)
            .orderBy("name", "asc")
            .onSnapshot( snapshot => 
        {

            snapshot.forEach( doc => {
                const playlistID = doc.id;
                if(this.state.debug) console.log("    group: '"+deviceGroupName+"', playlist: ("+playlistID+ ') ' + doc.data().name);

                // if (playlistsList.includes())
                if (playlistsList.filter(
                    function(e) { 
                        return  e.deviceGroupId === deviceGroupId && 
                                e.playlistID === playlistID; 
                    }
                ).length === 0) {
                    const data = doc.data();
                  /* playlistsList doesn't contain the element we're looking for */
                    playlistsList.push({
                      deviceGroupId: deviceGroupId,
                      deviceGroupName: deviceGroupName,
                      playlistID: playlistID,
                      playlistName: data.name,
                      isActive: data.isActive,
                      description: data.description
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
            // this.playlistsRef();
            // this.playlistsRef1();
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

        this.addItem(
            document.getElementsByName("deviceGroupId")[0].value,
            document.getElementsByName("playlistName")[0].value
            ); //this.state.playlistName
        this.setState({playlistName: ''});
    }    
    addItem = (deviceGroupId, playlistName) => {
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

    resetQuery() {
        this.setState({
          searchQuery: ''
        });
    }

    render(){
        const {playlistName, playlists, searchQuery, deviceGroupsListStr, distinctDeviceGroups, groups} = this.state;
        let filteredList = [];

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

                    <form name="addItemForm" className="ui form" onSubmit={this.handleSubmit}>
                        <div className="ui text container">
                          <select 
                            className="ui sub header dropdown"
                            name="deviceGroupId" 
                            onChange={this.handleChange}>
                          {deviceGroupsListStr}
                          </select>
                            <div className="ui basic field">
                                <div className="ui action input">
                                    <input type="text" 
                                        placeholder="New playlist name..." 
                                        name="playlistName"
                                        aria-describedby="buttonAdd"
                                        value={playlistName}
                                        onChange={this.handleChange}
                                        onKeyDown={(e) => {
                                            if(e.keyCode===27)
                                            {
                                                document.getElementsByName("buttonReset")[0].click();
                                                this.setState({playlistName: ''});
                                            }
                                        }}
                                        style={{paddingRight: 1+'em'}}
                                    />
                                    <button className="ui icon button" 
                                        type="submit" id="buttonAdd"
                                        style={{marginLeft: -1+'em'}}>
                                        <i className="plus icon"></i>
                                    </button>
                                    <button style={{display:'none'}} type="reset" name="buttonReset"/>
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
                    <PlaylistsList /*deleteItem={(e, whichPlaylist, deviceGroupId)=>this.deleteItem(e, whichPlaylist, deviceGroupId)}*/
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