import React, { Component } from 'react';
import Popout from 'react-popout';
import Popup from 'react-popup';
import PropTypes from 'prop-types';
import './App.css';
import './Popup.css';
import Nav from './components/nav/Nav';
import Main from './components/main/Main';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      accessToken: null,
      isPoppedOut: false,
      period: 'future'
    };
    this.loginPopout = this.loginPopout.bind(this);
    this.checkToken = this.checkToken.bind(this);
    this.popoutClosed = this.popoutClosed.bind(this);
    this.setUser = this.setUser.bind(this);
    this.logout = this.logout.bind(this);
    this.handleJoinClick = this.handleJoinClick.bind(this);
    this.setAccessTokenInSession = this.setAccessTokenInSession.bind(this);
    this.getAccessTokenFromSession = this.getAccessTokenFromSession.bind(this);
  }

  loginPopout() {
    this.setState({ isPoppedOut: true });
    this.checkTokenInterval = setInterval(this.checkToken, 500);
  }

  checkToken() {
    if (window.accessToken) {
      clearInterval(this.checkTokenInterval);
      this.popoutClosed();
    }
  }

  popoutClosed() {
    this.setState({ isPoppedOut: false, accessToken: window.accessToken });
    window.accessToken = null;
    this.setAccessTokenInSession();
    this.setUser();
  }

  setUser() {
    this.props.getUser(this.state.accessToken).then(result => {
      this.setState({ user: result.user });
    });
  }

  setAccessTokenInSession() {
    fetch('/token', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ token: this.state.accessToken })
    }).catch(error => {
      console.log(error);
    });
  }

  getAccessTokenFromSession() {
    fetch('/token', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'GET',
      credentials: 'include'
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        this.setState({ accessToken: json.accessToken });
        if (json.accessToken) this.setUser();
      })
      .catch(error => {
        console.log(error);
      });
  }

  componentDidMount() {
    this.getAccessTokenFromSession();
  }

  logout() {
    this.setState({ user: null, accessToken: null });
  }

  handleJoinClick(eventId) {
    if (!this.state.accessToken) Popup.alert('Please log in to join events.');
    else
      return this.props.eventApi
        .join(this.state.accessToken, eventId)
        .then(response => {
          this.setState({ user: response.user });
          return response.event;
        });
  }

  render() {
    const isPoppedOut = this.state.isPoppedOut;
    const user = this.state.user;
    const userName = user ? user.authenticationInfo[0].name : null;
    const eventsJoined = user ? user.eventsJoined : null;
    const accessToken = this.state.accessToken;
    return (
      <div>
        <Popup />
        {isPoppedOut && (
          <Popout
            url="http://eventer.lexlabs.com/api/auth/google"
            title="Log in"
            onClosing={this.popoutClosed}
          />
        )}
        <Nav
          user={userName}
          loginCallback={this.loginPopout}
          logoutCallback={this.logout}
        />
        <Main
          eventApi={this.props.eventApi}
          onJoinClick={this.handleJoinClick}
          eventsJoined={eventsJoined}
          accessToken={accessToken}
        />
      </div>
    );
  }
}

App.propTypes = {
  eventApi: PropTypes.object.isRequired,
  getUser: PropTypes.func.isRequired
};

export default App;
