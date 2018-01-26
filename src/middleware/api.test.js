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

describe('API middleware', () => {
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
});
