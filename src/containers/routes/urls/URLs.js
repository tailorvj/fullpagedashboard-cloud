import React, {Component} from 'react';
import BackView from '../../global/Back.view';
import firebase from '../../../utils/Firebase';
import URLView from './URL.view'
import PlaylistView from '../playlists/Playlist.view';

class URLs extends Component {
    constructor(props) {
        super(props);
        const {userID} = this.props;
        this.state = {
            listName: '',
            list: [],
            searchQuery: '',
            howManyItems: 0,
            playlist: this.props.location.state.playlist,
            userID: userID
        };
        this.urlsRef = '';
        this.playlistRef = '';

        this.handleChange = this.handleChange.bind(this);
        this.resetQuery = this.resetQuery.bind(this);

     }
  
    componentDidMount(){
        this._isMounted = true;

        this.playlistRef = firebase
          .database()
          .ref('playlists/'+this.props.userID+'/'+this.props.playlistID);

        this.playlistRef.on('value', snapshot => {
            let playlist = snapshot.val();

            this.setState({
                playlist
            })
          });

        this.urlsRef = firebase
          .database()
          .ref('playlists/'+this.props.userID+'/'+this.props.playlistID+'/URLs/')
          .orderByChild("URLDescription");

        this.urlsRef.on('value', snapshot => {
            let URLs = snapshot.val();
            var list= [];

            for (let item in URLs){
                list.push({ //listItems
                    urlID: item, //itemID
                    urlDesc: URLs[item].URLDescription,
                    urlUrl: URLs[item].URLURL,
                    urlDuration: Number.parseInt(URLs[item].URLDuration),
                    star: URLs[item].star,
                    playlistID: this.props.playlistID,
                    userID: this.state.userID                            
                });
            }

            this.setState({
                list,       //list:listItems
                filteredList: list, 
                howManyItems: list.length
                
            })
        });

    }
    
    componentWillUnmount() {
        this._isMounted = false;
        this.urlsRef.off();
        this.playlistRef.off();
   }

    handleChange(e) {
        const keyName = e.target.name;
        const keyValue = e.target.value;

        this.setState({ [keyName]: keyValue });
    }
    refresh(e) {
        this.setState({});
    }
    resetQuery() {
        this.setState({
          filteredList: this.state.list,
          searchQuery: ''
        });
    }
        
    render() {
        const {list, searchQuery, playlist} = this.state;
        const {playlistName} = playlist;
        const URLsCount = Object.keys(playlist.playlistURLs || {}).length
        var filteredList = [];

        const dataFilter = item =>
            item.urlDesc
            .toLowerCase()
            .match(searchQuery.toLowerCase()) && true;

        if (list)
            filteredList = list.filter(
                dataFilter
            );

        const myURLs = filteredList.map((item) => 
        {
            return(
                <URLView key={item.urlID} {...item} callback={(e) => this.refresh(e)}
                    playlistName={playlistName}></URLView>
                
            );
        });
        return(
            <div className="ui container">
                <BackView/>
                {/*<div className="ui header">Playlist &quot;{playlistName}&quot;</div>*/}
                {filteredList ?
                    <div className="ui header">
                        <PlaylistView key={this.props.playlistID}  userID={this.props.userID}
                            item={playlist} URLsCount={URLsCount} 
                            mode="header"/>
                    </div>
                    :''
                }

                <div className="ui basic segment">

                    {filteredList && filteredList.length ? 
                    <div className="ui very padded basic segment left aligned">
                        <div className="ui inverted red segment" style={{display: 'flex',alignItems: 'center'}}>
                            <span className="ui content header huge" 
                                style={{marginBottom: 0}}>URLs&nbsp;</span>
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

                        <div className="ui animated relaxed divided list">
                            {myURLs}
                        </div>
                    </div>
                    : null}

                </div>
            </div>
        );
    }
}

export default URLs;