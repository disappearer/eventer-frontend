import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import eventApi, { getUser } from './api/api';

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
