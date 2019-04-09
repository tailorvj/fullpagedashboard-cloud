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
                <div className="right floated content">
                    <button 
                        className="ui basic icon button"
                        onClick={() => navigate(`/addURL/${this.props.userID}/${item.playlistID}`)}
                    >
                        <i className="icon edit"></i>
                    </button>
                    <button 
                        className="ui basic icon button"
                        onClick={() => navigate(`/URLs/${this.props.userID}/${item.playlistID}`)}
                    >
                        <i className="icon eye"></i>
                    </button>
                    <button 
                        className="ui basic icon button"
                        onClick={e => this.deletePlaylist(e, item.playlistID)}
                    >
                        <i className="icon delete"></i>
                    </button>
                </div>
                <i className="middle aligned icon list ul "></i>
                <div className="middle aligned content">
                  {item.playlistName}
                </div>
            </div>


        );
    });
    return (
        <div className="ui middle aligned animated selection divided list">
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
