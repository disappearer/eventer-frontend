import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import EventList from './event-list/EventList';
import NewEventForm from './NewEventForm';

const Main = ({ eventApi, getFunction, onJoinClick }) => {
  return (
    <main className="container event-container" role="main">
      <Switch>
        <Route
          exact
          path="/events"
          render={({ match }) => (
            <EventList
              getEvents={eventApi[getFunction].bind(eventApi)}
              onJoinClick={onJoinClick}
            />
          )}
        />
        <Route path="/events/new" component={NewEventForm} />
      </Switch>
    </main>
  );
};

Main.propTypes = {
  eventApi: PropTypes.object.isRequired,
  getFunction: PropTypes.string.isRequired,
  onJoinClick: PropTypes.func.isRequired
};

export default Main;
