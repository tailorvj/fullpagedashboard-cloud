import React, { Component } from 'react';
import firebase from '../../../utils/Firebase';
import { navigate } from '@reach/router';

class EditURL extends Component {
  constructor(props) {
    super(props);
    this.state = {
      URLID: '',
      URLDescription: '',
      URLURL: '',
      URLDuration: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleChange(e) {
    const itemName = e.target.name;
    const itemValue = e.target.value;

    this.setState({ [itemName]: itemValue });
  }

  handleSubmit(e) {
    e.preventDefault();

    const ref = firebase
      .database()
      .ref(
        `playlists/${this.props.userID}/${this.props.playlistID}/URLs/${this.props.URLID}`
      );
    ref.update({
      URLDescription: this.state.URLDescription,
      URLURL: this.state.URLURL,
      URLDuration: this.state.URLDuration,
    });
    navigate(
      `/URLs/${this.props.userID}/${this.props.playlistID}`
    );
  }

  handleReset(e) {
    e.preventDefault();
    
    navigate(
      `/URLs/${this.props.userID}/${this.props.playlistID}`
    );
  }

  componentDidMount(){
    //Let's get the URL data and push it into Component state
    if(this.props.userID && this.props.playlistID && this.props.URLID){
        let ref2 = firebase.database().ref(`playlists/${this.props.userID}/${this.props.playlistID}/URLs/${this.props.URLID}`);
        ref2.on('value', snapshot => {
            let URLDescription = snapshot.val().URLDescription;
            let URLURL = snapshot.val().URLURL;
            let URLDuration = snapshot.val().URLDuration;
            this.setState({
              URLDescription: URLDescription,
              URLURL: URLURL,
              URLDuration: URLDuration
            });
        });

    }
}

  render() {
    return (
      <form className="mt-3" onSubmit={this.handleSubmit} onReset={this.handleReset}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="card bg-light">
                <div className="card-body">
                  <h3 className="font-weight-light mb-3">Edit URL</h3>
                  <section className="form-group">
                    <label
                      className="form-control-label sr-only"
                      htmlFor="URLDescription"
                    >
                      Display Name
                    </label>
                    <input
                      required
                      className="form-control"
                      type="text"
                      id="URLDescription"
                      name="URLDescription"
                      placeholder="URL Description"
                      value={this.state.URLDescription}
                      onChange={this.handleChange}
                    />
                  </section>
                  <section className="form-group">
                    <label
                      className="form-control-label sr-only"
                      htmlFor="URLURL"
                    >
                      URL
                    </label>
                    <input
                      required
                      className="form-control"
                      type="text"
                      id="URLURL"
                      name="URLURL"
                      placeholder="https://www.example.com"
                      value={this.state.URLURL}
                      onChange={this.handleChange}
                    />
                  </section>
                  <section className="form-group">
                    <label
                      className="form-control-label sr-only"
                      htmlFor="URLDuration"
                    >
                      Duration
                    </label>
                    <input
                      required
                      className="form-control"
                      type="text"
                      id="URLDuration"
                      name="URLDuration"
                      placeholder="50000 (duration in milliseconds)"
                      value={this.state.URLDuration}
                      onChange={this.handleChange}
                    />
                  </section>

                  <div className="clearfix">
                    <span className="form-group float-left mb-0">
                      <button className="btn btn-secondary btn-lg" type="reset">
                        Cancel
                      </button>
                    </span>
                    <span className="form-group float-right mb-0 ml-2">
                      <button className="btn btn-primary btn-lg" type="submit">
                        Save
                      </button>
                    </span>                  
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default EditURL;