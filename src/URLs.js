import React, {Component} from 'react';
import firebase from './Firebase';
import URLsList from './URLsList';
import { FaUndo, FaRandom } from 'react-icons/fa';

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
      this.chooseRandom = this.chooseRandom.bind(this);
    }
  
    componentDidMount(){
        //Let's get the playlist name for the heading
        const ref2 = firebase.database().ref(`playlists/${this.props.userID}/${this.props.playlistID}`);
        ref2.on('value', snapshot => {
            let playlistName = snapshot.val().playlistName;
            this.setState({
                playlistName: playlistName
            });
        });

        //gets URLs from Firebase and 
        //sets this.state.displayURLs
        const ref = firebase.database().ref(
            `playlists/${this.props.userID}/${this.props.playlistID}/URLs`
        );

        ref.on('value', snapshot => {
            let URLs = snapshot.val();
            let URLsList = [];
            //convert Object to Array
            for (let item in URLs){
                URLsList.push({
                    URLID: item,
                    URLName: URLs[item].URLName,
                    URLEmail: URLs[item].URLEmail,
                    star: URLs[item].star
                });
            }
            this.setState({
                displayURLs: URLsList,
                allURLs: URLsList
            });
        });
    }

    handleChange(e) {
        const itemName = e.target.name;
        const itemValue = e.target.value;
    
        this.setState({ [itemName]: itemValue });
      }    

      chooseRandom(){
        const randomURLIndex = Math.floor(
          Math.random() * this.state.allURLs.length
        );
        if(randomURLIndex !== undefined){
            this.resetQuery();
            this.setState({
              displayURLs: [this.state.allURLs[randomURLIndex]]
            });
        }
      }
    
      resetQuery() {
        this.setState({
          displayURLs: this.state.allURLs,
          searchQuery: ''
        });
      }
        
    render() {
        const dataFilter = item =>
          item.URLName
            .toLowerCase()
            .match(this.state.searchQuery.toLowerCase()) && true;
        const filteredURLs = this.state.displayURLs.filter(
          dataFilter
        );
    
        return(
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <h4 className="text-center font-weight-bolder">
                            {this.state.playlistName} URLs
                        </h4>
                        <div className="card bg-light mb-4">
                            <div className="card-body text-center">
                                <div className="input-group input-group-lg">
                                    <input
                                        type="text"
                                        name="searchQuery"
                                        value={this.state.searchQuery}
                                        placeholder="Search URLs"
                                        className="form-control"
                                        onChange={this.handleChange}
                                    />
                                    <div className="input-group-append">
                                        <button
                                        className="btn btn-sm btn-outline-info "
                                        title="Pick a random URL"
                                        onClick={() => this.chooseRandom()}
                                        >
                                        <FaRandom />
                                        </button>
                                        <button
                                        className="btn btn-sm btn-outline-info "
                                        title="Reset Search"
                                        onClick={() => this.resetQuery()}
                                        >
                                        <FaUndo />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <URLsList
                userID={this.props.userID}
                playlistID={this.props.playlistID}
                adminUser={this.props.adminUser}
                URLs={filteredURLs}
                />
            </div>
        );
    }
}

export default URLs;