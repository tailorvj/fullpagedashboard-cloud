import React, {Component} from 'react';
import firebase from '../../../utils/Firebase';
import PlaylistsList from './PlaylistsList';

class Playlists extends Component {
    constructor(props) {
        super(props);
        this.state = {
          playlistName: ''
        };
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addPlaylist = this.addPlaylist.bind(this);
      }
        
    handleChange(e) {
    const itemName = e.target.name;
    const itemValue = e.target.value;

    this.setState({ [itemName]: itemValue });
    }

    handleSubmit(e){
    e.preventDefault();
    this.addPlaylist(this.state.playlistName);
    this.setState({playlistName: ''});
    }    
    addPlaylist = playlistName => {
        this.ref = firebase
          .database()
          .ref(`playlists/${this.props.userID}`)
          .orderByChild("playlistName");
        this.ref.push({ playlistName: playlistName });
    };

    render(){
        // console.log(`Playlists render. this.props.userID: ${this.props.userID} .`);
        return (
            <div className="ui container">
                <div className="ui header">Add a Playlist</div>
                <div className="ui basic segment">

                    <form className="ui form" onSubmit={this.handleSubmit}>
                        <div className="ui actio    n input">
                            <input type="text" 
                                placeholder="New playlist name..." 
                                name="playlistName"
                                aria-describedby="buttonAdd"
                                value={this.state.playlistName}
                                onChange={this.handleChange}
                            />
                            <button className="ui teal icon button" type="submit" id="buttonAdd">
                                <i className="plus icon"></i>
                            </button>
                        </div>
                    </form>

                    {this.props.playlists && this.props.playlists.length ?
                    <div className="ui very padded basic segment">
                        <h2 className="ui header">Your Playlists</h2>
                        <PlaylistsList 
                            playlists={this.props.playlists} 
                            userID={this.props.userID}
                        />
                    </div>
                    : null}

                </div>
            </div>
        );
    }
}

export default Playlists;