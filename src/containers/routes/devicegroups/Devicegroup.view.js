import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import {Card,Image,Icon, Label} from 'semantic-ui-react'
// import cn from 'classnames'
import { navigate } from '@reach/router';
import {db} from '../../../utils/Firebase';
// import firebase from 'firebase/app';

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
  handleCancel(e){
      e.preventDefault();
      this.setState({whichDevice: null, deviceDetails: this.props.item.deviceDetails});
  }    
  updateItemName = (deviceId, deviceDetails) => {
    console.log("updateItemName: device id="+deviceId+" , device 'details'="+deviceDetails);
      db.doc('devices/'+deviceId).update({ details: deviceDetails });
 }
 deleteItem = (e, itemId) => {
    e.preventDefault();
    let that=this;

    db.doc('devices/'+itemId).update({ deviceGroupId: ""/*firebase.firestore.FieldValue.delete()*/ })
    // db.doc('devices/'+itemId).delete()
    .then(function() {
        console.log("Device "+itemId+" successfully deleted!");
        that.setState(that.state);
        that.forceUpdate();
        window.location.reload();//temp
    }).catch(function(error) {
        console.error("Error removing device: ", error);
    });  
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
      // this.URLs = db.collection('/URLs/').where("deviceId", "==", item.deviceID);

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
    const deviceID = item.deviceID;//id;
    const canEdit = this.state.whichDevice == null;
    const headerColor = item.deviceGroupId !=="" ? 'teal' : 'silver';
    const headerClasses = isHeader? headerColor : headerColor + ' left aligned';
    const headerClasses2 = isHeader? 'ui header':'left floated content';
    const headerStyles = isHeader? '' : {paddingTop: 10 + 'px'};
    return (
    <div className="ui basic item" key={deviceID}>
  
          <span className={headerClasses2} style={headerStyles}>
              {deviceID === this.state.whichDevice ? 
                <form className="ui form" onSubmit={this.handleSubmit} style={{marginTop: -7 + 'px'}}>
                  <button style={{display:'none'}} type="reset" name="buttonReset"/>
                  <div className="ui action input">
                      <input type="text" 
                          placeholder="Device name..." 
                          name="deviceDetails"
                          aria-describedby="buttonUpdate"
                          value={/*item.deviceDetails*/this.state.deviceDetails }
                          onChange={(e) => this.handleChange(e,deviceID)}
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
                          onClick={(e) => this.handleCancel(e)}>
                          <i className="icon delete"></i>
                      </button>
                  </div>
                </form>
              :
                  <span >
                      <span className={"ui "+headerClasses+" header"}>
                          {/*item.deviceDetails*/this.state.deviceDetails}&nbsp;&nbsp;
                          {item.deviceGroupId !=="" && canEdit ?
                          <a className="ui basic edit" href="edit" 
                              onClick={(e) => { 
                                                  e.preventDefault();
                                                  this.setState({'whichDevice': deviceID})
                                              }
                                      }>
                              <i className="icon grey pencil alternate small"></i>
                          </a>
                          : ''}
                      </span>
                      
                  </span>
              }      
          </span>
          <span className="right floated content ui basic icon buttons">
            {/*edit button - temp. hidden on header */}
            {false/*!this.state.isHeader*/?
              <button className="ui link button" href="#"
                  onClick={() => {
                    navigate(`/URL/${userID}/${deviceID}`,{state: { device:item}})
                  }}>
                  <i className="large icons">
                      <i className="fitted link  linkify icon"></i>
                      <i className="plus corner icon"></i>
                  </i>
              </button>
            :''}

            {/*view list button - hidden on header */}
            {false/*!this.state.isHeader*/?
              <button className="ui link button" href="#"
                  onClick={() => {
                    navigate(`/URLs/${userID}/${item.deviceID}`,{state: {deviceID:item.deviceID, device:item}})
                  }}>
                  <i className="icon eye large"></i>
              </button>
            :''}

            {/*delete button - temp. hidden on header */}
            {item.deviceGroupId !=="" && !this.state.isHeader?
              <button className="ui link button" href="#"
                  onClick={(e) => this.deleteItem(e, item.deviceID)}>
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
