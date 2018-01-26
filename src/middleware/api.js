export default store => next => action => {
  const apiCall = action['apiCall'];
  if (typeof apiCall === 'undefined') {
    return next(action);
  }

  const { endpoint } = apiCall;

  const [requestType, successType, failType] = apiCall.types;
  next({ type: requestType });

  return callApi(endpoint).then(
    body => next({ type: successType, body }),
    error => next({ type: failType, error })
  );
};

const API_ROOT = '/api';

const callApi = endpoint => {
  const fullUrl = API_ROOT + endpoint;
  return fetch(fullUrl).then(response =>
    response.json().then(json => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    })
  );
};
