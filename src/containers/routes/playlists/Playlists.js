import React, {Component} from 'react';
import {db} from '../../../utils/Firebase';
import PlaylistsList from './PlaylistsList';
// import {Container, Header, Card} from 'semantic-ui-react'
//          <Container fluid>
//           <Header className="row" as="h5" dividing>{msg}</Header>
//           <Card.Group itemsPerRow={3}>
//             {contactsList}
//           </Card.Group>
//         </Container>

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

        // this.userRef='';
        // this.userUserGroupsRef='';
        // this.userDeviceGroupsRef='';
        // this.playlistsRef = '';
        // this.URLs='';

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
        this.userUserGroupsRef.onSnapshot( UGsnapshot => 
        {
            let userGroupsList = this.state.userGroups || []; //Helper Array

            UGsnapshot.forEach( doc => 
            {
                const userGroupId = doc.id;
                console.log("in Playlists.js - getData - user group "+doc.id);
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
                    if(DGsnapshot)
                        console.log("in Playlists.js - getData - user group "+doc.id + " size:"+DGsnapshot.size);
                    else
                        console.log("in Playlists.js - getData - user group "+doc.id + " size:0");

                    DGsnapshot.forEach( doc => 
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
            ;
        this.playlistsRef
            .where("deviceGroupId", "==", deviceGroupId)
            .orderBy("name", "asc")
            .onSnapshot( snapshot => 
        {

            snapshot.forEach( doc => {
                const playlistID = doc.id;
                console.log("device group:"+deviceGroupId+" playlist: ("+playlistID+ ') ' + doc.data().name);

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
        var devGroupRef = db.collection('/device_groups/'+deviceGroupId+'/playlists');
        db.collection('/playlists/')
            .add({ name: playlistName, description: '', isActive:false , deviceGroupId: deviceGroupId })
            .then(function(docRef) {
                devGroupRef.doc(docRef.id).set({});
            });

    };
    deletePlaylist = (e, whichPlaylist, deviceGroupId) => {
      console.log("delete playlist "+whichPlaylist+" of device-group "+deviceGroupId);
      e.preventDefault();
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
              console.log("deleteing URL: "+doc.id+ ' ' + JSON.stringify(doc.data()));
              db.collection('URLs').doc(doc.id).delete();
            }
          });
        });
        this.playlistsRef.doc(whichPlaylist).delete();
        // delete this playlist from the device group
        db.collection('device_groups').doc(deviceGroupId).collection('playlists').doc(whichPlaylist).delete();

        //temporary until we keep the data on app state (redux):
        // navigate('/login');
        //this.state.playlists
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
                <div className="ui segment">
                    <div className="ui header">
                        Add a Playlist
                    </div>

                    <form className="ui form" onSubmit={this.handleSubmit}>
                        <div className="ui text container">
                            <div className="ui basic field">
                              <select 
                                className="ui dropdown"
                                name="deviceGroupId" 
                                onChange={this.handleChange}>
                              {deviceGroupsList}
                              </select>
                            </div>
                            <div className="ui basic required field">
                                <div className="ui input">
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
                <div>
                    <div className="ui inverted red segment">
                        <div className="ui {searchQuery.length? 'action':''} input icon right floated content">
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
                        </div>
                    </div>

                    <div className="ui header"
                        style={{marginTop: 0}}>&nbsp;&nbsp;(
                            {filteredList && filteredList.length && filteredList.length < this.state.howManyPlaylists ? 
                                filteredList.length + ' of '
                            :''}
                            {this.state.howManyPlaylists} Playlists)
                    </div>

                    <PlaylistsList deletePlaylist={(e, whichPlaylist, deviceGroupId)=>this.deletePlaylist(e, whichPlaylist, deviceGroupId)}
                        distinctDeviceGroups = {distinctDeviceGroups}
                        playlists={filteredList} 
                        userID={this.props.userID}
                    />
                </div>

            </div>
        );
    }
}

export default Playlists;