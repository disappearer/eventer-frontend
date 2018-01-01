import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const EventAPI = {
  events: [
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
  ],
  future: function() {
    return Promise.resolve(this.events);
  },
  all: function() {
    return Promise.resolve(this.events.slice(1));
  }
};

ReactDOM.render(
  <BrowserRouter>
    <App eventApi={EventAPI} getUser={getUser} />
  </BrowserRouter>,
  document.getElementById('root')
);
registerServiceWorker();

function getUser(accessToken) {
  const url = `http://eventer.lexlabs.com/api/profile?access_token=${accessToken}`;
  const userPromise = fetch(url, {
    method: 'GET'
  }).then(function(response) {
    return response.json();
  });

  return userPromise;
}
