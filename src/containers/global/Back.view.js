import React, { Component } from 'react';

class BackView extends Component {
  render() {
    return (
	     <div className="ui small left aligned header">
	        <button className="ui action basic button" onClick={ () => window.history.back() }>
	            <i className="left arrow icon"></i>
	            Back
	        </button>
	    </div>
     )
  }
}

export default BackView
