import React, {Component} from 'react';
import {db} from '../../../utils/Firebase';
// import DevicegroupsList from './DevicegroupsList';
import DevicegroupView from './Devicegroup.view';

class Devicegroups extends Component {
    constructor(props) {
        super(props);
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
 
        this.resetQuery = this.resetQuery.bind(this);
        this.getData = this.getData.bind(this);

        this.addItem = this.addItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.getItems = this.getItems.bind(this);

        this.state ={
            debug:false,
            searchQuery: '',
            playlistName: '',
            playlists: [],
            userGroups: [],
            deviceGroupsList: [], 
            distinctDeviceGroups: [], 
            groups: [],
            howManyItems: 0,
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
            let userGroupsListStr =[];

            UGsnapshot.forEach( doc => 
            {
                const userGroupId = doc.id;
                let userGroupName = '';
                if(this.state.debug) console.log("in Playlists.js - getData - user group "+doc.id);

                this.userGroupRef = db.collection('/user_groups/').doc(doc.id);
                this.userGroupRef.onSnapshot (UGsnapshot => {
                    userGroupName = UGsnapshot.data().name;
                    userGroupsListStr.push(
                        <option key={userGroupId} value={userGroupId}>{userGroupName}</option>
                    );
                });

                //get user device groups
                this.userDeviceGroupsRef = db.collection('/device_groups/').where("userGroupId", "==", userGroupId);
                this.userDeviceGroupsRef.onSnapshot( DGsnapshot => 
                {
                    let deviceGroupsList = []; //Helper Array
                    // let groups = [];

                    let distinctDeviceGroups = [];

                    // if(this.state.debug) {
                    //     if(DGsnapshot)
                    //         if(this.state.debug) console.log("in Playlists.js - getData - user group "+doc.id + " size:"+DGsnapshot.size);
                    //     else
                    //         if(this.state.debug) console.log("in Playlists.js - getData - user group "+doc.id + " size:0");
                    // }

                    DGsnapshot.forEach( doc => 
                    {
                        const deviceGroupId = doc.id;
                        const deviceGroupName = doc.data().name;
                        if(this.state.debug) console.log("user group id:" + userGroupId + ", device group id:" + deviceGroupId);

                        // get device group playlists
                        // var playlistsList = this.getItems(deviceGroupId, deviceGroupName);
                        deviceGroupsList.push({
                          deviceGroupsID: deviceGroupId, //.data()
                          deviceGroupName: deviceGroupName//,
                          // playlists: playlistsList,
                          // howManyItems: playlistsList.length

                        });
                        if (!distinctDeviceGroups.includes(deviceGroupId))
                        {
                            distinctDeviceGroups.push(deviceGroupId);
                            // groups.push({id: deviceGroupId, name: deviceGroupName, count:playlistsList.length});
                        }

                    });

                    userGroupsList.push({
                        userGroupsID: userGroupId, //.data
                        userGroupName: userGroupName,
                        deviceGroups: deviceGroupsList,//?
                        howManyDeviceGroups: deviceGroupsList.length                        
                    });

                    this.setState({
                        userGroups: userGroupsList,
                        howManyUserGroups: userGroupsList.length,
                        userGroupsListStr, 
                        distinctDeviceGroups//, 
                        //groups
                    });


                });

            });

        });
     }
     getItems(deviceGroupId, deviceGroupName)
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
                howManyItems: playlistsList.length
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
    deleteItem = (e, whichItem, deviceGroupId) => {
      if(this.state.debug) console.log("delete playlist "+whichItem+" of device-group "+deviceGroupId);
      e.preventDefault();
      let that=this;
      try{
        //need to delete this playlist URLs -> 
        //TODO: it is recomended to do this via a cloud function !!!
        //https://firebase.google.com/docs/firestore/solutions/delete-collections
        db.collection('URLs').where("playlistId", "==", whichItem)
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
        this.playlistsRef.doc(whichItem)
            .delete()
            .then(function() {
                // Force a render with a simulated state change
                that.setState(that.state);
                that.forceUpdate();
            });

        // delete this playlist from the device group
        db.collection('device_groups').doc(deviceGroupId)
            .collection('playlists').doc(whichItem)
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
        const {playlistName, searchQuery, userGroupsListStr, distinctDeviceGroups, userGroups} = this.state;
        let filteredList = [];

        const dataFilter = item =>
            (item.playlistName || '')
            .toLowerCase()
            .match(searchQuery.toLowerCase()) && true;

        if (distinctDeviceGroups)
            filteredList = distinctDeviceGroups.filter(
                dataFilter
            );
    
        const myDeviceGroupsByUserGroup = userGroups.map((usergroup,idx) => 
        {
            const usergroupDeviceGroups = usergroup.deviceGroups.map((item) => 
            {
                return(
                    <div className="item" key={usergroup.userGroupsID+"_"+item.deviceGroupsID}>
                        <DevicegroupView 
                            key={usergroup.userGroupsID+"_"+item.deviceGroupName} 
                            item={item} 
                            userID={this.props.userID} 
                            deleteItem={
                                (e, whichItem, deviceGroupId) => 
                                    this.props.deleteItem(e, whichItem, deviceGroupId)
                            }
                        />
                    </div>
                )
            });

            return (
            <div className="ui animated relaxed divided list" key={idx+"_group"}>
                <div className="disabled item" key={usergroup.userGroupsID+"_item"}>                
                    <div className="divided content" key={usergroup.userGroupsID}>
                        <div key={usergroup.userGroupsID+"_title"} className="ui left aligned tiny grey sub header">{usergroup.deviceGroupName}</div>
                    </div>
                </div>
                {usergroupDeviceGroups}
                <div className="ui divider hidden"/>
            </div>
            )          
        });

        return (
            <div className="ui tab basic segment active" data-tab="devicegroups">
                <div className="ui basic segment silver-card">
                    <h4 className="ui grey header">
                        Add a Device Group
                    </h4>

                    <form name="addItemForm" className="ui form" onSubmit={this.handleSubmit}>
                        <div className="ui text container">
                          <select 
                            className="ui sub header dropdown"
                            name="deviceGroupId" 
                            onChange={this.handleChange}>
                          {userGroupsListStr}
                          </select>
                            <div className="ui basic field">
                                <div className="ui action input">
                                    <input type="text" 
                                        placeholder="New device group name..." 
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
                        <span className="ui teal header">Device Groups</span>
                        <span className="header">&nbsp;&nbsp;(
                                        {filteredList && filteredList.length && filteredList.length < this.state.howManyItems ? 
                                            filteredList.length + ' of '
                                        :''}
                                        {this.state.howManyItems} items)
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
                    {myDeviceGroupsByUserGroup}
                    {/*<DevicegroupsList deleteItem={(e, whichItem, deviceGroupId)=>this.deleteItem(e, whichItem, deviceGroupId)}
                        distinctDeviceGroups = {distinctDeviceGroups}
                        playlists={filteredList} 
                        groups={groups}
                        userID={this.props.userID}
                    />*/}
                </div>

            </div>
        );
    }
}

export default Devicegroups;