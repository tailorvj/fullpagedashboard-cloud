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
      whichPlaylist: null , 
      itemName: this.props.item.deviceGroupName
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.updateItemName=this.updateItemName.bind(this);
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
      this.updateItemName(this.state.whichPlaylist,this.state.itemName);
      this.setState({whichPlaylist: null});
  }    
  handleCancel(e){debugger;
      e.preventDefault();
      this.setState({whichPlaylist: null, itemName: this.props.item.itemName});
  }    
  updateItemName = (playlistId, itemName) => {
      db.doc('playlists/'+playlistId).update({ name: itemName });
 }
 componentDidMount(){
    this._isMounted = true;
    this.getData();

  }
  getData(){
    const {item, URLsCount} = this.props;
    if (this.state.isHeader)
    {
      this.setState({URLsCount : URLsCount});
    }
    else
    {
      // this.URLs = db.collection('/URLs/').where("playlistId", "==", item.deviceGroupsID);

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
    const canEdit = this.state.whichPlaylist == null;
    const headerClasses = isHeader? '':'left aligned';
    const headerClasses2 = isHeader? 'ui header':'left floated content';
    return (
    <div className="ui basic item" key={deviceGroupsID}>
  
          <span className={headerClasses2}>
              {deviceGroupsID === this.state.whichPlaylist ? 
                <form className="ui form" onSubmit={this.handleSubmit}>
                  <button style={{display:'none'}} type="reset" name="buttonReset"/>
                  <div className="ui action input">
                      <input type="text" 
                          placeholder="Playlist name..." 
                          name="itemName"
                          aria-describedby="buttonUpdate"
                          value={/*item.itemName*/this.state.itemName }
                          onChange={(e) => this.handleChange(e,deviceGroupsID)}
                          onKeyDown={(e) => {
                              if(e.keyCode===27)
                              {
                                  document.getElementsByName("buttonReset")[0].click();
                                  this.setState({whichPlaylist: null, itemName: this.props.item.deviceGroupName});
                              }
                          }}

                      />
                      <button className="ui green basic icon button" type="submit" id="buttonUpdate">
                          <i className="check icon"></i>
                      </button>
                      <button className="ui red cancel basic icon button" href="#" type="cancel" id="buttonCancel"
                          onClick={(e) => this.setState({'whichPlaylist': null, 'itemName': null})}>
                          <i className="icon delete"></i>
                      </button>
                  </div>
                </form>
              :
                  <span >
                      <span className={"ui "+headerClasses+" blue header"}>
                          {/*item.itemName*/this.state.itemName}&nbsp;&nbsp;
                          {canEdit ?
                          <a className="ui basic edit" href="edit" 
                              onClick={(e) => { 
                                                  e.preventDefault();
                                                  this.setState({'whichPlaylist': deviceGroupsID})
                                              }
                                      }>
                              <i className="icon pencil alternate small"></i>
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
          <span className="right floated content ui basic icon buttons">
            {/*edit button - temp. hidden on header */}
            {true/*!this.state.isHeader*/?
              <button className="ui link button" href="#"
                  onClick={() => {
                    navigate(`/URL/${userID}/${deviceGroupsID}`,{state: { playlist:item}})
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
                    navigate(`/URLs/${userID}/${item.deviceGroupsID}`,{state: {deviceGroupsID:item.deviceGroupsID, playlist:item}})
                  }}>
                  <i className="icon eye large"></i>
              </button>
            :''}

            {/*delete button - temp. hidden on header */}
            {!this.state.isHeader?
              <button className="ui link button" href="#"
                  onClick={e => this.props.deletePlaylist(e, item.deviceGroupsID, item.deviceGroupId)}>
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
