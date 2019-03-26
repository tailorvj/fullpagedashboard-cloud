import React, {Component} from 'react';
import { navigate } from '@reach/router';
import firebase from '../../../utils/Firebase';
import URLsList from './URLsList';
import { MdPlaylistAdd } from 'react-icons/md';

class URLs extends Component {
    constructor(props) {
      super(props);
      this.state = {
        searchQuery: '',
        allURLs: [],
        displayURLs: [],
        playlistName: ''
      };
  
      this.handleChange = this.handleChange.bind(this);
      this.resetQuery = this.resetQuery.bind(this);

      this.ref = '';
      this.ref2 = '';
    }
  
    componentDidMount(){
        this._isMounted = true;
        //Let's get the playlist name for the heading
        if(this.props.userID && this.props.playlistID){
            this.ref2 = firebase.database().ref(`playlists/${this.props.userID}/${this.props.playlistID}`);
            this.ref2.on('value', snapshot => {
                let playlistName = snapshot.val().playlistName;
                if(this._isMounted){
                    this.setState({
                    playlistName: playlistName
                    });
                }
            });
        }

        //gets URLs from Firebase and 
        //sets this.state.displayURLs
        this.ref = firebase.database().ref(
            `playlists/${this.props.userID}/${this.props.playlistID}/URLs`
        );

        this.ref.on('value', snapshot => {
            let URLs = snapshot.val();
            let URLsList = [];
            //convert Object to Array
            for (let item in URLs){
                URLsList.push({
                    URLID: item,
                    URLDescription: URLs[item].URLDescription,
                    URLURL: URLs[item].URLURL,
                    URLDuration: URLs[item].URLDuration,
                    star: URLs[item].star                            
                });
            }
            if(this._isMounted){
                this.setState({
                displayURLs: URLsList,
                allURLs: URLsList
                });
            }
        });  
    }
    
    componentWillUnmount() {
        this._isMounted = false;
        this.ref.off();
        this.ref2.off();
    }

    handleChange(e) {
        const itemName = e.target.name;
        const itemValue = e.target.value;
    
        this.setState({ [itemName]: itemValue });
    }    
    
    resetQuery() {
        this.setState({
          displayURLs: this.state.allURLs,
          searchQuery: ''
        });
    }
        
    render() {
        const dataFilter = item =>
            item.URLDescription
            .toLowerCase()
            .match(this.state.searchQuery.toLowerCase()) && true;
        const filteredURLs = this.state.displayURLs.filter(
            dataFilter
        );
    
        return(
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-10 text-center">
                        <h1 className="font-weight-light">{this.state.playlistName}</h1>
                        <div className="card bg-light">
                            <div className="card-body text-center">

                                <div className="input-group input-group-lg">
                                    <input
                                        type="text"
                                        name="searchQuery"
                                        value={this.state.searchQuery}
                                        placeholder="Filter URLs"
                                        className="form-control"
                                        onChange={this.handleChange}
                                    />
                                    <div className="input-group-append">
                                        <button
                                        type="submit"
                                        className="btn btn-sm btn-info"
                                        id="buttonAdd"
                                        onClick={() => navigate(`/addURL/${this.props.userID}/${this.props.playlistID}`)}
                                        >
                                            <MdPlaylistAdd />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {filteredURLs && filteredURLs.length ?
                    <div className="col-11 col-md-8 text-center">
                        <div className="card border-top-0 rounded-0">
                            <div className="card-body py-2">
                                <h4 className="card-title font-weight-light m-0">
                                    Playlist URLs
                                </h4>
                            </div>
                            <div className="div-group div-group-flush">
                            <URLsList
                            userID={this.props.userID}
                            playlistID={this.props.playlistID}
                            adminUser={this.props.adminUser}
                            URLs={filteredURLs}
                            />
                            </div>
                        </div>
                    </div>
                    : null}
                </div>
            </div>
        );
    }
}

export default URLs;