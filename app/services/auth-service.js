'use strict';

const lamb = require('lamb');
const userService = require('./user-service');
const BluePromise = require('bluebird');
const encryptionService = require('./encryption-service');


function authenticateSocialMedia(filter, user) {
  return userService.findOne(filter).then(userByFilter =>
    lamb.isNil(userByFilter) ? userService.insert(user) :
      BluePromise.resolve(userByFilter)
  );
}

function authenticateGoogle(google, firstName, lastName) {
  return authenticateSocialMedia(
    {google},
    {
      firstName,
      lastName,
      google
    }
  );
}

function authenticateFacebook(facebook, firstName, lastName) {
  return authenticateSocialMedia(
    {facebook},
    {
      firstName,
      lastName,
      facebook
    }
  );
}

function authenticateGitHub(github, firstName, lastName) {
  return authenticateSocialMedia(
    {github},
    {
      firstName,
      lastName,
      github
    }
  );
}

function authenticateLocal(email, password) {
  return userService.findByEmail(email).then(user =>
    lamb.isNil(user) ? BluePromise.reject('USER.ERROR.NOT_FOUND') :
      encryptionService.compare(password, user.password).then(result =>
        result ? BluePromise.resolve(user) :
          BluePromise.reject('USER.ERROR.INVALID_PASSWORD')
      )
  );
}

exports.authenticateGoogle = authenticateGoogle;
exports.authenticateFacebook = authenticateFacebook;
exports.authenticateGitHub = authenticateGitHub;
exports.authenticateLocal = authenticateLocal;
