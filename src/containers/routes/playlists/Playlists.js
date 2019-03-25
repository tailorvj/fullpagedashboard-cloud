import React, {Component} from 'react';
import PlaylistsList from './PlaylistsList';

class Playlists extends Component {
    constructor(props) {
        super(props);
        this.state = {
          playlistName: ''
        };
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }
        
    handleChange(e) {
    const itemName = e.target.name;
    const itemValue = e.target.value;

    this.setState({ [itemName]: itemValue });
    }

    handleSubmit(e){
    e.preventDefault();
    this.props.addPlaylist(this.state.playlistName);
    this.setState({playlistName: ''});
    }    

    render(){
        // console.log(`Playlists render. this.props.userID: ${this.props.userID} .`);
        return (
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-8 text-center">
                        <h1 className="font-weight-light">Add a Playlist</h1>
                        <div className="card bg-light">
                            <div className="card-body text-center">
                                <form
                                    className="formgroup"
                                    onSubmit={this.handleSubmit}
                                >
                                    <div className="input-group input-group-lg">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="playlistName"
                                            placeholder="New playlist name"
                                            aria-describedby="buttonAdd"
                                            value={this.state.playlistName}
                                            onChange={this.handleChange}
                                        />
                                        <div className="input-group-append">
                                            <button
                                            type="submit"
                                            className="btn btn-sm btn-info"
                                            id="buttonAdd"
                                            >
                                            +
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {this.props.playlists && this.props.playlists.length ?
                    <div className="col-11 col-md-6 text-center">
                        <div className="card border-top-0 rounded-0">
                            <div className="card-body py-2">
                                <h4 className="card-title font-weight-light m-0">
                                    Your Playlists
                                </h4>
                            </div>
                            <div className="div-group div-group-flush">
                                <PlaylistsList playlists={this.props.playlists} userID={this.props.userID} />
                            </div>
                        </div>
                    </div>
                    : null}
                </div>
            </div>
        );
    }
}

export default Playlists;