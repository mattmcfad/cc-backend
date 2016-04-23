'use strict';

const lamb = require('lamb');
const bluebird = require('bluebird');
const userProvider = require('../providers/user-provider');
const encryptService = require('./encryption-service');


function countUserKeys(user) {
  let key = 0;
  if (!lamb.isNil(user.email)) {
    key++;
  }
  if (!lamb.isNil(user.google)) {
    key++;
  }
  if (!lamb.isNil(user.facebook)) {
    key++;
  }
  if (!lamb.isNil(user.github)) {
    key++;
  }
  return key;
}

function validateUser(user) {
  if (lamb.isNil(user)) {
    return bluebird.reject('USER.ERROR.EMPTY_USER');
  }
  const keyQty = countUserKeys(user);
  if (keyQty > 1) {
    return bluebird.reject('USER.ERROR.MULTIPLE_KEYS');
  } else if (keyQty < 1) {
    return bluebird.reject('USER.ERROR.EMPTY_KEY');
  }
  if (!lamb.isNil(user.firstName) && user.firstName.length > 20) {
    return bluebird.reject('USER.ERROR.FIRST_NAME_MAX_LENGTH');
  }
  if (!lamb.isNil(user.lastName) && user.lastName.length > 50) {
    return bluebird.reject('USER.ERROR.LAST_NAME_MAX_LENGTH');
  }
  if (!lamb.isNil(user.email)) {
    if (lamb.isNil(user.password)) {
      return bluebird.reject('USER.ERROR.EMPTY_PASSWORD');
    } else {
      return encryptService.encrypt(user.password).then(hash =>
        lamb.merge(user, {password: hash})
      );
    }
  } else {
    return bluebird.resolve();
  }
}

function insert(user) {
  return validateUser(user).then((validUser) =>
    userProvider.insert(validUser)
  );
}

function findById(id) {
  return userProvider.findById(id);
}

function findByEmail(email) {
  return userProvider.findByEmail(email);
}

function findOne(filter) {
  return userProvider.findOne(filter);
}

module.exports = {
  validateUser,
  insert,
  findById,
  findByEmail,
  findOne
};
