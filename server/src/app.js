const express = require('express');
const session = require('express-session');
const logger = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(
  session({
    secret: 'cave opener',
    resave: false,
    saveUninitialized: true,
    cookie: {}
  })
);

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.post('/token', (req, res) => {
  req.session.accessToken = req.body.accessToken;
  res.status(200).send('Token set successfully.');
});

app.get('/token', (req, res) => {
  res.status(200).json({ accessToken: req.session.accessToken });
});

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

module.exports = app;
