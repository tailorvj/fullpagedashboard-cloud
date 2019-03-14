import React, { Component } from 'react';
import firebase from './utils/Firebase';
import { navigate } from '@reach/router';

class CheckIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: '',
      email: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const itemName = e.target.name;
    const itemValue = e.target.value;

    this.setState({ [itemName]: itemValue });
  }

  handleSubmit(e) {
    e.preventDefault();
    // console.log(`CheckIn handleSubmit. this.props.userID: ${this.props.userID}. this.props.playlistID: ${this.props.playlistID}`);

    const ref = firebase
      .database()
      .ref(
        `playlists/${this.props.userID}/${
          this.props.playlistID
        }/URLs`
      );
    ref.push({
      URLName: this.state.displayName,
      URLEmail: this.state.email,
      star: false
    });
    navigate(
      `/URLs/${this.props.userID}/${this.props.playlistID}`
    );
  }

  render() {
    // console.log(`CheckIn render. this.props.userID: ${this.props.userID}. this.props.playlistID: ${this.props.playlistID}`);
    return (
      <form className="mt-3" onSubmit={this.handleSubmit}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="card bg-light">
                <div className="card-body">
                  <h3 className="font-weight-light mb-3">Check in</h3>
                  <section className="form-group">
                    <label
                      className="form-control-label sr-only"
                      htmlFor="displayName"
                    >
                      Name
                    </label>
                    <input
                      required
                      className="form-control"
                      type="text"
                      id="displayName"
                      name="displayName"
                      placeholder="Name"
                      value={this.state.displayName}
                      onChange={this.handleChange}
                    />
                  </section>
                  <section className="form-group">
                    <label
                      className="form-control-label sr-only"
                      htmlFor="Email"
                    >
                      Email
                    </label>
                    <input
                      required
                      className="form-control"
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email"
                      value={this.state.email}
                      onChange={this.handleChange}
                    />
                  </section>
                  <div className="form-group text-right mb-0">
                    <button className="btn btn-primary" type="submit">
                      Check in
                    </button>
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

export default CheckIn;