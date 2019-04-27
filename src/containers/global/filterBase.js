import React, {Component} from 'react';
import {db} from '../../utils/Firebase';

// example usage:
//----------------------------------------------
// <Filteredlist 
//     pageTitle="Add a Playlist"
//     listTitle="Your Playlists"
//     collectionURL="playlists/"+ {this.props.userID}
//     sortFieldName="playlistName">
//     <PlaylistsList/>        
// </Filteredlist>

class Filteredlist extends Component {
    constructor(props) {
        super(props);

        this.resetQuery = this.resetQuery.bind(this);        
        // this.listRef = '';

        const {pageTitle, listTitle, collectionURL, sortFieldName, userID} = this.props;

        this.state ={
            listName: '',
            list: [],
            searchQuery: '',
            howManyItems: 0,
            pageTitle: pageTitle,
            listTitle: listTitle,
            collectionURL: collectionURL.replace(":userID",userID),
            sortFieldName: sortFieldName
        };

     }

    componentDidMount(){
        this._isMounted = true;
        this.listRef = db
          .collection(this.state.collectionURL)
          .orderBy(this.state.sortFieldName,"asc");

        this.listRef.onSnapshot( snapshot => {
            let listItems = []; //Helper Array

            snapshot.forEach( doc => 
            {
                var data = doc.data();

                listItems.push({
                  itemID: doc.id,
                  // item: data,
                  itemName: data[this.state.sortFieldName],
                  ...data
                });
            })

            this.setState({
                itemName: '',
                list: listItems,
                howManyItems: listItems.length
            });
        });
    }       

    componentWillUnmount() {
        this._isMounted = false;
        this.listRef();
    }

    handleChange(e) {
        const keyName = e.target.name;
        const keyValue = e.target.value;

        this.setState({ [keyName]: keyValue });
    }

    resetQuery() {
        this.setState({
          searchQuery: ''
        });
    }

    render(){
        const { list, searchQuery/*, howManyItems*/} = this.state;
        var filteredList = [];

        const dataFilter = item =>
            item[this.state.sortFieldName]
            .toLowerCase()
            .match(searchQuery.toLowerCase()) && true;

        if (list)
            filteredList = list.filter(
                dataFilter
            );

        const children = React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
              list: filteredList,
              userID: this.props.userID,
              someFunction: x => x
            });
        });

        return (
            <div className="ui container">
                <div className="ui header">
                    {this.state.pageTitle}
                </div>
                <div className="ui basic segment">

                    {filteredList && filteredList.length ? 
                    <div className="ui very padded basic segment left aligned">
                        <div className="ui inverted red segment" style={{display: 'flex',alignItems: 'center'}}>
                            <span className="ui content header huge" 
                                style={{marginBottom: 0}}>{this.state.listTitle}&nbsp;</span>
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
                        {children}
                    </div>
                    : null}

                </div>
            </div>
        );
    }
}

export default Filteredlist;