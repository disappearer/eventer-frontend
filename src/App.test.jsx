import React from 'react';
import enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import App from './App';
import Popup from 'react-popup';

enzyme.configure({ adapter: new Adapter() });

const EVENT_API = {
  events: [
    {
      id: 0,
      creatorId: 123,
      title: 'Some Event 1',
      description: 'Some random event with id 0',
      date: '2017-10-15T20:00:00.000Z',
      location: 'Somewhere',
      guestList: [123]
    },
    {
      id: 1,
      creatorId: 123,
      title: 'Some Event 2',
      description: 'Some random event with id 1',
      date: '2017-10-14T20:00:00.000Z',
      location: 'Somewhere',
      guestList: [123]
    },
    {
      id: 2,
      creatorId: 123,
      title: 'Some Event 3',
      description: 'Some random event with id 2',
      date: '2017-10-18T18:00:00.000Z',
      location: 'Somewhere',
      guestList: [123]
    }
  ],
  future: function() {
    return Promise.resolve(this.events);
  },
  join: function(accessToken, eventId) {
    return Promise.resolve({ user: {}, event: {} });
  }
};

const SESSION_API = {
  setToken: accessToken => {
    Promise.resolve();
  },
  getToken: () => Promise.resolve({ accessToken: null })
};

const user = {
  id: 246,
  accessToken: 'randomString2',
  authenticationInfo: [
    {
      provider: 'google',
      id: 11011011,
      name: 'Nada Zelic',
      email: 'nada.zelic@gmail.com'
    }
  ],
  eventsJoined: ['23', '11', '456']
};

describe('App', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <App
        eventApi={EVENT_API}
        sessionApi={SESSION_API}
        getUser={() => Promise.resolve({ user: user })}
      />
    );
  });

  it('should contain Popup, Nav and Main components', () => {
    expect(wrapper.find('Popup').length).toBe(1);
    expect(wrapper.find('Nav').length).toBe(1);
    expect(wrapper.find('Main').length).toBe(1);
  });

  it('should start with null user, null token and false isPoppedOut', () => {
    expect(wrapper.state('user')).toEqual(null);
    expect(wrapper.state('accessToken')).toEqual(null);
    expect(wrapper.state('isPoppedOut')).toEqual(false);
    expect(wrapper.state('period')).toEqual('future');
  });

  it('has a popout method which sets isPoppedOut to true until token is set', () => {
    jest.useFakeTimers();
    wrapper.instance().loginPopout();
    expect(wrapper.state('isPoppedOut')).toEqual(true);
    global.window.accessToken = user.accessToken;
    jest.runAllTimers();
    expect(wrapper.state('isPoppedOut')).toEqual(false);
    expect(wrapper.state('accessToken')).toEqual(user.accessToken);
  });

  it('sets user when accessToken is set', async () => {
    jest.useFakeTimers();
    wrapper.instance().loginPopout();
    global.window.accessToken = user.accessToken;
    jest.runAllTimers();
    await wrapper.prop('getUser');
    expect(wrapper.state('user')).toEqual(user);
  });

  it('calls getUser prop with accessToken when accessToken is set', () => {
    jest.useFakeTimers();
    const getUserStub = sinon.stub();
    getUserStub.returns(Promise.resolve(user));
    wrapper = shallow(
      <App
        eventApi={EVENT_API}
        getUser={getUserStub}
        sessionApi={SESSION_API}
      />
    );
    wrapper.instance().loginPopout();
    global.window.accessToken = user.accessToken;
    jest.runAllTimers();
    expect(getUserStub.calledOnce).toBe(true);
    expect(getUserStub.calledWith(user.accessToken)).toBe(true);
  });

  it('passes login callback to Nav', () => {
    expect(wrapper.find('Nav').prop('loginCallback')).toEqual(
      wrapper.instance().loginPopout
    );
  });

  it('has a logout method that clears user and accessToken', async () => {
    jest.useFakeTimers();
    /* Log in */
    wrapper.instance().loginPopout();
    global.window.accessToken = user.accessToken;
    jest.runAllTimers();
    await wrapper.prop('getUser');
    expect(wrapper.state('user')).toEqual(user);
    expect(wrapper.state('accessToken')).toEqual(user.accessToken);
    /* Log out */
    wrapper.instance().logout();
    expect(wrapper.state('user')).toEqual(null);
    expect(wrapper.state('accessToken')).toEqual(null);
  });

  it('passes logout callback to Nav', () => {
    expect(wrapper.find('Nav').prop('logoutCallback')).toEqual(
      wrapper.instance().logout
    );
  });

  it('sets eventsJoined prop in Main component when user logs in', async () => {
    jest.useFakeTimers();
    /* Log in */
    wrapper.instance().loginPopout();
    global.window.accessToken = user.accessToken;
    jest.runAllTimers();
    await wrapper.prop('getUser');
    wrapper.update();
    expect(wrapper.find('Main').prop('eventsJoined')).toEqual(
      user.eventsJoined
    );
  });

  it(`handleJoinClick calls event API method join with access token,
      > updates user in the state and returns updated event promise`, async () => {
    /* log in user */
    jest.useFakeTimers();
    wrapper.instance().loginPopout();
    global.window.accessToken = user.accessToken;
    jest.runAllTimers();
    await wrapper.prop('getUser');
    expect(wrapper.state('user')).toEqual(user);
    /* join event */
    const updatedEvent = { someKey: 'someValue' };
    const updatedUser = Object.assign({}, user);
    updatedUser.eventsJoined = Array.from(user.eventsJoined.push('1'));
    const joinStub = sinon
      .stub(EVENT_API, 'join')
      .returns(Promise.resolve({ user: updatedUser, event: updatedEvent }));
    const event = await wrapper.instance().handleJoinClick('1');
    expect(event).toEqual(updatedEvent);
    expect(joinStub.calledWith(user.accessToken, '1')).toBe(true);
    expect(wrapper.state('user')).toEqual(updatedUser);
  });

  it('handleJoinClick shows alert popup if user not logged in', () => {
    const popupAlertStub = sinon.stub(Popup, 'alert');
    wrapper.instance().handleJoinClick('1');
    expect(popupAlertStub.calledWith('Please log in to join events.')).toEqual(
      true
    );
  });

  it('passes handleJoinClick callback to Main', () => {
    expect(wrapper.find('Main').prop('onJoinClick')).toEqual(
      wrapper.instance().handleJoinClick
    );
  });

  it('passes accessToken to Main', () => {
    const accessToken = 'randomString';
    wrapper.setState({ accessToken });
    expect(wrapper.find('Main').prop('accessToken')).toEqual(accessToken);
  });

  it('calls sessionApi.setToken(state.accessToken) when user logs in', async () => {
    const setTokenStub = sinon.stub(SESSION_API, 'setToken');
    jest.useFakeTimers();
    /* Log in */
    wrapper.instance().loginPopout();
    global.window.accessToken = user.accessToken;
    jest.runAllTimers();
    await wrapper.prop('getUser');
    wrapper.update();
    expect(setTokenStub.calledWith(user.accessToken)).toBe(true);
    expect(setTokenStub.calledOnce).toBe(true);
    setTokenStub.restore();
  });

  it('calls sessionApi.getToken() and sets token in the state when component loads', async () => {
    const getTokenStub = sinon
      .stub(SESSION_API, 'getToken')
      .returns(Promise.resolve({ accessToken: user.accessToken }));
    wrapper = shallow(
      <App
        eventApi={EVENT_API}
        sessionApi={SESSION_API}
        getUser={() => Promise.resolve({ user: user })}
      />
    );
    expect(getTokenStub.calledOnce).toBe(true);
    await getTokenStub();
    expect(wrapper.state('accessToken')).toEqual(user.accessToken);
    getTokenStub.restore();
  });

  it('clears accessToken in session when user logs out', async () => {
    const setTokenStub = sinon.stub(SESSION_API, 'setToken');
    wrapper.instance().logout();
    expect(setTokenStub.calledWith(null)).toBe(true);
    expect(setTokenStub.calledOnce).toBe(true);
    setTokenStub.restore();
  });
});
