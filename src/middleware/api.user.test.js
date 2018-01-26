import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import sinon from 'sinon';
import * as actions from '../actions';
import api from './api';

const middlewares = [thunk, api];
const mockStore = configureMockStore(middlewares);

const createApiMiddleware = () => {
  const store = {
    getState: sinon.spy(),
    dispatch: sinon.spy()
  };

  const next = sinon.spy();

  const invoke = action => api(store)(next)(action);

  return { store, next, invoke };
};

const ACCESS_TOKEN = 'randomString';

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

describe('Current user fetching', () => {
  afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
  });

  it('calls next with request action', () => {
    fetchMock.get('*', {
      body: { hello: 'world' },
      headers: { 'content-type': 'application/json' }
    });
    const { next, invoke } = createApiMiddleware();
    const action = actions.fetchUser(ACCESS_TOKEN);
    invoke(action);
    expect(next.calledWith({ type: actions.FETCH_USER_REQUEST })).toBe(true);
  });

  it('creates success action when fetching user profile has been done', done => {
    fetchMock.getOnce(`/api/profile?access_token=${ACCESS_TOKEN}`, {
      body: { user },
      headers: { 'content-type': 'application/json' }
    });

    const expectedActions = [
      { type: actions.FETCH_USER_REQUEST },
      { type: actions.FETCH_USER_SUCCESS, body: { user } }
    ];

    const store = mockStore({ user: null });

    store.dispatch(actions.fetchUser(ACCESS_TOKEN)).then(() => {
      expect(fetchMock.called()).toBe(true);
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });
  });

  it('creates fail action when fetching user profile has failed', done => {
    const expectedActions = [
      { type: actions.FETCH_USER_REQUEST },
      {
        type: actions.FETCH_USER_FAIL,
        error: new TypeError('Network request failed')
      }
    ];

    const store = mockStore({ user: null });

    store.dispatch(actions.fetchUser(ACCESS_TOKEN)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });
  });
});
