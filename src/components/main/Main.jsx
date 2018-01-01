import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import EventList from './event-list/EventList';
import NewEventForm from './NewEventForm';

const Main = ({ eventApi, getFunction, onJoinClick, eventsJoined }) => {
  const isAuthenticated = eventsJoined ? true : false;
  return (
    <main role="main">
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/events" />} />
        <Route
          exact
          path="/events"
          render={({ match }) => (
            <EventList
              api={eventApi}
              onJoinClick={onJoinClick}
              eventsJoined={eventsJoined}
            />
          )}
        />
        <PrivateRoute
          path="/events/new"
          isAuthenticated={isAuthenticated}
          component={NewEventForm}
        />
      </Switch>
    </main>
  );
};

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/events'
          }}
        />
      )
    }
  />
);

Main.propTypes = {
  eventApi: PropTypes.object.isRequired,
  onJoinClick: PropTypes.func.isRequired,
  eventsJoined: PropTypes.arrayOf(PropTypes.string)
};

export default Main;
