import React, {Component} from 'react';
import firebase from '../../../utils/Firebase';
import PlaylistsList from './PlaylistsList';

class Playlists extends Component {
    constructor(props) {
        super(props);
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addPlaylist = this.addPlaylist.bind(this);
        this.resetQuery = this.resetQuery.bind(this);
        
        this.playlistsRef = '';

        this.state ={
            playlistName: '',
            playlists: [],
            searchQuery: '',
            howManyPlaylists: 0
        };


     }

    componentDidMount(){
        this._isMounted = true;
        this.playlistsRef = firebase
          .database()
          .ref('playlists/' + this.props.userID)
          .orderByChild("playlistName");

        this.playlistsRef.on('value', snapshot => {
            let playlists = snapshot.val();
            let playlistsList = []; //Helper Array

            for (let item in playlists) {
                playlistsList.push({
                  playlistID: item,
                  // playlist: playlists[item],
                  playlistName: playlists[item].playlistName,
                  playlistURLs: playlists[item].URLs || {}
                });
            }
            this.setState({
                playlistName: '',
                playlists: playlistsList,
                howManyPlaylists: playlistsList.length
            });
        });
    }       

    componentWillUnmount() {
        this._isMounted = false;
        this.playlistsRef.off();
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
          .ref(`playlists/${this.props.userID}`);
        this.ref.push({ playlistName: playlistName });
    };
    resetQuery() {
        this.setState({
          searchQuery: ''
        });
    }

    render(){
        const {playlistName, playlists, searchQuery} = this.state;
        var filteredList = [];

        const dataFilter = item =>
            (item.playlistName || '')
            .toLowerCase()
            .match(searchQuery.toLowerCase()) && true;

        if (playlists)
            filteredList = playlists.filter(
                dataFilter
            );

        return (
            <div className="ui container">
                <div className="ui header">
                    Add a Playlist
                </div>
                <div className="ui basic segment">

                    <form className="ui form" onSubmit={this.handleSubmit}>
                        <div className="ui action input">
                            <input type="text" 
                                placeholder="New playlist name..." 
                                name="playlistName"
                                aria-describedby="buttonAdd"
                                value={playlistName}
                                onChange={this.handleChange}
                            />
                            <button className="ui icon button" type="submit" id="buttonAdd">
                                <i className="plus icon"></i>
                            </button>
                        </div>
                    </form>

                    {filteredList && filteredList.length ?
                    <div className="ui very padded basic segment left aligned">
                        <div className="ui inverted red segment" style={{display: 'flex',alignItems: 'center'}}>
                            <span className="ui content header huge" 
                                style={{marginBottom: 0}}>Your Playlists&nbsp;</span>
                            <span className="ui {searchQuery.length? 'action':''} input icon right floated content">
                                 <input type="text"
                                    name="searchQuery"
                                    value={searchQuery}
                                    placeholder="Filter..."
                                    onChange={this.handleChange}
                                />
                                {!searchQuery.length?
                                <i className="filter disabled icon"></i>
                                :
                                <button className="ui basic inverted  white button icon"  
                                    onClick={this.resetQuery}><i className="close icon"></i></button>                                
                                }
                           </span>
                        </div>
                        <PlaylistsList 
                            playlists={filteredList} 
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