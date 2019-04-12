import React, { Component } from 'react';
import { navigate } from '@reach/router';
import firebase from '../../../utils/Firebase';
import FormError from '../../../FormError';
// import { GoTrashcan } from 'react-icons/go';
// import { MdPlaylistAdd, MdEdit } from 'react-icons/md';


class PlaylistsList extends Component {
    constructor(props){
        super(props);
        this.state = {
        errorMessage: null
        }
        this.deleteMetting = this.deletePlaylist.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updatePlaylistName=this.updatePlaylistName.bind(this);

        this.ref = '';
    }

    deletePlaylist = (e, whichPlaylist) => {
        e.preventDefault();
        try{
        this.ref = firebase.database().ref(
            `playlists/${this.props.userID}/${whichPlaylist}`
        );
        this.ref.remove();
        }
        catch(e) {
            this.setState({errorMessage: e});
        }
    }
    handleChange(e, whichPlaylist) {
        const itemName = e.target.name;
        const itemValue = e.target.value;

        this.setState({'whichPlaylist': whichPlaylist, [itemName]: itemValue });
    }

    handleSubmit(e){
        e.preventDefault();
        this.updatePlaylistName(this.state.whichPlaylist,this.state.playlistName);
        this.setState({whichPlaylist: null , playlistName: null});
    }    
    updatePlaylistName = (playlistId, playlistName) => {
        this.ref = firebase
          .database()
          .ref(`playlists/${this.props.userID}/`+playlistId);
        this.ref.set({ playlistName: playlistName });
   }
    componentWillUnmount() {
        // this.ref.off();
    }

  render() {
    const { playlists } = this.props;
    const canEdit = this.state.whichPlaylist == null;
    const myPlaylists = playlists.map((item) => {
    let URLsCount=0;
        this.URLs = firebase
            .database()
            .ref(`playlists/${this.props.userID}/${item.playlistID}/URLs`)
            .on('value', snapshot => {
                const arrObj = snapshot? snapshot.val(): {};
                URLsCount = Object.keys(arrObj? arrObj: {}).length;
            });

        return(

            <div className="item" key={item.playlistID}>
                <div className="right floated content ui basic icon buttons">
                    <button className="ui link button" href="#"
                        onClick={() => navigate(`/addURL/${this.props.userID}/${item.playlistID}`)}>
                        <i className="large icons">
                            <i className="fitted link  linkify icon"></i>
                            <i className="plus corner icon"></i>
                        </i>
                    </button>
                    <button className="ui link button" href="#"
                        onClick={() => navigate(`/URLs/${this.props.userID}/${item.playlistID}`)}>
                        <i className="icon eye large"></i>
                    </button>
                    <button className="ui link button" href="#"
                        onClick={e => this.deletePlaylist(e, item.playlistID)}>
                        <i className="icon delete large"></i>
                    </button>
                </div>
                <div className="content">
                     <form className="ui form" onSubmit={this.handleSubmit}>
                        {item.playlistID === this.state.whichPlaylist ? 
                            <div className="ui action input">
                                <input type="text" 
                                    placeholder="New playlist name..." 
                                    name="playlistName"
                                    aria-describedby="buttonUpdate"
                                    value={this.state.playlistName || item.playlistName}
                                    onChange={(e) => this.handleChange(e,item.playlistID)}
                                />
                                <button className="ui green basic icon button" type="submit" id="buttonUpdate">
                                    <i className="check icon"></i>
                                </button>
                                <button className="ui red cancel basic icon button" href="#" type="cancel" id="buttonCancel"
                                    onClick={(e) => this.setState({'whichPlaylist': null, 'playlistName': null})}>
                                    <i className="icon delete"></i>
                                </button>
                            </div>
                        :
                            <div >
                                <h2 className="header">
                                    {item.playlistName}&nbsp;&nbsp;
                                    {canEdit ?
                                    <a className="ui basic edit" href="#" 
                                        onClick={(e) => { 
                                                            e.cancelEvent = true; 
                                                            this.setState({'whichPlaylist': item.playlistID})
                                                        }
                                                }>
                                        <i className="icon pencil alternate small"></i>
                                    </a>
                                    : ''}
                                </h2>
                                <h5 className="ui grey left aligned header">&nbsp;({URLsCount} URLs)</h5>
                            </div>
                        }      
                    </form>

                </div>
                {/*
                            <div className="item" key={item.playlistID}>
                                <div className="right floated content">
                                    <a className="ui basic icon" href="#" alt="Add URL"
                                       onClick={() => navigate(`/addURL/${this.props.userID}/${item.playlistID}`)}
                                    >
                                        <i className="large icons">
                                          <i className="linkify icon"></i>
                                          <i className="plus corner icon"></i>
                                        </i>
                                    </a>
                                    <a className="ui basic icon" href="#" alt=""
                                       onClick={() => navigate(`/URLs/${this.props.userID}/${item.playlistID}`)}
                                    ><i className="icon eye large"></i></a>

                                    <a className="ui basic icon" href="#"
                                        onClick={e => this.deletePlaylist(e, item.playlistID)}
                                    ><i className="icon delete large"></i></a>

                                </div>
                                <i className="middle aligned icon list ul "></i>
                                <div className="middle aligned content">
                                  {item.playlistName}
                                </div>
                            </div>
                */}
            </div>

        );
    });
    return (
        <div className="ui animated relaxed divided list">
        {/*<div className="ui middle aligned animated selection divided list">*/}
            {
                this.state.errorMessage !== null ?
                    <FormError theMessage={this.state.errorMessage}/> 
                : null
            }
            {myPlaylists}
        </div>
    );
  }
}

export default PlaylistsList;
