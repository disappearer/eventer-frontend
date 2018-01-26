export const FETCH_EVENTS_REQUEST = 'FETCH_EVENTS_REQUEST';
export const FETCH_EVENTS_SUCCESS = 'FETCH_EVENTS_SUCCESS';
export const FETCH_EVENTS_FAIL = 'FETCH_EVENTS_FAIL';

export const fetchEvents = period => ({
  apiCall: {
    types: [FETCH_EVENTS_REQUEST, FETCH_EVENTS_SUCCESS, FETCH_EVENTS_FAIL],
    endpoint: `/events/${period}`
  }
});

export const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAIL = 'FETCH_USER_FAIL';

export const fetchUser = accessToken => ({
  apiCall: {
    types: [FETCH_USER_REQUEST, FETCH_USER_SUCCESS, FETCH_USER_FAIL],
    endpoint: `/profile?access_token=${accessToken}`
  }
});
