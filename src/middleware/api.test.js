import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import sinon from 'sinon';
import * as actions from '../actions';
import api from './api';

const middlewares = [thunk, api];
const mockStore = configureMockStore(middlewares);

const eventArray = [
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
];

const createApiMiddleware = () => {
  const store = {
    getState: sinon.spy(),
    dispatch: sinon.spy()
  };

  const next = sinon.spy();

  const invoke = action => api(store)(next)(action);

  return { store, next, invoke };
};

describe('API middleware', () => {
  beforeEach(() => {
    fetchMock.get('*', {
      body: { hello: 'world' },
      headers: { 'content-type': 'application/json' }
    });
  });

  afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
  });

  it('passes through non-api actions', () => {
    const { next, invoke } = createApiMiddleware();
    const action = {
      type: 'TEST'
    };
    invoke(action);
    expect(next.calledWith(action)).toBe(true);
    const functionAction = sinon.spy();
    invoke(functionAction);
    expect(next.calledWith(functionAction)).toBe(true);
  });

  it('calls next with request action', () => {
    const { next, invoke } = createApiMiddleware();
    const action = actions.fetchEvents('all');
    const [requestType, ,] = action.apiCall.types;
    invoke(action);
    expect(next.calledWith({ type: requestType })).toBe(true);
  });

  it('creates success action when fetching all events has been done', done => {
    fetchMock.restore();
    fetchMock.getOnce('/api/events/all', {
      body: { events: eventArray },
      headers: { 'content-type': 'application/json' }
    });

    const expectedActions = [
      { type: actions.FETCH_EVENTS_REQUEST },
      { type: actions.FETCH_EVENTS_SUCCESS, body: { events: eventArray } }
    ];

    const store = mockStore({ events: [] });

    store.dispatch(actions.fetchEvents('all')).then(() => {
      expect(fetchMock.called()).toBe(true);
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });
  });

  it('creates success action when fetching future events has been done', done => {
    fetchMock.restore();
    fetchMock.getOnce('/api/events/future', {
      body: { events: eventArray },
      headers: { 'content-type': 'application/json' }
    });

    const expectedActions = [
      { type: actions.FETCH_EVENTS_REQUEST },
      { type: actions.FETCH_EVENTS_SUCCESS, body: { events: eventArray } }
    ];

    const store = mockStore({ events: [] });

    store.dispatch(actions.fetchEvents('future')).then(() => {
      expect(fetchMock.called()).toBe(true);
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });
  });

  it('creates fail action when fetching events has failed', done => {
    fetchMock.restore();

    const expectedActions = [
      { type: actions.FETCH_EVENTS_REQUEST },
      {
        type: actions.FETCH_EVENTS_FAIL,
        error: new TypeError('Network request failed')
      }
    ];

    const store = mockStore({ events: [] });

    store.dispatch(actions.fetchEvents('all')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });
  });
});
