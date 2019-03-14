import React, {Component} from 'react';
import MeetingsList from './MeetingsList';

class Meetings extends Component {
    constructor(props) {
        super(props);
        this.state = {
          meetingName: ''
        };
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }
        
    handleChange(e) {
    const itemName = e.target.name;
    const itemValue = e.target.value;

    this.setState({ [itemName]: itemValue });
    }

    handleSubmit(e){
    e.preventDefault();
    this.props.addMeeting(this.state.meetingName);
    this.setState({meetingName: ''});
    }    

    render(){
        // console.log(`Meetings render. this.props.userID: ${this.props.userID} .`);
        return (
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-8 text-center">
                        <h1 className="font-weight-light">Add a Meeting</h1>
                        <div className="card bg-light">
                            <div className="card-body text-center">
                                <form
                                    className="formgroup"
                                    onSubmit={this.handleSubmit}
                                >
                                    <div className="input-group input-group-lg">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="meetingName"
                                            placeholder="Meeting name"
                                            aria-describedby="buttonAdd"
                                            value={this.state.meetingName}
                                            onChange={this.handleChange}
                                        />
                                        <div className="input-group-append">
                                            <button
                                            type="submit"
                                            className="btn btn-sm btn-info"
                                            id="buttonAdd"
                                            >
                                            +
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {this.props.meetings && this.props.meetings.length ?
                    <div className="col-11 col-md-6 text-center">
                        <div className="card border-top-0 rounded-0">
                            <div className="card-body py-2">
                                <h4 className="card-title font-weight-light m-0">
                                    Your Meetings
                                </h4>
                            </div>
                            <div className="div-group div-group-flush">
                                <MeetingsList meetings={this.props.meetings} userID={this.props.userID} />
                            </div>
                        </div>
                    </div>
                    : null}
                </div>
            </div>
        );
    }
}

export default Meetings;