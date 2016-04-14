'use strict';

const assert = require('chai').assert;
const request = require('supertest');
const app = require('../../../../app/app');

describe('user dummy test', () => {

  it('should create a user', (done) => {
    const newUser = {
      email: 'testuser@cc.com'
    };
    request(app.getApp())
      .post('/users')
      .send(newUser)
      .end((err, resp) => {
        if (err) {
          assert.fail(`Could not create user. Reason: ${err}`);
        } else {
          assert.equal(resp.status, 201, 'Failed to create user');
        }
        done();
      });
  });

});
