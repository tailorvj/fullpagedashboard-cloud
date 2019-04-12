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

    componentWillUnmount() {
        // this.ref.off();
    }

  render() {
    const { playlists } = this.props;
    const myPlaylists = playlists.map((item) => {
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
                <div className="content" style={{paddingTop: .5 + 'em'}}>
                    <h2 className="header">{item.playlistName}</h2>
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
        <div className="ui animated selection relaxed divided list">
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
