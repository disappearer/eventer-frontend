import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import eventApi, { getUser } from './api/api';

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
  },
  create: function() {
    return Promise.resolve(this.events[0]);
  }
};

const sessionApi = {
  setToken: accessToken => {
    return fetch('/token', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ accessToken })
    });
  },
  getToken: () => {
    return fetch('/token', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'GET',
      credentials: 'include'
    }).then(response => {
      return response.json();
    });
  }
};

ReactDOM.render(
  <BrowserRouter>
    <App eventApi={eventApi} sessionApi={sessionApi} getUser={getUser} />
  </BrowserRouter>,
  document.getElementById('root')
);
registerServiceWorker();
