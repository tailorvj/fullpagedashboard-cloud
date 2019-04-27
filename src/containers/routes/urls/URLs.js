import React, {Component} from 'react';
import BackView from '../../global/Back.view';
import {db} from '../../../utils/Firebase';
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
        const {userID} = this.props;

        this._isMounted = true;

        // this.playlistRef = db
        //   .doc('playlists/'+this.props.playlistID);

        // this.playlistRef.onSnapshot(snapshot => {
        //     let playlist = {...playlist, ...snapshot.data()};

        //     // this.setState({
        //     //     playlist
        //     // })
        //   });

        this.urlsRef = db
          // .ref('playlists/'+this.props.userID+'/'+this.props.playlistID+'/URLs/')
          .collection('URLs')
          .where("playlistId", "==", this.props.playlistID)
          ;

        this.urlsRef
          .orderBy("description","asc")
          .onSnapshot(snapshot => {
            var list= [];
            snapshot.forEach( doc => {
                var data = doc.data();

                list.push({ //listItems
                    urlID: doc.id, //itemID
                    ...data,
                    // urlDesc: data.description,
                    // urlUrl: data.url,
                    // urlDuration: Number.parseInt(data.duration),
                    // star: data.star,
                    playlistID: this.props.playlistID,
                    userID                          
                });
            });

            this.setState({
                list,       //list:listItems
                filteredList: list, 
                howManyItems: list.length
                
            })
        });

    }
    
    componentWillUnmount() {
        this._isMounted = false;
        // this.urlsRef.off();
        // this.playlistRef.off();
   }

    handleChange(e) {
        const keyName = e.target.name;
        const keyValue = e.target.value;

        this.setState({ [keyName]: keyValue });
    }
    refresh(e) {
        this.setState({timestemp: new Date()});
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
        const URLsCount = list.length;//this.state.URLsCount || this.state.howManyItems;//Object.keys(playlist.playlistURLs || {}).length
        var filteredList = [];

        const dataFilter = item =>
            item.description
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
                        <PlaylistView key={playlist.playlistID}  userID={this.props.userID}
                            item={playlist} URLsCount={URLsCount} 
                            mode="header"/>
                    </div>
                    :''
                }

                <div className="ui basic segment">

                  {/*  {filteredList && filteredList.length ? */}
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
                           <span className="ui header content"
                                style={{marginTop: 0}}>&nbsp;&nbsp;(
                                {filteredList && filteredList.length && filteredList.length < this.state.howManyItems ? 
                                        filteredList.length + ' of '
                                    :''}
                                {this.state.howManyItems} URLs)</span>
                        </div>

                        <div className="ui animated relaxed divided list">
                            {myURLs}
                        </div>
                    </div>
                    {/*: null}*/}

                </div>
            </div>
        );
    }
}

export default URLs;