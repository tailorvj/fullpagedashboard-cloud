import React, { Component } from 'react';
import { navigate } from '@reach/router';
import firebase from '../../../utils/Firebase';
import FormError from '../../../FormError';
import { GoTrashcan, GoListUnordered } from 'react-icons/go';
import { FaUserCheck } from 'react-icons/fa';


class PlaylistsList extends Component {
    constructor(props){
        super(props);
        this.state = {
        errorMessage: null
        }
        this.deleteMetting = this.deletePlaylist.bind(this);
    }

    deletePlaylist = (e, whichPlaylist) => {
        e.preventDefault();
        // console.log(`delete btn pressed: whichPlaylist: ${whichPlaylist} userID: ${this.props.userID}`);
        try{
        const ref = firebase.database().ref(
            `playlists/${this.props.userID}/${whichPlaylist}`
        );
        ref.remove();
        }
        catch(e) {
            this.setState({errorMessage: e});
        }
    }

  render() {
    // console.log(`PlaylistsList render. this.props.userID: ${this.props.userID} .`);
    const { playlists } = this.props;
    const myPlaylists = playlists.map((item) => {
        return(
            <div className="container" key={item.playlistID}>
                <section className="row border-top clearfix pt-2 pb-2">
                    <div className="col-10 float-left text-left">
                        <div>{item.playlistName}</div>
                    </div>
                    <div className="col-2 float-right">
                        <div className="btn-group float-right border" role="group">
                        <button className="btn btn-sm btn-outline-secondary mr-1"
                        title="Check In"
                        onClick={() => navigate(`/checkin/${this.props.userID}/${item.playlistID}`)}
                        >
                        <FaUserCheck />
                        </button>
                        <button className="btn btn-sm btn-outline-secondary mr-1"
                        title="URLs List"
                        onClick={() => navigate(`/URLs/${this.props.userID}/${item.playlistID}`)}
                        >
                        <GoListUnordered />
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
