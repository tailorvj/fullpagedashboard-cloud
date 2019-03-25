import React, { Component } from 'react';
import FormError from '../../../FormError';
import { navigate } from '@reach/router';
import firebase from '../../../utils/Firebase';
import { GoTrashcan} from 'react-icons/go';
import { MdEdit } from 'react-icons/md';

class URLsList extends Component {
    constructor(props){
        super(props);
        this.state = {
            errorMessage: null
        }
        this.deleteURL = this.deleteURL.bind(this);
    }

    deleteURL = (e, whichURL) => {
        e.preventDefault();
        console.log(`delete btn pressed: whichURL: ${whichURL} playlistID: ${this.props.playlistID} userID: ${this.props.userID}`);
        try{
        const ref = firebase.database().ref(
            `playlists/${this.props.userID}/${this.props.playlistID}/URLs/${whichURL}`
        );
        ref.remove();
        }
        catch(e) {
            this.setState({errorMessage: e});
        }
    }

  render() {
    // const admin = ((this.props.adminUser === this.props.userID) ? true : false);
    const URLs = this.props.URLs;
    
    const myURLs = URLs.map((item) => {
        return(
            <div className="container" key={item.URLID}>
                <section className="row border-top clearfix pt-2 pb-2">
                    <div className="col-10 float-left text-left">
                        <span className="d-flex justify-content-between">
                            <a href={item.URLURL} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-secondary">
                            {item.URLDescription}
                            </a>
                            <span className="text-nowrap small">{item.URLDuration} ms</span>
                        </span>
                        
                    </div>
                    <div className="col-2 float-right">
                        <div className="btn-group float-right border" role="group">
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                title="Delete URL"
                                onClick={e =>
                                this.deleteURL(
                                    e,
                                    item.URLID
                                )
                                }
                            >
                                <GoTrashcan />
                            </button>
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                title="Edit URL"
                                onClick={() => navigate(`/editURL/${this.props.userID}/${this.props.playlistID}/URLs/${item.URLID}`)}
                            >
                                <MdEdit />
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
      
              {myURLs}
            </div>
          );
        
      
  } //render()

} //componenet class

export default URLsList;
