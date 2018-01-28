import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import * as actions from '../actions';
import api from './api';

const middlewares = [thunk, api];
const mockStore = configureMockStore(middlewares);

const USER = {
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
  eventsJoined: ['0', '23', '11', '456']
};

const EVENT = {
  id: 0,
  creatorId: 123,
  title: 'Some Event 1',
  description: 'Some random event with id 0',
  date: new Date(),
  location: 'Somewhere',
  guestList: [123, 246]
};

describe('Event joining', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it('creates success action when joining event has been done', done => {
    fetchMock.post(
      `/api/events/${EVENT.id}/join?access_token=${USER.accessToken}`,
      {
        body: JSON.stringify({ user: USER, event: EVENT }),
        headers: { 'content-type': 'application/json' }
      }
    );
    const expectedActions = [
      { type: actions.JOIN_EVENT_REQUEST },
      {
        type: actions.JOIN_EVENT_SUCCESS,
        body: { user: USER, event: EVENT }
      }
    ];

    const store = mockStore({ user: null });

    store.dispatch(actions.joinEvent(USER.accessToken, EVENT.id)).then(() => {
      expect(fetchMock.called()).toBe(true);
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });
  });

  it('creates fail action when joining event has failed', done => {
    const expectedActions = [
      { type: actions.JOIN_EVENT_REQUEST },
      {
        type: actions.JOIN_EVENT_FAIL,
        error: new TypeError('Network request failed')
      }
    ];

    const store = mockStore({ user: null });

    store.dispatch(actions.joinEvent(USER.accessToken, EVENT.id)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });
  });
});
