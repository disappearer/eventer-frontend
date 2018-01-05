import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EventItem from './EventItem';

class EventList extends Component {
  constructor(props) {
    super(props);
    this.state = { events: [] };
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
    this.handleEventJoin = this.handleEventJoin.bind(this);
  }

  componentDidMount() {
    this.props.api.future().then(response => {
      this.setState({ events: response.events });
    });
  }

  handleCheckBoxChange(e) {
    const checked = e.target.checked;
    const method = checked ? 'future' : 'all';
    this.props.api[method]().then(response => {
      this.setState({ events: response.events });
    });
  }

  handleEventJoin(id) {
    this.props.onJoinClick(id).then(updatedEvent => {
      const events = this.state.events;
      const updatedEvents = events.map(event => {
        if (event.id === id) return updatedEvent;
        return event;
      });
      this.setState({ events: updatedEvents });
    });
  }

  render() {
    const events = this.state.events;
    const eventsJoined = this.props.eventsJoined;
    return (
      <div>
        <div className="fixed">
          <div className="container filter-container">
            <div className="row event" id="filter-row">
              <div className="col-md-12">
                <span id="filter-title">Filter events:</span>
                <input
                  type="checkbox"
                  defaultChecked
                  onChange={this.handleCheckBoxChange}
                />
                <label id="future-checkbox-label">future</label>
              </div>
            </div>
          </div>
        </div>

        <div className="container event-container">
          {events.length
            ? events.map(event => (
                <EventItem
                  key={event.id}
                  event={event}
                  onJoinClick={this.handleEventJoin}
                  joined={
                    eventsJoined &&
                    eventsJoined.indexOf(event.id.toString()) > -1
                  }
                />
              ))
            : 'No events found.'}
        </div>
      </div>
    );
  }
}

EventList.propTypes = {
  api: PropTypes.object.isRequired,
  onJoinClick: PropTypes.func.isRequired,
  eventsJoined: PropTypes.arrayOf(PropTypes.string)
};

export default EventList;
