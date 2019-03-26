import React, { Component } from 'react';
import { navigate } from '@reach/router';
import firebase from '../../../utils/Firebase';
import FormError from '../../../FormError';
import { GoTrashcan } from 'react-icons/go';
import { MdPlaylistAdd, MdEdit } from 'react-icons/md';


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
            <div className="container" key={item.playlistID}>
                <section className="row border-top clearfix pt-2 pb-2">
                    <div className="col-8 float-left text-left">
                        <div className="text-break">{item.playlistName}</div>
                    </div>
                    <div className="col-4 float-right">
                        <div className="btn-group float-right border" role="group">
                        <button className="btn btn-sm btn-outline-secondary mr-1"
                        title="Add URL"
                        onClick={() => navigate(`/addURL/${this.props.userID}/${item.playlistID}`)}
                        >
                        <MdPlaylistAdd />
                        </button>
                        <button className="btn btn-sm btn-outline-secondary mr-1"
                        title="URLs List"
                        onClick={() => navigate(`/URLs/${this.props.userID}/${item.playlistID}`)}
                        >
                        <MdEdit />
                        </button>
                        <button className="btn btn-sm btn-outline-secondary"
                        title="Delete Playlist"
                        onClick={e => this.deletePlaylist(e, item.playlistID)}
                        >
                        <GoTrashcan />
                        </button>
                        </div>
                    </div>
                </section>
            </div>
        );
    });
    return (
      <div>
        {this.state.errorMessage !== null ?
        <FormError 
            theMessage={this.state.errorMessage}
        /> : null}

        {myPlaylists}
      </div>
    );
  }
}

export default PlaylistsList;
