import React from 'react';
import PropTypes from 'prop-types';
import { WEEKDAYS, MONTHS } from '../date.helper';

const EventItem = ({ event, onJoinClick, joined }) => {
  const date = new Date(event.date);
  const minutes = date.getMinutes();
  const timeString = `${date.getHours()}:${
    minutes < 10 ? `0${minutes}` : minutes
  }`;
  return (
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
        <div className="row">
          <div className="col-md-12">
            <div className="guests">Guests: {event.guestList.length}</div>
            <button
              className="btn btn-info btn-sm btn-join"
              onClick={() => {
                if (!joined) onJoinClick(event.id);
              }}
            >
              {joined ? 'Joined' : 'Join'}
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
