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

    return (
      <div>
        {events.length
          ? events.map(event => (
              <EventItem key={event.id} event={event} onJoinClick={() => {}} />
            ))
          : 'No events found.'}
      </div>
    );
  }
}

EventList.propTypes = {
  getEvents: PropTypes.func
};

export default EventList;
