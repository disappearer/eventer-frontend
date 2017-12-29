import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EventItem from './EventItem';

class EventList extends Component {
  constructor(props) {
    super(props);
    this.state = { events: [] };
  }

  componentDidMount() {
    this.props.getEvents().then(events => {
      this.setState({ events });
    });
  }

  render() {
    const events = this.state.events;
    const eventsJoined = this.props.eventsJoined;
    return (
      <div>
        {events.length
          ? events.map(event => (
              <EventItem
                key={event.id}
                event={event}
                onJoinClick={this.props.onJoinClick}
                joined={
                  eventsJoined && eventsJoined.indexOf(event.id.toString()) > -1
                }
              />
            ))
          : 'No events found.'}
      </div>
    );
  }
}

EventList.propTypes = {
  getEvents: PropTypes.func.isRequired,
  onJoinClick: PropTypes.func.isRequired,
  eventsJoined: PropTypes.arrayOf(PropTypes.string)
};

export default EventList;
