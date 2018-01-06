const api = {
  create: (accessToken, eventInfo) => {
    const url = `/api/events?access_token=${accessToken}`;
    const jsonData = JSON.stringify(eventInfo);
    return fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: jsonData
    }).then(function(response) {
      return response.json();
    });
  },
  future: () => {
    const url = `/api/events/future`;
    return fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'GET'
    }).then(function(response) {
      return response.json();
    });
  },
  all: () => {
    const url = `/api/events/all`;
    return fetch(url, {
      method: 'GET'
    })
      .then(function(response) {
        return response.json();
      })
      .then(events => {
        return events;
      });
  },
  join: (accessToken, eventId) => {
    const url = `/api/events/${eventId}/join?access_token=${accessToken}`;
    return fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }).then(function(response) {
      return response.json();
    });
  }
};

export default api;

export function getUser(accessToken) {
  const url = `/api/profile?access_token=${accessToken}`;
  const userPromise = fetch(url, {
    method: 'GET'
  }).then(function(response) {
    return response.json();
  });

  return userPromise;
}
