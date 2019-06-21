import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import {Card,Image,Icon, Label} from 'semantic-ui-react'
// import cn from 'classnames'
import { navigate } from '@reach/router';
import {db} from '../../../utils/Firebase';

class DevicegroupView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isHeader: props.mode === "header",
      errorMessage: null,
      whichDevice: null , 
      deviceDetails: this.props.item.deviceDetails
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.updateItemName=this.updateItemName.bind(this);
    this.getData=this.getData.bind(this);

    this.ref = '';
    this.URLs = '';
  }
  handleChange(e, whichDevice) {
      const itemName = e.target.name;
      const itemValue = e.target.value;

      this.setState({'whichDevice': whichDevice, [itemName]: itemValue });
  }

  handleSubmit(e){
      e.preventDefault();
      this.updateItemName(this.state.whichDevice,this.state.deviceDetails);
      this.setState({whichDevice: null});
  }    
  handleCancel(e){debugger;
      e.preventDefault();
      this.setState({whichDevice: null, deviceDetails: this.props.item.deviceDetails});
  }    
  updateItemName = (deviceId, deviceDetails) => {
      db.doc('devices/'+deviceId).update({ name: deviceDetails });
 }
 componentDidMount(){
    this._isMounted = true;
    this.getData();

  }
  getData(){
    const {/*item,*/ URLsCount} = this.props;
    if (this.state.isHeader)
    {
      this.setState({URLsCount : URLsCount});
    }
    else
    {
      // this.URLs = db.collection('/URLs/').where("deviceId", "==", item.deviceGroupsID);

      // this.URLs
      //     .onSnapshot( snapshot => {
      //       this.setState({URLsCount : snapshot.size});
      // });      
    }


  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { item, userID/*, URLsCount*/ } = this.props
    const {isHeader} = this.state;

    // const {URLsCount} = item;
    const deviceGroupsID = item.deviceGroupsID;//id;
    const canEdit = this.state.whichDevice == null;
    const headerClasses = isHeader? '':'left aligned';
    const headerClasses2 = isHeader? 'ui header':'left floated content';
    const headerStyles = isHeader? '' : {paddingTop: 10 + 'px'};
    return (
    <div className="ui basic item" key={deviceGroupsID}>
  
          <span className={headerClasses2} style={headerStyles}>
              {deviceGroupsID === this.state.whichDevice ? 
                <form className="ui form" onSubmit={this.handleSubmit} style={{marginTop: -7 + 'px'}}>
                  <button style={{display:'none'}} type="reset" name="buttonReset"/>
                  <div className="ui action input">
                      <input type="text" 
                          placeholder="Device name..." 
                          name="deviceDetails"
                          aria-describedby="buttonUpdate"
                          value={/*item.deviceDetails*/this.state.deviceDetails }
                          onChange={(e) => this.handleChange(e,deviceGroupsID)}
                          onKeyDown={(e) => {
                              if(e.keyCode===27)
                              {
                                  document.getElementsByName("buttonReset")[0].click();
                                  this.setState({whichDevice: null, deviceDetails: this.props.item.deviceDetails});
                              }
                          }}

                      />
                      <button className="ui green basic icon button" type="submit" id="buttonUpdate">
                          <i className="check icon"></i>
                      </button>
                      <button className="ui red cancel basic icon button" href="#" type="cancel" id="buttonCancel"
                          onClick={(e) => this.setState({'whichDevice': null, 'deviceDetails': null})}>
                          <i className="icon delete"></i>
                      </button>
                  </div>
                </form>
              :
                  <span >
                      <span className={"ui "+headerClasses+" blue header"}>
                          {/*item.deviceDetails*/this.state.deviceDetails}&nbsp;&nbsp;
                          {canEdit ?
                          <a className="ui basic edit" href="edit" 
                              onClick={(e) => { 
                                                  e.preventDefault();
                                                  this.setState({'whichDevice': deviceGroupsID})
                                              }
                                      }>
                              <i className="icon pencil alternate small"></i>
                          </a>
                          : ''}
                      </span>
                      
                  </span>
              }      
          </span>
          <span className="right floated content ui basic icon buttons">
            {/*edit button - temp. hidden on header */}
            {true/*!this.state.isHeader*/?
              <button className="ui link button" href="#"
                  onClick={() => {
                    navigate(`/URL/${userID}/${deviceGroupsID}`,{state: { device:item}})
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
                    navigate(`/URLs/${userID}/${item.deviceGroupsID}`,{state: {deviceGroupsID:item.deviceGroupsID, device:item}})
                  }}>
                  <i className="icon eye large"></i>
              </button>
            :''}

            {/*delete button - temp. hidden on header */}
            {!this.state.isHeader?
              <button className="ui link button" href="#"
                  onClick={e => this.props.deleteDevice(e, item.deviceGroupsID, item.deviceGroupId)}>
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

DevicegroupView.propTypes = {
  userID: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired/*,
  URLsCount: PropTypes.number.isRequired,*/
}

export default DevicegroupView
