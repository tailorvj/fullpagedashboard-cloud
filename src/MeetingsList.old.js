import React, { Component } from 'react';
import { navigate } from '@reach/router';
import firebase from './Firebase';
import FormError from './FormError';
import { GoTrashcan, GoListUnordered } from 'react-icons/go';
import { FaUserCheck } from 'react-icons/fa';


class MeetingsListOld extends Component {
    constructor(props){
        super(props);
        this.state = {
        errorMessage: null
        }
        this.deleteMetting = this.deleteMeeting.bind(this);
    }

    deleteMeeting = (e, whichMeeting) => {
        e.preventDefault();
        // console.log(`delete btn pressed: whichMeeting: ${whichMeeting} userID: ${this.props.userID}`);
        try{
        const ref = firebase.database().ref(
            `meetings/${this.props.userID}/${whichMeeting}`
        );
        ref.remove();
        }
        catch(e) {
            this.setState({errorMessage: e});
        }
    }

  render() {
    // console.log(`MeetingsListOld render. this.props.userID: ${this.props.userID} .`);
    const { meetings } = this.props;
    const myMeetings = meetings.map((item) => {
        return(
            <div className="container" key={item.meetingID}>
                <section className="row border-top clearfix pt-2 pb-2">
                    <div className="col-10 float-left text-left">
                        <div>{item.meetingName}</div>
                    </div>
                    <div className="col-2 float-right">
                        <div className="btn-group float-right border" role="group">
                        <button className="btn btn-sm btn-outline-secondary mr-1"
                        title="Check In"
                        onClick={() => navigate(`/checkin/${this.props.userID}/${item.meetingID}`)}
                        >
                        <FaUserCheck />
                        </button>
                        <button className="btn btn-sm btn-outline-secondary mr-1"
                        title="Attendees List"
                        onClick={() => navigate(`/attendees/${this.props.userID}/${item.meetingID}`)}
                        >
                        <GoListUnordered />
                        </button>
                        <button className="btn btn-sm btn-outline-secondary"
                        title="Delete Meeting"
                        onClick={e => this.deleteMeeting(e, item.meetingID)}
                        >
                        <GoTrashcan />
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

        {myMeetings}
      </div>
    );
  }
}

export default MeetingsListOld;
