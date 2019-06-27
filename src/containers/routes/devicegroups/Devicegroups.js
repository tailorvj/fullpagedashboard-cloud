import React, {Component} from 'react';
import {db} from '../../../utils/Firebase';
import DevicegroupsList from './DevicegroupsList';

class Devicegroups extends Component {
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
            deviceDetails: '',
            devices: [],
            userGroups: [],
            deviceGroupsList: [], 
            distinctDeviceGroups: [], 
            groups: [],
            howManyDevices: 0,
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

                       // get device group devices
                       var devicesList = this.getItems(deviceGroupId, deviceGroupName);
                       deviceGroupsList.push({
                          deviceGroupsID: deviceGroupId, //.data()
                          deviceGroupName: deviceGroupName,
                          devices: devicesList,
                          howManyDevices: devicesList.length

                        });
                        if (!distinctDeviceGroups.includes(deviceGroupId))
                        {
                            distinctDeviceGroups.push(deviceGroupId);
                            groups.push({id: deviceGroupId, name: deviceGroupName, count:devicesList.length});

                            deviceGroupsListStr.push(
                                <option key={deviceGroupId} value={deviceGroupId}>{deviceGroupName}</option>);
                        }

                    });

                    //show un assigned devices
                    var devicesList = this.getItems("", "Un-Assigned Devices");
                    deviceGroupsList.push({
                        deviceGroupsID: "", 
                        deviceGroupName: "Un-Assigned Devices",
                        devices: devicesList,
                        howManyDevices: devicesList.length

                    });
                    groups.push({id: "", name: "Un-Assigned Devices", count:devicesList.length});

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
        let devicesList = this.state.devices || []; //Helper Array

        if(this.state.debug) console.log("  device group:"+deviceGroupId+" - '"+deviceGroupName+"'\n-------------------");
        this.devicesRef = 
            db.collection('/devices')
            ;
        this.devicesRef
            .where("deviceGroupId", "==", deviceGroupId)
            .orderBy("details", "asc")
            .onSnapshot( snapshot => 
        {

            snapshot.forEach( doc => {
                const deviceID = doc.id;
                if(this.state.debug) console.log("    group: '"+deviceGroupName+"', device: ("+deviceID+ ') ' + doc.data().details);

                // if (devicesList.includes())
                if (devicesList.filter(
                    function(e) { 
                        return  e.deviceGroupId === deviceGroupId && 
                                e.deviceID === deviceID; 
                    }
                ).length === 0) {
                  /* devicesList doesn't contain the element we're looking for */
                    devicesList.push({
                      deviceGroupId: deviceGroupId,
                      deviceGroupName: deviceGroupName,
                      deviceID: deviceID,
                      deviceDetails: doc.data().details
                    });
                }

            });
            this.setState({
                deviceDetails: '',
                devices: devicesList,
                howManyDevices: devicesList.length
            });
        });
        return devicesList;

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
            this.devicesRef();
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
            document.getElementsByName("deviceDetails")[0].value
            ); //this.state.deviceDetails
        this.setState({deviceDetails: ''});
    }    
    addItem = (deviceGroupId, deviceDetails) => {
        let that=this;
        var devGroupRef = db.collection('/device_groups/'+deviceGroupId+'/devices');
        db.collection('/devices/')
            .add({ details: deviceDetails/*, description: '', isActive:false  */, deviceGroupId: deviceGroupId})
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
        const {deviceDetails, devices, searchQuery, deviceGroupsListStr, distinctDeviceGroups, groups} = this.state;
        let filteredList = [];

        const dataFilter = item =>
            (item.deviceDetails || '')
            .toLowerCase()
            .match(searchQuery.toLowerCase()) && true;

        if (devices)
            filteredList = devices.filter(
                dataFilter
            );

        return (
            <div className="ui tab basic segment active" data-tab="devicegroups">
                <div className="ui basic segment silver-card">
                    <h4 className="ui grey header">
                        Add a Device
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
                                        placeholder="New device details..." 
                                        name="deviceDetails"
                                        aria-describedby="buttonAdd"
                                        value={deviceDetails}
                                        onChange={this.handleChange}
                                        onKeyDown={(e) => {
                                            if(e.keyCode===27)
                                            {
                                                document.getElementsByName("buttonReset")[0].click();
                                                this.setState({deviceDetails: ''});
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
                        <span className="ui teal header">Devices</span>
                        <span className="header">&nbsp;&nbsp;(
                                        {filteredList && filteredList.length && filteredList.length < this.state.howManyDevices ? 
                                            filteredList.length + ' of '
                                        :''}
                                        {this.state.howManyDevices} items)
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
                    <DevicegroupsList /*deleteItem={(e, whichDevice, deviceGroupId)=>this.deleteItem(e, whichDevice, deviceGroupId)}*/
                        distinctDeviceGroups = {distinctDeviceGroups}
                        devices={filteredList} 
                        groups={groups}
                         userID={this.props.userID}
                    />
                </div>

            </div>
        );
    }
}

export default Devicegroups;