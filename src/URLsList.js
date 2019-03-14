import React, { Component } from 'react';
import firebase from './Firebase';
import { GoTrashcan, GoStar, GoMail } from 'react-icons/go';

class URLsList extends Component {
    constructor(props){
        super(props);
        this.state = {
            errorMessage: null
        }
        this.deleteURL = this.deleteURL.bind(this);
    }

    deleteURL = (e, whichPlaylist, whichURL) => {
        e.preventDefault();
        const adminUser = this.props.adminUser;
        try{
        const ref = firebase.database().ref(
            `playlists/${adminUser}/${whichPlaylist}/URLs/${whichURL}`
        );
        ref.remove();
        }
        catch(e) {
            this.setState({errorMessage: 'Error: failed to delete URL from URLs list.'});
        }
    }

    toggleStar = (e, star, whichPlaylist, whichURL) => {
        e.preventDefault();
        const adminUser = this.props.adminUser;
        try{
            const ref = firebase.database().ref(
            `playlists/${adminUser}/${whichPlaylist}/URLs/${whichURL}/star`
            );
            if(ref === undefined){
                ref.set(true);
            } else {
                ref.set(!star);
            }
        }
        catch(e) {
            this.setState({errorMessage: 'Error: failed to set star status for URL in URLs list.'});
        }
    }

  render() {
    const admin = ((this.props.adminUser === this.props.userID) ? true : false);
    const URLs = this.props.URLs;
    
    const myURLs = URLs.map((item) => {
        return(
            <div key={item.URLID}
                className="col-8 col-sm-6 col-md-4 col-lg-3 mb-2 p-0 px-1">
                <div className="card ">
                    <div className={
                        `card-body px-3 py-2 d-flex align-items-center ` +
                        (admin ? '' : 'justify-content-center')
                    }>
                        {admin && (
                            <div className="btn-group pr-2">
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                title="Delete URL"
                                onClick={e =>
                                this.deleteURL(
                                    e,
                                    this.props.playlistID,
                                    item.URLID
                                )
                                }
                            >
                                <GoTrashcan />
                            </button>
                            <a
                                href={`mailto:${item.URLEmail}`}
                                className="btn btn-sm btn-outline-secondary"
                                title="Mail URL"
                            >
                                <GoMail />
                            </a>
                            <button
                                className={
                                  'btn btn-sm btn-outline-secondary'  +
                                  (item.star 
                                    ?  ' btn-info'
                                    : ''
                                    )
                                }
                                title="Star URL"
                                onClick={e =>
                                this.toggleStar(
                                    e,
                                    item.star,
                                    this.props.playlistID,
                                    item.URLID
                                )
                                }
                            >
                                <GoStar />
                            </button>
                            </div>
                        )}
                        <div>{item.URLName}</div>
                    </div>
                </div>
            </div>
        );
    });

        return(
            <div className="row justify-content-center">
                {myURLs}
            </div>
        );
  } //render()

} //componenet class

export default URLsList;
