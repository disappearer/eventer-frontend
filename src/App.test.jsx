import React from 'react';
import enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import Main from './components/main/Main';

enzyme.configure({ adapter: new Adapter() });

const EventAPI = {
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
  }
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
        eventApi={EventAPI}
        getUser={() => Promise.resolve({ user: user })}
      />
    );
  });

  it('should contain Nav and Main components', () => {
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
    global.window.accessToken = 'bla';
    jest.runAllTimers();
    expect(wrapper.state('isPoppedOut')).toEqual(false);
    expect(wrapper.state('accessToken')).toEqual('bla');
  });

  it('sets user when accessToken is set', async () => {
    jest.useFakeTimers();
    wrapper.instance().loginPopout();
    global.window.accessToken = 'bla';
    jest.runAllTimers();
    await wrapper.prop('getUser');
    expect(wrapper.state('user')).toEqual(user);
  });

  it('calls getUser prop with accessToken when accessToken is set', () => {
    jest.useFakeTimers();
    const getUserStub = sinon.stub();
    getUserStub.returns(Promise.resolve(user));
    wrapper = shallow(<App eventApi={EventAPI} getUser={getUserStub} />);
    wrapper.instance().loginPopout();
    global.window.accessToken = 'bla';
    jest.runAllTimers();
    expect(getUserStub.calledOnce).toBe(true);
    expect(getUserStub.calledWith('bla')).toBe(true);
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
    global.window.accessToken = 'bla';
    jest.runAllTimers();
    await wrapper.prop('getUser');
    expect(wrapper.state('user')).toEqual(user);
    expect(wrapper.state('accessToken')).toEqual('bla');
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
    global.window.accessToken = 'bla';
    jest.runAllTimers();
    await wrapper.prop('getUser');
    wrapper.update();
    expect(wrapper.find('Main').prop('eventsJoined')).toEqual(
      user.eventsJoined
    );
  });
});
