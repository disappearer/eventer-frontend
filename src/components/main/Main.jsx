import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import EventList from './event-list/EventList';
import NewEventForm from './NewEventForm';

const Main = ({ eventApi }) => {
  return (
    <main>
      <Switch>
        <Route path="/events/new" component={NewEventForm} />
        <Route
          path="/events/:time"
          render={({ match }) => (
            <EventList getEvents={eventApi[match.params.time].bind(eventApi)} />
          )}
        />
      </Switch>
    </main>
  );
};

Main.propTypes = {
  eventApi: PropTypes.object
};

export default Main;
