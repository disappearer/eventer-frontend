import React, { Component } from 'react';
import Popout from 'react-popout';
import PropTypes from 'prop-types';
import './App.css';
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
    this.setUser();
  }

  setUser() {
    this.props.getUser(this.state.accessToken).then(result => {
      this.setState({ user: result.user });
    });
  }

  logout() {
    this.setState({ user: null, accessToken: null });
  }

  render() {
    const isPoppedOut = this.state.isPoppedOut;
    const user = this.state.user;
    const userName = user ? user.authenticationInfo[0].name : null;
    const eventsJoined = user ? user.eventsJoined : null;
    return (
      <div>
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
          onJoinClick={() => {}}
          eventsJoined={eventsJoined}
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
