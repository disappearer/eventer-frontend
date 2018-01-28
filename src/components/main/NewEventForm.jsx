import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DateTimePicker from 'react-datetime-picker';
import { WEEKDAYS, MONTHS } from './date.helper';

class NewEventForm extends Component {
  constructor(props) {
    super(props);
    this.state = { title: '', location: '', description: '', date: new Date() };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleCreateClick = this.handleCreateClick.bind(this);
    this.clearState = this.clearState.bind(this);
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleDateChange(date) {
    this.setState({ date });
  }

  handleCreateClick() {
    const eventInfo = {
      title: this.state.title,
      location: this.state.location,
      date: this.state.date,
      description: this.state.description
    };
    const accessToken = this.props.accessToken;
    this.props.eventApi.create(accessToken, eventInfo).then(response => {
      this.setState({ event: response.event });
    });
  }

  clearState() {
    this.setState({
      event: null,
      title: '',
      location: '',
      description: '',
      date: new Date()
    });
  }

  render() {
    let date, minutes, timeString;
    const event = this.state.event;
    if (event) {
      date = new Date(event.date);
      minutes = date.getMinutes();
      timeString = `${date.getHours()}:${
        minutes < 10 ? `0${minutes}` : minutes
      }`;
    }
    return (
      <div className="container new-event-container">
        {event ? (
          <div id="new-event-data">
            <div className="row event">
              <h5>New Event Created</h5>
            </div>
            <div className="row event">
              <div className="col-md-2">
                <div className="weekday">{WEEKDAYS[date.getDay()]}</div>
                <div className="date">{`${
                  MONTHS[date.getMonth()]
                } ${date.getDate()}`}</div>
                <div className="time">{timeString}</div>
              </div>
              <div className="col-md-5">
                <div className="location">
                  <span className="at">@ </span>
                  {event.location}
                </div>
                <div className="title">{event.title}</div>
              </div>
              <div className="col-md-5">
                <p className="description">{event.description}</p>
              </div>
            </div>
            <div className="row event">
              <button
                className="btn btn-info btn-sm"
                type="button"
                onClick={this.clearState}
              >
                New Event
              </button>
            </div>
          </div>
        ) : (
          <div id="new-event-form">
            <div className="row input-row">
              <div className="col-md-4 label">Title</div>
              <div className="col-md-4">
                <span className="form-input">
                  <input
                    type="text"
                    name="title"
                    value={this.state.title}
                    onChange={this.handleInputChange}
                  />
                </span>
              </div>
            </div>
            <div className="row input-row">
              <div className="col-md-4 label">Location</div>
              <div className="col-md-4">
                <span className="form-input">
                  <input
                    type="text"
                    name="location"
                    value={this.state.location}
                    onChange={this.handleInputChange}
                  />
                </span>
              </div>
            </div>

            <div className="row input-row">
              <div className="col-md-4 label">Date & time</div>
              <div className="col-md-4">
                <DateTimePicker
                  onChange={this.handleDateChange}
                  value={this.state.date}
                />
              </div>
            </div>

            <div className="row input-row">
              <div className="col-md-4 label">Description</div>
              <div className="col-md-4">
                <span className="form-input">
                  <textarea
                    name="description"
                    placeholder="Add a description..."
                    value={this.state.description}
                    onChange={this.handleInputChange}
                  />
                </span>
              </div>
            </div>

            <div className="row input-row">
              <div className="col-md-4 label" />
              <div className="col-md-4">
                <button
                  className="btn btn-info btn-sm"
                  type="button"
                  onClick={this.handleCreateClick}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

NewEventForm.propTypes = {
  eventApi: PropTypes.object.isRequired,
  accessToken: PropTypes.string
};

export default NewEventForm;
