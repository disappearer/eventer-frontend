export default store => next => action => {
  const apiCall = action['apiCall'];
  if (typeof apiCall === 'undefined') {
    return next(action);
  }

  const { endpoint, payload } = apiCall;

  const [requestType, successType, failType] = apiCall.types;
  next({ type: requestType });

  return callApi(endpoint, payload).then(
    body => {
      if (body.hasOwnProperty('event')) {
        body.event = { ...body.event, date: new Date(body.event.date) };
      }
      next({ type: successType, body });
    },
    error => next({ type: failType, error })
  );
};

const API_ROOT = '/api';

const callApi = (endpoint, payload) => {
  const options = getOptions(payload);
  const fullUrl = API_ROOT + endpoint;

  return fetch(fullUrl, options).then(response =>
    response.json().then(json => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    })
  );
};

const getOptions = payload => {
  let options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };

  if (typeof payload !== 'undefined') {
    options = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
  }

  return options;
};
