import React, { Component } from 'react';
import firebase from './Firebase';
import { GoTrashcan, GoStar, GoMail } from 'react-icons/go';

class AttendeesList extends Component {
    constructor(props){
        super(props);
        this.state = {
            errorMessage: null
        }
        this.deleteAttendee = this.deleteAttendee.bind(this);
    }

    deleteAttendee = (e, whichMeeting, whichAttendee) => {
        e.preventDefault();
        const adminUser = this.props.adminUser;
        try{
        const ref = firebase.database().ref(
            `meetings/${adminUser}/${whichMeeting}/attendees/${whichAttendee}`
        );
        ref.remove();
        }
        catch(e) {
            this.setState({errorMessage: 'Error: failed to delete attendee from attendees list.'});
        }
    }

    toggleStar = (e, star, whichMeeting, whichAttendee) => {
        e.preventDefault();
        const adminUser = this.props.adminUser;
        try{
            const ref = firebase.database().ref(
            `meetings/${adminUser}/${whichMeeting}/attendees/${whichAttendee}/star`
            );
            if(ref === undefined){
                ref.set(true);
            } else {
                ref.set(!star);
            }
        }
        catch(e) {
            this.setState({errorMessage: 'Error: failed to set star status for attendee in attendees list.'});
        }
    }

  render() {
    const admin = ((this.props.adminUser === this.props.userID) ? true : false);
    const attendees = this.props.attendees;
    
    const myAttendees = attendees.map((item) => {
        return(
            <div key={item.attendeeID}
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
                                title="Delete Attendee"
                                onClick={e =>
                                this.deleteAttendee(
                                    e,
                                    this.props.meetingID,
                                    item.attendeeID
                                )
                                }
                            >
                                <GoTrashcan />
                            </button>
                            <a
                                href={`mailto:${item.attendeeEmail}`}
                                className="btn btn-sm btn-outline-secondary"
                                title="Mail Attendee"
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
                                title="Star Attendee"
                                onClick={e =>
                                this.toggleStar(
                                    e,
                                    item.star,
                                    this.props.meetingID,
                                    item.attendeeID
                                )
                                }
                            >
                                <GoStar />
                            </button>
                            </div>
                        )}
                        <div>{item.attendeeName}</div>
                    </div>
                </div>
            </div>
        );
    });

        return(
            <div className="row justify-content-center">
                {myAttendees}
            </div>
        );
  } //render()

} //componenet class

export default AttendeesList;
