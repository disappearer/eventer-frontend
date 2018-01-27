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
const EVENT_INFO = {
  title: 'Some Title',
  location: 'Somewhere',
  description: 'Something',
  date: new Date()
};

const CREATED_EVENT = Object.assign(
  {
    id: 0,
    creatorId: 123,
    guestList: [123]
  },
  EVENT_INFO
);

describe('Event creation', () => {
  afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
  });

  it('calls next with request action and payload', () => {
    fetchMock.post(`/api/events?access_token=${ACCESS_TOKEN}`, {
      body: { event: CREATED_EVENT },
      headers: { 'content-type': 'application/json' }
    });
    const { next, invoke } = createApiMiddleware();
    const action = actions.createEvent(ACCESS_TOKEN, { event: EVENT_INFO });
    invoke(action);
    expect(next.calledWith({ type: actions.CREATE_EVENT_REQUEST })).toBe(true);
    expect(fetchMock.lastCall()[1].body).toEqual(
      JSON.stringify({ event: EVENT_INFO })
    );
  });

  it('creates success action when creating event has been done', done => {
    fetchMock.post(`/api/events?access_token=${ACCESS_TOKEN}`, {
      body: JSON.stringify({ event: CREATED_EVENT }),
      headers: { 'content-type': 'application/json' }
    });

    const expectedActions = [
      { type: actions.CREATE_EVENT_REQUEST },
      {
        type: actions.CREATE_EVENT_SUCCESS,
        body: { event: CREATED_EVENT }
      }
    ];

    const store = mockStore({ user: null });

    store
      .dispatch(actions.createEvent(ACCESS_TOKEN, { event: EVENT_INFO }))
      .then(() => {
        expect(fetchMock.called()).toBe(true);
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
  });

  it('creates fail action when creating event has failed', done => {
    const expectedActions = [
      { type: actions.CREATE_EVENT_REQUEST },
      {
        type: actions.CREATE_EVENT_FAIL,
        error: new TypeError('Network request failed')
      }
    ];

    const store = mockStore({ user: null });

    store
      .dispatch(actions.createEvent(ACCESS_TOKEN, { event: EVENT_INFO }))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
  });
});
