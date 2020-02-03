import React, { Component } from 'react';

import DevicegroupView from './Devicegroup.view';


class DevicegroupsList extends Component {
    constructor(props){
        super(props);
        this.state = {
        errorMessage: null
        }
    }

  render() {
    const { devices, groups} = this.props;

    const myDevicesByGroup = groups.map((group,idx) => 
        {
            // if (devices.filter((item) => item.deviceGroupId !== group.id).length)
            //     return null;
            const groupDevices = devices.map((item) => 
            {
                if (item.deviceGroupId === group.id)
                    return(
                        <div className="item" key={item.deviceGroupId+"_"+item.deviceID}>
                            <DevicegroupView 
                                key={item.deviceGroupName+"_"+item.deviceID} 
                                item={item} 
                                userID={this.props.userID} 
                                deleteDevice={
                                    (e, whichDevice, deviceGroupId) => 
                                        this.props.deleteDevice(e, whichDevice, deviceGroupId)
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
                {groupDevices}
                <div className="ui divider hidden"/>
            </div>
            )          
        });
    // const myDevices = devices.map((item) => 
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
    //             <div className="item" key={item.deviceGroupId+"_"+item.deviceID}>
    //                 <DeviceView key={item.deviceGroupName+"_"+item.deviceID} item={item} userID={this.props.userID} deleteDevice={(e, whichDevice, deviceGroupId) => this.props.deleteDevice(e, whichDevice, deviceGroupId)}/>
    //             </div>
    //         );
    //     });

    return (
        // {/*<div className="ui animated relaxed divided list">*/
        <div>
            {myDevicesByGroup}
        </div>
        // {/*</div>*/}
    );
  }
}

export default DevicegroupsList;
