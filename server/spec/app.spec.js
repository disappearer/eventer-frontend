const request = require('supertest');
const app = require('../src/app');
const agent = request.agent(app);

describe('app', () => {
  const token = 'randomString';
  it('accepts POST to "/token" and sets access token in session', done => {
    agent
      .post('/token')
      .send({ accessToken: token })
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.text).toEqual('Token set successfully.');
        done();
      });
  });

  it('accepts GET to "/token" and returns access token from session', done => {
    const token = 'randomString';
    agent.get('/token').then(res => {
      expect(res.status).toEqual(200);
      expect(res.body).toEqual({ accessToken: token });
      done();
    });
  });

  it('returns index.html for all other routes', done => {
    Promise.all([
      agent.get('/'),
      agent.get('/events'),
      agent.get('/events/new'),
      agent.get('/just/a/random/path')
    ]).then(responses => {
      responses.forEach(res => {
        expect(res.status).toEqual(200);
        const html = res.text;
        expect(html.includes('<!DOCTYPE html>')).toBe(true);
        expect(html.includes('<title>Eventer</title')).toBe(true);
        done();
      });
    });
  });
});
