'use strict';

const userService = require('../../../../app/services/user-service');
const assert = require('chai').assert;

describe('User services unit test', () => {

  describe('User success scenarios', () => {
    it('should create user with email key', () => {
      try {
        userService.validateUser({
          email: 'darth@vader.com'
        });
      } catch (err) {
        assert.fail(`Expected user validation to pass, but got ${err}`);
      }
    });
    it('should create user with google key', () => {
      try {
        userService.validateUser({
          google: 'IUSAIGW23847923L'
        });
      } catch (err) {
        assert.fail(`Expected user validation to pass, but got ${err}`);
      }
    });
    it('should create user with facebook key', () => {
      try {
        userService.validateUser({
          facebook: 'IUSAIGW23847923L'
        });
      } catch (err) {
        assert.fail(`Expected user validation to pass, but got ${err}`);
      }
    });
  });

  describe('User error scenarios', () => {
    it('should not create user with an empty object', () => {
      try {
        userService.validateUser(null);
      } catch (err) {
        assert.equal(
          err,
          'USER.ERROR.EMPTY_USER',
          'Should not be able to create user without a key attribute'
        );
      }
    });

    it('should not create user with empty object', () => {
      try {
        userService.validateUser({});
      } catch (err) {
        assert.equal(
          err,
          'USER.ERROR.NO_KEY',
          'Should not be able to create user without a key attribute'
        );
      }
    });

    it('should not create user with more than one key', () => {
      const users = [
        {
          email: 'yoda@jedicounsel.ccom',
          google: '123876JHGATQW'
        },
        {
          email: 'yoda@jedicounsel.ccom',
          facebook: '123876JHGATQW'
        },
        {
          facebook: 'yoda@jedicounsel.ccom',
          google: '123876JHGATQW'
        }
      ];
      users.forEach(user => {
        try {
          userService.validateUser(user);
        } catch (err) {
          assert.equal(
            err,
            'USER.ERROR.MULTIPLE_KEYS',
            'Should not be able to create user without a key attribute'
          );
        }
      });
    });

  });

});
