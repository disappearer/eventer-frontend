import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

const Nav = ({ user, loginCallback, logoutCallback }) => {
  return (
    <nav className="navbar navbar-expand-sm navbar-light fixed-top">
      <div className="container">
        <Link className="navbar-brand" to="/events">
          Eventer
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarsExample09"
          aria-controls="navbarsExample09"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarsExample09">
          <ul className="navbar-nav mr-auto">
            <LiNavLink
              classes="nav-item form-inline"
              to="/events"
              activeOnlyWhenExact={true}
              label="Events"
            />
            {user && (
              <LiNavLink
                classes="nav-item"
                to="/events/new"
                activeOnlyWhenExact={true}
                label="New Event"
              />
            )}
          </ul>
          <ul className="navbar-nav navbar-right">
            {user && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  data-toggle="dropdown"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {user}
                </a>
                <div className="dropdown-menu" aria-labelledby="dropdown09">
                  <a
                    className="dropdown-item"
                    id="logout-link"
                    href="#"
                    onClick={logoutCallback}
                  >
                    Log out
                  </a>
                </div>
              </li>
            )}
          </ul>
          {!user && (
            <button
              id="login-btn"
              className="btn btn-info"
              type="button"
              onClick={loginCallback}
            >
              Log in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

const LiNavLink = ({
  label,
  to,
  activeOnlyWhenExact,
  classes,
  extraWhenActive
}) => (
  <Route
    path={to}
    exact={activeOnlyWhenExact}
    children={({ match }) => (
      <li className={classes + (match ? ' active' : '')}>
        <Link className="nav-link" to={to}>
          {label}
        </Link>
        {match && extraWhenActive}
      </li>
    )}
  />
);

Nav.propTypes = {
  user: PropTypes.string,
  loginCallback: PropTypes.func,
  logoutCallback: PropTypes.func
};

export default Nav;
