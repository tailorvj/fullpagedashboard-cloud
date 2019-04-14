import React, { Component } from 'react';
import firebase from '../../../utils/Firebase';
// import { navigate } from '@reach/router';

class AddURL extends Component {
  constructor(props) {
    super(props);
    const {playlistName, urlID, urlDesc, urlUrl, urlDuration, mode} = this.props.location.state;

    this.state = {
      playlistName,
      urlID: urlID || '',
      urlDesc: urlDesc || '',
      urlUrl: urlUrl || '',
      urlDuration: urlDuration || 50000,
      isEdit: mode === "edit"
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
    if (!this.state.isEdit) {
      //add new
      const ref = firebase
        .database()
        .ref(
          `playlists/${this.props.userID}/${
            this.props.playlistID
          }/URLs`
        );
      ref.push({
        URLDescription: this.state.urlDesc,
        URLURL: this.state.urlUrl,
        URLDuration: this.state.urlDuration
      });
    }
    else
    {
      //update existing
      firebase
        .database()
        .ref(
          `playlists/${this.props.userID}/${
            this.props.playlistID
          }/URLs/${this.state.urlID}`
        ).update({
        URLDescription: this.state.urlDesc,
        URLURL: this.state.urlUrl,
        URLDuration: this.state.urlDuration
      });
    }
    window.history.back();
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
 
        <h3 className="ui center aligned header">{this.state.isEdit ? 'Update URL of' : 'Add URL to'} {this.state.playlistName}</h3>
        <div className="eight wide field">
          <label htmlFor="urlDesc">
            Display Name
          </label>
          <input
            required
            type="text"
            id="urlDesc"
            name="urlDesc"
            placeholder="URL Description"
            value={this.state.urlDesc}
            onChange={this.handleChange}
          />
        </div>
        <div className="twelve wide required field">
          <label htmlFor="urlUrl">
            URL
          </label>
          <input
            required
            type="text"
            id="urlUrl"
            name="urlUrl"
            placeholder="https://www.example.com"
            value={this.state.urlUrl}
            onChange={this.handleChange}
          />
        </div>
        <div className="six wide required field">
          <label htmlFor="urlDuration">
            Duration
          </label>
          <div className="ui right labeled input">
            <input
              required
              type="number"
              step="500"
              min="500"
              id="urlDuration"
              name="urlDuration"
              placeholder="Duration in MSs"
              value={this.state.urlDuration || 50000}
              onChange={this.handleChange}
              />
              <div className="ui basic label">MilliSeconds</div>
          </div>
        </div>

        <button className="ui primary button" type="submit">
            OK
        </button>
        <button className="ui button" type="reset">
          Cancel
        </button>
      </form>
    );
  }
}

export default AddURL;