'use strict';

const assert = require('chai').assert;
const supertest = require('supertest-as-promised');

describe('user api test', () => {

  it('should create an user', (done) => {
    const newUser = {
      email: 'testuser@cc.com'
    };
    supertest.agent('http://localhost:3011/')
      .post('/users')
      .send(newUser)
      .expect(400, done);
  });

  it('should authenticate and get an user', (done) => {
    const newUser = {
      email: 'testuser@cc.com',
      password: '1233'
    };
    const agent = supertest.agent('http://localhost:3011/');
    let userId;
    agent.post('/users')
      .send(newUser)
      .expect(201)
      .expect(resp => {
        assert.isNotNull(resp.body._id);
        userId = resp.body._id;
      })
      .then(() =>
        agent.get(`/auth/login?email=${newUser.email}&password=${newUser.password}`)
          .expect(302)
          .expect('location', '/')
      ).then(() =>
        agent.get(`/users/${userId}`)
          .expect(200)
          .expect(resp => {
            assert.equal(resp.body.email, newUser.email);
            assert.notEqual(resp.body.password, newUser.password);
          })
      ).then(() => done())
      .catch(err => done(err));
  });

});
