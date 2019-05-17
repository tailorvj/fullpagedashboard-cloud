import React, { Component } from 'react';
import {db} from '../../../utils/Firebase';
import { isWebUri } from 'valid-url';
// import { navigate } from '@reach/router';

class URLDetails extends Component {
  constructor(props) {
    super(props);
    const {playlist, urlItem, mode} = this.props.location.state;

    const {playlistID, playlistName} = playlist;
    const {urlID, description, url, duration} = urlItem || {};

    this.state = {
      playlistID,
      playlistName,
      urlID: urlID || '',
      urlDesc: description || '',
      urlUrl: url || '',
      isUrlValid: true,
      urlDuration: duration || 50000,
      isEdit: mode === "edit"
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleChange(e) {
    const itemName = e.target.name;
    const itemValue = e.target.value;

    //validate url
    if (itemName === "urlUrl") {
      this.setState({ "isUrlValid": isWebUri(itemValue) });
    }

    this.setState({ [itemName]: itemValue });
  }

  handleSubmit(e) {
    e.preventDefault();

    if (!this.state.isEdit) {
      //add new
      const ref = db
        // .collection(`playlists/${this.props.userID}/`)
        // .doc(this.props.playlistID)
        .collection('URLs');
      ref.add({
        playlistId: this.state.playlistID,
        description: this.state.urlDesc,
        url: this.state.urlUrl,
        duration: this.state.urlDuration,
        star: false,
      });
    }
    else
    {
      //update existing
      db
        .collection('URLs')
        .doc(this.state.urlID)
        .set({
          playlistId: this.state.playlistID,
          description: this.state.urlDesc,
          url: this.state.urlUrl,
          duration: this.state.urlDuration,
          star: false
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
    const urlClasses = this.state.isUrlValid ? 'required field':'required field error';
    return (
      <form className="ui left aligned container form" onSubmit={this.handleSubmit} onReset={this.handleReset}>
 
        <h3 className="ui center aligned header">{this.state.isEdit ? 'Update URL of' : 'Add URL to'} {this.state.playlistName}</h3>
        <div className="required field">
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
        <div className={urlClasses}>
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
        <div className="required field">
          <label htmlFor="urlDuration">
            Duration (ms)
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

export default URLDetails;