'use strict';

const userService = require('../../../../app/services/user-service');
const assert = require('chai').assert;

describe('User services dummy test', () => {

  it('should require an email for user', () => {
    const newUser = {};
    assert.isNotOk(
      userService.validateUser(newUser),
      'User was invalid, but was missing email property.'
    );
  });

});
