import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import {Card,Image,Icon, Label} from 'semantic-ui-react'
// import cn from 'classnames'
import { navigate } from '@reach/router';
import firebase from '../../../utils/Firebase';

class URLView extends Component {
  constructor(props) {
    super(props);

    this.state = {
    	whichURL: '',
    	urlName: '',
    	errorMessage: null
   }
  }
  handleChange(e, whichURL) {
      const itemName = e.target.name;
      const itemValue = e.target.value;

      this.setState({'whichURL': whichURL, [itemName]: itemValue });
  }

  handleSubmit(e){
      e.preventDefault();
      this.updateURLName(this.state.whichURL,this.state.urlName);
      this.setState({whichURL: null , urlName: null});
  }    
  updateURLName = (urlID, urlName) => {
      this.ref = firebase
        .database()
        .ref(`playlists/${this.props.userID}/`+this.props.playlistID+'/URLs/'+urlID);
      this.ref.set({ urlName: urlName });
 }
 deleteURL = (e, whichURL) => {
    e.preventDefault();
    try{
      this.ref = firebase.database().ref(
          `playlists/${this.props.userID}/${this.props.playlistID}/URLs/${whichURL}`
      );
      this.ref.remove();
      //update parent !!!
      this.props.callback();
    }
    catch(e) {
        this.setState({errorMessage: e});
    }
}

  render() {
    const {  userID, playlistID , urlID, urlDesc, urlUrl, urlDuration} = this.props
    const canEdit = this.state.whichURL == null;
    return (
     <div className="item" key={urlID}>
        <div className="right floated content ui basic icon buttons">
        {/*
            // <button className="ui link button" href="#"
            //     onClick={() => {
            //       let listName = item.urlName;
            //       navigate(`/addURL/${this.props.userID}/${this.props.playlistID}`,{state: {playlistName:listName}})
            //     }}>
            //     <i className="large icons">
            //         <i className="fitted link  linkify icon"></i>
            //         <i className="plus corner icon"></i>
            //     </i>
            // </button>
        */}
            <button className="ui link button" href="#"
                onClick={() => {
                  //let listName = this.props.playlistName;
                  navigate(`/URL/${userID}/${playlistID}`,{state: {userID, playlistID , urlID, urlDesc, urlUrl, urlDuration, mode: "edit", playlistName: this.props.playlistName}});
                }}>
                <i className="icon pencil alternate large"></i>
            </button>
            <button className="ui link button" href="#"
                onClick={e => this.deleteURL(e, urlID)}>
                <i className="icon delete large"></i>
            </button>
        </div>
        <div className="content">
             <form className="ui form" onSubmit={this.handleSubmit}>
                {urlID === this.state.whichURL ? 
                    <div className="ui action input">
                        <input type="text" 
                            placeholder="New URL name..." 
                            name="urlDesc"
                            aria-describedby="buttonUpdate"
                            value={this.state.urlDesc || urlDesc}
                            onChange={(e) => this.handleChange(e,urlID)}
                        />
                        <button className="ui green basic icon button" type="submit" id="buttonUpdate">
                            <i className="check icon"></i>
                        </button>
                        <button className="ui red cancel basic icon button" href="#" type="cancel" id="buttonCancel"
                            onClick={(e) => this.setState({'whichURL': null, 'urlName': null})}>
                            <i className="icon delete"></i>
                        </button>
                    </div>
                :
                    <div >
                        <h2 className="header">
                            <a href={urlUrl} target="_blank" rel="noopener noreferrer">
                            {urlDesc}
                            </a>
                            &nbsp;&nbsp;
                            {canEdit ?
                            <a className="ui basic edit" href="edit" 
                                onClick={(e) => { 
                                                    e.preventDefault();
                                                    this.setState({'whichURL': urlID})
                                                }
                                        }>
                                <i className="icon pencil alternate small"></i>
                            </a>
                            : ''}
                        </h2>
                        <h5 className="ui grey left aligned header">{urlDuration} ms</h5>
                     </div>
                }      
            </form>

        </div>
        {
            this.state.errorMessage !== null ?
                <div className="ui error message">{this.state.errorMessage}</div> 
            : null
        }

     </div>
    )
  }
}

URLView.propTypes = {
  userID: PropTypes.string.isRequired,
  playlistID: PropTypes.string.isRequired,
  urlID: PropTypes.string.isRequired,
  urlDesc: PropTypes.string.isRequired, 
  urlUrl: PropTypes.string.isRequired, 
  urlDuration: PropTypes.number.isRequired
}

export default URLView
