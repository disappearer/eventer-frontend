export const FETCH_EVENTS_REQUEST = 'FETCH_EVENTS_REQUEST';
export const FETCH_EVENTS_SUCCESS = 'FETCH_EVENTS_SUCCESS';
export const FETCH_EVENTS_FAIL = 'FETCH_EVENTS_FAIL';

export const fetchEvents = period => ({
  apiCall: {
    types: [FETCH_EVENTS_REQUEST, FETCH_EVENTS_SUCCESS, FETCH_EVENTS_FAIL],
    endpoint: `/events/${period}`
  }
});
