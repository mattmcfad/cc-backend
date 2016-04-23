'use strict';

const bluebird = require('bluebird');
const assert = require('chai').assert;
const userService = require('../../../../app/services/user-service');
const encryptionService = require('../../../../app/services/encryption-service');

describe('User services unit test', () => {

  describe('User success scenarios', () => {
    it('should create user with email key', (done) => {
      const user = {
        email: 'darth@vader.com',
        password: 'leia@jedi.com'
      };
      userService.validateUser(user).then(
        (validUser) =>
          encryptionService.compare(user.password, validUser.password).then(
            isEqual => isEqual ? done() : assert.fail('Password encryption failed')
          )
      ).catch(
        err => done(err)
      );
    });
    it('should create user with google key', (done) => {
      userService.validateUser({
        google: 'IUSAIGW23847923L'
      }).then(
        () => done()
      ).catch(
        err => done(err)
      );
    });
    it('should create user with facebook key', (done) => {
      userService.validateUser({
        facebook: 'IUSAIGW23847923L'
      }).then(
        () => done()
      ).catch(
        err => done(err)
      );
    });
  });

  describe('User error scenarios', () => {
    it('should not create user without an object', (done) => {
      userService.validateUser(null).then(
        () => done()
      ).catch(
        err => {
          assert.equal(err, 'USER.ERROR.EMPTY_USER');
          done();
        }
      );
    });

    it('should not create user with empty object', (done) => {
      userService.validateUser({}).then(
        () => done()
      ).catch(
        err => {
          assert.equal(err, 'USER.ERROR.EMPTY_KEY');
          done();
        }
      );
    });

    it('should not create user with more than one key', (done) => {
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
      bluebird.each(
        users,
        (user) => userService.validateUser(user).catch(
          err => assert.equal(err, 'USER.ERROR.MULTIPLE_KEYS')
        )
      ).then(
        () => done()
      );
    });

    it('should not create a user with email without password', (done) => {
      userService.validateUser({
        email: 'without@passwrod.com'
      }).catch(
        err => {
          assert.equal(err, 'USER.ERROR.EMPTY_PASSWORD');
          done();
        }
      );
    });

  });

});
