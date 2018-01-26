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

describe('Event fetching', () => {
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
    const action = actions.fetchEvents('all');
    invoke(action);
    expect(next.calledWith({ type: actions.FETCH_EVENTS_REQUEST })).toBe(true);
  });

  it('creates success action when fetching all events has been done', done => {
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
