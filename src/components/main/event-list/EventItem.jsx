import React from 'react';
import PropTypes from 'prop-types';

const Weekdays = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  0: 'Sunday'
};

const Months = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December'
};

const EventItem = props => {
  const event = props.event;
  const date = new Date(event.date);
  const minutes = date.getMinutes();
  const timeString = `${date.getHours()}:${
    minutes < 10 ? `0${minutes}` : minutes
  }`;
  return (
    <div className="row event">
      <div className="col-md-2">
        <div className="weekday">{Weekdays[date.getDay()]}</div>
        <div className="date">{`${
          Months[date.getMonth()]
        } ${date.getDate()}`}</div>
        <div className="time">{timeString}</div>
      </div>
      <div className="col-md-5">
        <div className="location">
          <span className="at">@ </span>
          {event.location}
        </div>
        <div className="title">{event.title}</div>
        <div className="row">
          <div className="col-md-12">
            <div className="guests">Guests: {event.guestList.length}</div>
            <button
              className="btn btn-info btn-sm btn-join"
              onClick={() => {
                props.onJoinClick(props.joined ? true : false);
              }}
            >
              {props.joined ? 'Joined' : 'Join'}
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-5">
        <p className="description">{event.description}</p>
      </div>
    </div>
  );
};

EventItem.propTypes = {
  event: PropTypes.object.isRequired,
  onJoinClick: PropTypes.func.isRequired,
  joined: PropTypes.bool
};

export default EventItem;
