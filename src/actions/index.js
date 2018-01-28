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

export const CREATE_EVENT_REQUEST = 'CREATE_EVENT_REQUEST';
export const CREATE_EVENT_SUCCESS = 'CREATE_EVENT_SUCCESS';
export const CREATE_EVENT_FAIL = 'CREATE_EVENT_FAIL';

export const createEvent = (accessToken, eventInfo) => ({
  apiCall: {
    types: [CREATE_EVENT_REQUEST, CREATE_EVENT_SUCCESS, CREATE_EVENT_FAIL],
    endpoint: `/events?access_token=${accessToken}`,
    payload: eventInfo
  }
});

export const JOIN_EVENT_REQUEST = 'JOIN_EVENT_REQUEST';
export const JOIN_EVENT_SUCCESS = 'JOIN_EVENT_SUCCESS';
export const JOIN_EVENT_FAIL = 'JOIN_EVENT_FAIL';

export const joinEvent = (accessToken, eventId) => ({
  apiCall: {
    types: [JOIN_EVENT_REQUEST, JOIN_EVENT_SUCCESS, JOIN_EVENT_FAIL],
    endpoint: `/events/${eventId}/join?access_token=${accessToken}`,
    payload: {}
  }
});
