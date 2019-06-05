import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import {Card,Image,Icon, Label} from 'semantic-ui-react'
// import cn from 'classnames'
import { navigate } from '@reach/router';
import {db} from '../../../utils/Firebase';

class Usergroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isHeader: props.mode === "header",
      errorMessage: null,
      whichPlaylist: null , 
      playlistName: this.props.item.playlistName
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
      this.updateItemName(this.state.whichPlaylist,this.state.playlistName);
      this.setState({whichPlaylist: null});
  }    
  handleCancel(e){debugger;
      e.preventDefault();
      this.setState({whichPlaylist: null, playlistName: this.props.item.playlistName});
  }    
  updateItemName = (playlistId, playlistName) => {
      db.doc('playlists/'+playlistId).update({ name: playlistName });
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
      this.URLs = db.collection('/URLs/').where("playlistId", "==", item.playlistID);

      this.URLs
          .onSnapshot( snapshot => {
            this.setState({URLsCount : snapshot.size});
      });      
    }


  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { item, userID/*, URLsCount*/ } = this.props
    const {isHeader} = this.state;

    // const {URLsCount} = item;
    const playlistID = item.playlistID;//id;
    const canEdit = this.state.whichPlaylist == null;
    const headerClasses = isHeader? '':'left aligned';
    const headerClasses2 = isHeader? 'ui header':'left floated content';
    return (
    <div className="ui basic item" key={playlistID}>
  
          <span className={headerClasses2}>
              {playlistID === this.state.whichPlaylist ? 
                <form className="ui form" onSubmit={this.handleSubmit}>
                  <button style={{display:'none'}} type="reset" name="buttonReset"/>
                  <div className="ui action input">
                      <input type="text" 
                          placeholder="Playlist name..." 
                          name="playlistName"
                          aria-describedby="buttonUpdate"
                          value={/*item.playlistName*/this.state.playlistName }
                          onChange={(e) => this.handleChange(e,playlistID)}
                          onKeyDown={(e) => {
                              if(e.keyCode===27)
                              {
                                  document.getElementsByName("buttonReset")[0].click();
                                  this.setState({whichPlaylist: null, playlistName: this.props.item.playlistName});
                              }
                          }}

                      />
                      <button className="ui green basic icon button" type="submit" id="buttonUpdate">
                          <i className="check icon"></i>
                      </button>
                      <button className="ui red cancel basic icon button" href="#" type="cancel" id="buttonCancel"
                          onClick={(e) => this.setState({'whichPlaylist': null, 'playlistName': null})}>
                          <i className="icon delete"></i>
                      </button>
                  </div>
                </form>
              :
                  <span >
                      <span className={"ui "+headerClasses+" blue header"}>
                          {/*item.playlistName*/this.state.playlistName}&nbsp;&nbsp;
                          {canEdit ?
                          <a className="ui basic edit" href="edit" 
                              onClick={(e) => { 
                                                  e.preventDefault();
                                                  this.setState({'whichPlaylist': playlistID})
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
                    navigate(`/URL/${userID}/${playlistID}`,{state: { playlist:item}})
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
                    navigate(`/URLs/${userID}/${item.playlistID}`,{state: {playlistID:item.playlistID, playlist:item}})
                  }}>
                  <i className="icon eye large"></i>
              </button>
            :''}

            {/*delete button - temp. hidden on header */}
            {!this.state.isHeader?
              <button className="ui link button" href="#"
                  onClick={e => this.props.deletePlaylist(e, item.playlistID, item.deviceGroupId)}>
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

Usergroup.propTypes = {
  userID: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired/*,
  URLsCount: PropTypes.number.isRequired,*/
}

export default Usergroup
