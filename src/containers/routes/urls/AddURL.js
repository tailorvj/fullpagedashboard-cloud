import React, { Component } from 'react';
import firebase from '../../../utils/Firebase';
import { navigate } from '@reach/router';

class AddURL extends Component {
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
        `playlists/${this.props.userID}/${
          this.props.playlistID
        }/URLs`
      );
    ref.push({
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
    window.history.back();
    // navigate(
    //   `/URLs/${this.props.userID}/${this.props.playlistID}`
    // );
  }

  render() {
    return (
      <form className="ui left aligned container form" onSubmit={this.handleSubmit} onReset={this.handleReset}>
 
        <h3 className="ui center aligned header">Add URL to Playlist</h3>
        <div className="eight wide field">
          <label htmlFor="URLDescription">
            Display Name
          </label>
          <input
            required
            type="text"
            id="URLDescription"
            name="URLDescription"
            placeholder="URL Description"
            value={this.state.URLDescription}
            onChange={this.handleChange}
          />
        </div>
        <div className="twelve wide required field">
          <label htmlFor="URLURL">
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
        </div>
        <div className="six wide required field">
          <label htmlFor="URLDuration">
            Duration
          </label>
          <div className="ui right labeled input">
            <input
              required
              className="form-control"
              type="text"
              id="URLDuration"
              name="URLDuration"
              placeholder="Duration in MSs"
              value={this.state.URLDuration || 50000}
              onChange={this.handleChange}
              />
              <div className="ui basic label">MilliSeconds</div>
          </div>
        </div>

        <button className="ui button" type="reset">
          Cancel
        </button>
        <button className="ui primary button" type="submit">
          Add
        </button>
      </form>
    );
  }
}

export default AddURL;